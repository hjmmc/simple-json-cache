const ProtoListener = require('./proto-listener')

class SimpleJsonCache {
	constructor(cacheEngine, _options) {
		if (!cacheEngine || !cacheEngine.save || !cacheEngine.read) {
			throw 'CacheEngine error.'
		}
		this.cacheEngine = cacheEngine

		this.options = {
			cacheDelay: 1000, //延时保存,
			debug: false
		}
		if (typeof _options == 'object') {
			for (var k in _options) {
				if (_options[k])
					this.options[k] = _options[k]
			}
		}

		this.saving = {}
	}

	//obj 顶层属性必须全部定义好，动态添加的属性无法自动保存
	newObject(obj, name) {
		var _obj = this.cacheEngine.read(name)
		if (_obj) {
			obj = _obj
		} else {
			//this.cacheEngine.save(name, obj)
		}

		//创建监听器
		ProtoListener.addListener(obj, (newVal, oldVal, pathArray) => {
			if (this.options.debug) {
				console.log(pathArray)
				console.log('[value change]: obj.' + pathArray || '', oldVal || 'undefined', '==>', newVal || 'undefined')
			}
			if (this.saving[name]) {
				return
			}
			this.saving[name] = true
			//延时保存，以防止短时间大量更改导致太多保存
			setTimeout(() => {
				this.saving[name] = false

				//属性数据变化时保存
				this.cacheEngine.save(name, obj)
			}, this.options.cacheDelay)
		})

		//为obj定义save 手动保存函数
		obj.save = (cb) => {
			this.cacheEngine.save(name, obj, cb)
		}

		//为obj定义read 读取缓存中的对象
		obj.read = () => {
			return this.cacheEngine.read(name)
		}

		return obj
	}
}


module.exports = SimpleJsonCache