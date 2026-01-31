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
       GLOBAL_LOG_PROVIDER,
} from "./inject.tokens";
import { ConfigurationService, FileProvider } from "@geeko/configuration";
import { Provider } from "@nestjs/common";
import { LogService } from "@geeko/log";

/**_-_-_-_-_-_-_-_-_-_-_-_-_-           _-_-_-_-_-_-_-_-_-_-_-_-_-*/

/**
 * Injects an instance of @see ConfigurationService
 *
 * @public
 * @returns {Provider<ConfigurationService>}
 */
export const injectConfigurationService =
       (): Provider<ConfigurationService> => {
              return {
                     provide: GLOBAL_CONFIGURATION_PROVIDER,
                     useFactory: async (
                            logger: LogService,
                     ): Promise<ConfigurationService> => {
                            const provider: ConfigurationService =
                                   new ConfigurationService(
                                          new FileProvider({
                                                 path: "./app.config.json",
                                                 fragment: false,
                                                 logger: logger,
                                          }),
                                   );

                            await provider.load();
                            return provider;
                     },
                     inject: [GLOBAL_LOG_PROVIDER],
              };
       };
