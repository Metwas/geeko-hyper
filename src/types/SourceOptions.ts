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
 * @see ScriptInjectorService source options
 *
 * @public
 */
export type SourceOptions = {
       /**
        * Wraps the source @see Buffer in the specified string tag.
        *
        * @public
        * @type {Boolean | String}
        */
       wrap?: boolean;

       /**
        * Optional source version filter
        *
        * @public
        * @type {String}
        */
       version?: string;

       /**
        * Source fetch method, such as 'github' releases
        *
        * @public
        * @type {String}
        */
       method?: string;

       /**
        * Authentication token for a secure remote server
        *
        * @public
        * @type {String}
        */
       token?: string;

       /**
        * The source local or remote url
        *
        * @public
        * @type {String}
        */
       url: string;
};
