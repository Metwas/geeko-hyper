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

import { DEFAULT_DASHBOARD_SCRIPT } from "../../../global/scripts/dashboard";
import { DEFAULT_ERROR_SCRIPT } from "../../../global/scripts/error";
import { DEFAULT_404_SCRIPT } from "../../../global/scripts/404";
import { ScriptInjectorService } from "./ScriptInjectorService";
import { ReadStream, Stats, createReadStream } from "node:fs";
import { InjectOptions } from "../../../types/InjectOptions";
import { injectStream } from "../../../tools/stream";
import { Request, Response } from "hyper-express";
import { Script } from "../../../types/Script";
import { getFsStat } from "../../../tools/fs";
import { LogService } from "@geeko/log";
import { join } from "node:path";

/**_-_-_-_-_-_-_-_-_-_-_-_-_-          _-_-_-_-_-_-_-_-_-_-_-_-_-*/

/**
 * @see Script HTTP streaming service
 *
 * @public
 */
export class ScriptStreamService {
       /**
        * @public
        * @param {ScriptInjectorService} injector
        * @param {LogService} logger
        */
       public constructor(
              public readonly injector: ScriptInjectorService,
              private logger?: LogService,
       ) {}

       /**
        * Streams the specified @see StreamOptions on the given @see Response
        *
        * @public
        * @param {String} path
        * @param {Script} script
        * @param {Request} request
        * @param {Response} response
        * @param {Boolean} inject
        * @returns {Promise<void>}
        */
       public async stream(
              path: string,
              script: Script,
              request: Request,
              response: Response,
              inject: boolean = false,
       ): Promise<void> {
              let needle: Buffer | Array<Buffer> | string | undefined = void 0;
              let source: Buffer | string | undefined = void 0;

              if (inject === true) {
                     if (
                            script.inject === null ||
                            script.inject === void 0 ||
                            script.inject === true
                     ) {
                            source = this.injector.source();
                            needle = this.injector.needle();
                     } else if ((script.inject as InjectOptions)?.replacer) {
                            source = (script.inject as InjectOptions).replacer;

                            if (typeof source === "string") {
                                   source = Buffer.from(source);
                            }
                     }

                     if ((script.inject as InjectOptions)?.needle) {
                            needle = (script.inject as InjectOptions).needle;

                            if (typeof needle === "string") {
                                   needle = Buffer.from(needle);
                            }
                     }
              }

              const stat: Stats | undefined = await getFsStat(path);

              // Handle 404 if file doesn't exist
              if (!stat?.isFile()) {
                     return await ScriptStreamService.NOT_FOUND(response);
              }

              if (source && needle) {
                     this.logger?.debug(
                            `Inject script [${path}] source [${source.length}]`,
                     );

                     return injectStream(
                            path,
                            needle as Buffer,
                            source,
                            response,
                     );
              }

              const fsStream: ReadStream = createReadStream(path);
              return response.stream(fsStream);
       }

       /**
        * Streams the default dashboard/home script
        *
        * @public
        * @param {Response} response
        * @returns {Promise<void>}
        */
       public static async HOME(response: Response): Promise<void> {
              return streamStatusScript(DEFAULT_DASHBOARD_SCRIPT, response);
       }

       /**
        * Streams the 404 'Not found' @see Script or text
        *
        * @public
        * @param {Response} response
        * @returns {Promise<void>}
        */
       public static async NOT_FOUND(response: Response): Promise<void> {
              return streamStatusScript(DEFAULT_404_SCRIPT, response);
       }

       /**
        * Streams a the predefined 'error' @see Script or text
        *
        * @public
        * @param {Response} response
        * @returns {Promise<void>}
        */
       public static async ERROR(response: Response): Promise<void> {
              return streamStatusScript(DEFAULT_ERROR_SCRIPT, response);
       }
}

/**
 * Helper for streaming default status messages and scripts
 *
 * @private
 * @param {Script} script
 * @param {Response} response
 * @param {String} message
 * @returns {Promise<void>}
 */
async function streamStatusScript(
       script: Script,
       response: Response,
       message?: string,
): Promise<void> {
       const path: string = join(script.root, script.file);
       const stat: Stats | undefined = await getFsStat(path);

       if (!stat?.isFile()) {
              response
                     .status(script.code ?? 200)
                     .send(message ?? script.status ?? "OK");
       } else {
              const fsStream: ReadStream = createReadStream(path);
              return response.stream(fsStream);
       }

       return void 0;
}
