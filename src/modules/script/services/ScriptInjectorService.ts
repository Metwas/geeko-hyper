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

import { IScriptSourceProvider } from "../interfaces/IScriptSourceProvider";

/**_-_-_-_-_-_-_-_-_-_-_-_-_-          _-_-_-_-_-_-_-_-_-_-_-_-_-*/

/**
 * @see Script source injector service
 *
 * @public
 */
export class ScriptInjectorService {
       /**
        * @public
        * @param {IScriptSourceProvider} sourceProvider
        * @param {LogService} logger
        */
       public constructor(
              public readonly sourceProvider: IScriptSourceProvider,
       ) {
              this.load();
       }

       /**
        * Loads the source from the provided @see IScriptSourceProvider
        *
        * @public
        * @returns {Promise<void>}
        */
       public async load(): Promise<void> {
              if (this.sourceProvider) {
                     await this.sourceProvider.load();
              }
       }

       /**
        * Returns the source from the configured @see IScriptSourceProvider
        *
        * @public
        * @returns {Buffer}
        */
       public source(): Buffer | undefined {
              return this.sourceProvider.source();
       }

       /**
        * Returns the @see source replacer/needle
        *
        * @public
        * @returns {Buffer}
        */
       public needle(): Buffer | Array<Buffer> | undefined {
              return this.sourceProvider.needle();
       }
}
