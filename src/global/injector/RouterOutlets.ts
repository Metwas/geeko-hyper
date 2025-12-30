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
       GLOBAL_LOG_PROVIDER,
       GLOBAL_ROUTE_OUTLETS,
       ROUTE_OUTLET_TOKEN,
} from "./inject.tokens";
import { WebSocketRouterOutlet } from "../../components/routers/WebSocketRouterOutlet";
import { ScriptRouterOutlet } from "../../components/routers/ScriptRouterOutlet";
import { ScriptService } from "../../modules/script/services/ScriptService";
import { RouterOutlet } from "../../components/routers/Router";
import { Provider } from "@nestjs/common";
import { LogService } from "@geeko/log";
import { Reflector } from "@geeko/meta";

/**_-_-_-_-_-_-_-_-_-_-_-_-_-           _-_-_-_-_-_-_-_-_-_-_-_-_-*/

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
                     const routers: Array<RouterOutlet> | undefined =
                            Reflector.getFor(ROUTE_OUTLET_TOKEN) as
                                   | Array<RouterOutlet>
                                   | undefined;

                     if (!routers) {
                            logger.debug("No injected routers");
                            return [];
                     }

                     const length: number = routers?.length ?? 0;
                     let index: number = 0;

                     for (; index < length; ++index) {
                            logger.info(routers[index].tag ?? "Unknown");
                     }

                     return [
                            new WebSocketRouterOutlet(script),
                            new ScriptRouterOutlet(script),
                     ];
              },
              inject: [ScriptService, GLOBAL_LOG_PROVIDER],
       };
};
