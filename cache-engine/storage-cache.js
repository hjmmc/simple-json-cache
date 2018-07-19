class StorageCache {
	constructor(_options) {
		this.options = {
			prefix: 'sjc_',
			debug: false
		}
		if (typeof _options == 'object') {
			for (var k in _options) {
				if (_options[k])
					this.options[k] = _options[k]
			}
		}

		this.localStorage = localStorage
	}

	save(name, obj) {
		var str = JSON.stringify(obj)
		this.localStorage[this.options.prefix + name] = str
		if (this.options.debug) {
			console.log('save to localStorage', str)
		}
	}

	read(name) {
		var str = this.localStorage[this.options.prefix + name]
		if (this.options.debug) {
			console.log('read from localStorage', str)
		}
		if (str) {
			try {
				return JSON.parse(str)
			} catch (e) {
				if (this.options.debug) {
					console.log('parse json error')
				}
				return null
			}
		}
		return null
	}
}

module.exports = StorageCache