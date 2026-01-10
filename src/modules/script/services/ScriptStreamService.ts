/**
     MIT License

     @Copyright (c) Metwas

     Permission is hereby granted, free of charge, to any person obtaining a copy
     of this software and associated documentation files (the "Software"), to deal
     in the Software without restriction, including without limitation the rights
     to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     copies of the Software, and to permit persons to whom the Software is
     furnished to do so, subject to the following conditions:

     The above Copyright notice and this permission notice shall be included in all
     copies or substantial portions of the Software.

     THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     AUTHORS OR Copyright HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
     SOFTWARE.
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
                     return await ScriptStreamService.NOT_FOUND(
                            request,
                            response,
                     );
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
        * @param {Request} request
        * @param {Response} response
        * @returns {Promise<void>}
        */
       public static async HOME(
              request: Request,
              response: Response,
       ): Promise<void> {
              return streamStatusScript(DEFAULT_DASHBOARD_SCRIPT, response);
       }

       /**
        * Streams the 404 'Not found' @see Script or text
        *
        * @public
        * @param {Request} request
        * @param {Response} response
        * @returns {Promise<void>}
        */
       public static async NOT_FOUND(
              request: Request,
              response: Response,
       ): Promise<void> {
              return streamStatusScript(DEFAULT_404_SCRIPT, response);
       }

       /**
        * Streams a the predefined 'error' @see Script or text
        *
        * @public
        * @param {Request} request
        * @param {Response} response
        * @returns {Promise<void>}
        */
       public static async ERROR(
              request: Request,
              response: Response,
       ): Promise<void> {
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
