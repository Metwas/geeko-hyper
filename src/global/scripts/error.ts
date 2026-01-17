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

import { Script, ScriptShell } from "../../types/Script";
import { HttpStatus } from "@nestjs/common";
import { resolve } from "node:path";

/**_-_-_-_-_-_-_-_-_-_-_-_-_-          _-_-_-_-_-_-_-_-_-_-_-_-_-*/

/**
 * Generic 'error' script
 *
 * @public
 * @type {Script}
 */
export const DEFAULT_ERROR_SCRIPT: Script = {
       root: resolve(__dirname, "../assets/scripts/core/error/"),
       code: HttpStatus.INTERNAL_SERVER_ERROR,
       status: "Something went wrong",
       shell: ScriptShell.WEB,
       file: "index.html",
       inject: false,
       id: "error",
};
