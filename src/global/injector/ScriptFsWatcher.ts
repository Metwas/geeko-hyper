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

/**_-_-_-_-_-_-_-_-_-_-_-_-_- @Imports  _-_-_-_-_-_-_-_-_-_-_-_-_-*/

import { SCRIPT_WATCH_SERVICE } from "./script.tokens";
import { GLOBAL_LOG_PROVIDER } from "./inject.tokens";
import { Provider } from "@nestjs/common";
import { LogService } from "@geeko/log";
import { FsDetector } from "@geeko/os";

/**_-_-_-_-_-_-_-_-_-_-_-_-_-           _-_-_-_-_-_-_-_-_-_-_-_-_-*/

/**
 * Injects an instance of script-scoped @see FsDetector
 * 
 * @public
 * @returns {Provider<FsDetector>}
 */
export const injectScriptWatcher = (): Provider<FsDetector> =>
{
       return {
              provide: SCRIPT_WATCH_SERVICE,
              useFactory: async ( logger: LogService ): Promise<FsDetector> =>
              {
                     return new FsDetector( {
                            logger: logger
                     } );
              },
              inject: [ GLOBAL_LOG_PROVIDER ]
       };
};