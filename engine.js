const pm2         = require('pm2')
const FileManager = require('./class.FileManager.js')


const commandStructure = {
	start : ['baseDir'],
	stop  : [],
	sync  : ['baseDir'],
	build : ['puerDir', 'buildDir']
}

const watcherScriptName  = 'watcher.js'
const EXIT_SUCCESS       = 0
const EXIT_INVALID_ARGS  = 1
const EXIT_RUNTIME_ERROR = 2

class Engine {
	constructor(commandStructure) {
		const [, , command, ...args] = process.argv
		if (!commandStructure.hasOwnProperty(command)) {
			console.error('Invalid command. Valid commands are:', Object.keys(commandStructure).join(', '))
			process.exit(EXIT_INVALID_ARGS)
		}

		const expectedArgs = commandStructure[command]
		this.args = {command}

		for (let i = 0; i < expectedArgs.length; i++) {
			if (args[i] === undefined) {
				console.error(`Missing argument: ${expectedArgs[i]}`)
				process.exit(EXIT_INVALID_ARGS)
			}
			this.args[expectedArgs[i]] = args[i]
		}
		this._run()
	}

	_run() {
		switch (this.args.command) {
			case 'start':
				this.start(this.args.baseDir)
				break
			case 'stop':
				this.stop()
				break
			case 'sync':
				this.sync(this.args.baseDir)
				break
			case 'build':
				break
		}
	}

	sync(baseDir) {
		// FileManager.sync(baseDir)
	}

	start(baseDir) {
		pm2.connect((err) => {
			if (err) {
				console.error('Error connecting to PM2:', err)
				process.exit(EXIT_RUNTIME_ERROR)
			}

			pm2.start(watcherScriptName, {args: [baseDir]}, (err) => {
				if (err) {
					if (err.message && err.message.includes('Script already launched')) {
						console.log('Puer engine is already running')
					} else {
						console.error('Error starting puer engine:', err)
					}
					pm2.disconnect()
					process.exit(EXIT_RUNTIME_ERROR)
				} else {
					console.log('Puer engine started')
					pm2.disconnect()
					process.exit(EXIT_SUCCESS)
				}
			})
		})
	}


	stop() {
		pm2.stop('watcher.js', (err, apps) => {
			pm2.disconnect()
			if (err) {
				console.error('Error stopping Puer engine:', err)
				process.exit(EXIT_RUNTIME_ERROR)
			} else {
				console.log('Puer engine stopped')
				process.exit(EXIT_SUCCESS)
			}
		})
	}
}

new Engine(commandStructure)
