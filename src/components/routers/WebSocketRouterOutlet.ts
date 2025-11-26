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

import { RouteOutlet } from "../decorators/RouteOutlet";
import { Ws } from "../decorators/Websocket";
import { Websocket } from "hyper-express";
import { RouterOutlet } from "./Router";
import { LogService } from "@geeko/log";

/**_-_-_-_-_-_-_-_-_-_-_-_-_-           _-_-_-_-_-_-_-_-_-_-_-_-_-*/

/**
 * @public
 */
@RouteOutlet( "ws" )
export class WebSocketRouterOutlet extends RouterOutlet
{
       /**
        * @public
        * @param {ScriptService} scriptService 
        */
       public constructor( public scriptService?: any )
       {
              super();

              let logger = new LogService();

              this.addRoute( {
                     path: "/connect",
                     method: "WS",
                     handler: ( socket: Websocket ) =>
                     {
                            logger.info( "Websocket client connected: " );

                            socket.on( "message", ( message: string ) =>
                            {
                                   logger.info( message );
                            } );
                     }
              } );
       }

       @Ws( "connect" )
       public connect( socket: Websocket ): void
       {
              console.log( "Websocket client connected: ", socket );
       }
}