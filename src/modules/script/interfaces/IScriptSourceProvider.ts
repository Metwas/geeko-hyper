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
 * Injectable @see Script source provider
 *
 * @public
 */
export interface IScriptSourceProvider {
       /**
        * Loads the injectable source from the configured destination
        *
        * @public
        * @returns {Promise<void>}
        */
       load(): Promise<void>;

       /**
        * Returns the injectable source as a @see Buffer
        *
        * @public
        * @returns {Buffer}
        */
       source(): Buffer | undefined;

       /**
        * Returns the @see source replacer/needle
        *
        * @public
        * @returns {Buffer}
        */
       needle(): Buffer | Array<Buffer> | undefined;
}
