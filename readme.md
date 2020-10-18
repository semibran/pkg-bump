# pkg-bump
> bump package.json dependency versions

This is a tiny tool that updates all dependencies in your `package.json` (including `devDependencies`, `peerDependencies`, and `optionalDependencies`) to their latest versions, disregarding semver. This makes it invaluable when reviving old projects or starting new ones from a template, where you would typically want to use the latest versions of each package.

**NOTE:** For the sake of flexibility, the `pkg-bump` command does not install new versions of dependencies. Use in tandem with the package manager of your choice, e.g. `pkg-bump && npm i`.

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
* rollup                       ^0.55.5 -> ^2.28.2
* rollup-plugin-node-resolve   ^2.1.1 -> ^9.0.0

$ npm i
```

Install globally using npm:
```sh
npm i -g pkg-bump
```
