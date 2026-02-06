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
       INJECTOR_CONFIGURATION_KEY,
       SCRIPT_TAG_BUFFER_BOTTOM,
       SCRIPT_TAG_BUFFER_TOP,
       SOURCE_AUTH_TOKEN,
       HTTP_REGEX_PATH,
} from "../../../global/injector/script.tokens";

import { INJECTABLE_NEEDLE_BUFFER, decompress } from "../../../tools/stream";
import { GithubReleaseOptions } from "../../../types/GithubReleaseOptions";
import { IScriptSourceProvider } from "./IScriptSourceProvider";
import { SourceOptions } from "../../../types/SourceOptions";
import { ConfigurationService } from "@geeko/configuration";
import { getRelease } from "../../../tools/github";
import { isAbsolute, resolve } from "node:path";
import { JsonLike } from "@geeko/serialization";
import { readFileData } from "@geeko/os";
import { LogService } from "@geeko/log";

/**_-_-_-_-_-_-_-_-_-_-_-_-_-          _-_-_-_-_-_-_-_-_-_-_-_-_-*/

/**
 * Default file & Http Injectable source provider
 *
 * @public
 */
export class DefaultSourceProvider implements IScriptSourceProvider {
       /**
        * @public
        * @param {ConfigurationService} configuration
        * @param {LogService} log
        */
       public constructor(
              private readonly configuration: ConfigurationService,
              private readonly log?: LogService,
       ) {}

       /**
        * Source buffer
        *
        * @private
        * @type {Buffer}
        */
       private _buffer: Buffer | undefined = void 0;

       /**
        * Loads the injectable source from the configured destination
        *
        * @public
        * @returns {Promise<void>}
        */
       public async load(): Promise<void> {
              try {
                     const options: SourceOptions =
                            await this.configuration?.get(
                                   INJECTOR_CONFIGURATION_KEY,
                            );
                     let path: string = options?.url;

                     if (path) {
                            const token: string =
                                   options?.token ??
                                   (await this.configuration.get(
                                          SOURCE_AUTH_TOKEN,
                                          {
                                                 env: true,
                                          },
                                   )) ??
                                   "";

                            this.log?.debug(
                                   `Using authentication token [${token}]`,
                            );

                            /** Validate if local or remote path */
                            if (HTTP_REGEX_PATH.test(path)) {
                                   this.log?.verbose(
                                          `Fetching HTTP source [${path}]`,
                                   );

                                   const response: Response = await fetch(
                                          path,
                                          {
                                                 method: "GET",
                                                 headers: token
                                                        ? {
                                                                 Authorization: `Token ${token}`,
                                                          }
                                                        : void 0,
                                          },
                                   );

                                   if (response.ok === false) {
                                          this.log?.error(
                                                 `Source fetch error: [${response.statusText}] path [${path}]`,
                                          );
                                   } else {
                                          if (options?.method === "github") {
                                                 /** Github path will return a @see json object containing the releases */
                                                 let releases: Array<JsonLike> =
                                                        await response.json();

                                                 releases = Array.isArray(
                                                        releases,
                                                 )
                                                        ? releases
                                                        : [releases];
                                                 const release:
                                                        | GithubReleaseOptions
                                                        | undefined =
                                                        getRelease(
                                                               options?.version ??
                                                                      "latest",
                                                               releases,
                                                        );

                                                 if (release?.url) {
                                                        this.log?.verbose(
                                                               `Fetching github source [${release?.url}]`,
                                                        );

                                                        const response: Response =
                                                               await fetch(
                                                                      release?.url,
                                                                      {
                                                                             method: "GET",
                                                                             headers: token
                                                                                    ? {
                                                                                             Authorization: `Token ${token}`,
                                                                                             Accept: "application/octet-stream",
                                                                                             "accept-encoding":
                                                                                                    "gzip,deflate",
                                                                                      }
                                                                                    : void 0,
                                                                      },
                                                               );

                                                        const buffer: Buffer =
                                                               Buffer.from(
                                                                      await response.arrayBuffer(),
                                                               );

                                                        this.log?.debug(
                                                               `Got release source buffer [${buffer.length}]`,
                                                        );
                                                        /** This would be compressed, therefore use @see gunzip to deflate */
                                                        this._buffer =
                                                               this.normalize(
                                                                      release.compressed
                                                                             ? await decompress(
                                                                                      buffer,
                                                                               )
                                                                             : buffer,
                                                                      options?.wrap,
                                                               );
                                                 }
                                          } else {
                                                 this.log?.verbose(
                                                        `Parsing HTTP source`,
                                                 );
                                                 this._buffer = this.normalize(
                                                        Buffer.from(
                                                               await response.arrayBuffer(),
                                                        ),
                                                        options?.wrap,
                                                 );
                                          }
                                   }
                            } else {
                                   /** Assume local & ensure absolute */
                                   if (isAbsolute(path) === false) {
                                          path = resolve(process.cwd(), path);
                                   }

                                   this._buffer = this.normalize(
                                          await readFileData(path),
                                          options?.wrap,
                                   );
                            }

                            if ((this._buffer?.length ?? 0) > 0) {
                                   this.log?.verbose(
                                          `Got source buffer [${this._buffer?.length} bytes]`,
                                   );
                            } else {
                                   this.log?.warn(`Buffer returned empty`);
                            }
                     }

                     return void 0;
              } catch (error) {
                     this.log?.error(error as Error);
              }
       }

       /**
        * Returns the injectable source as a @see Buffer
        *
        * @public
        * @returns {Buffer}
        */
       public source(): Buffer | undefined {
              return this._buffer;
       }

       /**
        * Returns the @see source replacer/needle. Defaults to @see INJECTABLE_NEEDLE_BUFFER
        *
        * @public
        * @returns {Buffer}
        */
       public needle(): Buffer | Array<Buffer> | undefined {
              return INJECTABLE_NEEDLE_BUFFER[0];
       }

       /**
        * Normalizes the @see Buffer input by containing the source in a wrap pattern which defaults to <script> if set to true
        *
        * @protected
        * @param {Buffer} buffer
        * @param {Boolean | String} wrap
        * @returns {Buffer}
        */
       protected normalize(buffer: Buffer, wrap?: boolean): Buffer {
              if (wrap === true) {
                     return Buffer.concat([
                            SCRIPT_TAG_BUFFER_TOP,
                            buffer,
                            SCRIPT_TAG_BUFFER_BOTTOM,
                     ]);
              }

              /** Simply return the raw @see Buffer if we got this far */
              return buffer;
       }
}
