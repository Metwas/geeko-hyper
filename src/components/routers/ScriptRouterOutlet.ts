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
       GLOBAL_SCRIPTS_URI,
       IFRAME_URL_REGEX,
       SCRIPT_ID_REGEX,
} from "../../global/scripts/paths";

import { ScriptStreamService } from "../../modules/script/services/ScriptStreamService";
import { ScriptService } from "../../modules/script/services/ScriptService";
import { SCRIPT_COOKIE_TAG } from "../../global/constants";
import { Request, Response, Router } from "hyper-express";
import { RouteOutlet } from "../decorators/RouteOutlet";
import { Script } from "../../types/Script";
import { Get } from "../decorators/RESTful";
import { RouterOutlet } from "./Router";
import { LogService } from "@geeko/log";
import { join } from "node:path";

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
              super("scripts", router);
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

                     return await ScriptStreamService.ERROR(response);
              }

              let url: string = request.url;
              let referer: string = request.cookies[SCRIPT_COOKIE_TAG];

              const indexOf: number = url.indexOf(GLOBAL_SCRIPTS_URI);
              let id: string | undefined =
                     indexOf > -1
                            ? url.substring(
                                     indexOf + GLOBAL_SCRIPTS_URI.length + 1,
                              )
                            : void 0;

              let resourceRequest: boolean = false;

              if ((!id && referer) || (id && id.indexOf(".") > -1)) {
                     id = referer;
                     resourceRequest = true;
              }

              if (!id) {
                     response.header["body"] = "No script is was specified";
                     return ScriptStreamService.ERROR(response);
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
                     } else {
                            response.cookie(SCRIPT_COOKIE_TAG, id);

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
