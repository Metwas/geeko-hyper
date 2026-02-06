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
       GLOBAL_CONFIGURATION_PROVIDER,
       GLOBAL_LOG_PROVIDER,
} from "../../global/injector/inject.tokens";

import { injectConfigurationService } from "../../global/injector/ConfigurationProvider";
import { injectLogProvider } from "../../global/injector/LogProvider";
import { Module } from "@nestjs/common";

/**_-_-_-_-_-_-_-_-_-_-_-_-_-           _-_-_-_-_-_-_-_-_-_-_-_-_-*/

/**
 * Global core module context
 *
 * @public
 */
@Module({
       exports: [GLOBAL_CONFIGURATION_PROVIDER, GLOBAL_LOG_PROVIDER],
       providers: [injectConfigurationService(), injectLogProvider()],
})
export class CoreModule {}
