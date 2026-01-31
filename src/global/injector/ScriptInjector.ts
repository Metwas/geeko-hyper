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

import { IScriptSourceProvider } from "../../modules/script/interfaces/IScriptSourceProvider";
import { ScriptInjectorService } from "../../modules/script/services/ScriptInjectorService";
import { SCRIPT_INJECTOR_TOKEN, SCRIPT_SOURCE_PROVIDER } from "./script.tokens";
import { Provider } from "@nestjs/common";

/**_-_-_-_-_-_-_-_-_-_-_-_-_-           _-_-_-_-_-_-_-_-_-_-_-_-_-*/

/**
 * Injects an instance of @see ScriptInjectorService
 *
 * @public
 * @returns {Provider<ScriptInjectorService>}
 */
export const injectScriptInjectorService =
       (): Provider<ScriptInjectorService> => {
              return {
                     provide: SCRIPT_INJECTOR_TOKEN,
                     useFactory: async (
                            source: IScriptSourceProvider,
                     ): Promise<ScriptInjectorService> => {
                            return new ScriptInjectorService(source);
                     },
                     inject: [SCRIPT_SOURCE_PROVIDER],
              };
       };
