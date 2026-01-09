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

import {
       GLOBAL_SCRIPTS_URI,
       IFRAME_URL_REGEX,
       SCRIPT_ID_REGEX,
} from "../../global/scripts/paths";

import { ScriptStreamService } from "../../modules/script/services/ScriptStreamService";
import { ScriptService } from "../../modules/script/services/ScriptService";
import { Request, Response, Router } from "hyper-express";
import { RouteOutlet } from "../decorators/RouteOutlet";
import { extractKeyFromUrl } from "../../tools/text";
import { Script } from "../../types/Script";
import { Get } from "../decorators/RESTful";
import { RouterOutlet } from "./Router";
import { LogService } from "@geeko/log";
import { join } from "node:path";
import mime from "mime-types";

/**_-_-_-_-_-_-_-_-_-_-_-_-_-           _-_-_-_-_-_-_-_-_-_-_-_-_-*/

/**
 * @public
 */
@RouteOutlet(GLOBAL_SCRIPTS_URI)
export class ScriptRouterOutlet extends RouterOutlet {
       /**
        * @public
        * @param {ScriptService} script
        * @param {LogService} logger
        * @param {Router} router
        */
       public constructor(
              public script: ScriptService,
              public logger?: LogService,
              router?: Router,
       ) {
              super(router);
       }

       /**
        * Streams the specified @see Script by id
        *
        * @public
        * @param {Request} request
        * @param {Response} response
        * @returns {Promise<void>}
        */
       @Get("/:id")
       public async get(request: Request, response: Response): Promise<void> {
              if (!this.script) {
                     this.logger?.debug(
                            `Invalid [GET] request, url [${request.url}]`,
                     );

                     return await ScriptStreamService.ERROR(request, response);
              }

              let url: string = request.url;
              let referer: string = request.headers["referer"];

              let id: string | undefined = extractKeyFromUrl(
                     referer ?? url,
                     GLOBAL_SCRIPTS_URI,
              );

              let resourceRequest: boolean = false;

              if (referer) {
                     /** if no id was provided, check the @see referer header */
                     const referer: string = request.headers["referer"] ?? url;
                     id = extractKeyFromUrl(referer, GLOBAL_SCRIPTS_URI);

                     resourceRequest = true;
              }

              if (!id) {
                     response.header["body"] = "No script is was specified";
                     return ScriptStreamService.ERROR(request, response);
              }

              /** Hack to allow for recursive @see iframes by exploiting the url, but remove it at this stage */
              url = url
                     .replace(IFRAME_URL_REGEX, "")
                     .replace(SCRIPT_ID_REGEX, "");

              if (id) {
                     const streamer: ScriptStreamService = this.script.stream;
                     const script: Script | undefined = this.script.get(id);

                     if (!script) {
                            return await ScriptStreamService.NOT_FOUND(
                                   request,
                                   response,
                            );
                     }

                     let path: string;

                     if (resourceRequest) {
                            const resourceFile: string = url.replace(
                                   `/${GLOBAL_SCRIPTS_URI}/`,
                                   "",
                            );

                            path = join(script.root, resourceFile);

                            response.header(
                                   "Content-Type",
                                   mime.lookup(resourceFile) ||
                                          "application/octet-stream",
                            );
                     } else {
                            path =
                                   script.path ??
                                   join(script.root, script.file);
                     }

                     return await streamer.stream(
                            path,
                            script,
                            request,
                            response,
                            !resourceRequest,
                     );
              }

              return void 0;
       }
}
