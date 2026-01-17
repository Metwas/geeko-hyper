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
       GLOBAL_CONFIGURATION_PROVIDER,
       GLOBAL_ROUTE_OUTLETS,
       GLOBAL_LOG_PROVIDER,
       HYPER_CTOR_OPTIONS,
} from "./global/injector/inject.tokens";

import { HyperExpressStrategy } from "./components/strategy/HyperHTTPStrategy";
import { ConfigurationService } from "@geeko/configuration";
import { RouterOutlet } from "./components/routers/Router";
import { INestApplicationContext } from "@nestjs/common";
import { AppModule } from "./modules/core/app.module";
import { NestFactory } from "@nestjs/core";
import { LogService } from "@geeko/log";

/**_-_-_-_-_-_-_-_-_-_-_-_-_-           _-_-_-_-_-_-_-_-_-_-_-_-_-*/

/**
 * Application bootstrap
 *
 * @public
 * @param {Array<string>} args
 * @returns {Promise<void>}
 */
(async (args: Array<string>): Promise<void> => {
       const context: INestApplicationContext =
              await NestFactory.createApplicationContext(AppModule, {
                     logger: false,
              });

       const configuration: ConfigurationService = context.get(
              GLOBAL_CONFIGURATION_PROVIDER,
       );

       const routerOutlets: Array<RouterOutlet> =
              context.get(GLOBAL_ROUTE_OUTLETS);

       const logger: LogService = context.get(GLOBAL_LOG_PROVIDER);
       const hyper: any = context.get(HYPER_CTOR_OPTIONS);

       const http: HyperExpressStrategy = new HyperExpressStrategy(
              configuration,
              routerOutlets,
              logger.branch("hyper"),
              hyper,
       );

       http.listen();
})(process.argv.slice(2));
