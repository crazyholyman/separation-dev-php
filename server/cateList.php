<?php
    $link=mysqli_connect('localhost','root','cruces','abate');
    $sql="select cat_name,goods_id from goods group by cat_name";
    $result=mysqli_query($link,$sql);
    $data=mysqli_fetch_all($result,MYSQLI_ASSOC);

    $arr=array(
        "message"=>"fetch tabulation success",
        "code"=>0,
        "list"=>$data
    );
    echo json_encode($arr);
?>