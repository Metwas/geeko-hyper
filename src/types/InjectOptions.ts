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
 * @see Script injector options
 *
 * @public
 */
export type InjectOptions = {
       /**
        * Replacer token as either @see Buffer or @see String
        *
        * @public
        * @type {Buffer | String}
        */
       replacer?: Buffer | string;

       /**
        * Replace matcher/needle token as either @see Buffer or @see String
        *
        * @public
        * @type {Buffer | String}
        */
       needle?: Buffer | string;
};
