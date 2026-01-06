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

import { ScriptService } from "../../modules/script/services/ScriptService";
import { GLOBAL_WEBSOCKET_URI } from "../../global/scripts/paths";
import { RouteOutlet } from "../decorators/RouteOutlet";
import { Router, Websocket } from "hyper-express";
import { Ws } from "../decorators/Websocket";
import { RouterOutlet } from "./Router";
import { LogService } from "@geeko/log";

/**_-_-_-_-_-_-_-_-_-_-_-_-_-           _-_-_-_-_-_-_-_-_-_-_-_-_-*/

/**
 * Websocket @see RouterOutlet interface
 *
 * @public
 */
@RouteOutlet(GLOBAL_WEBSOCKET_URI)
export class WebSocketRouterOutlet extends RouterOutlet {
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
                     path: "/connect",
                     method: "WS",
                     handler: (socket: Websocket) => {
                            logger?.info("Websocket client connected: ");

                            socket.on("message", (message: string) => {
                                   logger?.info(message);
                            });

                            socket.on("close", () => {
                                   logger?.warn(
                                          `WS Client ${socket.ip} closed`,
                                   );
                            });
                     },
              });
       }

       @Ws("connect")
       public connect(socket: Websocket): void {
              console.log("Websocket client connected: ", socket);
       }
}
