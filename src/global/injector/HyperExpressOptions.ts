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

import { ServerConstructorOptions } from "hyper-express";
import { HYPER_CTOR_OPTIONS } from "./inject.tokens";
import { Provider } from "@nestjs/common";

/**_-_-_-_-_-_-_-_-_-_-_-_-_-           _-_-_-_-_-_-_-_-_-_-_-_-_-*/

/**
 * Injects an instance of @see ServerConstructorOptions
 *
 * @public
 * @returns {Provider<ServerConstructorOptions>}
 */
export const injectHyperOptions = (): Provider<
       ServerConstructorOptions | undefined
> => {
       return {
              provide: HYPER_CTOR_OPTIONS,
              useFactory: (): ServerConstructorOptions | undefined => {
                     return void 0;
              },
       };
};
