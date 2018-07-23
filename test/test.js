const SimpleJsonCache = require('../index.js')
const DiskCache = require('../cache-engine/disk-cache.js')

var sjc = new SimpleJsonCache(new DiskCache({
    dir: 'cache',
    debug: true
}), {
    saveDelay: 1000,
    debug: true
})

var data = sjc.newObject({
    a: 200,
    level1: {
        b: 'str',
        c: [1, 2, 3],
        level2: {
            d: 90,
            level3: 'aaaa'
        }
    }
}, 'data')

var array=sjc.newObject([],'array')
array.push(1)
array.push(2)

var step = 1

//对于一开始就存在的属性修改可自动保存
if (step == 1) {
    data.level1.level2.d++
        data.a += '2'
    data.level1.c[0] = 'a'
    data.level1.c.pop()
    data.level1.c.push('6')
    data.level1.c = ['a', 'b', 'c']
    data.level1.level2.level3 = {
        ss: 'saas'
    }
}
//不存在于data的属性需要手动保存，或者修改其它属性进行自动保存
else if (step == 2) {
    data['newProto'] = 'new'
    data.save()

    //由于保存的函数是异步的，这里等待一段时间后才从磁盘读取对象
    setTimeout(() => {
        console.log(data.read())
    }, 2000)
}
//测试大量修改
else {
    data.level1.level2.d = 100
    var thread = setInterval(() => {
        data.level1.level2.d++
            if (data.level1.level2.d >= 500) {
                clearInterval(thread)
            }
    }, 10)
}