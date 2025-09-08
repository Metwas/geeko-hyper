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

import { SCRIPT_COLLECTOR_TOKEN, SCRIPT_STREAM_TOKEN } from "../../../global/injector/script.tokens";
import { GLOBAL_LOG_PROVIDER } from "../../../global/injector/inject.tokens";
import { ScriptStreamService } from "./ScriptStreamService";
import { ScriptCollection } from "./ScriptCollection";
import { Inject, Injectable } from "@nestjs/common";
import { LogService } from "@geeko/log";

/**_-_-_-_-_-_-_-_-_-_-_-_-_-          _-_-_-_-_-_-_-_-_-_-_-_-_-*/

/**
 * Global @see Script management service 
 * 
 * @public
 */
@Injectable()
export class ScriptService
{
       /**
        * @public
        * @param {ScriptStreamService} stream
        * @param {ScriptCollection} scripts
        * @param {LogService} logger 
        */
       public constructor( @Inject( SCRIPT_STREAM_TOKEN ) public readonly stream: ScriptStreamService, @Inject( SCRIPT_COLLECTOR_TOKEN ) public readonly scripts: ScriptCollection, @Inject( GLOBAL_LOG_PROVIDER ) private logger?: LogService ) { }
}