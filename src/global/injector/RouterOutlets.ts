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

                                          instance.root(metadata.path);
                                          
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
