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
 * @see RegExp for matching non alphabet & decimal charactors
 *
 * @public
 * @type {String}
 */
export const NON_CHAR_REG: RegExp = /[^a-z-A-Z\d]/g;

/**
 * Attempts to extract the specified @see String key from the provided @see String url
 *
 * @public
 * @param {String} url
 * @param {String} key
 * @returns {String}
 */
export const extractKeyFromUrl = (
       url: string,
       key: string,
): string | undefined => {
       if (typeof url !== "string" || !url || typeof key !== "string" || !key) {
              return void 0;
       }

       let index: number = url.indexOf(key);

       if (index === -1) {
              return void 0;
       }

       index += key.length + 1;
       const length: number = url.length;
       let value: string = "";

       for (; index < length; ++index) {
              const char: string = url[index];
              const matches: RegExpMatchArray | null = char.match(NON_CHAR_REG);

              if (matches && matches.length > 0) {
                     break;
              }

              value += char;
       }

       return value;
};
