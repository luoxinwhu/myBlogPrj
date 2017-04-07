<?php
/**
 * Created by PhpStorm.
 * User: 35943
 * Date: 2017/4/4
 * Time: 13:07
 */
//设置编码
header('Content-type: text/json; charset=utf8');

//创建连接
$host = '127.0.0.1';
$username = 'root';
$password = 'luoxin742052';
$database = 'diary';
$con = mysqli_connect($host,$username,$password,$database);
//检测连接
if(!$con) {
    die('connect failed:'.mysqli_error($con));
}

//ajax请求信息处理
$timeBar_date = $_GET["test"];

//获取数据
$sql = "SELECT * FROM mydiary WHERE diary_date LIKE '$timeBar_date%'";
$query = mysqli_query($con, $sql);

//返回结果
if($row = mysqli_fetch_assoc($query)) {
    $dataList[] = $row;
    while($row = mysqli_fetch_assoc($query)) {
        $dataList[] = $row; //将取得的所有数据，一行、两行或多行，赋值给data数组
    }
    echo json_encode($dataList);
    /*将$dataList数组转换成JSON数组，echo就是php返回给前台的值，传递给ajax的success：function(data){}中的参数data，
    data[0]就是$dataList[0]，就是第一次循环取得的第一行记录*/
}
else {
    echo 'false';
}

//断开数据库连接
mysqli_close($con);

?>