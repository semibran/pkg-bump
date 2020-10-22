# pkg-bump
> tiny package.json dependency version bumper

This tool updates all dependencies in your `package.json` (including `devDependencies`, `peerDependencies`, and `optionalDependencies`) to their latest versions, disregarding semver. This makes it useful when reviving old projects or starting new ones from a template, where you would typically want to use the latest versions of each package.

**NOTE:** For flexibility's sake, the `pkg-bump` command does not install new versions of dependencies. Use in tandem with the package manager of your choice, e.g. `pkg-bump && npm i`.

```sh
$ cat package.json
{
  "name": "example",
  "version": "0.0.0",
  "description": "an example package",
  "devDependencies": {
    "@rollup/plugin-node-resolve": "^2.1.1",
    "rollup": "^0.55.5",
  }
}

$ pkg-bump
devDependencies:
* @rollup/plugin-node-resolve   ^2.1.1 -> ^9.0.0
* rollup                        ^0.55.5 -> ^2.32.1

$ npm i
$ git init
```

Install globally using npm:
```sh
npm i -g pkg-bump
```
