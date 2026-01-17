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

import { RouteHandler } from "./RouteHandler";
import { Websocket } from "hyper-express";

/**_-_-_-_-_-_-_-_-_-_-_-_-_-           _-_-_-_-_-_-_-_-_-_-_-_-_-*/

/**
 * Core @see Route options
 *
 * @public
 */
export type RouteOptions = {
       method: string;
       path: string;
};

/**
 * @see Websocket specific @see Router options
 *
 * @public
 */
export type WebsocketRoute = RouteOptions & {
       handler: (socket: Websocket) => void;
       method: "WS";
};

/**
 * HTTP specific @see Router options
 *
 * @public
 */
export type HttpRoute = RouteOptions & {
       method: "GET" | "POST" | "PUT" | "DELETE" | "TRACE";
       handler: RouteHandler;
};

/**
 * @see Router options type
 */
export type Route = HttpRoute | WebsocketRoute;
