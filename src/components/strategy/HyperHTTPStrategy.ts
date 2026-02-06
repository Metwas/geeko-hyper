/**
 * Copyright (c) Metwas
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; version 2 of the License.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
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
        * @param {Array<RouterOutlet>} routerOutlets
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
                                          let root: string =
                                                 outlet
                                                        .root()
                                                        ?.replace(/^\//g, "") ??
                                                 "";

                                          this.log.debug(
                                                 `Attaching router outlet [${outlet.name}] at [${root || "/"}]`,
                                          );

                                          this._server?.use(`/${root}`, router);
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
