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

import { InjectOptions } from "./InjectOptions";

/**_-_-_-_-_-_-_-_-_-_-_-_-_-          _-_-_-_-_-_-_-_-_-_-_-_-_-*/

/**
 * Possible @see Script shell or bootstrap types
 *
 * @public
 */
export enum ScriptShell {
       WEB,
       NODE,
}

/**
 * @see Script operating states
 *
 * @public
 */
export enum ScriptState {
       DOWN,
       UP,
       ALARM,
       ERROR,
}

/**
 * Core script interface options
 *
 * @public
 */
export type Script = {
       /**
        * Unique identifier of the script
        *
        * @public
        * @type {String}
        */
       id: string;

       /**
        * Script shell type
        *
        * @public
        * @type {ScriptShell}
        */
       shell: ScriptShell;

       /**
        * Unix timestamp of the time-to-live on this script therefore forcing any loaders to fetch from source if expired
        *
        * @public
        * @type {Number}
        */
       ttl?: number;

       /**
        * Path to the browsable script file, e.g: .html, .svg, .jsx, etc.
        *
        * @public
        * @type {String}
        */
       file: string;

       /**
        * Absolute path to the @see Script.file
        *
        * @public
        * @type {String}
        */
       path?: string;

       /**
        * Root directory which contains the @see this.path & assets
        *
        * @public
        * @type {String}
        */
       root: string;

       /**
        * Script operating state enumeration
        *
        * @public
        * @type {ScriptState}
        */
       state?: ScriptState;

       /**
        * Script custom status message
        *
        * @public
        * @type {String}
        */
       status?: string;

       /**
        * Flag to allow for automatic code injection from the core API @see HttpScriptService
        *
        * @public
        * @type {Boolean}
        */
       inject?: boolean | InjectOptions;
};
