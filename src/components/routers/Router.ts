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

import { Route } from "../../types/Route";
import { Router } from "hyper-express";

/**_-_-_-_-_-_-_-_-_-_-_-_-_-           _-_-_-_-_-_-_-_-_-_-_-_-_-*/

/**
 * Hyperexpress @see Router dyanmic route management interface
 *
 * @public
 */
export interface IRouterOutlet {
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
       addRoute(route: Route): void;
}

/**
 * Hyperexpress @see Router dyanmic route management interface
 *
 * @public
 */
export abstract class RouterOutlet implements IRouterOutlet {
       /**
        * Optionally provide a hyperexpress @see Router instance
        *
        * @public
        * @param {String} name
        * @param {Router} router
        */
       public constructor(
              public readonly name: string,
              router?: Router,
       ) {
              this._routes = new Map<string, Route>();
              this._router = router ?? new Router();
       }

       /**
        * Router name
        *
        * @protected
        * @type {String}
        */
       protected _root: string = "";

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
        * Root path
        *
        * @public
        * @type {String}
        */
       public root(override?: string): string | undefined {
              if (typeof override === "string") {
                     this._root = override;
              }

              return this._root;
       }

       /**
        * Gets the underlying Hyperexpress @see Router
        *
        * @public
        * @returns {Router}
        */
       public router(): Router | undefined {
              return this._router;
       }

       /**
        * Gets the predefined @see Route references
        *
        * @public
        * @returns {Array<Route>}
        */
       public getRoutes(): Array<Route> | undefined {
              return this._routes ? Array.from(this._routes?.values()) : void 0;
       }

       /**
        * Adds the specified path and handler to this @see IRouterOutlet instance
        *
        * @public
        * @param {Route} route
        * @param {WSRouteOptions | RouteOptions} options
        */
       public addRoute(route: Route, options?: any): void {
              if (route && this._routes?.has(route.path) === false) {
                     this._routes.set(route.path, route);
                     /** Attach to the underlying @see Router */
                     switch (route.method) {
                            case "WS":
                                   this._router?.ws(
                                          route.path,
                                          options,
                                          route.handler,
                                   );
                                   break;
                            case "GET":
                                   this._router?.get(
                                          route.path,
                                          options,
                                          route.handler,
                                   );
                                   break;
                            case "PUT":
                            case "POST":
                                   this._router?.post(
                                          route.path,
                                          options,
                                          route.handler,
                                   );
                                   break;
                            case "DELETE":
                                   this._router?.delete(
                                          route.path,
                                          options,
                                          route.handler,
                                   );
                                   break;
                            case "TRACE":
                                   this._router?.trace(
                                          route.path,
                                          options,
                                          route.handler,
                                   );
                                   break;
                     }
              }
       }
}
