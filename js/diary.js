/**
 * Created by 35943 on 2017/4/5.
 */
/*监测年份的变化*/

function createDiary() {

    /*监听年份变化事件*/
    $('#timeBar_year').change(function () {
        var $timeBar_year = $(this).val();

        /*监听月份点击事件*/
        $('#timeBar').find('a').click(function (e) {
            var $timeBar_month = e.target.textContent;

            //月份格式转换
            switch ($timeBar_month) {
                case 'Jan.':
                    $timeBar_month = '01';
                    break;
                case 'Feb.':
                    $timeBar_month = '02';
                    break;
                case 'Mar.':
                    $timeBar_month = '03';
                    break;
                case 'Apr.':
                    $timeBar_month = '04';
                    break;
                case 'May.':
                    $timeBar_month = '05';
                    break;
                case 'Jun.':
                    $timeBar_month = '06';
                    break;
                case 'Jul.':
                    $timeBar_month = '07';
                    break;
                case 'Aug.':
                    $timeBar_month = '08';
                    break;
                case 'Sep.':
                    $timeBar_month = '09';
                    break;
                case 'Oct.':
                    $timeBar_month = '10';
                    break;
                case 'Nov.':
                    $timeBar_month = '11';
                    break;
                case 'Dec.':
                    $timeBar_month = '12';
                    break;
                default:
                    break;
            }

            //组装传递给后台的数据
            var timeBar_date = $timeBar_year+'-'+$timeBar_month;



            //ajax请求
            $.ajax({
                url: "../php/diaryRequest.php",
                type: "GET",
                dataType: "html",   //返回的数据类型
                data:{"test":timeBar_date},
                complete: function (data) {
                    //写成功后更新页面的操作
                    var response_text = data.responseText;
                    if(response_text!='false') {
                        var diary_msg = $.parseJSON(response_text);
                        var diary_msg_num = diary_msg.length;


                        /*create DOM*/

                        //diary-box part
                        for(var i=0; i<diary_msg_num/2; i++) {
                            $('.contentwrap-left>ul').append('<li class="li-left"></li>');
                        }
                        for(var j=i; j<diary_msg_num; j++) {
                            $('.contentwrap-right>ul').append('<li class="li-right"></li>');
                        }
                        $('li.li-left').append('<div class="diary_item"></div>')
                                       .append('<div class="time-axle-icon-l"></div>');
                        $('li.li-right').append('<div class="diary_item"></div>')
                                        .append('<div class="time-axle-icon-r"></div>');

                        $('.diary_item').append('<div class="cont-time"></div>')
                                        .append('<div class="cont-title"></div>')
                                        .append('<div class="cont-body"></div>')
                                        .append('<div class="feedback"></div>');
                        $('li.li-left .diary_item').append('<div class="contentItem-icon-left"></div>');
                        $('li.li-right .diary_item').append('<div class="contentItem-icon-right"></div>');
                        $('.cont-title').append('<h3></h3>');
                        $('.feedback').append('<div class="like_num"><img src="../images/like_icon.png"><span></span></div>')
                                      .append('<div class="comment_num"><img src="../images/comment_icon.png"><span></span></div>');

                        //time-axle part
                        for(i=0; i<diary_msg_num; i++) {
                            if(i%2==0) {
                                $('.time-axle>ul').append('<li><div class="time-axle-msgR"></div></li>');
                            }
                            if(i%2==1) {
                                $('.time-axle>ul').append('<li><div class="time-axle-msgL"></div></li>');
                            }
                        }




                        /* add diary_date into cont-time */
                        var index= 0;
                        $("li.li-left  div.cont-time").each(function () {
                            $(this).text(diary_msg[index]['diary_date']);
                            index = index+2;
                        });
                        index=1;
                        $("li.li-right  div.cont-time").each(function () {
                            $(this).text(diary_msg[index]['diary_date']);
                            index = index+2;
                        });

                        /* add cont_title */
                        index= 0;
                        $("li.li-left  div.cont-title").each(function () {
                            $(this).text(diary_msg[index]['cont_title']);
                            index = index+2;
                        });
                        index=1;
                        $("li.li-right  div.cont-title").each(function () {
                            $(this).text(diary_msg[index]['cont_title']);
                            index = index+2;
                        });

                        /* add cont_body */
                        index= 0;
                        $("li.li-left  div.cont-body").each(function () {
                            $(this).text(diary_msg[index]['cont_body']);
                            index = index+2;
                        });
                        index=1;
                        $("li.li-right  div.cont-body").each(function () {
                            $(this).text(diary_msg[index]['cont_body']);
                            index = index+2;
                        });

                        /* add like_num*/
                        index= 0;
                        $("li.li-left  .like_num>span").each(function () {
                            $(this).text(diary_msg[index]['like_num']);
                            index = index+2;
                        });
                        index=1;
                        $("li.li-right .like_num>span").each(function () {
                            $(this).text(diary_msg[index]['like_num']);
                            index = index+2;
                        });

                        /* add comment_num*/
                        index= 0;
                        $("li.li-left .comment_num>span").each(function () {
                            $(this).text(diary_msg[index]['comment_num']);
                            index = index+2;
                        });
                        index=1;
                        $("li.li-right .comment_num>span").each(function () {
                            $(this).text(diary_msg[index]['comment_num']);
                            index = index+2;
                        });

                        /* add time-axle msg */
                        index= 0;
                        $(".time-axle-msgR").each(function () {
                            var msg = diary_msg[index]['diary_date'].substr(5,6);
                            $(this).text(msg);
                            index = index+2;
                        });
                        index=1;
                        $(".time-axle-msgL").each(function () {
                            var msg = diary_msg[index]['diary_date'].substr(5,6);
                            $(this).text(msg);
                            index = index+2;
                        });

                        /*监听时间轴按钮点击事件
                         * 效果：展开或收缩日志面板
                         **/
                        $('.time-axle-icon-l').click(function() {
                            $(this).prev().slideToggle('slow');
                        });
                        $('.time-axle-icon-r').click(function() {
                            $(this).prev().slideToggle('slow');
                        });




                    }
                    else {
                        alert('数据库查询失败：指定日期内无记录！');
                    }


                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    alert('ajax连接失败！\n'
                        +'XMLHttpRequest:'+XMLHttpRequest.status+'\n'
                        +'XMLHttpRequest:'+XMLHttpRequest.readyState+'\n'
                        +'textStatus:'+textStatus);
                }
            });
        });
    });



}

createDiary();
