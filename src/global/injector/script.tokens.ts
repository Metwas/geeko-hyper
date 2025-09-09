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
