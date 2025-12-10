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
