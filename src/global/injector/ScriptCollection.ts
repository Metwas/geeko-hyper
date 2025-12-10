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
