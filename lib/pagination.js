/*
  1. 根据传递的参数设置一系列默认值
    => first 显示的文字
    => 根据多少条数据和一页显示多少条计算多少页
    => 不管用户是不是传递, 你得有一套默认值
    => 用户传递的数据和默认值配套
  2. 渲染结构
    => this.ele 里面要添加 div * 6
      -> 我需要创建 6 个 div
      -> 每个 div 的类名不一样, 文本内容不一样, 样式也不太一样
    => 我们准备两个方法
      -> 一个是专门创建元素的方法
      -> 一个是专门添加样式的方法
    => 使用我们准备的两个方法创建标签
      -> 创建 list 的时候, 需要向 list 里面添加一些内容
    => 向 list 里面添加一些内容
      -> 需要根据 default.current
      -> 需要根据 default.totalPage
      -> 最后在解决这个问题, 先按照默认的 9 页来渲染

  3. 设置大盒子的样式
    => this.ele 设置一些样式

  4. 切换各种页
    => 都是点击事件
    => DOM 结构都是渲染的
    => 事件委托, this.ele
    => 判断你点击的是哪一个按钮
      -> 改掉 current
      -> 渲染一遍 DOM 结构
    => 可以加一个回车事件
      -> 和 go 按钮的事件一摸一样

  5. 准备一个回调函数
    => 每次你改变当前页的时候, 我需要做一些事情
    => 把你要做的事情放在一个函数里面传递进来
    => 我每次改变的时候帮你触发一下
    => 因为每一次改变 current 都会执行以下 this.renderHtml()
      -> 就在 renderHtml 里面去调用回调函数

  6. 把结构从新调整一下
    6-1. init 里面计算一下 totalPage
*/


class Pagination {
  constructor (ele, options = {}) {
    this.ele = document.querySelector(ele)

    // 1. 设置一套默认值出来
    this.default = {
      current: options.current || 1, // 当前是第几页
      total: options.total || 90, // 一共多少条数据
      totalpage: 9, // 多少页, 我去计算
      pagesize: options.pagesize || 10, // 一页显示多少条
      first: options.first || 'first', // 默认首页文本
      prev: options.prev || 'prev', // 默认上一页文本
      next: options.next || 'next', // 默认下一页文本
      last: options.last || 'last', // 默认尾页文本
      go: options.go || 'go', // 默认跳转按钮文本
      change: options.change || (() => {}), // 用户传递进来的函数, 想在 current 改变的时候触发
    }

    // 单独提取一套按钮样式
    this.btnCss = {
      float: 'left',
      padding: '5px',
      margin: '5px',
      border: '1px solid #333',
      cursor: 'pointer'
    }

    this.init()
  }

  init () {
    // 6-1. 计算总页数
    this.default.totalpage = Math.ceil(this.default.total / this.default.pagesize)
    this.renderHtml()
    this.setBoxStyle()
    this.bindEvent()
  }

  // 2. 渲染 DOM 结构
  renderHtml () {
    const { first, prev, next, last, current } = this.default
    // 因为要渲染很多的结构进去
    // 准备一个 "筐"
    const frg = document.createDocumentFragment()

    // 1. 创建一个首页标签
    frg.appendChild(setCss(creEle('div', 'first', first), this.btnCss))
    frg.appendChild(setCss(creEle('div', 'prev', prev), this.btnCss))

    // list 单独接收一个变量
    const list = setCss(creEle('div', 'list', ''), { margin: 0, padding: 0, float: 'left' })
    list.appendChild(this.creItem())
    frg.appendChild(list)
    frg.appendChild(setCss(creEle('div', 'next', next), this.btnCss))
    frg.appendChild(setCss(creEle('div', 'last', last), this.btnCss))

    // jump 单独接收一个变量
    const jump = setCss(creEle('div', 'jump', ''), { margin: 0, padding: 0, float: 'left' })
    jump.appendChild(this.creJump())
    frg.appendChild(jump)

    // 最后一次性放到 this.ele
    this.ele.innerHTML = ''
    this.ele.appendChild(frg)

    // 调用用户传递进来的函数
    this.default.change(current)
  }

  // 2-2. 创建 item 标签页的方法
  creItem () {
    const { current, totalpage } = this.default

    // 创建一个筐
    const frg = document.createDocumentFragment()

    // 当总页数 <= 9 的时候, 不管多少个直接渲染
    if (totalpage <= 9) {
      for (let i = 1; i <= totalpage; i++) {
        const p = setCss(creEle('p', 'item', i), this.btnCss)
        p.dataset.index = i
        if (i === current) setCss(p, { backgroundColor: 'orange' })
        frg.appendChild(p)
      }

      return frg
    }

    // 准备一个 ...
    const point = document.createElement('p')
    point.innerHTML = '···'
    setCss(point, {
      padding: '5px',
      margin: '5px',
      float: 'left'
    })

    // 当总页数 > 9 的时候了
    // 当 current < 5 的时候, 1 2 3 4 5 ... 99 100
    if (current < 5) {
      for (let i = 1; i <= 5; i++) {
        const p = setCss(creEle('p', 'item', i), this.btnCss)
        p.dataset.index = i
        if (i === current) setCss(p, { backgroundColor: 'orange' })
        frg.appendChild(p)
      }

      // 加一个 ...
      frg.appendChild(point.cloneNode(true))

      for (let i = totalpage - 1; i <= totalpage; i++) {
        const p = setCss(creEle('p', 'item', i), this.btnCss)
        p.dataset.index = i
        frg.appendChild(p)
      }

      return frg
    }

    // 当 current == 5 的时候, 1 2 3 4 5 6 7 ... 99 100
    if (current === 5) {
      for (let i = 1; i <= 7; i++) {
        const p = setCss(creEle('p', 'item', i), this.btnCss)
        p.dataset.index = i
        if (i === current) setCss(p, { backgroundColor: 'orange' })
        frg.appendChild(p)
      }

      // 加一个 ...
      frg.appendChild(point.cloneNode(true))

      for (let i = totalpage - 1; i <= totalpage; i++) {
        const p = setCss(creEle('p', 'item', i), this.btnCss)
        p.dataset.index = i
        frg.appendChild(p)
      }

      return frg
    }

    // 当 current > 5 && current < 到数第五个 的时候, 1 2 ... 5 6 current 8 9 ... 99 100
    if (current > 5 && current < totalpage - 4) {
      for (let i = 1; i <= 2; i++) {
        const p = setCss(creEle('p', 'item', i), this.btnCss)
        p.dataset.index = i
        frg.appendChild(p)
      }

      // 加一个 ...
      frg.appendChild(point.cloneNode(true))

      // 放中间五个
      for (let i = current - 2; i <= current + 2; i++) {
        const p = setCss(creEle('p', 'item', i), this.btnCss)
        p.dataset.index = i
        if (i === current) setCss(p, { backgroundColor: 'orange' })
        frg.appendChild(p)
      }

      frg.appendChild(point.cloneNode(true))

      for (let i = totalpage - 1; i <= totalpage; i++) {
        const p = setCss(creEle('p', 'item', i), this.btnCss)
        p.dataset.index = i
        frg.appendChild(p)
      }

      return frg
    }

    // 当 current == 到数第五个 的时候, 1 2 ... 94 95 current 97 98 99 100
    if (current === totalpage - 4) {
      for (let i = 1; i <= 2; i++) {
        const p = setCss(creEle('p', 'item', i), this.btnCss)
        p.dataset.index = i
        frg.appendChild(p)
      }

      // 加一个 ...
      frg.appendChild(point.cloneNode(true))

      for (let i = totalpage - 6; i <= totalpage; i++) {
        const p = setCss(creEle('p', 'item', i), this.btnCss)
        p.dataset.index = i
        if (i === current) setCss(p, { backgroundColor: 'orange' })
        frg.appendChild(p)
      }

      return frg
    }

    // 当 current > 到数第五个 的时候, 1 2 ... current 97 98 99 100
    if (current > totalpage - 4) {
      for (let i = 1; i <= 2; i++) {
        const p = setCss(creEle('p', 'item', i), this.btnCss)
        p.dataset.index = i
        frg.appendChild(p)
      }

      // 加一个 ...
      frg.appendChild(point.cloneNode(true))

      for (let i = totalpage - 4; i <= totalpage; i++) {
        const p = setCss(creEle('p', 'item', i), this.btnCss)
        p.dataset.index = i
        if (i === current) setCss(p, { backgroundColor: 'orange' })
        frg.appendChild(p)
      }

      return frg
    }
  }

  // 2-3. 创建 jump 跳转结构
  creJump () {
    const { go, current } = this.default

    const frg = document.createDocumentFragment()

    // 创建一个 input 标签
    const inp = document.createElement('input')
    inp.value = current
    setCss(inp, {
      height: '28px',
      width: '30px',
      float: 'left',
      outline: 'none',
      margin: '5px',
    })
    frg.appendChild(inp)

    // 创建一个 button 标签
    const btn = document.createElement('button')
    btn.className = 'go'
    btn.innerHTML = go
    setCss(btn, {
      height: '30px',
      width: '30px',
      float: 'left',
      outline: 'none',
      margin: '5px',
      cursor: 'pointer'
    })
    frg.appendChild(btn)


    return frg
  }

  // 3. 设置大盒子样式
  setBoxStyle () {
    setCss(this.ele, {
      height: '50px',
      padding: '10px 30px 0',
      // 居中显示, 我们直接给定位
      position: 'absolute'
    })
  }

  // 4. 绑定事件 - 事件委托
  bindEvent () {
    this.ele.addEventListener('click', e => {
      e = e || window.event
      const target = e.target || e.srcElement

      // 解构赋值
      const { current, totalpage } = this.default
      // this.default.current 是一个基本数据类型
      // 基本数据类型的赋值, 赋值过后两个变量没有关系
      // 你修改 current, this.default.cureent 不会改变
      // let current = this.default.current

      // 判断下一页, 并且是在最后一页之前
      if (target.className === 'next' && current < totalpage) {
        this.default.current++
        this.renderHtml()
      }

      // 判断上一页, 并且是在第一页之后
      if (target.className === 'prev' && current > 1) {
        this.default.current--
        this.renderHtml()
      }

      // 判断最后一页, 并且在最后一页之前
      if (target.className === 'last' && current < totalpage) {
        this.default.current = totalpage
        this.renderHtml()
      }

      // 判断是第一页, 并且是在第一页之后
      if (target.className === 'first' && current > 1) {
        this.default.current = 1
        this.renderHtml()
      }

      // 判断是某一页
      if (target.className === 'item') {
        const index = target.dataset.index - 0
        if (index === current) return
        this.default.current = index
        this.renderHtml()
      }

      // 判断是跳转按钮
      if (target.className === 'go') {
        // 我要拿到前面 input 文本框里面的文本
        let index = target.previousElementSibling.value - 0
        if (index <= 1) index = 1
        if (index >= totalpage) index = totalpage
        if (index === current) return
        this.default.current = index
        this.renderHtml()
      }
    })
  }
}


// 额外的两个方法

// 创建 DOM 结构
// 什么标签?
// 什么类名?
// 什么文本内容?
function creEle(nodeName, className, text) {
  const ele = document.createElement(nodeName)
  ele.className = className

  // 最好使用 innerHTML
  ele.innerHTML = text

  return ele
}

// 添加 css 样式
// 给谁添加?
// 添加什么样式
function setCss(ele, styles) {
  for (let key in styles) {
    ele.style[key] = styles[key]
  }
  // 上面的 for 循环, 是在 ele 添加样式
  // ele 就是要添加样式的元素
  return ele
}
