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

if (process.argv[2] === "-v") {
	console.log("v" + pkg.version)
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

if (!names.length) {
	console.log("No dependencies found in package.json")
	process.exit()
}

let latest = {}
let remaining = names.length
for (let name of names) {
	let url = `http://registry.npmjs.org/${name}/latest`
	http.get(url, res => {
		let bufs = []
		res.on("error", callback)
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
	let change = false
	for (let type of types) {
		let deps = pkg[type]
		if (!deps) continue
		let names = Object.keys(deps)
		for (let name of names) {
			if (deps[name] !== latest[name]) {
				change = true
			}
		}
	}
	if (!change) {
		console.log("All dependencies up to date")
		return
	}
	for (let type of types) {
		let deps = pkg[type]
		if (!deps) continue
		let names = Object.keys(deps)
		if (!names.length) continue
		let maxlen = 0
		let change = false
		for (let name of names) {
			if (deps[name] !== latest[name]) {
				change = true
			}
			if (name.length > maxlen) {
				maxlen = name.length
			}
		}
		if (!change) continue
		names.sort()
		console.log(`${type}:`)
		for (let name of names) {
			if (deps[name] === latest[name]) continue
			deps[name] = latest[name]
			let whitespace = ""
			while (whitespace.length < maxlen - name.length) {
				whitespace += " "
			}
			let change = `${deps[name]} -> ${latest[name]}`
			console.log(`* ${name}${whitespace}   ${change}`)
		}
		console.log("")
	}

	let data = JSON.stringify(pkg, null, 2)
	fs.writeFileSync(file, data)
}
