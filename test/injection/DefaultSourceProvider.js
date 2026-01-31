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

const {
       DefaultSourceProvider,
} = require("../../dist/modules/script/interfaces/DefaultSourceProvider");
const { ConfigurationService, FileProvider } = require("@geeko/configuration");
const { LogService } = require("@geeko/log");
const { resolve } = require("node:path");

/**_-_-_-_-_-_-_-_-_-_-_-_-_-          _-_-_-_-_-_-_-_-_-_-_-_-_-*/

const configuration = new ConfigurationService(
       new FileProvider({
              path: resolve(process.cwd(), "./app.config.json"),
              fragment: false,
       }),
);

const logger = new LogService({
       level: "debug",
});

(async () => {
       await configuration.load();
       const provider = new DefaultSourceProvider(configuration, logger);

       await provider.load();
       logger.debug(JSON.stringify(provider.source()));
})();
