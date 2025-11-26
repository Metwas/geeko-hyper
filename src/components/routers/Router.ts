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

import { Route } from "../../types/Route";
import { Router } from "hyper-express";

/**_-_-_-_-_-_-_-_-_-_-_-_-_-           _-_-_-_-_-_-_-_-_-_-_-_-_-*/

/**
 * Hyperexpress @see Router dyanmic route management interface
 * 
 * @public
 */
export interface IRouterOutlet
{
       /**
        * Gets the underlying Hyperexpress @see Router
        * 
        * @public
        * @returns {Router}
        */
       router(): Router | undefined;

       /**
        * Gets the predefined @see Route references
        * 
        * @public
        * @returns {Array<Route>}
        */
       getRoutes(): Array<Route> | undefined;

       /**
        * Adds the specified path and handler to this @see IRouterOutlet instance
        * 
        * @public
        * @param {Route} route
        */
       addRoute( route: Route ): void;
}

/**
 * Hyperexpress @see Router dyanmic route management interface
 * 
 * @public
 */
export abstract class RouterOutlet implements IRouterOutlet
{
       /**
        * Optionally provide a hyperexpress @see Router instance
        * 
        * @public
        * @param {String} tag
        * @param {Router} router 
        */
       public constructor( tag?: string, router?: Router )
       {
              this._routes = new Map<string, Route>();
              this._router = router ?? new Router();

              this.tag = tag;
       }

       /**
        * Router prefix tag
        * 
        * @public
        * @type {String}
        */
       public readonly tag: string | undefined = void 0;

       /**
        * Optional Router version number 
        * 
        * @public
        * @type {String}
        */
       public readonly version: string = "";

       /**
        * Underlying @see HyperExpressServer Router instance
        * 
        * @protected
        * @type {Router}
        */
       protected _router: Router | undefined = void 0;

       /**
        * Underlying @see Route instances
        * 
        * @protected
        * @type {Array<Route>}
        */
       protected _routes: Map<string, Route> | undefined = void 0;

       /**
        * Gets the underlying Hyperexpress @see Router
        * 
        * @public
        * @returns {Router}
        */
       public router(): Router | undefined
       {
              return this._router;
       }

       /**
        * Gets the predefined @see Route references
        * 
        * @public
        * @returns {Array<Route>}
        */
       public getRoutes(): Array<Route> | undefined
       {
              return this._routes ? Array.from( this._routes?.values() ) : void 0;
       }

       /**
        * Adds the specified path and handler to this @see IRouterOutlet instance
        * 
        * @public
        * @param {Route} route
        * @param {WSRouteOptions | RouteOptions} options
        */
       public addRoute( route: Route, options?: any ): void
       {
              if ( route && this._routes?.has( route.path ) === false )
              {
                     this._routes.set( route.path, route );
                     /** Attach to the underlying @see Router */
                     switch ( route.method )
                     {
                            case "WS":
                                   this._router?.ws( route.path, options, route.handler );
                                   break;
                            case "GET":
                                   this._router?.get( route.path, options, route.handler );
                                   break;
                            case "PUT":
                            case "POST":
                                   this._router?.post( route.path, options, route.handler );
                                   break;
                            case "DELETE":
                                   this._router?.delete( route.path, options, route.handler );
                                   break;
                            case "TRACE":
                                   this._router?.trace( route.path, options, route.handler );
                                   break;
                     };
              }
       }
}