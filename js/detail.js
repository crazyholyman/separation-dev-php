(function(window){
    // let str=window.location.search.substr(1)
    let str=window.location.search.substring(1)
    let obj={}
    str.split("&").forEach(value=>{
        const array=value.split('=')
        obj[array[0]]=array[1] 
    })
    if(!obj.goodId) return window.location.href='list.html'

    getWareInfo()
    function getWareInfo(){
        const xhr=new XMLHttpRequest()
        url='server/getWareInfo.php?'+window.location.search.slice(1)
        xhr.open('GET',url)
        xhr.onload=function(){
            const result=JSON.parse(this.responseText)
            console.log(result)
            const {code,info}=result
            if(code!==0) return
            bindHTML(info)
        }
        xhr.send()
    }

    function bindHTML(info){
        const img=document.querySelector('.goodsInfo img')
        const description=document.querySelector('.goodsInfo .description')
        const price=document.querySelector('.goodsInfo .price')
        const infor=document.querySelector('.infor')
        img.src=info.goods_big_logo
        description.innerHTML=info.goods_name
        price.innerHTML=info.goods_price
        infor.innerHTML=info.goods_introduce
        console.log(img)
    }
})(window)