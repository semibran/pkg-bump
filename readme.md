# pkg-bump
> bump package.json dependency versions

This is a tiny tool that updates all dependencies in your `package.json` (including `devDependencies`, `peerDependencies`, and `optionalDependencies`) to their latest versions, disregarding semver. This makes it invaluable when reviving old projects or starting new projects from a template, where you would typically want to use the latest versions of each package.

```sh
$ cat package.json
{
  "name": "example",
  "version": "0.0.0",
  "description": "an example package",
  "devDependencies": {
    "rollup": "^0.55.5",
    "rollup-plugin-node-resolve": "^2.1.1"
  }
}

$ pkg-bump
devDependencies:
* rollup                      ^0.55.5 -> ^0.56.5
* rollup-plugin-node-resolve  ^2.1.1 -> ^3.2.0

$ npm i
```

Install globally using npm:
```sh
npm i -g pkg-bump
```
