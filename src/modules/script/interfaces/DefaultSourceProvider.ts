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

import { IScriptSourceProvider } from "./IScriptSourceProvider";
import { ConfigurationService } from "@geeko/configuration";
import { isAbsolute, resolve } from "node:path";
import { JsonLike } from "@geeko/serialization";
import { LogService } from "@geeko/log";
import { gunzip } from "node:zlib";

/**_-_-_-_-_-_-_-_-_-_-_-_-_-          _-_-_-_-_-_-_-_-_-_-_-_-_-*/

export type SourceOptions = {
       wrap?: boolean | string;
       version?: string;
       method?: string;
       token?: string;
       path: string;
};

export const HTTP_REGEX_PATH: RegExp = /^https?:\/\//i;

/**
 * Source authentication token
 * 
 * @public
 * @type {String}
 */
export const SOURCE_AUTH_TOKEN: string = "SOURCE_AUTH_TOKEN";

/**
 * Github release asset tag
 * 
 * @public
 * @type {RegExp}
 */
export const GIT_RELEASE_TAG: RegExp = /^release/g;

/**
 * Script wrapper replacement tag
 * 
 * @public
 * @type {String}
 */
export const SCRIPT_REPLACE_TAG: string = "${{}}$";

/**
 * Default HTML script wrapper, <script>
 * 
 * @public
 * @type {String}
 */
export const SCRIPT_TAG_WRAPPER: string = `<script type="text/javascript" defer>${SCRIPT_REPLACE_TAG}</script>`;


/**
 * Default file & Http Injectable source provider
 * 
 * @public
 */
export class DefaultSourceProvider implements IScriptSourceProvider
{
       /**
        * 
        * @public
        * @param {ConfigurationService} configuration
        * @param {LogService} logger 
        */
       public constructor( private readonly configuration: ConfigurationService, private readonly logger?: LogService ) { }

       /**
        * Source buffer
        * 
        * @private
        * @type {Buffer}
        */
       private _buffer: Buffer | undefined = void 0;

       /**
        * Loads the injectable source from the configured destination
        * 
        * @public
        * @returns {Promise<void>}  
        */
       public async load(): Promise<void>
       {
              try
              {
                     const options: SourceOptions = await this.configuration?.get( "injector" );
                     let path: string = options?.path;

                     if ( path )
                     {
                            const token: string = options?.token ?? await this.configuration.get( SOURCE_AUTH_TOKEN, { env: true } ) ?? "";
                            /** Validate if local or remote path */
                            if ( HTTP_REGEX_PATH.test( path ) )
                            {
                                   const response: Response = await fetch( path, {
                                          method: 'GET',
                                          headers: token ? {
                                                 'Authorization': `Token ${token}`,
                                          } : void 0
                                   } );

                                   if ( response.ok === false )
                                   {
                                          this.logger?.error( `Source fetch error: [${response.statusText}]` );
                                   }
                                   else
                                   {
                                          if ( options?.method === "github" )
                                          {
                                                 this.logger?.verbose( `Fetching github source` );
                                                 /** Github path will return a @see json object containing the releases */
                                                 const releases: JsonLike = await response.json();
                                                 const assets: Array<any> = releases?.data?.assets;

                                                 const length: number = assets?.length ?? 0;
                                                 let index: number = 0;

                                                 if ( length === 0 )
                                                 {
                                                        this.logger?.error( `Github path [${path}] returned no asset releases` );
                                                        return void 0;
                                                 }

                                                 let releasePath: string | undefined = void 0;

                                                 for ( ; index < length; ++index )
                                                 {
                                                        const asset: any = assets[ index ];

                                                        if ( asset?.url && asset?.name )
                                                        {
                                                               const match: Array<string> = asset.name.match( GIT_RELEASE_TAG );

                                                               if ( match?.length > 0 )
                                                               {
                                                                      releasePath = asset.url;
                                                                      break;
                                                               }
                                                        }
                                                 }

                                                 if ( releasePath )
                                                 {
                                                        const response: Response = await fetch( path, {
                                                               method: 'GET',
                                                               headers: token ? {
                                                                      'Authorization': `Token ${token}`,
                                                                      Accept: "application/octet-stream",
                                                                      'accept-encoding': 'gzip,deflate'
                                                               } : void 0
                                                        } );

                                                        const buffer: Buffer = Buffer.from( await response.arrayBuffer() );
                                                        /** This would be compress, there use @see gunzip to deflate */
                                                        this._buffer = this.normalize( await decompress( buffer ), options?.wrap );
                                                 }
                                          }
                                          else
                                          {
                                                 this.logger?.verbose( `Fetching HTTP source` );
                                                 this._buffer = this.normalize( Buffer.from( await response.arrayBuffer() ), options?.wrap );
                                          }
                                   }
                            }
                            else
                            {
                                   /** Assume local & ensure absolute */
                                   if ( isAbsolute( path ) === false )
                                   {
                                          path = resolve( process.cwd(), path );
                                   }
                            }


                            if ( ( this._buffer?.length ?? 0 ) > 0 )
                            {
                                   this.logger?.verbose( `Got source buffer [${this._buffer?.length} bytes]` );
                            }
                            else
                            {
                                   this.logger?.warn( `Buffer returned empty` );
                            }
                     }

                     return void 0;
              }
              catch ( error )
              {
                     this.logger?.error( error.message );
              }
       }

       /**
        * Returns the injectable source as a @see Buffer
        * 
        * @public
        * @returns {Buffer}  
        */
       public source(): Buffer | undefined
       {
              return this._buffer;
       }

       /**
        * Normalizes the @see Buffer input by containing the source in a wrap pattern which defaults to <script> if set to true
        * 
        * @protected
        * @param {Buffer} buffer
        * @param {Boolean | String} wrap
        * @returns {Buffer}
        */
       protected normalize( buffer: Buffer, wrap?: boolean | string ): Buffer
       {
              if ( wrap === true )
              {
                     /** Get default @see script tag wrapper */
                     wrap = SCRIPT_TAG_WRAPPER;
              }

              if ( typeof wrap === "string" )
              {
                     const wrappers: Array<string> = wrap.split( SCRIPT_REPLACE_TAG );
                     const top: Buffer = Buffer.from( wrappers[ 0 ] );
                     const bottom: Buffer = Buffer.from( wrappers[ 1 ] );

                     return Buffer.concat( [ top, buffer, bottom ] );
              }

              /** Simply return the raw @see Buffer if we got this far */
              return buffer;
       }
}

/**
 * Gzip decompression helper function
 * 
 * @public
 * @param {Buffer} buffer 
 * @returns {Promise<Buffer>}
 */
const decompress = ( buffer: Buffer ): Promise<Buffer> =>
{
       return new Promise( ( resolve, reject ) =>
       {
              gunzip( buffer, ( error: Error, decompressed: Buffer ) =>
              {
                     error ? reject( error ) : resolve( decompressed );
              } );
       } );
};