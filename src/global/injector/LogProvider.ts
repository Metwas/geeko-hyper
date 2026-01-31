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

import { GLOBAL_LOG_PROVIDER } from "./inject.tokens";
import { LogLevel, LogService } from "@geeko/log";
import { Provider } from "@nestjs/common";

/**_-_-_-_-_-_-_-_-_-_-_-_-_-           _-_-_-_-_-_-_-_-_-_-_-_-_-*/

/**
 * Injects an instance of @see LogService
 *
 * @public
 * @returns {Provider<LogService>}
 */
export const injectLogProvider = (): Provider<LogService> => {
       return {
              provide: GLOBAL_LOG_PROVIDER,
              useFactory: (): LogService => {
                     const args: Array<string> = process.argv.slice(2);
                     const verbose: boolean = args.indexOf("--verbose") > -1;
                     const debug: boolean = args.indexOf("--debug") > -1;

                     const env: string | undefined = process.env.NODE_ENV;

                     let level: LogLevel = "info";

                     if (debug || env === "development") {
                            level = "debug";
                     } else if (verbose) {
                            level = "verbose";
                     }

                     return new LogService({ level: level });
              },
              inject: [],
       };
};
