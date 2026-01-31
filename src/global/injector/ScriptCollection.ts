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
       SCRIPT_WATCH_SERVICE,
       SCRIPT_COLLECTOR_TOKEN,
       SCRIPT_CONFIGURATION_KEY,
} from "./script.tokens";

import {
       GLOBAL_CONFIGURATION_PROVIDER,
       GLOBAL_LOG_PROVIDER,
} from "./inject.tokens";

import { ScriptCollection } from "../../modules/script/services/ScriptCollection";
import { ScriptWatchOptions } from "../../types/ScriptConfigurationOptions";
import { ConfigurationService } from "@geeko/configuration";
import { Provider } from "@nestjs/common";
import { LogService } from "@geeko/log";
import { FsDetector } from "@geeko/os";

/**_-_-_-_-_-_-_-_-_-_-_-_-_-           _-_-_-_-_-_-_-_-_-_-_-_-_-*/

/**
 * Injects an instance of @see ScriptCollection
 *
 * @public
 * @returns {Provider<ScriptCollection>}
 */
export const injectScriptCollection = (): Provider<ScriptCollection> => {
       return {
              provide: SCRIPT_COLLECTOR_TOKEN,
              useFactory: async (
                     watcher: FsDetector,
                     configuration: ConfigurationService,
                     logger: LogService,
              ): Promise<ScriptCollection> => {
                     const collector: ScriptCollection = new ScriptCollection(
                            watcher,
                            logger.branch("Scripts"),
                     );
                     const options: ScriptWatchOptions =
                            await configuration.get(SCRIPT_CONFIGURATION_KEY);

                     if (options.path) {
                            collector.watch(options.path);
                     }

                     return collector;
              },
              inject: [
                     SCRIPT_WATCH_SERVICE,
                     GLOBAL_CONFIGURATION_PROVIDER,
                     GLOBAL_LOG_PROVIDER,
              ],
       };
};
