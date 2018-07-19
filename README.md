
# A Simple Json Cache

> auto save json data to disk/localStorage when object change. it support nodejs and web.

## Build Setup

``` bash
# install dependencies
npm install simple-json-cache --save

# node test
cd node_modules/simple-json-cache
npm run test
```

## API

### SimpleJsonCache

- newObject(object,name)
- object.save()
- object.read()

## Usage

### NodeJS

```js
const SimpleJsonCache = require('simple-json-cache')
const DiskCache = require('simple-json-cache/cache-engine/disk-cache.js')

var sjc = new SimpleJsonCache(new DiskCache({
    dir: 'cache',
    debug: true
}), {
    saveDelay: 1000,
    debug: true
})

//auto load data from cache/data.json
var data = sjc.newObject({a,:'a',b:[1,2,3],c:{c1:10}},'data')

data.b.push(data.c.c1) //auto save data to cache/data.json
data.c.c1++ //auto save to data cache/data.json

//but
data.newProto='newProto' //this will do nothing when you add a new proto in object
data.save() //you must invoke save method to save json data
```

### Web(Vue)

```js
const SimpleJsonCache = require('simple-json-cache')
const StorageCache = require('simple-json-cache/cache-engine/storage-cache.js')

Vue.prototype.sjc = new SimpleJsonCache(new StorageCache({
    prefix: 'jsc_',
    debug: true
}), {
    saveDelay: 1000,
    debug: true
})


//in vue file
var config = this.sjc.newObject({a:'aaa',b:[1,2,3]},'config') //auto load data from localStorage['jsc_config']
config.a='sdsasa'  //auto save data to localStorage['jsc_config']
config.b[1]++  //auto save data to localStorage['jsc_config']

//but
config.newProto='newProto' //this will do nothing when you add a new proto in object
config.save() //you must invoke save method to save json data
```