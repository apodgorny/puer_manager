const fs   = require('fs')
const path = require('path')


class FileManager {
	static logFile = 'log.txt'

	static getConfig(dir, result = []) {
		let jsPath  = null
		let cssPath = null

		fs.readdirSync(dir, { withFileTypes: true }).forEach(dirent => {
			if (dirent.isDirectory()) {
				const subdir = path.join(dir, dirent.name);
				FileManager.getConfig(subdir, result);
				if (dirent.name == 'js') {
					jsPath = path.join(dir, 'js')
				} else if (dirent.name == 'css') {
					cssPath = path.join(dir, 'css')
				}
			}
		})

		if (jsPath && cssPath) {
			result.push({ css: cssPath, js: jsPath })
		}

		return result
	}

	static isFileEmpty(path) {
		return fs.statSync(path).size == 0
	}

	static isFileValid(path) {
		// console.log(path, !!path.match(/js\/class\.(\w+)\.js$/))
		return !!path.match(/js\/class\.(\w+)\.js$/)
	}

	static getJsClassName(path) {
		const regex = /class\.(\w+)\.js$/
		const match = path.match(regex)

		if (match) {
			return match[1]
		} else {
			return null
		}
	}

	static camelToKebab(s) {
		return s.replace(/([a-zA-Z])(?=[A-Z])/g, '$1-').toLowerCase()
	}

	static jsToCss(className, path) {
		return path.replace(/js\/class\.(\w+)\.js$/, `css/class.${className}.css`)
	}

	static addJsClass(className, path) {
		let s = fs.readFileSync('templates/class.js', { encoding: 'utf8', flag: 'r' })
		s = s.split('<className>').join(className)
		fs.writeFileSync(path, s)
	}

	static addCssClass(className, path) {
		const cssClass = FileManager.camelToKebab(className)
		fs.writeFileSync(FileManager.jsToCss(className, path), `.${cssClass} {\n}`)
	}

	static removeClass(className, path) {
		path = FileManager.jsToCss(className, path)
		if (fs.existsSync(path)) {
			fs.unlinkSync(path)
		}
	}

	static onAdd(path) {
		if (FileManager.isFileValid(path) && FileManager.isFileEmpty(path)) {
			const className = FileManager.getJsClassName(path)
			FileManager.log(`Added class: ${className}`)
			FileManager.addJsClass(className, path)
			FileManager.addCssClass(className, path)
		}
	}

	static onChange(path) {
		if (FileManager.isFileValid(path)) {
			// FileManager.log(`File ${path} has been changed`)
		}
	}

	static onDelete(path) {
		if (FileManager.isFileValid(path)) {
			const className = FileManager.getJsClassName(path)
			FileManager.log(`Removed class: ${className}`)
			FileManager.removeClass(className, path)
		}
	}

	static log(...args) {
		console.log(...args)
		// fs.appendFile(FileManager.logFile,  args.join(' ') + '\n', err => {})
	}

	static clearLog() {
		fs.unlink(FileManager.logFile, err => {})
	}
}

module.exports = FileManager