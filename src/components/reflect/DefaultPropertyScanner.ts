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

import { ProviderPropertyMetadata } from "../../types/PropertyScanOptions";
import { Reflector } from "@nestjs/core";
import { Type } from "@nestjs/common";

/**_-_-_-_-_-_-_-_-_-_-_-_-_-           _-_-_-_-_-_-_-_-_-_-_-_-_-*/

/**
 * Default @see Reflector based metadata scanner
 * 
 * @public
 */
export class DefaultPropertyMetadataScanner implements ProviderPropertyMetadata
{
       /**
        * Provide a property object reference
        * 
        * @public
        * @param {Object} property 
        */
       public constructor( public readonly property: Type<any>, public reflector: Reflector = new Reflector() ) { }

       /**
        * Reflects any metadata stored against the provided @see String key
        * 
        * @public
        * @param {String} key 
        * @returns {Object}
        */
       public scan( key: string | symbol ): any
       {
              return this.reflector.get( key, this.property );
       }
};