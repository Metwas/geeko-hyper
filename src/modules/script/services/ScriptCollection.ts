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

import { FILE_CHANGE_EVENT, FILE_CREATE_EVENT, FILE_DELETE_EVENT, FileFragment, FileInfo, FileValidator, FsDetector, directory, extension, filename } from "@geeko/os";
import { SCRIPT_ENTRY_NAME, SCRIPT_MANIFEST } from "../../../global/injector/script.tokens";
import { Script, ScriptShell } from "../../../types/Script";
import { getFilesInDirectory } from "@geeko/configuration";
import { getScriptShellType } from "../../../tools/script";
import { isAbsolute, resolve, sep } from "node:path";
import { existsSync, mkdirSync } from "node:fs";
import { Collection } from "@geeko/core";
import { LogService } from "@geeko/log";

/**_-_-_-_-_-_-_-_-_-_-_-_-_-          _-_-_-_-_-_-_-_-_-_-_-_-_-*/

/**
 * @see Script collection provider which includes @see FsDetector to observe changes of the scripts in a given path
 * 
 * @public
 */
export class ScriptCollection extends Collection<Script, string>
{
       /**
        * @public
        * @param {LogService} logger
        */
       public constructor( watcher?: FsDetector, private logger?: LogService )
       {
              super();

              if ( !logger )
              {
                     this.logger = new LogService( {
                            title: "Scripts",
                            level: "info"
                     } );
              }

              if ( watcher )
              {
                     this.watcher( watcher );
              }
       }

       /**
        * Gets or sets the specified @see FsDetector
        * 
        * @param {FsDetector} watcher 
        * @returns {FsDetector}
        */
       public watcher( watcher?: FsDetector ): FsDetector | undefined
       {
              if ( watcher )
              {
                     if ( this._detector )
                     {
                            /** Cleanup existing bound events */
                            this.removeEventHandlers();
                     }

                     this._detector = watcher;
                     this.addEventHandlers();
              }

              return this._detector;
       }

       /**
        * Script watcher service
        * 
        * @private
        * @type {FsDetector}
        */
       private _detector: FsDetector | undefined = void 0;

       /**
        * Script file type validation service
        * 
        * @private
        * @type {FileValidator}
        */
       private _validator: FileValidator | undefined = void 0;

       /**
        * ReadyState flag for when the @see FsDetector has initialized fully
        * 
        * @private
        * @type {Boolean}
        */
       private _ready: boolean = false;

       /**
       * Sets up a @see FsDetector watch for any script file changes within the specified directory
       * 
       * @public
       * @param {String} path 
       */
       public async watch( path: string ): Promise<void>
       {
              try
              {
                     if ( typeof path === "string" && this._detector )
                     {
                            /** ensure @see path is absolute */
                            if ( isAbsolute( path ) === false )
                            {
                                   path = resolve( __dirname, "./" + path );
                            }

                            path = directory( path, { skipIfDirectory: true } );

                            if ( existsSync( path ) === false )
                            {
                                   mkdirSync( path, { recursive: true } );
                            }

                            await this.loadFromPath( path );
                            this._detector?.watch( { path } );
                     }
              }
              catch ( error )
              {
                     this.onError( error );
              }
       }

       /**
        * Reads the data from the specified file at the @see path. Building the @see CommandSource add storing the tagged @see CommandHandler
        * 
        * @public
        * @param {String} path 
        * @returns {Promise<void>}
        */
       public async loadFromPath( path: string ): Promise<void>
       {
              if ( typeof path !== "string" || !path )
              {
                     return;
              }

              const files: Array<FileFragment> = await getFilesInDirectory( path, { recursive: 1, match: SCRIPT_MANIFEST } );
              const length: number = files.length;
              let index: number = 0;

              for ( ; index < length; ++index )
              {
                     try
                     {
                            const fragment: FileFragment = files[ index ];
                            const fileDirectory: string = fragment[ "directory" ];
                            const buffer: Buffer = fragment[ "data" ];

                            const data: any = JSON.parse( buffer.toString() );
                            /** Attempt to get main */
                            const main: string = data?.[ SCRIPT_ENTRY_NAME ];

                            if ( typeof main === "string" && main !== "" )
                            {
                                   let rootPath: string = "";

                                   /** Attempt to get @see Script name from the directory */
                                   const directories: Array<string> = fileDirectory.split( sep );
                                   let name: string = "";

                                   let cindex: number = directories.length - 1;
                                   /** Iterate until the first valid @see directory is returned */
                                   while ( cindex >= 0 && !name )
                                   {
                                          --cindex;
                                          name = directories[ cindex ];
                                   }

                                   if ( isAbsolute( main ) === false )
                                   {
                                          rootPath = resolve( fileDirectory, main );
                                   }

                                   /** Determine the @see ScriptShell from the extension type */
                                   const shell: ScriptShell = getScriptShellType( rootPath );

                                   const script: Script = {
                                          file: filename( main ),
                                          root: fileDirectory,
                                          shell: shell,
                                          id: name,
                                   };

                                   if ( this.has( script[ "id" ] ) === false )
                                   {
                                          this.add( script[ "id" ], script );
                                   }
                            }
                     }
                     catch ( error ) { }
              }

              if ( this._ready === false )
              {
                     this._ready = true;
                     this.emit( "ready" );
              }
       }

       /**
        * Returns true if the loader has fully checked and loaded pre-defined scripts
        * 
        * @public
        * @returns {Boolean}
        */
       public ready(): boolean
       {
              return this._ready;
       }

       /**
        * File on change detect handler
        * 
        * @protected
        * @param {Object} file 
        */
       protected onChange( file: any ): void
       {
              this.onDelete( file );
              this.onCreate( file );
       }

       /**
        * File creation handler
        * 
        * @protected
        * @param {Object} file 
        */
       protected onCreate( file: any ): void
       {
              try
              {
                     if ( typeof file?.[ "path" ] === "string" )
                     {
                            const relativePath: string = file[ "relativePath" ];
                            const name: string = file[ "name" ];
                            const type: string = file[ "type" ];

                            /** if @see directory and not relative, attempt to load manifest */
                            if ( type === "directory" && !relativePath )
                            {
                                   this.loadFromPath( file[ "path" ] );
                                   return;
                            }

                            /** Otherwise, trigger the @see Script about the changes */
                            const relativeName: string = relativePath.split( sep )[ 0 ];

                            if ( name !== relativeName )
                            {
                                   const script: Script = this.get( relativeName );

                                   /** Attempt to find required script files on change if @see Script does not exist */
                                   if ( !script )
                                   {
                                          const relativePaths: string = relativePath.split( sep ).slice( 1 ).join( sep );
                                          const rootPath: string = file[ "path" ].replace( `${sep}${name}`, "" ).replace( relativePaths, "" );

                                          this.loadFromPath( rootPath );
                                          return;
                                   }

                                   this.emit( "reload", script );
                            }
                     }
              }
              catch ( error )
              {
                     this.onError( error );
              }
       }

       /**
        * File removal handler
        * 
        * @protected
        * @param {Object} file 
        */
       protected async onDelete( file: any ): Promise<void>
       {
              try
              {
                     if ( typeof file?.[ "path" ] === "string" )
                     {
                            const relativePath: string = file[ "relativePath" ];
                            const name: string = file[ "name" ];
                            const type: string = file[ "type" ];

                            /** if @see directory and not relative, attempt to load manifest */
                            if ( type === "directory" && ( !relativePath || relativePath === name ) )
                            {
                                   const script: Script = this.get( name );

                                   if ( script )
                                   {
                                          this.emit( "stop", script );
                                          this.delete( name );
                                   }

                                   return;
                            }

                            const relativeName: string = relativePath.split( sep )[ 0 ];
                            const script: Script = this.get( relativeName );

                            if ( script )
                            {
                                   /** Trigger an update on the @see Script */
                                   this.emit( "reload", script );
                            }
                     }
              }
              catch ( error )
              {
                     this.onError( error );
              }
       }

       /**
        * Message handler/logger
        * 
        * @protected
        * @param {String} message 
        */
       protected onMessage( message: string ): void
       {
              if ( this.logger )
              {
                     this.logger.verbose( message );
              }
       }

       /**
        * Error handler
        * 
        * @protected
        * @param {Error | String} error 
        */
       protected onError( error: Error | string ): void
       {
              if ( this.logger )
              {
                     this.logger.error( error );
              }
       }

       /**
        * Used to validate loaded files ensuring that the extension types match to the configuration
        * 
        * @protected
        * @param {Object} pathOrFile 
        * @returns {Boolean}
        */
       protected validate( pathOrFile: string | FileInfo ): boolean
       {
              if ( !pathOrFile )
              {
                     return false;
              }

              let ext: string | undefined = void 0;
              let name: string | undefined = void 0;

              if ( typeof pathOrFile === "string" )
              {
                     ext = extension( pathOrFile );
                     name = filename( pathOrFile );
              }

              return this._validator?.isValid( {
                     extension: ext || pathOrFile?.[ "extension" ],
                     name: name || pathOrFile?.[ "name" ],
              } ) ?? false;
       }

       /**
        * Binds all @see FsDetector file events to this @see CommandLoader instance
        * 
        * @protected
        */
       protected addEventHandlers(): void
       {
              this._detector?.on( FILE_CHANGE_EVENT, this.onChange.bind( this ) );
              this._detector?.on( FILE_CREATE_EVENT, this.onCreate.bind( this ) );
              this._detector?.on( FILE_DELETE_EVENT, this.onDelete.bind( this ) );
       }

       /**
        * Removes all @see FsDetector bound events
        * 
        * @protected
        */
       protected removeEventHandlers(): void
       {
              this._detector?.off( FILE_CHANGE_EVENT, this.onChange.bind( this ) );
              this._detector?.off( FILE_CREATE_EVENT, this.onCreate.bind( this ) );
              this._detector?.off( FILE_DELETE_EVENT, this.onDelete.bind( this ) );
       }
}