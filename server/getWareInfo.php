<?php
    $goodId=$_GET['goodId'];

    $link=mysqli_connect('localhost','root','cruces','abate');
    $sql="select * from goods where goods_id=$goodId";
    $result=mysqli_query($link,$sql);
    $data=mysqli_fetch_all($result,MYSQLI_ASSOC);

    $arr=array(
        "message"=>"获取商品detail成功",
        "code"=>0,
        "info"=>$data[0]
    );

    echo json_encode($arr);
?>