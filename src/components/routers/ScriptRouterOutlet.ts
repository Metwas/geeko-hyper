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

import { IFRAME_URL_REGEX, SCRIPT_ID_REGEX, GLOBAL_SCRIPTS_URI } from "../../global/scripts/paths";
import { ScriptStreamService } from "../../modules/script/services/ScriptStreamService";
import { ScriptService } from "../../modules/script/services/ScriptService";
import { Get, Post, Delete } from "../decorators/RESTful";
import { RouteOutlet } from "../decorators/RouteOutlet";
import { extractKeyFromUrl } from "../../tools/text";
import { Request, Response } from "hyper-express";
import { JsonLike } from "@geeko/serialization";
import { Script } from "../../types/Script";
import { RouterOutlet } from "./Router";
import { join } from "node:path";
import mime from "mime-types";

/**_-_-_-_-_-_-_-_-_-_-_-_-_-           _-_-_-_-_-_-_-_-_-_-_-_-_-*/

/**
 * @public
 */
@RouteOutlet( GLOBAL_SCRIPTS_URI )
export class ScriptRouterOutlet extends RouterOutlet
{
       /**
        * @public
        * @param {ScriptService} scriptService 
        */
       public constructor( public scriptService: ScriptService )
       {
              super();

              this.addRoute( {
                     path: "/*",
                     method: "GET",
                     handler: this.get.bind( this )
              } );
       }

       /**
        * Streams the specified @see Script by id
        * 
        * @public
        * @param {Request} request 
        * @param {Response} response 
        * @returns {Promise<void>}
        */
       @Get( "/*" )
       public async get( request: Request, response: Response ): Promise<void>
       {
              const query: JsonLike = request.query;

              let id: string | undefined = query?.id;
              let url: string = request.url;

              let resourceRequest: boolean = false;

              if ( !id )
              {
                     /** if no id was provided, check the @see referer header */
                     const referer: string = request.headers[ "referer" ] ?? url;
                     id = extractKeyFromUrl( referer, "?id" );

                     resourceRequest = true;
              }

              /** Hack to allow for recursive @see iframes by exploiting the url, but remove it at this stage */
              url = url.replace( IFRAME_URL_REGEX, "" ).replace( SCRIPT_ID_REGEX, "" );

              if ( id )
              {
                     const streamer: ScriptStreamService = this.scriptService.stream;
                     const script: Script | undefined = this.scriptService.get( id );

                     if ( !script )
                     {
                            return await streamer.notFound( request, response );
                     }

                     let path: string = script.path ?? join( script.root, script.file );

                     if ( resourceRequest )
                     {
                            path = join( script.root, ( resourceRequest ? url : script.file ) );
                            response.header( "Content-Type", ( mime.lookup( url ) || "application/octet-stream" ) );
                     }

                     return await streamer.stream( path, script, request, response, !resourceRequest );
              }

              return void 0;
       }
}