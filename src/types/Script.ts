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

import { InjectOptions } from "./InjectOptions";
import { HttpStatus } from "@nestjs/common";

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
 * @public
 */
export type ScriptStatusCode = HttpStatus;

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
        * Script status code similar to the HttpStatus
        *
        * @public
        * @type {ScriptStatusCode}
        */
       code?: ScriptStatusCode;

       /**
        * Flag to allow for automatic code injection from the core API @see HttpScriptService
        *
        * @public
        * @type {Boolean}
        */
       inject?: boolean | InjectOptions;
};
