const FileManager = require('./class.FileManager.js')
const chokidar    = require('chokidar')

const args    = process.argv.slice(2)
const baseDir = args[0]
const puerDir = baseDir + '/puer'

FileManager.clearLog()
FileManager.log('Watcher started on', puerDir)

const watcher = chokidar.watch(puerDir, {
	ignored: /(^|[\/\\])\../,  // Ignore dotfiles
	persistent: true
})


watcher
	.on('add',    FileManager.onAdd)
	.on('change', FileManager.onChange)
	.on('unlink', FileManager.onDelete)

FileManager.log('Watcher intialized', watcher.options)
