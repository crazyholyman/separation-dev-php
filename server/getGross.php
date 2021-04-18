<?php
    $_cateName=$_GET['cateName'];
    $_isPromote=$_GET['isPromote']-0;

    $sql="select count(*) count from goods where cat_name='$_cateName'";
    if($_isPromote===0){
        $sql=$sql . " and is_promote=$_isPromote";
    }else if($_isPromote===1){
        $sql=$sql . " and is_promote=$_isPromote";
    }

    $link=mysqli_connect('localhost','root','cruces','abate');
    $result=mysqli_query($link,$sql);
    $data=mysqli_fetch_all($result,MYSQLI_ASSOC);

    $arr=array(
        "message"=>"获取总数成功",
        "code"=>0,
        "sql"=>$sql,
        "gross"=>$data[0]['count']
    );
    echo json_encode($arr);
?>