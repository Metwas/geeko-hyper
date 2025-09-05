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

import { GLOBAL_CONFIGURATION_PROVIDER, GLOBAL_LOG_PROVIDER, GLOBAL_ROUTE_OUTLETS, HYPER_CTOR_OPTIONS } from './global/injector/inject.tokens';
import { HyperExpressStrategy } from './components/strategy/HyperHTTPStrategy';
import { ConfigurationService } from '@geeko/configuration';
import { RouterOutlet } from './components/routers/Router';
import { INestApplicationContext } from '@nestjs/common';
import { AppModule } from './modules/core/app.module';
import { NestFactory } from '@nestjs/core';
import { LogService } from '@geeko/log';

/**_-_-_-_-_-_-_-_-_-_-_-_-_-           _-_-_-_-_-_-_-_-_-_-_-_-_-*/

/**
 * Application bootstrap
 * 
 * @public
 * @param {Array<string>} args
 * @returns {Promise<void>}
 */
( async ( args: Array<string> ): Promise<void> => 
{
       const context: INestApplicationContext = await NestFactory.createApplicationContext( AppModule, {
              logger: false
       } );

       const configuration: ConfigurationService = context.get( GLOBAL_CONFIGURATION_PROVIDER );
       const routerOutlets: Array<RouterOutlet> = context.get( GLOBAL_ROUTE_OUTLETS );
       const logger: LogService = context.get( GLOBAL_LOG_PROVIDER );
       const hyper: any = context.get( HYPER_CTOR_OPTIONS );

       const http: HyperExpressStrategy = new HyperExpressStrategy( configuration, logger.branch( "hyper" ), routerOutlets, hyper );
       http.listen();

} )( process.argv.slice( 2 ) );
