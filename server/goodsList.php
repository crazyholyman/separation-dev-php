<?php
    $current=$_GET['current']-0;
    $pageSize=$_GET['pageSize']-0;
    $cateName=$_GET['cateName'];
    $isPromote=$_GET['isPromote']-0;
    $sortType=$_GET['sortType']-0;
    $sort=$_GET['sort'];

    $sql="select * from goods where cat_name='$cateName'";

    if($isPromote===0){
        $sql=$sql . " and is_promote=$isPromote";
    }else if($isPromote===1){
        $sql=$sql . " and is_promote=$isPromote";
    }

    if($sortType===0){
        $sql=$sql . " order by goods_id $sort";
    }else if($sortType===1){
        $sql=$sql . " order by goods_price $sort";
    }else if($sortType===2){
        $sql=$sql . " order by goods_number $sort";
    }    

    $offset=($current-1)*$pageSize;
    $sql=$sql . " limit $pageSize offset $offset";

    $link=mysqli_connect('localhost','root','cruces','abate');
    $result=mysqli_query($link,$sql);
    $data=mysqli_fetch_all($result,MYSQLI_ASSOC);

    // $arr=array(
    //     $current,$pageSize,$cateName,$isPromote,$sortType,$sort,$offset
    // );

    $arr=array(
        "message"=>"获取商品列表成功",
        "code"=>0,
        "list"=>$data
    );
    echo json_encode($arr);

?>