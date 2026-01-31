/**
 * Copyright (c) Metwas
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; version 2 of the License.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
 */

/**_-_-_-_-_-_-_-_-_-_-_-_-_- Imports  _-_-_-_-_-_-_-_-_-_-_-_-_-*/

import {
       FILE_CHANGE_EVENT,
       FILE_CREATE_EVENT,
       FILE_DELETE_EVENT,
       FileValidator,
       FileFragment,
       FsDetector,
       FileInfo,
       directory,
       extension,
       filename,
} from "@geeko/os";

import {
       SCRIPT_ENTRY_NAME,
       SCRIPT_MANIFEST,
} from "../../../global/injector/script.tokens";

import { Script, ScriptShell } from "../../../types/Script";
import { isAbsolute, join, resolve, sep } from "node:path";
import { getFilesInDirectory } from "@geeko/configuration";
import { getScriptShellType } from "../../../tools/script";
import { existsSync, mkdirSync } from "node:fs";
import { Collection } from "@geeko/core";
import { LogService } from "@geeko/log";

/**_-_-_-_-_-_-_-_-_-_-_-_-_-          _-_-_-_-_-_-_-_-_-_-_-_-_-*/

/**
 * @see Script collection provider which includes @see FsDetector to observe changes of the scripts in a given path
 *
 * @public
 */
export class ScriptCollection extends Collection<Script, string> {
       /**
        * @public
        * @param {LogService} log
        */
       public constructor(
              watcher?: FsDetector,
              private log?: LogService,
       ) {
              super();

              if (!log) {
                     this.log = new LogService({
                            title: "Scripts",
                            level: "info",
                     });
              }

              if (watcher) {
                     this.watcher(watcher);
              }
       }

       /**
        * Gets or sets the specified @see FsDetector
        *
        * @param {FsDetector} watcher
        * @returns {FsDetector}
        */
       public watcher(watcher?: FsDetector): FsDetector | undefined {
              if (watcher) {
                     if (this._detector) {
                            /** Cleanup existing bound events */
                            this._removeEventHandlers();
                     }

                     this._detector = watcher;
                     this._addEventHandlers();
              }

              return this._detector;
       }

       /**
        * Script watcher service
        *
        * @private
        * @type {FsDetector}
        */
       private _detector: FsDetector | undefined = void 0;

       /**
        * Script file type validation service
        *
        * @private
        * @type {FileValidator}
        */
       private _validator: FileValidator | undefined = void 0;

       /**
        * ReadyState flag for when the @see FsDetector has initialized fully
        *
        * @private
        * @type {Boolean}
        */
       private _ready: boolean = false;

       /**
        * Sets up a @see FsDetector watch for any script file changes within the specified directory
        *
        * @public
        * @param {Array<String> | String} path
        */
       public async watch(path: Array<string> | string): Promise<void> {
              try {
                     const paths: Array<string> = Array.isArray(path)
                            ? path
                            : [path];

                     const length: number = paths.length;
                     let index: number = 0;

                     for (; index < length; ++index) {
                            let path: string | undefined = this._resolve(
                                   paths[index],
                            );

                            if (typeof path === "string" && this._detector) {
                                   this.log?.verbose(
                                          `Watching script path [${path}]`,
                                   );

                                   this._detector?.watch({ path });
                            }
                     }
              } catch (error) {
                     this._onError(error as Error);
              }
       }

       /**
        * Reads the data from the specified file at the @see path. Building the @see CommandSource add storing the tagged @see CommandHandler
        *
        * @public
        * @param {String} path
        * @returns {Promise<void>}
        */
       public async loadFromPath(path: string): Promise<void> {
              if (typeof path !== "string" || !path) {
                     return;
              }

              const files: Array<FileFragment> = await getFilesInDirectory(
                     path,
                     { recursive: 1, match: SCRIPT_MANIFEST },
              );

              const length: number = files?.length;
              let index: number = 0;

              for (; index < length; ++index) {
                     try {
                            const fragment: FileFragment = files[index];
                            const fileDirectory: string = fragment.directory;
                            const buffer: Buffer = fragment.data;

                            const data: any = JSON.parse(buffer.toString());
                            /** Attempt to get main */
                            const main: string = data?.[SCRIPT_ENTRY_NAME];

                            if (typeof main === "string" && main !== "") {
                                   let rootPath: string = "";

                                   /** Attempt to get @see Script name from the directory */
                                   const directories: Array<string> =
                                          fileDirectory.split(sep);
                                   let name: string = "";

                                   let cindex: number = directories.length - 1;
                                   /** Iterate until the first valid @see directory is returned */
                                   while (cindex >= 0 && !name) {
                                          --cindex;
                                          name = directories[cindex];
                                   }

                                   if (isAbsolute(main) === false) {
                                          rootPath = resolve(
                                                 fileDirectory,
                                                 main,
                                          );
                                   }

                                   /** Determine the @see ScriptShell from the extension type */
                                   const shell: ScriptShell =
                                          getScriptShellType(rootPath);
                                   const fileName: string = filename(main);
                                   const path: string = join(
                                          fileDirectory,
                                          fileName,
                                   );

                                   const script: Script = {
                                          root: fileDirectory,
                                          file: fileName,
                                          shell: shell,
                                          path: path,
                                          id: name,
                                   };

                                   if (this.has(script.id) === false) {
                                          this.log?.verbose(
                                                 `Added script [${script.id}] path [${script.path}]`,
                                          );

                                          this.add(script.id, script);
                                   }
                            }
                     } catch (error) {}
              }

              if (this._ready === false) {
                     this._ready = true;
                     this.emit("ready");
              }
       }

       /**
        * Returns true if the loader has fully checked and loaded pre-defined scripts
        *
        * @public
        * @returns {Boolean}
        */
       public ready(): boolean {
              return this._ready;
       }

       /**
        * File on change detect handler
        *
        * @private
        * @param {Object} file
        */
       private _onChange(file: any): void {
              this._onDelete(file);
              this._onCreate(file);
       }

       /**
        * File creation handler
        *
        * @private
        * @param {Object} file
        */
       private _onCreate(file: any): void {
              try {
                     if (typeof file?.path === "string") {
                            const relativePath: string = file.path;
                            const name: string = file.name;
                            const type: string = file.type;

                            /** if @see directory and not relative, attempt to load manifest */
                            if (type === "directory" && !relativePath) {
                                   this.loadFromPath(file.path);
                                   return;
                            }

                            /** Otherwise, trigger the @see Script about the changes */
                            const relativeName: string =
                                   relativePath.split(sep)[0];

                            if (name !== relativeName) {
                                   const script: Script =
                                          this.get(relativeName);

                                   /** Attempt to find required script files on change if @see Script does not exist */
                                   if (!script) {
                                          const relativePaths: string =
                                                 relativePath
                                                        .split(sep)
                                                        .slice(1)
                                                        .join(sep);

                                          const rootPath: string = file["path"]
                                                 .replace(`${sep}${name}`, "")
                                                 .replace(relativePaths, "");

                                          this.loadFromPath(rootPath);
                                          return;
                                   }

                                   this.emit("reload", script);
                            }
                     }
              } catch (error) {
                     this._onError(error as Error);
              }
       }

       /**
        * File removal handler
        *
        * @private
        * @param {Object} file
        */
       private async _onDelete(file: any): Promise<void> {
              try {
                     if (typeof file?.path === "string") {
                            const relativePath: string = file.path;
                            const name: string = file.name;
                            const type: string = file.type;

                            /** if @see directory and not relative, attempt to load manifest */
                            if (
                                   type === "directory" &&
                                   (!relativePath || relativePath === name)
                            ) {
                                   const script: Script = this.get(name);

                                   if (script) {
                                          this.log?.debug(
                                                 `Removing script [${script.id}]`,
                                          );

                                          this.emit("stop", script);
                                          this.delete(name);
                                   }

                                   return;
                            }

                            const relativeName: string =
                                   relativePath.split(sep)[0];
                            const script: Script = this.get(name);

                            if (script) {
                                   this.log?.debug(
                                          `Reloading script [${script.id}]`,
                                   );
                                   /** Trigger an update on the @see Script */
                                   this.emit("reload", script);
                            }
                     }
              } catch (error) {
                     this._onError(error as Error);
              }
       }

       /**
        * Message handler/log
        *
        * @private
        * @param {String} message
        */
       private _onMessage(message: string): void {
              this.log?.verbose(message);
       }

       /**
        * Error handler
        *
        * @private
        * @param {Error | String} error
        */
       private _onError(error: Error | string): void {
              this.log?.error(error);
       }

       /**
        * Used to validate loaded files ensuring that the extension types match to the configuration
        *
        * @private
        * @param {Object} pathOrFile
        * @returns {Boolean}
        */
       private _validate(pathOrFile: string | FileInfo): boolean {
              if (!pathOrFile) {
                     return false;
              }

              let ext: string | undefined = void 0;
              let name: string | undefined = void 0;

              if (typeof pathOrFile === "string") {
                     ext = extension(pathOrFile);
                     name = filename(pathOrFile);
              }

              return (
                     this._validator?.isValid({
                            extension: ext || pathOrFile?.["extension"],
                            name: name || pathOrFile?.["name"],
                     }) ?? false
              );
       }

       /**
        * Binds all @see FsDetector file events to this @see CommandLoader instance
        *
        * @private
        */
       private _addEventHandlers(): void {
              this._detector?.on(FILE_CHANGE_EVENT, this._onChange.bind(this));
              this._detector?.on(FILE_CREATE_EVENT, this._onCreate.bind(this));
              this._detector?.on(FILE_DELETE_EVENT, this._onDelete.bind(this));
       }

       /**
        * Removes all @see FsDetector bound events
        *
        * @private
        */
       private _removeEventHandlers(): void {
              this._detector?.off(FILE_CHANGE_EVENT, this._onChange.bind(this));
              this._detector?.off(FILE_CREATE_EVENT, this._onCreate.bind(this));
              this._detector?.off(FILE_DELETE_EVENT, this._onDelete.bind(this));
       }

       /**
        * Resolves the given @see String path, ensuring absolute, existing and resolving any env variables
        *
        * @private
        * @param {String} path
        * @returns {String | undefined}
        */
       private _resolve(path: string): string | undefined {
              const index: number = path.indexOf("$");
              /** resolve env variables */
              if (index > -1) {
                     const end: number = path.indexOf("/", index);
                     const key: string = path.substring(
                            index,
                            end > -1 ? end : void 0,
                     );
                     const variable: string | undefined =
                            process.env[key.replace("$", "")];

                     if (variable) {
                            path = path.replace(key, variable);
                     }
              }

              /** ensure @see path is absolute */
              if (isAbsolute(path) === false) {
                     path = resolve(process.cwd(), path);
              }

              path = directory(path, {
                     skipIfDirectory: true,
              });

              if (existsSync(path) === false) {
                     mkdirSync(path, { recursive: true });
              }

              return path;
       }
}
