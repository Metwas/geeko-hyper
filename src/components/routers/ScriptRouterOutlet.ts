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

/**_-_-_-_-_-_-_-_-_-_-_-_-_- @Imports  _-_-_-_-_-_-_-_-_-_-_-_-_-*/

import { ScriptService } from "../../modules/script/services/ScriptService";
import { Get, Post, Delete } from "../decorators/RESTful";
import { RouteOutlet } from "../decorators/RouteOutlet";
import { Request, Response } from "hyper-express";
import { JsonLike } from "@geeko/serialization";
import { RouterOutlet } from "./Router";

/**_-_-_-_-_-_-_-_-_-_-_-_-_-           _-_-_-_-_-_-_-_-_-_-_-_-_-*/

/**
 * @public
 */
@RouteOutlet( "scripts" )
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
                     path: "/",
                     method: "GET",
                     handler: ( request, response ) =>
                     {
                            const query: JsonLike = request.query;
                            const scriptId: string = query?.id;

                            return response.html( "Got script from new outlet: " + scriptId );
                     }
              } );
       }

       @Get( "/" )
       public async get( request: Request, response: Response ): Promise<any>
       {
              const query: JsonLike = request.query;
              const id: string = query?.id;

              if ( id )
              {
                     await this.scriptService.interceptStream( id, request, response );
              }

              return void 0;
       }
}