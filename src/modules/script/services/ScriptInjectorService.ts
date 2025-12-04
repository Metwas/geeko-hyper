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

/**_-_-_-_-_-_-_-_-_-_-_-_-_- Imports  _-_-_-_-_-_-_-_-_-_-_-_-_-*/

import { IScriptSourceProvider } from "../interfaces/IScriptSourceProvider";

/**_-_-_-_-_-_-_-_-_-_-_-_-_-          _-_-_-_-_-_-_-_-_-_-_-_-_-*/

/**
 * @see Script source injector service
 * 
 * @public
 */
export class ScriptInjectorService
{
       /**
        * @public
        * @param {IScriptSourceProvider} sourceProvider 
        * @param {LogService} logger 
        */
       public constructor( public readonly sourceProvider: IScriptSourceProvider )
       {
              this.load();
       }

       /**
        * Loads the source from the provided @see IScriptSourceProvider
        * 
        * @public
        * @returns {Promise<void>}
        */
       public async load(): Promise<void>
       {
              if ( this.sourceProvider )
              {
                     await this.sourceProvider.load();
              }
       }

       /**
        * Returns the source from the configured @see IScriptSourceProvider
        * 
        * @public
        * @returns {Buffer}
        */
       public source(): Buffer | undefined
       {
              return this.sourceProvider.source();
       }

       /**
        * Returns the @see source replacer/needle
        * 
        * @public
        * @returns {Buffer}
        */
       public needle(): Buffer | Array<Buffer> | undefined
       {
              return this.sourceProvider.needle();
       }
}