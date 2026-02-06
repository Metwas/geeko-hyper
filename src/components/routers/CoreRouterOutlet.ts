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
       GLOBAL_ROOT_URI,
} from "../../global/scripts/paths";

import { ScriptStreamService } from "../../modules/script/services/ScriptStreamService";
import { ScriptService } from "../../modules/script/services/ScriptService";
import { SCRIPT_COOKIE_TAG } from "../../global/constants";
import { Request, Response, Router } from "hyper-express";
import { RouteOutlet } from "../decorators/RouteOutlet";
import { Get } from "../decorators/RESTful";
import { Script } from "src/types/Script";
import { RouterOutlet } from "./Router";
import { LogService } from "@geeko/log";
import { join } from "node:path";
import mime from "mime-types";

/**_-_-_-_-_-_-_-_-_-_-_-_-_-           _-_-_-_-_-_-_-_-_-_-_-_-_-*/

/**
 * @public
 */
@RouteOutlet(GLOBAL_ROOT_URI)
export class CoreRouterOutlet extends RouterOutlet {
       /**
        * @public
        * @param {ScriptService} script
        * @param {LogService} logger
        * @param {Router} router
        */
       public constructor(
              public script?: ScriptService,
              public logger?: LogService,
              router?: Router,
       ) {
              super(router);
       }

       /**
        * Streams the default dashboard @see ScriptStreamService.DEFAULT_PAGE
        *
        * @public
        * @param {Request} request
        * @param {Response} response
        * @returns {Promise<void>}
        */
       @Get("*")
       public async get(request: Request, response: Response): Promise<void> {
              const url: string = request.url;
              const id: string = request.cookies[SCRIPT_COOKIE_TAG];

              if (id) {
                     if (!this.script) {
                            this.logger?.debug(
                                   `Invalid [GET] request, url [${url}]`,
                            );

                            return await ScriptStreamService.ERROR(response);
                     }

                     const streamer: ScriptStreamService = this.script.stream;
                     const script: Script | undefined = this.script.get(id);

                     if (!script) {
                            return await ScriptStreamService.NOT_FOUND(
                                   response,
                            );
                     }

                     const resourceFile: string = url.replace(
                            `/${GLOBAL_SCRIPTS_URI}/`,
                            "",
                     );

                     let path: string = join(script.root, resourceFile);

                     response.header(
                            "Content-Type",
                            mime.lookup(resourceFile) ||
                                   "application/octet-stream",
                     );

                     return await streamer.stream(
                            path,
                            script,
                            request,
                            response,
                            false,
                     );
              }

              return await ScriptStreamService.HOME(response);
       }
}
