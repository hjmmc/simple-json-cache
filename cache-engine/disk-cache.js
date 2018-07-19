const fs = require('fs')
const path = require('path')

class DiskCache {
	constructor(_options) {
		this.options = {
			dir: '.cache', //保存的目录
			debug: false
		}
		if (typeof _options == 'object') {
			for (var k in _options) {
				if (_options[k])
					this.options[k] = _options[k]
			}
		}

		this.mkdirsSync(this.options.dir)

		this.fileLocked = false
		this.saveWaitThread = null
	}

	//递归创建目录
	mkdirsSync(dirname) {
		if (dirname == '') {
			return true
		}
		if (fs.existsSync(dirname)) {
			return true;
		} else {
			if (this.mkdirsSync(path.dirname(dirname))) {
				fs.mkdirSync(dirname)
				return true;
			}
		}
	}

	//保存JSON对象到文件中
	save(name, obj) {

		var filepath = `${this.options.dir}/${name}.json`
		var str = JSON.stringify(obj)
		if (this.options.debug) {
			console.log('saving to ' + filepath, str)
		}

		if (this.fileLocked) {
			//如果文件正在使用中,且没有等待中的保存队列,则延时1秒再次尝试保存
			if (!this.saveWaitThread) {
				if (this.options.debug) {
					console.log('create saveWaitThread')
				}
				this.saveWaitThread = setTimeout(() => {
					this.saveWaitThread = null
					this.save(name, obj)
				}, 1000)
			}
			return
		}

		this.fileLocked = true
		fs.writeFile(filepath, str, (err) => {
			this.fileLocked = false
			if (this.options.debug) {
				if (err)
					console.error(err)
				else
					console.log('saved')
			}
		})
	}

	//从文件中读取指定对象
	read(name) {
		var filepath = `${this.options.dir}/${name}.json`
		if (fs.existsSync(filepath)) {
			var str = fs.readFileSync(filepath)
			if (this.options.debug) {
				console.log('reading from ' + filepath, str.toString())
			}
			try {
				return JSON.parse(str)
			} catch (e) {
				console.log('read json error')
				return null
			}
		}
		return null
	}
}


module.exports = DiskCache