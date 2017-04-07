/**
 * Created by 35943 on 2017/3/20.
 */

/*获取非中文字符的个数*/
function getMsgLen(str) {
    //用xx替换单字节字符，
    return str.replace( /[^\x00-\xff]/g , "xx").length;
}

/*寻找字符串中与目标字符相同的字符个数*/
function findStr(str, target) {
    var tmp = 0;
    for(var i=0; i<str.length; i++) {
        if(str.charAt(i) == target) {
            tmp++;
        }
    }

    return tmp;
}


/*产生验证码*/
function createCode() {

    codeGet='';
    var codeLen = 4;
    var code = document.getElementById('code');
    //随机数
    var randomNum = new Array(0,1,2,3,4,5,6,7,8,9,'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z');
    for(var i=0; i<codeLen; i++) {
        var index = Math.floor(Math.random()*36);
        codeGet += randomNum[index];
    }
    code.value = codeGet;
}

function validate() {

    var validateCode = document.getElementById('validateCode');
    var valErrMsg = document.getElementById('valErrMsg');
    var inputCode = validateCode.value.toUpperCase();
    if(inputCode.length<=0) {
        valErrMsg.innerHTML = '请输入验证码！';
    }
    else if(inputCode != codeGet) {
        valErrMsg.innerHTML = '输入错误，请重新输入！';
        createCode();   //刷新验证码
        validateCode.value = '';    //清空文本框
    }
    else {
        alert('ok!');
    }

}




window.onload = function () {
    var userID = document.getElementById('userID');
    var userErrMsg = document.getElementById('userErrMsg');
    var msgSymbNum = document.getElementById('msgSymbNum');

    var password = document.getElementById('password');
    var pwdErrMsg = document.getElementById('pwdErrMsg');
    var pwdSafety = document.getElementsByTagName('li');

    var passwordCheck = document.getElementById('passwordCheck');
    var pwdCheckErrMsg = document.getElementById('pwdCheckErrMsg');

    var validateCode = document.getElementById('validateCode');
    var code = document.getElementById('code');
    var msgLen = 0;
    var codeGet;

    /*************** 用户名部分 BEGIN ********************/

    //光标移入时显示提示/错误信息
    userID.onfocus = function() {
        userErrMsg.innerHTML = '5~20个字符，数字、字母、下划线';
        userErrMsg.style.display = 'inline-block';
    };

    //键入过程中判断
    userID.onkeyup = function() {
        msgSymbNum.style.visibility = 'visible';
        msgLen = getMsgLen(this.value);
        msgSymbNum.innerHTML = msgLen + '个字符';
        if(msgLen===0) {
            msgSymbNum.style.visibility = 'hidden';
        }
    };

    //光标移开时判断
    userID.onblur = function() {
        //非法字符
        var regUserID = /[^\w\u4e00-\u9fa5]/g ; // unicode : \u4e00-\u9fa5，表示汉字
        if( regUserID.test(this.value)) {
            userErrMsg.innerHTML = '含有非法字符';
        }

        //空
        else if(this.value == '') {
            userErrMsg.innerHTML = '不能为空！';
        }

        //长度超范围
        else if(msgLen<5 || msgLen>20) {
            userErrMsg.innerHTML = '长度必须在5~20之间！';
        }

        else {
            userErrMsg.style.color = 'green';
            userErrMsg.innerHTML = 'ok!';
            msgSymbNum.style.visibility = 'hidden';
        }
    };


    /******************** 密码部分 BEGIN *************************/

    //光标移入时显示提示/错误信息
    password.onfocus = function() {
        pwdErrMsg.innerHTML = '6~16个字符，字母、数字、下划线的组合，' +
            '<a href="http://jingyan.baidu.com/article/0320e2c1d26f111b87507b86.html">密码设置技巧</a>';
        pwdErrMsg.style.display = 'inline-block';
    };

    //键入过程中判断
    password.onkeyup = function() {
        /*密码强度设定:弱<6,6~11中,12~16强*/
        if(this.value.length>0 && this.value.length<6) {
            pwdSafety[0].style.backgroundColor = '#ffe003';
            pwdSafety[1].style.backgroundColor = 'darkgrey';
            pwdSafety[2].style.backgroundColor = 'darkgrey';
            passwordCheck.setAttribute('disabled','');
        }
        //中
        if(this.value.length>=6 && this.value.length<=11) {
            pwdSafety[1].style.backgroundColor = 'orange';
            pwdSafety[2].style.backgroundColor = 'darkgrey';
            passwordCheck.removeAttribute('disabled');
         }
        if(this.value.length>11 && this.value.length<=16) {
            pwdSafety[2].style.backgroundColor = 'red';
        }

    };

    password.onblur = function() {
        var num = findStr(password.value, password.value[0]);
        var regDigit = /[^\d]/g;                         //全是数字
        var regLetter = /[^a-zA-Z]/g;                    //全是字母

        if(this.value.length === 0) {
            pwdErrMsg.innerHTML = '密码不能为空！';
        }

        else if(this.value.length<6 || this.value.length>16) {
            pwdErrMsg.innerHTML = '密码长度必须在6~16之间！';
        }

        else if(num == this.value.length) {
            pwdErrMsg.innerHTML = '不能全使用相同字符！';
        }

        else if(!(regDigit.test(this.value))) {
            pwdErrMsg.innerHTML = '不能全是数字！';
        }

        else if(!(regLetter.test(this.value))) {
            pwdErrMsg.innerHTML = '不能全是字母！';
        }

        else {
            pwdErrMsg.innerHTML = 'ok!';
            pwdErrMsg.style.color = 'green';

        }
    };

    /***************** 密码验证部分 BEGIN *************************/

    passwordCheck.onblur = function() {
        if(this.value != password.value) {
            pwdCheckErrMsg.innerHTML = '两次输入不一致，请重新输入！';
        }
        else {
            pwdCheckErrMsg.innerHTML = 'ok!';
            pwdCheckErrMsg.style.color = 'green';
        }
    };


    /******************** 验证码部分 BEGIN ***********************/

    createCode();
    validateCode.onfocus = function() {
        code.style.visibility = 'visible';
    };
    validateCode.onblur = function() {
        validate();
    };



};