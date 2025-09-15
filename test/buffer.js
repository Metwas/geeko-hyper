/**
     MIT License

     @Copyright (c) Metwas

     Permission is hereby granted, free of charge, to any person obtaining a copy
     of this software and associated documentation files (the "Software"), to deal
     in the Software without restriction, including without limitation the rights
     to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     copies of the Software, and to permit persons to whom the Software is
     furnished to do so, subject to the following conditions:

     The above Copyright notice and this permission notice shall be included in all
     copies or substantial portions of the Software.

     THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     AUTHORS OR Copyright HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
     SOFTWARE.
*/

/**_-_-_-_-_-_-_-_-_-_-_-_-_- @Imports _-_-_-_-_-_-_-_-_-_-_-_-_-*/

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
       transform (chunk, encoding, cb)
       {
              /** Prepend @see carry from possible previous split @see Buffer chunk */
              const data = Buffer.concat([ carry, chunk ]);

              /** Loop to find all @see needle references within the buffer */
              while (true)
              {
                     const indexOf = data.indexOf(needle, searchIndex);

                     if (indexOf === -1)
                     {
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
       flush (cb)
       {
              if (carry.length)
              {
                     this.push(carry);
              }

              cb();
       }
});

fsStream.pipe(transform).on("data", (data) => { process.stdout.write(data.toString()); });