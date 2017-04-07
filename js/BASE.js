/**
 * Created by 35943 on 2017/3/12.
 */

//前台调用：实例化Base类
var $ = function () {
    return new Base();
};


/*
 * Base类
 * 获取节点和标签属性的接口
 * */
function Base() {
    Base.prototype.elements = [];
}


/*
 * Base类原型的方法
 */

//获取ID节点
Base.prototype.getId = function (id) {
    this.elements.push(document.getElementById(id));
    return this;
};

//获取元素节点
Base.prototype.getTagName = function (tag) {
    //TagName获取的是一个标签数组
    var tags = document.getElementsByTagName(tag);
    for(var i=0; i<tags.length; i++) {
        this.elements.push(tags[i]);
    }
    return this;
};

//根据class属性值获取节点
Base.prototype.getClassName = function (tag_name, class_name){

    //TagName获取的是一个标签数组
    var tags = document.getElementsByTagName(tag_name);
    var tagAll = [];

    for(var i=0; i < tags.length; i++) {

        // .className获取标签的class属性
        //indexof()从头到尾地检索传入的标签的class属性字符串，看它是否含有子串className
        if(tags[i].className.indexOf(class_name) != -1) {
            tagAll[tagAll.length] = tags[i];
        }
    }

    return tagAll;
};

//根据name属性值获取节点
Base.prototype.getName = function (name) {
    this.elements.push(document.getElementsByName(name));
    return this;
};



//设置css样式
Base.prototype.css = function (attr, value) {

    for(var i=0; i<this.elements.length; i++) {
        if(arguments.length == 1) {             //如果没有传参数
            return this.elements[i].style[attr];
        }
        this.elements[i].style[attr] = value;
    }
    return this;
};

//设置 or 获取innerHTML内容
Base.prototype.inner_html = function (str) {

    for(var i=0; i<this.elements.length; i++) {
        if(arguments.length == 0) {             //如果没有传参数
            return this.elements[i].innerHTML;
        }
        this.elements[i].innerHTML = str;
    }
    return this;

};

//触发鼠标点击事件
Base.prototype.click = function (fn) {

    for(var i=0; i<this.elements.length; i++) {
        this.elements[i].onclick = fn;
    }
    return this;
};

//触发鼠标滑动事件
Base.prototype.mousehover = function (over, out) {

    for(var i=0; i<this.elements.length; i++) {
        this.elements[i].onmouseover = over;
        this.elements[i].onmouseout = out;
    }
    return this;
};

// set block show
Base.prototype.show = function () {

    for(var i=0;i<this.elements.length; i++) {
        this.elements[i].style.display = 'block';
    }
};
// set block hide
Base.prototype.hide = function () {

    for(var i=0;i<this.elements.length; i++) {
        this.elements[i].style.display = 'none';
    }
};








