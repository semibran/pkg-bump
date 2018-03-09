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
    "babel": "*",
    "rollup": "*"
  }
}

$ pkg-bump
$ npm i
```

Install globally using npm:
```sh
npm i -g pkg-bump
```
