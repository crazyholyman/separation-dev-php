/**
 * 获取时间差
 * @param {TIME} time1 时间节点1
 * @param {TIME} time2 时间节点2
 * @return { Object } 以对象形式返回时间差
 */
function getTimeDifference(time1, time2) {
  var diffTime = Math.round(Math.abs(time1.getTime() - time2.getTime()) / 1000)
  var day = parseInt(diffTime / (60 * 60 * 24))
  var hours = parseInt(diffTime % (60 * 60 * 24) / (60 * 60))
  var minutes = parseInt(diffTime % (60 * 60) / 60)
  var seconds = diffTime % 60

  return {
    day: day,
    hours: hours,
    minutes: minutes,
    seconds: seconds
  }
}

/**
 * 范围内的随机整数
 * @param {NUMBER} a 数字1
 * @param {NUMBER} b 数字2
 * @return { NUMBER } 随机数字
 */
function rangeRandom(a, b) {
  var max = Math.max(a, b)
  var min = Math.min(a, b)
  var res = Math.floor(Math.random() * (max - min + 1) + min)
  return res
}

/**
 * 生成一个随机颜色字符串
 * @param {BOOLEAN} type 是否十六进制返回
 * @return {STRING} 随机颜色的字符串
 */
function randomColor(type) {
  if (!type) {
    var res = 'rgb(' + rangeRandom(0, 255) + ', ' + rangeRandom(0, 255) + ', ' + rangeRandom(0, 255) + ')'
    return res
  }

  var str = '#'
  for (var i = 0; i < 3; i++) {
    var n = rangeRandom(0, 255).toString(16)
    if (n.length === 1) n = '0' + n
    str += n
  }
  return str
}

/**
 * 解析查询字符串
 * @param { STRING } str 要解析的查询字符串
 * @return { OBJECT } 解析后的结果
 */
function parseQueryString(str) {
  var obj = {}
  if (str) {
    var tmp = str.slice(1).split('&')
    tmp.forEach(function (item) {
      var t = item.split('=')
      obj[t[0]] = t[1]
    })
  }
  return obj
}

/**
 * 获取元素样式
 * @param { ELEMENT } ele 要获取样式得元素
 * @param { STRING } style 要获取得样式字符串
 * @return { STRING } 获取到得元素得样式
 */
function getStyle(ele, style) {
  // 判断 window 里面有没有 getComputedStyle()
  if ('getComputedStyle' in window) {
    // 标准浏览器
    return window.getComputedStyle(ele)[style]
  } else {
    // IE 低版本
    return ele.currentStyle[style]
  }
}

/**
 * 事件绑定的兼容处理
 * @param { ELEMENT } ele 事件源
 * @param { STRING } type 事件类型
 * @param { FUNCTION } handler 事件处理函数
 */
function on(ele, type, handler) {
  if (!ele) throw new Error('请按照规则传递参数')
  if (ele.nodeType !== 1) throw new Error('事件源有问题')
  if (ele.addEventListener) {
    ele.addEventListener(type, handler)
  } else if (ele.attachEvent) {
    ele.attachEvent('on' + type, handler)
  } else {
    ele['on' + type] = handler
  }
}

/**
 * 事件解绑的兼容处理
 * @param { ELEMENT } ele 事件源
 * @param { STRING } type 事件类型
 * @param { FUNCTION } handler 事件处理函数
 */
function off(ele, type, handler) {
  if (!ele) throw new Error('请按照规则传递参数')
  if (ele.nodeType !== 1) throw new Error('事件源有问题')

  // 处理解绑的兼容
  if (ele.removeEventListener) {
    ele.removeEventListener(type, handler)
  } else if (ele.detachEvent) {
    ele.detachEvent('on' + type, handler)
  } else {
    ele['on' + type] = null
  }
}

/**
 * 简单版多属性运动函数
 * @param { ELEMENT } ele 要运动的元素
 * @param { OBJECT } target 要运动的属性(对象)
 * @param { FUNCTION } fn 运动结束的回调函数
 */
function move(ele, target, fn = () => {}) {
  let count = 0
  for (let key in target) {
    if (key === 'opacity') target[key] *= 100
    count++
    let timer = setInterval(() => {
      let current = key === 'opacity' ? getStyle(ele, 'opacity') * 100 : parseInt(getStyle(ele, key))
      let distance = (target[key] - current) / 10
      distance = distance > 0 ? Math.ceil(distance) : Math.floor(distance)
      if (current === target[key]) {
        clearInterval(timer)
        count--
        if (!count) fn()
      } else {
        ele.style[key] = key === 'opacity' ? (current + distance) / 100 : current + distance + 'px'
      }
    }, 10)
  }
}


/**
 * setCookie 设置 cookie 的方法
 * @param {STRING} key cookie 的 key
 * @param {STRING} value cookie 的 value
 * @param {NUMBER} expires 多少秒以后过期
 * @param {STRING} path cookie 存储路径
 */
function setCookie(key, value, expires, path) {
  // 1. 准备一个标准cookie内容
  var str = key + '=' + value
  if (expires) {
    var time = new Date()
    time.setTime(time.getTime() - 1000 * 60 * 60 * 8 + expires * 1000)
    str += ';expires=' + time
  }
  if (path) {
    str += ';path=' + path
  }
  document.cookie = str
}


/**
 * getCookie 获取 cookie 的方法
 * @param {STRING}} key 选填: 你要获取的某一个cookie 的 key
 * @return {STRING | OBJECT} 填写参数是指定key 的值, 不填写参数是 对象
 */
function getCookie(key) {
  var tmp = document.cookie.split('; ')
  var o = key ? '' : {}
  tmp.forEach(function (item) {
    var t = item.split('=')
    if (key) {
      if (t[0] === key) {
        o = t[1]
      }
    } else {
      o[t[0]] = t[1]
    }
  })
  return o
}


/**
 * creXhr 创建 ajax 对象
 * @return { OBJECT } 当前浏览器使用的 ajax 对象
 */
function creXhr() {
  var xhr = null
  var flag = false
  var arr = [
    function () { return new XMLHttpRequest() },
    function () { return new ActiveXObject('Microsoft.XMLHTTP') },
    function () { return new ActiveXObject('Msxml.XMLHTTP') },
    function () { return new ActiveXObject('Msxml2.XMLHTTP') }
  ]
  for (let i = 0; i < arr.length; i++) {
    try {
      xhr = arr[i]()
      creXhr = arr[i]
      flag = true
      break
    } catch (e) {}
  }
  if (!flag) {
    xhr = '您的浏览器不支持 ajax, 请更换浏览器重试'
    throw new Error(xhr)
  }
  return xhr
}


/**
 * ajax 发送 ajax 请求的方法
 * @param { OBJECT } options 请求的所有配置项
 */
function ajax(options = {}) {
  if (!options.url) {
    throw new Error('url 为必填选项')
  }
  if (!(options.type == undefined || options.type.toUpperCase() === 'GET' || options.type.toUpperCase() === 'POST')) {
    throw new Error('目前只接收 GET 或者 POST 请求方式, 请期待更新')
  }
  if (!(options.async == undefined || typeof options.async === 'boolean')) {
    throw new Error('async 需要一个 Boolean 数据类型')
  }
  if (!(options.dataType == undefined || options.dataType === 'string' || options.dataType === 'json')) {
    throw new Error('目前只支持 string 和 json 格式解析, 请期待更新')
  }
  if (!(options.data == undefined || typeof options.data === 'string' || Object.prototype.toString.call(options.data) === '[object Object]')) {
    throw new Error('data 参数只支持 string 和 object 数据类型')
  }
  if (!(options.success == undefined || typeof options.success === 'function')) {
    throw new Error('success 传递一个函数类型')
  }
  if (!(options.error == undefined || typeof options.error === 'function')) {
    throw new Error('error 传递一个函数类型')
  }

  // 2. 设置一套默认值
  var _default = {
    url: options.url,
    type: options.type || 'GET',
    async: typeof options.async === 'boolean' ? options.async : true,
    dataType: options.dataType || 'string',
    data: options.data || '',
    success: options.success || function () {},
    error: options.error || function () {}
  }
  if (typeof _default.data === 'object') {
    var str = ''
    for (var key in _default.data) {
      str += key + '=' + _default.data[key] + '&'
    }
    _default.data = str.slice(0, -1)
  }

  // 3. 发送请求
  var xhr = creXhr()
  if (_default.type.toUpperCase() === 'GET' && _default.data) {
    _default.url += '?' + _default.data
  }
  xhr.open(_default.type, _default.url, _default.async)
  xhr.onreadystatechange = function () {
    if (xhr.status >= 200 && xhr.status < 300 && xhr.readyState === 4) {
      if (_default.dataType === 'json') {
        var res = JSON.parse(xhr.responseText)
        _default.success(res)
      } else if (_default.dataType === 'string') {
        _default.success(xhr.responseText)
      }
    }
    if (xhr.readyState === 4 && xhr.status >= 400) {
      _default.error(xhr.status)
    }
  }
  if (_default.type.toUpperCase() === 'POST') {
    xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded')
  }
  xhr.send(_default.data)
}
