#!/usr/bin/env node
const { existsSync } = require("fs")
const { resolve } = require("path")
const { get } = require("http")

let pkg = null
if (existsSync("package.json")) {
  path = resolve("package.json")
  pkg = require(path)
} else {
  console.log("No package.json file found")
}

let names = []
for (let name in pkg.dependencies) names.push(name)
for (let name in pkg.devDependencies) names.push(name)
for (let name in pkg.peerDependencies) names.push(name)
for (let name in pkg.optionalDependencies) names.push(name)

let versions = {}
let remaining = names.length
for (let name of names) {
  let url = `http://registry.npmjs.org/${name}/latest`
  get(url, res => {
    let bufs = []
    res
      .on("error", callback)
      .on("data", data => bufs.push(data))
      .on("end", _ => {
        let data = Buffer.concat(bufs)
        let dep = JSON.parse(data)
        versions[name] = "^" + dep.version
        if (!--remaining) {
          callback(null, versions)
        }
      })
  }).on("error", callback)
}

function callback(err, versions) {
  if (err) throw err

  for (let name in pkg.dependencies) {
    pkg.dependencies[name] = versions[name]
  }

  for (let name in pkg.devDependencies) {
    pkg.devDependencies[name] = versions[name]
  }

  for (let name in pkg.peerDependencies) {
    pkg.peerDependencies[name] = versions[name]
  }

  for (let name in pkg.optionalDependencies) {
    pkg.optionalDependencies[name] = versions[name]
  }

  let output = JSON.stringify(pkg, null, 2)
  fs.writeFileSync("package.json", output)
}
