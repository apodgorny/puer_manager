const fs = require('fs')


class FileManager {
	static logFile = 'log.txt'

	static onAdd(path) {
		this.log(`File ${path} has been added`)
	}

	static onChange(path) {
		this.log(`File ${path} has been changed`)
	}

	static onDelete(path) {
		this.log(`File ${path} has been removed`)
	}

	static log(...args) {
		fs.appendFile('log.txt',  args.join(' ') + '\n', err => {})
	}

	static clearLog() {
		fs.unlink(this.logFile, err => {})
	}
}

module.exports = FileManager