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

/**
 * Script URL ID regex
 *
 * @public
 * @type {RegExp}
 */
export const SCRIPT_ID_REGEX: RegExp = /script\/\?id=\w+|script\//g;

/**
 * Iframe URL regex
 *
 * @public
 * @type {RegExp}
 */
export const IFRAME_URL_REGEX: RegExp = /\&iframe=\d+/g;

/**
 * Global default scripts uri
 *
 * @public
 * @type {String}
 */
export const GLOBAL_SCRIPTS_URI: string = "scripts";

/**
 * Global default Websocket uri
 *
 * @public
 * @type {String}
 */
export const GLOBAL_WEBSOCKET_URI: string = "/";

/**
 * Application root URI
 *
 * @public
 * @type {String}
 */
export const GLOBAL_ROOT_URI: string = "/";
