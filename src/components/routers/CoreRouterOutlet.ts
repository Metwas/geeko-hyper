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

import { ScriptStreamService } from "../../modules/script/services/ScriptStreamService";
import { ScriptService } from "../../modules/script/services/ScriptService";
import { GLOBAL_ROOT_URI } from "../../global/scripts/paths";
import { Request, Response, Router } from "hyper-express";
import { RouteOutlet } from "../decorators/RouteOutlet";
import { Get } from "../decorators/RESTful";
import { RouterOutlet } from "./Router";
import { LogService } from "@geeko/log";

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

              this.addRoute({
                     path: "/",
                     method: "GET",
                     handler: this.get.bind(this),
              });
       }

       /**
        * Streams the default dashboard @see ScriptStreamService.DEFAULT_PAGE
        *
        * @public
        * @param {Request} request
        * @param {Response} response
        * @returns {Promise<void>}
        */
       @Get("/")
       public async get(request: Request, response: Response): Promise<void> {
              return await ScriptStreamService.ERROR(request, response);
       }
}
