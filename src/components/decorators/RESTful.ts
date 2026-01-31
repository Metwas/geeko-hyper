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

import { ROUTE_API_TOKEN } from "../../global/injector/inject.tokens";
import { RouteApiTypes } from "../../types/RouteApiTypes";
import { SetPropertyMetadata } from "@geeko/meta";

/**_-_-_-_-_-_-_-_-_-_-_-_-_-          _-_-_-_-_-_-_-_-_-_-_-_-_-*/

/**
 * @see RouterOutlet RESTful GET method decorator
 *
 * @public
 * @param {String} uri
 * @param {Object} options
 * @returns {PropertyDecorator}
 */
export function Get(
       uri?: string | undefined,
       options?: any,
): PropertyDecorator {
       return SetPropertyMetadata(ROUTE_API_TOKEN, {
              method: RouteApiTypes.GET,
              options: options,
              path: uri,
       });
}

/**
 * @see RouterOutlet RESTful POST method decorator
 *
 * @public
 * @param {String} uri
 * @param {Object} options
 * @returns {PropertyDecorator}
 */
export function Post(
       uri?: string | undefined,
       options?: any,
): PropertyDecorator {
       return SetPropertyMetadata(ROUTE_API_TOKEN, {
              method: RouteApiTypes.POST,
              options: options,
              path: uri,
       });
}

/**
 * @see RouterOutlet RESTful DELETE method decorator
 *
 * @public
 * @param {String} uri
 * @param {Object} options
 * @returns {PropertyDecorator}
 */
export function Delete(
       uri?: string | undefined,
       options?: any,
): PropertyDecorator {
       return SetPropertyMetadata(ROUTE_API_TOKEN, {
              method: RouteApiTypes.DELETE,
              options: options,
              path: uri,
       });
}

/**
 * @see RouterOutlet RESTful UPDATE method decorator
 *
 * @public
 * @param {String} uri
 * @param {Object} options
 * @returns {PropertyDecorator}
 */
export function Update(
       uri?: string | undefined,
       options?: any,
): PropertyDecorator {
       return SetPropertyMetadata(ROUTE_API_TOKEN, {
              method: RouteApiTypes.UPDATE,
              options: options,
              path: uri,
       });
}

/**
 * @see RouterOutlet RESTful TRACE method decorator
 *
 * @public
 * @param {String} uri
 * @param {Object} options
 * @returns {PropertyDecorator}
 */
export function Trace(
       uri?: string | undefined,
       options?: any,
): PropertyDecorator {
       return SetPropertyMetadata(ROUTE_API_TOKEN, {
              method: RouteApiTypes.TRACE,
              options: options,
              path: uri,
       });
}
