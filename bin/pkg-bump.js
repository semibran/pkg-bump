const http = require("http")
const fs = require("fs")
let pkg = null
if (fs.existsSync("package.json")) {
  pkg = require("./package.json")
} else {
  console.log("No package.json file found")
  process.exit()
}

let names = []
for (let name in pkg.dependencies) names.push(name)
for (let name in pkg.devDependencies) names.push(name)
for (let name in pkg.peerDependencies) names.push(name)
for (let name in pkg.optionalDependencies) names.push(name)

let versions = {}
let remaining = names.length
for (let i = 0; i < names.length; i++) {
  let name = names[i]
  let url = `http://registry.npmjs.org/${name}/latest`
  http.get(url, res => {
    let bufs = []
    res
      .on("data", data => bufs.push(data))
      .on("error", callback)
      .on("end", _ => {
        let dep = JSON.parse(Buffer.concat(bufs))
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
