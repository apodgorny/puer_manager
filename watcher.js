const path     = require('path')
const chokidar = require('chokidar')

const FileManager = require('./class.FileManager.js')

const args    = process.argv.slice(2)
const baseDir = args[0]
const puerDir = path.join(baseDir, 'puer/')

FileManager.clearLog()
FileManager.log('Watcher started on', puerDir)

const watcher = chokidar.watch(puerDir, {
	ignored    : /(^|[\/\\])\../,  // Ignore dotfiles
	persistent : true
})

console.log('Base Dir:', baseDir)
console.log('Puer Dir:', puerDir)

watcher
	.on('ready', ()     => { FileManager.log   ('Watcher is ready' ) })
	.on('error',  error => { FileManager.error (`Error: ${error}`  ) })

	.on('add',    path  => { FileManager.onAdd    (path, baseDir) })
	.on('change', path  => { FileManager.onChange (path, baseDir) })
	.on('unlink', path  => { FileManager.onDelete (path, baseDir) })
