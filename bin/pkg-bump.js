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

let names = []
let types = [
  "dependencies",
  "devDependencies",
  "peerDependencies",
  "optionalDependencies"
]

for (let type of types) {
  let deps = pkg[type]
  for (let name in deps) {
    names.push(name)
  }
}

let latest = {}
let remaining = names.length
for (let name of names) {
  let url = `http://registry.npmjs.org/${name}/latest`
  http.get(url, res => {
    let bufs = []
    res
      .on("error", callback)
      .on("data", data => bufs.push(data))
      .on("end", _ => {
        let data = Buffer.concat(bufs)
        let dep = JSON.parse(data)
        latest[name] = "^" + dep.version
        if (!--remaining) {
          callback(null, latest)
        }
      })
  }).on("error", callback)
}

function callback(err, latest) {
  if (err) throw err

  for (let type of types) {
    let deps = pkg[type]
    if (deps) {
      let names = Object.keys(deps)
      if (names.length) {
        console.log(`${type}:`)
        let longest = ""
        for (let name of names) {
          if (name.length > longest.length) {
            longest = name
          }
        }
        names.sort()
        for (let name of names) {
          let whitespace = ""
          while (whitespace.length < longest.length - name.length) {
            whitespace += " "
          }
          let change = `${deps[name]} -> ${latest[name]}`
          if (deps[name] === latest[name]) {
            change = `${latest[name]} (unchanged)`
          }
          deps[name] = latest[name]
          console.log(`* ${name}${whitespace}  ${change}`)
        }
      }
    }
  }

  let data = JSON.stringify(pkg, null, 2)
  fs.writeFileSync(file, data)
}
