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

import { GithubReleaseOptions } from "../types/GithubReleaseOptions";
import { JsonLike } from "@geeko/serialization";

/**_-_-_-_-_-_-_-_-_-_-_-_-_-           _-_-_-_-_-_-_-_-_-_-_-_-_-*/

/**
 * Gets the github release from the specified version. Defaults to 'latest'
 *
 * @public
 * @param {String} version
 * @param {Array<JsonLike>} releases
 * @returns {JsonLike}
 */
export const getRelease = (
       version: string,
       releases: Array<JsonLike>,
): GithubReleaseOptions | undefined => {
       const length: number = releases?.length ?? 0;
       let index: number = 0;

       if (length === 0) {
              return void 0;
       }

       for (; index < length; ++index) {
              const release: JsonLike = releases[index];
              const latest: boolean =
                     (!version || version === "latest") && index === 0;

              if (
                     latest ||
                     (release?.tag_name && release?.tag_name === version)
              ) {
                     const assets: JsonLike = release.assets?.[0];

                     if (assets) {
                            return {
                                   compressed:
                                          assets.content_type ===
                                          "application/octet-stream",
                                   url: assets.browser_download_url,
                                   version: release.tag_name,
                            };
                     }
              }
       }
};
