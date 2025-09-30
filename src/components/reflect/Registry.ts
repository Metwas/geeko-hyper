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

import { ProviderPropertyMetadata } from "../../types/PropertyScanOptions";
import { ProviderWrapper } from "../../types/ProviderWrapper";
import { Injectable } from "@nestjs/common";

/**_-_-_-_-_-_-_-_-_-_-_-_-_-          _-_-_-_-_-_-_-_-_-_-_-_-_-*/

/**
 * DI registry module
 * 
 * @public
 */
@Injectable()
export class Registry
{
       /**
        * Expects an @see DiscoveryService instance to be provided
        * 
        * @public
        * @param {DiscoveryService} discoveryService 
        */
       public constructor() { }

       /**
        * Provider lookup table
        * 
        * @private
        * @type {Map<string | symbol, ProviderWrapper>}
        */
       private _providers: Map<string | symbol, ProviderWrapper> = new Map();

       /**
        * Initializes the @see DiscoveryService to fetch all provider modules within the application context
        * 
        * @public
        */
       public initialize(): void
       {

       }

       /**
        * Gets the provider(s) defined by the @see string key - else returns all registered providers
        * 
        * @public
        * @param {String | Symbol} key 
        * @returns 
        */
       public getProviders<T extends Array<ProviderWrapper>>( key?: string | symbol ): T
       {
              return ( ( key ? this._providers[ key ] : this._flatten() ) || [] ) as T;
       }

       /**
        * Adds the set @see ProviderWrapper options to the @see this._providers table
        * 
        * @private
        * @param {Object} options 
        */
       private _add( options: { name: string, instance: any, properties: Array<ProviderPropertyMetadata> } ): void
       {
              if ( typeof options?.[ "name" ] !== "string" || !options[ "instance" ] )
              {
                     return void 0;
              }

              this._providers.set( options[ "name" ], {
                     instance: options[ "instance" ],
                     properties: options[ "properties" ]
              } );
       }

       /**
        * Returns a flattened list of the assigned providers @see this._providers
        * 
        * @private
        * @returns {Array<ProviderWrapper>}
        */
       private _flatten(): Array<ProviderWrapper>
       {
              const values: Array<ProviderWrapper> = [];

              for ( let provider of this._providers.values() )
              {
                     values.push( provider );
              }

              return values;
       }
}