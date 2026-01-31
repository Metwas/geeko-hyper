# Geeko Hyper 
![image](./assets/hyper-banner.jpg)
## _Fast HTTP server for the Geeko ecosystem_

[![License][license-image]][license-url] [![Downloads][downloads-image]][downloads-url]

[license-url]: LICENSE
[license-image]: https://img.shields.io/badge/License-MIT-blue
[downloads-image]: https://img.shields.io/npm/dm/%40geeko%2Fhyper
[downloads-url]: https://npm-stat.com/charts.html?package=@geeko/hyper
#
- [Configuration](#Configuration)
- [Installation](#Installation)
#
#

#
### Configuration
Example of the default hyper-server configuration.
```typescript
{
       "hyper": {
              "host": "0.0.0.0",
              "port": 3333
       },
       "scripts": {
              "path": [
                     "./assets/scripts/core",
                     "./assets/scripts/demo",
                     "$HOME/geeko/scripts/"
              ],
              "injector": {
                     "url": "https://api.github.com/repos/Metwas/geeko-chloro/releases",
                     "version": "latest",
                     "method": "github",
                     "wrap": true
              }
       }
}
```
#
#
## Installation

**NPM**

```sh
npm i @geeko/hyper
```
#
