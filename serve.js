const fs = require('fs')

const args = process.argv.slice(2)

const file     = args[0]              // external/web/static/js/App.js
const buildId  = args[1] || false

const fileEx   = getFileExt(fileName)     // js
const fileName = getFileName(fileName)    // App
const filePath = getFilePath(fileName)    // external/web/static/js/


function parsePuer(file) {
	fs.readFile(file, 'utf8', (err, data) => {
		if (err) {
			console.log('An error occurred:', err)
			return
		}

		const jsCodePattern  = /(^|\s)<script>([\s\S]*?)<\/script>(\s|$)/
		const cssCodePattern = /(^|\s)<style>([\s\S]*?)<\/style>(\s|$)/

		const jsCodeMatch  = data.match(jsCodePattern)
		const cssCodeMatch = data.match(cssCodePattern)

		const jsCode  = jsCodeMatch  ? jsCodeMatch[2]  : 'No JS Code found'
		const cssCode = cssCodeMatch ? cssCodeMatch[2] : 'No CSS Code found'

		console.log('JavaScript:', jsCode)
		console.log('CSS:', cssCode)

		return [jsCode, cssCode]
	})
}


switch (fileExt) {
	case 'js':
		if (builId) {
			if (buildExists) {
				return jsBuildFileName(buildId)
			} else {
				throw 'Build does not exists.'
			}
		} else {
			if (puerVersionExists) {
				if (puerVersionYoungerThenJsVersion) {
					const [jsCode, cssCode] = parsePuer(file)
					saveCode(`${filePath}${fileName}.js`,  jsCode)
					saveCode(`${filePath}${fileName}.css`, cssCode)
				}
				return file
			}
		}
		break
	// case 'sass':
	// 	serveSass()
	// 	break
}
