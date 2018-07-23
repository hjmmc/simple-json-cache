/**
*
*	实现原生js检测对象变化（ES5）
* 	#quote https://blog.csdn.net/qq_34829112/article/details/76345928
*
**/
const OP = Object.prototype;
const types = {
	obj: '[object Object]',
	array: '[object Array]'
}
const OAM = ['push', 'pop', 'shift', 'unshift', 'short', 'reverse', 'splice']

class ProtoListener {
	constructor(obj, cb) {
		if (OP.toString.call(obj) !== types.obj && OP.toString.call(obj) !== types.array) {
			console.log('请传入一个对象或数组');
			return false;
		}
		this._callback = cb;
		this.observe(obj);
	}
	observe(obj, path) { 
		if (OP.toString.call(obj) === types.array) {
			this.overrideArrayProto(obj, path);
		}
		Object.keys(obj).forEach((key) => {
			let oldVal = obj[key];
			let pathArray = path && path.slice();
			if (pathArray) {
				pathArray.push(key);
			} else {
				pathArray = [key];
			}
			Object.defineProperty(obj, key, {
				get: function() {
					return oldVal;
				},
				set: (function(newVal) {
					if (oldVal !== newVal) {
						if (OP.toString.call(newVal) === '[object Object]') {
							this.observe(newVal, pathArray);
						}
						this._callback(newVal, oldVal, pathArray)
						oldVal = newVal
					}
				}).bind(this)
			})
			if (OP.toString.call(obj[key]) === types.obj || OP.toString.call(obj[key]) === types.array) {
				this.observe(obj[key], pathArray)
			}
		}, this)
	}
	overrideArrayProto(array, path) {
		// 保存原始 Array 原型  
		var originalProto = Array.prototype,
			// 通过 Object.create 方法创建一个对象，该对象的原型是Array.prototype  
			overrideProto = Object.create(Array.prototype),
			self = this,
			result;
		// 遍历要重写的数组方法  
		OAM.forEach((method) => {
			Object.defineProperty(overrideProto, method, {
				value: function() {
					var oldVal = this.slice();
					//调用原始原型上的方法  
					result = originalProto[method].apply(this, arguments);
					//继续监听新数组  
					self.observe(this, path);
					self._callback(this, oldVal, path);
					return result;
				}
			})
		});
		// 最后 让该数组实例的 __proto__ 属性指向 假的原型 overrideProto  
		array.__proto__ = overrideProto;
	}
}

module.exports = ProtoListener