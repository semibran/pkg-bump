#!/usr/bin/env node
const fs = require("fs")
const http = require("http")
const path = require("path")
const file = path.resolve("package.json")

let pkg = null
if (fs.existsSync(file)) {
  pkg = require(file)
} else {
  console.log("No package.json file found")
  process.exit()
}

let deps = []
for (let name in pkg.dependencies) deps.push(name)
for (let name in pkg.devDependencies) deps.push(name)
for (let name in pkg.peerDependencies) deps.push(name)
for (let name in pkg.optionalDependencies) deps.push(name)

let versions = {}
let remaining = deps.length
for (let name of deps) {
  let url = `http://registry.npmjs.org/${name}/latest`
  http.get(url, res => {
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

  let data = JSON.stringify(pkg, null, 2)
  fs.writeFileSync(file, data)
}
