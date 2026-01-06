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

import { CustomTransportStrategy, Server } from "@nestjs/microservices";
import { Server as HyperExpressServer, Router } from "hyper-express";
import { ConnectionOptions } from "../../types/ConnectionOptions";
import { ConfigurationService } from "@geeko/configuration";
import { RouterOutlet } from "../routers/Router";
import { LogService } from "@geeko/log";

/**_-_-_-_-_-_-_-_-_-_-_-_-_-           _-_-_-_-_-_-_-_-_-_-_-_-_-*/

/**
 * @see HyperExpressServer microservice strategy
 *
 * @public
 */
export class HyperExpressStrategy
       extends Server
       implements CustomTransportStrategy
{
       /**
        * @public
        * @param {ConfigurationService} configuration
        * @param {LogService} log
        * @param {ServerConstructorOptions} options
        */
       public constructor(
              public readonly configuration: ConfigurationService,
              public readonly routerOutlets: Array<RouterOutlet>,
              public readonly log: LogService,
              options?: any,
       ) {
              super();
              /** Create new @see HyperExpressServer server instance */
              this._server = new HyperExpressServer(options);
       }

       /**
        * @see HyperExpressServer reference
        *
        * @private
        */
       private _server: HyperExpressServer | undefined = void 0;

       /**
        * Initializes the @see HyperExpressServer socket listener
        *
        * @public
        * @param {Function} callback
        */
       public async listen(callback?: () => void): Promise<void> {
              try {
                     const options: ConnectionOptions =
                            await this.configuration.get("hyper");

                     const host: string = options?.host ?? "127.0.0.1";
                     const port: number =
                            Number(
                                   options?.port ??
                                          (await this.configuration.get(
                                                 "GEEKO_HTTP_PORT",
                                                 {
                                                        env: true,
                                                 },
                                          )),
                            ) || 3333;

                     this.log.verbose(
                            `Initializing HTTP server on [port] ${port} [host] ${host}`,
                     );

                     /** Inject @see Router modules */
                     const outlets: Array<RouterOutlet> = this.routerOutlets;
                     const length: number = outlets?.length ?? 0;
                     let index: number = 0;

                     for (; index < length; ++index) {
                            const outlet: RouterOutlet =
                                   this.routerOutlets[index];

                            if (outlet) {
                                   const router: Router | undefined =
                                          outlet.router();

                                   if (router) {
                                          let name: string =
                                                 outlet
                                                        .name()
                                                        ?.replace(/^\//g, "") ??
                                                 "";

                                          this.log.debug(
                                                 `Attaching router outlet [${name ?? "::" + index}]`,
                                          );

                                          this._server?.use(`/${name}`, router);
                                   }
                            }
                     }

                     /** Finally listen on the configured port & host */
                     await this._server?.listen(port, host, () => {
                            this.log.info(
                                   `HTTP server now listening on [port] ${port} [host] ${host}`,
                            );
                     });

                     if (typeof callback === "function") {
                            callback();
                     }
              } catch (error) {
                     this.log.error(error as Error);
              }
       }

       /**
        * Triggered on application shutdown.
        *
        * @public
        */
       public close() {
              this.log.verbose(
                     `Closing HTTP server [port] ${this._server?.port}`,
              );
              this._server?.close();
       }

       /**
        * Attach external server event listeners
        *
        * @public
        * @param {String} event
        * @param {Function} callback
        */
       public on(event: string, callback: Function) {}

       /**
        * Returns the underlying @see HyperExpressServer reference
        *
        * @public
        * @returns {HyperExpressServer}
        */
       public unwrap<T = HyperExpressServer>(): T {
              return this._server as any;
       }
}
