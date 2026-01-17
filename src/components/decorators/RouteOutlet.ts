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

import { ROUTE_OUTLET_TOKEN } from "../../global/injector/inject.tokens";
import { SetMetadata } from "@geeko/meta";

/**_-_-_-_-_-_-_-_-_-_-_-_-_-          _-_-_-_-_-_-_-_-_-_-_-_-_-*/

/**
 * @see RouterOutlet
 *
 * @public
 * @param {String} uri
 * @param {Object} options
 * @returns {CustomDecorator}
 */
export function RouteOutlet(
       uri?: string | undefined,
       options?: any,
): ClassDecorator {
       return SetMetadata(
              ROUTE_OUTLET_TOKEN,
              {
                     options: options,
                     path: uri,
              },
              {
                     injectable: true,
              },
       );
}
