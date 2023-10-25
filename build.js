const args = process.argv.slice(2)


const file         = args[0]              // external/web/static/js/App.js
const isProduction = args[1] || false

const fileEx   = getFileExt(fileName)     // js
const fileName = getFileName(fileName)    // App
const filePath = getFilePath(fileName)    // external/web/static/js/

buildAndSaveJSAndCSS()

/*
	static/js/
	static/css/
	...
	static/puer/
	static/build/<build_id>.js
	static/build/<build_id>.css
*/