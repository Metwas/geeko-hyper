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

import { injectHyperOptions } from "../../global/injector/HyperExpressOptions";
import { injectRouterOutlets } from "../../global/injector/RouterOutlets";
import { ScriptModule } from "../script/script.module";
import { CoreModule } from "./core.module";
import { Module } from "@nestjs/common";

/**_-_-_-_-_-_-_-_-_-_-_-_-_-           _-_-_-_-_-_-_-_-_-_-_-_-_-*/

/**
 * Global Application module context
 *
 * @public
 */
@Module({
       imports: [CoreModule, ScriptModule],
       providers: [injectRouterOutlets(), injectHyperOptions()],
})
export class AppModule {}
