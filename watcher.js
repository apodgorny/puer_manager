const path     = require('path')
const watcher = require('chokidar-watcher')

const FileManager = require('./class.FileManager.js')

const args    = process.argv.slice(2)
const baseDir = args[0]

const config = FileManager.getConfig(baseDir)
let   jsDirs = []
for (const o of config) {
	jsDirs.push(o.js)
}
console.log(jsDirs)
FileManager.clearLog()
// FileManager.log('Watcher started on', puerDir)

watcher(jsDirs, {
	ignored    : /(^|[\/\\])\../,  // Ignore dotfiles
	persistent : true
})

watcher
	.on('ready', ()     => { FileManager.log   ('Watcher is ready' ) })
	.on('error',  error => { FileManager.error (`Error: ${error}`  ) })

	.on('add',    path  => { FileManager.onAdd    (path, baseDir) })
	.on('change', path  => { FileManager.onChange (path, baseDir) })
	.on('unlink', path  => { FileManager.onDelete (path, baseDir) })
