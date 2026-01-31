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

import { injectScriptSourceProvider } from "../../global/injector/DefaultScriptSourceProvider";
import { injectScriptInjectorService } from "../../global/injector/ScriptInjector";
import { injectScriptStreamer } from "../../global/injector/ScriptStreamService";
import { injectScriptCollection } from "../../global/injector/ScriptCollection";
import { injectScriptWatcher } from "../../global/injector/ScriptFsWatcher";
import { ScriptService } from "./services/ScriptService";
import { CoreModule } from "../core/core.module";
import { Module } from "@nestjs/common";

/**_-_-_-_-_-_-_-_-_-_-_-_-_-           _-_-_-_-_-_-_-_-_-_-_-_-_-*/

/**
 * Global @see Script module context
 *
 * @public
 */
@Module({
       imports: [CoreModule],
       exports: [ScriptService],
       providers: [
              injectScriptInjectorService(),
              injectScriptSourceProvider(),
              injectScriptCollection(),
              injectScriptStreamer(),
              injectScriptWatcher(),
              ScriptService,
       ],
})
export class ScriptModule {}
