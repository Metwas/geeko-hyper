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

import {
       SCRIPT_COLLECTOR_TOKEN,
       SCRIPT_STREAM_TOKEN,
} from "../../../global/injector/script.tokens";

import { GLOBAL_LOG_PROVIDER } from "../../../global/injector/inject.tokens";
import { ScriptStreamService } from "./ScriptStreamService";
import { ScriptCollection } from "./ScriptCollection";
import { Inject, Injectable } from "@nestjs/common";
import { Script } from "../../../types/Script";
import { LogService } from "@geeko/log";

/**_-_-_-_-_-_-_-_-_-_-_-_-_-          _-_-_-_-_-_-_-_-_-_-_-_-_-*/

/**
 * Global @see Script management service
 *
 * @public
 */
@Injectable()
export class ScriptService {
       /**
        * @public
        * @param {ScriptStreamService} stream
        * @param {ScriptCollection} scripts
        * @param {LogService} logger
        */
       public constructor(
              @Inject(SCRIPT_STREAM_TOKEN)
              public readonly stream: ScriptStreamService,
              @Inject(SCRIPT_COLLECTOR_TOKEN)
              public readonly scripts: ScriptCollection,
              @Inject(GLOBAL_LOG_PROVIDER) private logger?: LogService,
       ) {}

       /**
        * Gets the specific @see Script by id
        *
        * @public
        * @param {String} id
        * @returns {Script}
        */
       public get(id: string): Script | undefined {
              return this.scripts.get(id);
       }
}
