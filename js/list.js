const paginationBox=document.querySelector('.pagi');
const cateBox=document.querySelector('.filter>.cate>ul')
const waresBox=document.querySelector('.wares>ul')
const promoteBox=document.querySelector('.filter>.promote>ul')
const sortBox=document.querySelector('.filter>.sort>ul')
const loadingBox=document.querySelector('.loading')
let listInfo={
    current:1,
    pageSize:12,
    cateName:'个护健康',
    isPromote:2,  // 0 no, 1 yes, 2 all
    sortType:0,  // 0 colligate, 1 price, 2 sales
    sort: 'asc'
};

(function (window){
    renderCatelist()
    function renderCatelist(){
        const xhr=new XMLHttpRequest()
        xhr.open('GET','server/cateList.php')
        xhr.onload=function(){
            const result=JSON.parse(this.responseText)
            const {code,list}=result
            console.log(result)
            if(code !== 0) return
            bindCateList(list)
        }
        xhr.send()
    }
    bindEvent()
})(window)

function bindEvent(){
    cateBox.addEventListener('click',e=>{
        if(e.target.nodeName==='LI'){
            const cateName=e.target.dataset.catename
            listInfo.cateName=cateName
            listInfo.current=1
            getGross(listInfo.cateName,listInfo.isPromote)
            // Array.from(cateBox.children).forEach(value=>{
            //     value.className=''
            // })
            ;[...cateBox.children].forEach(value=>value.classList.remove('active'))
            e.target.className='active'
        }
    })
    
    promoteBox.addEventListener('click',e=>{
        if(e.target.nodeName === 'LI'){
            const promote=e.target.dataset.promote-0
            listInfo.isPromote=promote
            listInfo.current=1
            getGross(listInfo.cateName,listInfo.isPromote)
            console.log(listInfo)
            ;[...promoteBox.children].forEach(value=>{
                value.classList.remove('active')
            })
            e.target.classList.add('active')
        }
    })

    sortBox.addEventListener('click',e=>{
        if(e.target.nodeName==='LI'){
            const sort=e.target.dataset.sort
            const sortType=e.target.dataset.sorttype
            e.target.dataset.sort=sort==='ASC' ? 'DESC' : 'ASC'
            console.log('本次排序方式: ',sort)
            listInfo.sort=sort
            listInfo.sortType=sortType
            listInfo.current=1
            console.log('sortBox: ',listInfo)
            // getGoodsList()
            getGross(listInfo.cateName,listInfo.isPromote)
            ;[...sortBox.children].forEach(value=>{
                value.classList.remove('active')
            })
            e.target.classList.add('active')
        }
    })
    
    waresBox.addEventListener('click',e=>{
        console.log(e.target)
    })
}

function bindCateList(list){
    var str=''
    list.forEach((value,index)=>{
        str+=`
            <li class="${index===0 && 'active'}" data-catename="${value.cat_name}">${value.cat_name}</li>
        `
        // if(index===0) listInfo.cateName=value.cat_name
    })
    cateBox.innerHTML=str
    getGross(listInfo.cateName,listInfo.isPromote)
}

function getGross(cateName,isPromote){
    const xhr=new XMLHttpRequest()
    url=`server/getGross.php?cateName=${cateName}&isPromote=${isPromote}`
    xhr.open('GET',url)
    xhr.onload=function(){
        const result=JSON.parse(this.responseText)
        const {code,gross}=result
        console.log('getGross',result,cateName,isPromote,gross)
        if(code!==0) return
        pagination(gross/1)
    }
    loadingBox.style.display="block"
    xhr.send()
}
function pagination(gross){
    console.log('pagination: ',gross)
    const div=document.createElement('div')
    div.className='pagination'
    paginationBox.appendChild(div)
    new Pagination('.pagi>.pagination',{
        current:listInfo.current,
        pagesize:listInfo.pageSize,
        total:gross,
        go:'jump',
        change(num){
            console.log('current Page: '+num+" gross: "+gross)
            listInfo.current=num
            getGoodsList()
        }
    })
}
function getGoodsList(){
    const xhr=new XMLHttpRequest()
    url='server/goodsList.php?'
    for(let key in listInfo){
        url+=`${key}=${listInfo[key]}&`
    }
    url=url.slice(0,-1)
    xhr.open('GET',url)
    xhr.onload=function(){
        const result=JSON.parse(this.responseText)
        console.log('getGoodsList: ',result)
        // console.log(typeof this.responseText,this.responseText)
        const {code,list}=result
        if(code !== 0) return
        bindGoods(list)
    }
    loadingBox.style.display="block"
    xhr.send()
}

function bindGoods(list){
    console.log('bindGoods: ',list)
    waresBox.innerHTML=template('waresTemp',{list}) 
    loadingBox.style.display="none"  
}