const fs   = require('fs')
const path = require('path')


class FileManager {
	static logFile = 'log.txt'

	static parsePuer(filePath, basePath) {
		const variablePath = filePath.replace(basePath, '')
		FileManager.log('parsing', filePath)
		fs.readFile(filePath, 'utf8', (err, data) => {
			FileManager.log('read')
			if (err) {
				FileManager.log(`Error reading file "${filePath}":`, err)
				return
			}

			try {
				const regex     = /====([\s\S]*?)----/g
				const cssBlocks = []

				let result

				while ((result = regex.exec(data)) !== null) {
					cssBlocks.push(result[1].trim());
				}

				const cssCode = cssBlocks.join('\n').trim()        || '/* No JS Code found */'
				const jsCode  = data.replace(regex, '').trim() || '/* No CSS Code found */'

				const  jsFileName = basePath + variablePath.replace(/puer/g,  'js')
				const cssFileName = basePath + variablePath.replace(/puer/g, 'css')

				fs.writeFile(jsFileName, jsCode, 'utf8', (err) => {
					err && FileManager.log(`Error writing file "${jsFileName}":`, err)
				})
				fs.writeFile(cssFileName, cssCode, 'utf8', (err) => {
					err && FileManager.log(`Error writing file "${cssFileName}":`, err)
				})
			} catch (err) {
				FileManager.log(err.message)
			}
		})
	}

	// static getPath(baseDir, filePath, ext) {
	// 	return path.join(basePath, filePath.replace(basePath, '').replace

	// static sync(baseDir) {
	// 	const jsDir = path.join(baseDir, 'js/')

	// 	fs.readdir(jsDir, (err, files) => {
	// 		if (err) { return FileManager.log('Error sync-ing files:', err) }
	// 		files.filter(file => file.endsWith('.js')).forEach(file => {
	// 			const cssFile = basePath + variablePath.replace(/puer/g, 'css')
	// 			console.log(file)
	// 		});
	// 	})
	// }

	static onAdd(path, basePath) {
		FileManager.log(`File ${path} has been added`)
		FileManager.parsePuer(path, basePath)
	}

	static onChange(path, basePath) {
		FileManager.log(`File ${path} has been changed`)
		FileManager.parsePuer(path, basePath)
	}

	static onDelete(path, basePath) {
		FileManager.log(`File ${path} has been removed`)
	}

	static log(...args) {
		fs.appendFile(FileManager.logFile,  args.join(' ') + '\n', err => {})
	}

	static clearLog() {
		fs.unlink(FileManager.logFile, err => {})
	}
}

module.exports = FileManager