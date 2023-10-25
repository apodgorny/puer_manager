const pm2 = require('pm2')

const commandStructure = {
	start : ['baseDir'],
	stop  : [],
	build : ['puerDir', 'buildDir']
}

class Engine {
	constructor(commandStructure) {
		const [, , command, ...args] = process.argv
		if (!commandStructure.hasOwnProperty(command)) {
			console.error('Invalid command. Valid commands are:', Object.keys(commandStructure).join(', '))
			process.exit(1)
		}

		const expectedArgs = commandStructure[command]
		this.args = {command}

		for (let i = 0; i < expectedArgs.length; i++) {
			if (args[i] === undefined) {
				console.error(`Missing argument: ${expectedArgs[i]}`)
				process.exit(1)
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
			case 'build':
				break
		}
	}

	start(baseDir) {
		pm2.start('watcher.js', {args: [baseDir]}, (err, apps) => {
			pm2.disconnect()
			if (err) {
				console.error('Error starting script:', err)
				process.exit(2)
			} else {
				console.log(`Watching file changes on ${baseDir}`)
				process.exit(0)
			}
		})
	}

	stop() {
		pm2.stop('watcher.js', (err, apps) => {
			pm2.disconnect()
			if (err) {
				console.error('Error stopping script:', err)
				process.exit(2)
			} else {
				console.log('Script stopped')
				process.exit(0)
			}
		})
	}
}

new Engine(commandStructure)
