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
 * @see Script main tag
 *
 * @public
 * @type {String}
 */
export const SCRIPT_ENTRY_NAME: string = "main";

/**
 * Script manifest file @see RegExp
 *
 * @public
 * @type {RegExp}
 */
export const SCRIPT_MANIFEST: RegExp = /manifest\.json/g;

/**
 * HTTP path @see RegExp
 *
 * @public
 * @type {RegExp}
 */
export const HTTP_REGEX_PATH: RegExp = /^https?:\/\//i;

/**
 * Source authentication token
 *
 * @public
 * @type {String}
 */
export const SOURCE_AUTH_TOKEN: string = "SOURCE_AUTH_TOKEN";

/**
 * @see ScriptStreamService injector token
 *
 * @public
 * @type {String}
 */
export const SCRIPT_STREAM_TOKEN: string = "SCRIPT_STREAM_TOKEN";

/**
 * @see ScriptCollection injector token
 *
 * @public
 * @type {String}
 */
export const SCRIPT_COLLECTOR_TOKEN: string = "SCRIPT_COLLECTOR_TOKEN";

/**
 * Script focused @see FsDetector injector token
 *
 * @public
 * @type {String}
 */
export const SCRIPT_WATCH_SERVICE: string = "SCRIPT_WATCH_SERVICE";

/**
 * Script @see IScriptSourceProvider injector token
 *
 * @public
 * @type {String}
 */
export const SCRIPT_SOURCE_PROVIDER: string = "SCRIPT_SOURCE_PROVIDER";

/**
 * @see ScriptInjectorService injector token
 *
 * @public
 * @type {String}
 */
export const SCRIPT_INJECTOR_TOKEN: string = "SCRIPT_INJECTOR_TOKEN";

/**
 * Github release asset tag
 *
 * @public
 * @type {RegExp}
 */
export const GIT_RELEASE_TAG: RegExp = /^release/g;

/**
 * Script wrapper replacement tag
 *
 * @public
 * @type {String}
 */
export const SCRIPT_REPLACE_TAG: string = "${{}}$";

/**
 * Default HTML script wrapper, <script>
 *
 * @public
 * @type {String}
 */
export const SCRIPT_TAG_WRAPPER: string = `<script type="text/javascript" defer>${SCRIPT_REPLACE_TAG}</script>`;

/**
 * Script configuration key
 *
 * @public
 * @type {String}
 */
export const SCRIPT_CONFIGURATION_KEY: string = "scripts";

/**
 * Script injector configuration key
 *
 * @public
 * @type {String}
 */
export const INJECTOR_CONFIGURATION_KEY: string = "scripts/injector";
