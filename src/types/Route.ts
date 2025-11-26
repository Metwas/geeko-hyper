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

import { Request, Response, Websocket } from "hyper-express";

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
       handler: ( socket: Websocket ) => void;
       method: "WS";
};

/**
 * HTTP specific @see Router options
 * 
 * @public
 */
export type HttpRoute = RouteOptions & {
       handler: ( request: Request, response: Response ) => void;
       method: "GET" | "POST" | "PUT" | "DELETE" | "TRACE";
};

/**
 * @see Router options type
 */
export type Route = HttpRoute | WebsocketRoute;