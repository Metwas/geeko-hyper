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

import {
       GLOBAL_ROUTE_OUTLETS,
       GLOBAL_LOG_PROVIDER,
       ROUTE_OUTLET_TOKEN,
       ROUTE_API_TOKEN,
} from "./inject.tokens";

import { WebSocketRouterOutlet } from "../../components/routers/WebSocketRouterOutlet";
import { ScriptRouterOutlet } from "../../components/routers/ScriptRouterOutlet";
import { CoreRouterOutlet } from "../../components/routers/CoreRouterOutlet";
import { ScriptService } from "../../modules/script/services/ScriptService";
import { RouterOutlet } from "../../components/routers/Router";
import { ModuleWrapper, Reflector, Type } from "@geeko/meta";
import { RouteHandler } from "../../types/RouteHandler";
import { Provider } from "@nestjs/common";
import { LogService } from "@geeko/log";

/**_-_-_-_-_-_-_-_-_-_-_-_-_-           _-_-_-_-_-_-_-_-_-_-_-_-_-*/

/**
 * Core injectable @see RouterOutlet
 *
 * @private
 * @type {Array<Type<RouterOutlet>>}
 */
const CORE_ROUTE_OUTLETS: Array<Type<RouterOutlet>> = [
       WebSocketRouterOutlet,
       ScriptRouterOutlet,
       CoreRouterOutlet,
];

/**
 * Injects an collection of @see Array<RouterOutlet>
 *
 * @public
 * @returns {Provider<Array<RouterOutlet>>}
 */
export const injectRouterOutlets = (): Provider<Array<RouterOutlet>> => {
       return {
              provide: GLOBAL_ROUTE_OUTLETS,
              useFactory: async (
                     script: ScriptService,
                     logger: LogService,
              ): Promise<Array<RouterOutlet>> => {
                     const routes: Array<RouterOutlet> = [];

                     const wrappers:
                            | Array<ModuleWrapper<any, RouterOutlet>>
                            | undefined =
                            Reflector.getWrapperFor(ROUTE_OUTLET_TOKEN);

                     if (wrappers) {
                            const apis: Array<any> | undefined =
                                   Reflector.getFor(ROUTE_API_TOKEN, {
                                          isProperty: true,
                                   });

                            const length: number = wrappers?.length ?? 0;
                            const alength: number = apis?.length ?? 0;
                            let aindex: number = 0;
                            let index: number = 0;

                            for (; index < length; ++index) {
                                   try {
                                          const wrapper: ModuleWrapper<
                                                 any,
                                                 RouterOutlet
                                          > = wrappers[index];

                                          const target:
                                                 | Type<RouterOutlet>
                                                 | undefined = wrapper.target();

                                          if (!target) {
                                                 continue;
                                          }

                                          const metadata: any =
                                                 wrapper.metadata();

                                          const instance: RouterOutlet =
                                                 new target(script, logger);

                                          instance.name(metadata.path);

                                          if (apis) {
                                                 for (
                                                        ;
                                                        aindex < alength;
                                                        ++aindex
                                                 ) {
                                                        const api: any =
                                                               apis[aindex];

                                                        const name:
                                                               | string
                                                               | undefined =
                                                               api.target?.name;

                                                        if (
                                                               typeof api.key !==
                                                                      "string" ||
                                                               typeof name !==
                                                                      "string" ||
                                                               name !==
                                                                      target.name
                                                        ) {
                                                               continue;
                                                        }

                                                        const handler: RouteHandler =
                                                               instance[
                                                                      api.key
                                                               ];

                                                        if (
                                                               typeof handler !==
                                                               "function"
                                                        ) {
                                                               continue;
                                                        }

                                                        const metadata: any =
                                                               api.metadata;

                                                        /** Register route with the provided metadata */
                                                        instance.addRoute({
                                                               method: metadata.method,
                                                               path: metadata.path,
                                                               handler: handler.bind(
                                                                      instance,
                                                               ),
                                                        });
                                                 }

                                                 aindex = 0;
                                          }

                                          routes.push(instance);

                                          logger.debug(
                                                 `Adding route [${metadata.path}]`,
                                          );
                                   } catch (error) {
                                          logger.error(
                                                 (error as Error).message,
                                          );
                                   }
                            }
                     }

                     return routes;
              },
              inject: [ScriptService, GLOBAL_LOG_PROVIDER],
       };
};
