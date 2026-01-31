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

import { ReadStream, createReadStream, readFileSync } from "node:fs";
import { extension } from "@geeko/configuration";
import { Response } from "hyper-express";
import { Transform } from "node:stream";
import { gunzip } from "node:zlib";

/**_-_-_-_-_-_-_-_-_-_-_-_-_-          _-_-_-_-_-_-_-_-_-_-_-_-_-*/

/**
 * List of supported injectable file extensions
 *
 * @type {Array<String>}
 */
const SUPPORTED_EXTENSIONS: Array<string> = [".html", ".htm", ".xhtml", ".jsx"];

/**
 * List of possible injectable tag positions within a supported file, @see SUPPORTED_EXTENSIONS
 *
 * @type {Array<String>}
 */
export const INJECTABLE_NEEDLE_STRING: Array<RegExp> = [
       new RegExp("</head>", "i"),
       new RegExp("</body>", "i"),
];

/**
 * List of possible injectable tag positions within a supported file, @see SUPPORTED_EXTENSIONS
 *
 * @type {Array<Buffer>}
 */
export const INJECTABLE_NEEDLE_BUFFER: Array<Buffer> = [
       Buffer.from("</head>"),
       Buffer.from("</body>"),
];

/**
 * Gets the injectable token from the file @see String path
 *
 * @public
 * @param {String} path
 * @returns {String}
 */
export const getInjectorTokenString = (path: string): string | undefined => {
       if (SUPPORTED_EXTENSIONS.indexOf(extension(path)) > -1) {
              const data: string = readFileSync(path, "utf-8");
              const length: number = INJECTABLE_NEEDLE_STRING.length;
              let index: number = 0;

              for (; index < length; ++index) {
                     const match: Array<string> | null =
                            INJECTABLE_NEEDLE_STRING[index].exec(data);

                     if (match && match?.length > 0) {
                            return match[0];
                     }
              }
       }

       return void 0;
};

/**
 * Gets the injectable token index from the file @see Buffer
 *
 * @public
 * @param {Buffer} buffer
 * @returns {String}
 */
export const getInjectorTokenBuffer = (
       buffer: Buffer,
       needle: Array<Buffer> | Buffer,
): number => {
       const needles: Array<Buffer> = Array.isArray(needle)
              ? needle
              : needle
                ? [needle]
                : INJECTABLE_NEEDLE_BUFFER;

       const length: number = needles.length;
       let index: number = 0;

       for (; index < length; ++index) {
              const token: Buffer = needles[index];
              const indexOf: number = buffer.indexOf(token);

              if (indexOf > -1) {
                     return indexOf;
              }
       }

       return -1;
};

/**
 * Creates a @see Buffer only replace transform @see Stream
 *
 * @public
 * @param {Buffer} needle
 * @param {Buffer} replacer
 * @returns {Transform}
 */
export const replaceStream = (needle: Buffer, replacer: Buffer): Transform => {
       let needleLength: number = needle.length;
       let carry: Buffer = Buffer.alloc(0);
       let cursor: number = 0;

       return new Transform({
              transform(
                     chunk: Buffer,
                     encoding: BufferEncoding,
                     callback: Function,
              ) {
                     /** Prepend @see carry from possible previous split @see Buffer chunk */
                     const data: Buffer = Buffer.concat([carry, chunk]);

                     /** Loop to find all @see needle references within the buffer */
                     while (true) {
                            const indexOf: number = data.indexOf(
                                   needle,
                                   cursor,
                            );

                            if (indexOf === -1) {
                                   break;
                            }

                            this.push(data.subarray(cursor, indexOf));
                            this.push(replacer);

                            cursor = indexOf + needleLength;
                     }

                     const overlap: number = needleLength - 1;
                     carry = data.subarray(data.length - overlap);

                     this.push(data.subarray(cursor, data.length - overlap));
                     callback();
              },
              flush(callback: Function) {
                     if (carry.length) {
                            this.push(carry);
                     }

                     callback();
              },
       });
};

/**
 * Intercepts the stream pipe and injects the @see Buffer source from the given @see injectable options
 *
 * @public
 * @param {send.SendStream} stream
 * @param {Buffer} token
 * @param {String} source
 * @param {ServerResponse} response
 */
export const injectStream = async (
       path: string,
       needle: Buffer,
       replacer: Buffer,
       response: Response,
): Promise<void> => {
       const length: number =
              Buffer.byteLength(replacer) +
              Number(response.getHeader("Content-Length"));
       /** Update response header with the additional @see source code */
       response.header("Content-Length", length as any);

       const fsStream: ReadStream = createReadStream(path);
       const transform: Transform = replaceStream(needle, replacer);

       fsStream.pipe(transform);

       return response.stream(transform);
};

/**
 * Gzip decompression helper function
 *
 * @public
 * @param {Buffer} buffer
 * @returns {Promise<Buffer>}
 */
export const decompress = (buffer: Buffer): Promise<Buffer> => {
       return new Promise((resolve, reject) => {
              gunzip(buffer, (error: Error | null, decompressed: Buffer) => {
                     error ? reject(error) : resolve(decompressed);
              });
       });
};
