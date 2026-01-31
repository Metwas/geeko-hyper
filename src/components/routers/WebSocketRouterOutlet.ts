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
              public script: ScriptService,
              public logger?: LogService,
              router?: Router,
       ) {
              super(router);
       }

       /**
        * Websocket client connect handler
        *
        * @public
        * @param {Websocket} socket
        */
       @Ws("connect")
       public connect(socket: Websocket): void {
              this.logger?.verbose(`Websocket client [${socket.ip}] connected`);

              socket.on("message", (message: string) => {
                     this.logger?.debug(message);
              });

              socket.on("close", (code: number, reason: ArrayBuffer) => {
                     this.logger?.verbose(
                            `Websocket client [${socket.ip}] closed, reason [${(reason && Buffer.from(reason).toString("utf-8")) || "Client Disconnection"}] code [${code}]`,
                     );
              });
       }
}
