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

const { createReadStream } = require("node:fs");
const { Transform } = require("node:stream");
const { resolve } = require("node:path");

/**_-_-_-_-_-_-_-_-_-_-_-_-_-          _-_-_-_-_-_-_-_-_-_-_-_-_-*/

const fsStream = createReadStream(resolve(process.cwd(), "./package.json"));
const needle = Buffer.from("scripts");
const replacer = Buffer.from("replaced");

let searchIndex = 0;
let needleLength = needle.length;
let carry = Buffer.alloc(0);

const transform = new Transform({
       transform(chunk, encoding, cb) {
              /** Prepend @see carry from possible previous split @see Buffer chunk */
              const data = Buffer.concat([carry, chunk]);

              /** Loop to find all @see needle references within the buffer */
              while (true) {
                     const indexOf = data.indexOf(needle, searchIndex);

                     if (indexOf === -1) {
                            break;
                     }

                     this.push(data.subarray(searchIndex, indexOf));
                     this.push(replacer);

                     searchIndex = indexOf + needleLength;
              }

              const overlap = needleLength - 1;
              carry = data.subarray(data.length - overlap);

              this.push(data.subarray(searchIndex, data.length - overlap));
              cb();
       },
       flush(cb) {
              if (carry.length) {
                     this.push(carry);
              }

              cb();
       },
});

fsStream.pipe(transform).on("data", (data) => {
       process.stdout.write(data.toString());
});
