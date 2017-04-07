/**
 * Created by 35943 on 2017/3/30.
 */

var scrollObj = document.getElementsByClassName('scrollBox')[1];


(function (win,doc,$) {
    function CusScrollBar(options) {
        this.init(options);
    }
    $.extend(CusScrollBar.prototype, {
        /*
         * 初始化滚动条
         * @method ini
         * @return {self}
         */
        init: function (options) {
            var self = this;
            self.options = {
                scrollDir       : 'y',              // scroll direction
                articleItemSelector : '',
                contentSelector : '',               // 文档内容选择器
                barSelector     : '',               // 滚动条选择器
                sliderSelector  : '',               // 滚动滑块选择器
                wheelStep       : 5,                // 滚轮步长
                tabItemSelector : '.tabItem',       // 标签选择器
                tabActiveClass  : 'tabActive',      // 选中标签的类名
                anchorSelector  : '.anchor',        // 锚点选择器，定位某一篇文章内容
                pageSelector    : '.scroll-ol',        // 页面选择器
                correctSelector : '.correct-bot'   // 矫正元素，修正文章长度<可视范围的情况
            };
            $.extend(true, self.options, options||{}); //深拷贝,传入参数替换
            self.initDomEvent();
            return self;
        },

        /*
         * 初始化DOM引用
         * @method initDomEvent
         * @return {CusScrollBar}
         * */
        initDomEvent: function () {
            var opts = this.options;
            //滚动内容区对象
            this.$content = $(opts.contentSelector);
            //滚动滑块对象
            this.$slider = $(opts.sliderSelector);
            //滚动条对象
            this.$bar = $(opts.barSelector) ? $(opts.barSelector) : opts.$slider.parent();
            //获取文档对象
            this.$doc = $(doc);
            //获取标签项
            this.$tabItem = $(opts.tabItemSelector);
            //获取锚点
            this.$anchor = $(opts.anchorSelector);
            //获取正文
            this.$article = $(opts.articleSelector);
            //校正元素对象
            this.$correct = $(opts.correctSelector);

            //初始化事件
            this.initSliderDragEvent()
                .initTabEvent()
                .bindContScroll()
                .bindMousewheel()
                .initArticleHeight();
        },

        /*
         * 初始化滑块拖动功能
         * @method initSliderDragEvent
         * @return {[Object]} [this]
         * */
        initSliderDragEvent: function () {
            var self = this;
            var slider = self.$slider;
            var sliderElem = slider[0];
            if(sliderElem) {
                var
                    dragStartPagePosition,      //文档开始拖动的位置
                    dragStartScrollPostion,     //滚动条开始拖动的位置
                    dragContentBarRate;         //文档和滚动条的滚动比率：滑块移动距离/滑块可移动距离 = 内容滚动高度/内容可滚动高度

                function mousemoveHandler(e) {
                    e.preventDefault();
                    console.log('mousemove');
                    if(dragStartPagePosition == null) { return; } //滑块未滚动
                    self.scrollTo( dragStartScrollPostion + (e.pageY-dragStartPagePosition)*dragContentBarRate );
                }
                function mouseupHandler(e) {
                    console.log('mouseup');
                    //解除滚动条的mousemove, mouseup事件
                    slider.off('mouseup').off('mousemove');
                }
                //绑定事件
                slider.on("mousedown", function (e) {
                    e.preventDefault(); //阻止默认行为
                    console.log('mousedown');
                    dragStartPagePosition = e.pageY;
                    dragStartScrollPostion = self.$content[0].scrollTop;
                    dragContentBarRate = self.getMaxScrollPosition() / self.getMaxSliderPosition();

                    //鼠标拖动的过程中移开到document范围内
                    slider.on('mousemove', mousemoveHandler).on('mouseup', mouseupHandler);
                });
            }

            return self;
        },

        /*
         * 初始化标签切换功能
         * @method initTabEvent
         * @return {[Object]} [this]
         */
        initTabEvent: function () {
            var self = this;
            self.$tabItem.on('click', function (e) {
                e.preventDefault();
                var index = $(this).index();
                self.changeTabSelect(index);

                // 让滑块滚动到的位置 = 已经滚出可视区的那部分内容的高度 + 指定锚点与内容容器的距离
                self.scrollTo(self.$content[0].scrollTop + self.getAchorPosition(index));
            });
            return self;
        },

        /*
        * 初始化文档高度
        * @method initArticleHeight
        * @return {[Object]} [this]
        * */
        initArticleHeight: function () {
            var self = this;
            var lastArticle = self.$article.last(); //选中最后一篇文章
            var lastArticleHeight = lastArticle.height();   //最后一篇文章的高度
            var contentHeight = self.$content.height();     //可视区高度

            //设置校正元素高度 = 可视区高度 - 文章高度 - 标题的总高度（包括padding，border的垂直高度）
            if(lastArticleHeight < contentHeight) {
                self.$correct[0].style.height =
                    contentHeight - lastArticleHeight - self.$anchor.outerHeight() + 'px';
            }
            return self;
        },


        /*
         * 监听内容的滚动，同步滑块的位置
         * @method bindContScroll
         * @return {[Object]} [this]
         * */
        bindContScroll: function () {
            var self = this;
            self.$content.on('scroll', function () {
                var sliderElem = self.$slider && self.$slider[0];
                if(sliderElem) { //若滑块元素存在，计算滑块位置
                    sliderElem.style.top = self.getSliderPosition() + 'px';
                }
            });
            return self;
        },

        /*
        * 滚轮事件
        * @method bindMousewheel
        * return {[Object]} [this]
        * */
        bindMousewheel: function () {
            var self = this;
            self.$content.on('mousewheel DOMmousewheel', function (e) {
                e.preventDefault();
                var oEvent = e.originalEvent;
                var wheelRange;
                if(oEvent.wheelDelta) {
                    wheelRange = - oEvent.wheelDelta/120;   //other browser,负数表示向下
                }
                else {
                    wheelRange = (oEvent.detail || 0)/3;    //firefox，正数表示向下
                }
                // 滚动内容的高度
                self.scrollTo(self.$content[0].scrollTop + wheelRange * self.options.wheelStep);
            });

            return self;
        },


        /* ---------  以上操作涉及的自定义方法  ------------ */

        /*
         * 内容最大可滚动的高度
         * @method getMaxScrollPosition
         * @return
         * */
        getMaxScrollPosition: function () {
            var self = this;
            // self.$content.height() 可视区高度, self.$content[0].scrollHeight文档内容的高度
            return Math.max(self.$content.height(), self.$content[0].scrollHeight) - self.$content.height();
        },
        /*
         * 滑块最大可滚动的高度
         * @method getMaxSliderPosition
         * @return
         * */
        getMaxSliderPosition: function () {
            var self = this;
            return self.$bar.height() - self.$slider.height();
        },
        /*
         * 计算滑块当前位置
         * @method getSliderPosition
         * @return slidePosition
         * */
        getSliderPosition: function () {
            var self = this;
            //滑块最大可移动距离
            var maxSliderPosition1 = self.getMaxSliderPosition();
            //滑块已经移动的距离 = 内容滚动高度 / 内容最大可滚动高度 * 滑块最大可移动距离
            var maxSliderPosition2 = self.$content[0].scrollTop / self.getMaxScrollPosition() * maxSliderPosition1;
            return Math.min(maxSliderPosition1, maxSliderPosition2);
        },
        /*
         * 滑动滑块
         * @method scrollTo
         * */
        scrollTo: function (positionVal) {
            var self = this;
            var posArr = self.getAllAnchorPosition();

            //设置可视区文档的位置
            self.$content.scrollTop(positionVal);

            //使滚动条位置与tab标签对应
            function getIndex(positionVal) {
                for(var i = posArr.length-1; i>=0; i--) {
                    if(positionVal >= posArr[i]) { return i; } // 返回选中标签的索引值
                    else { continue; }
                }
            }
            //锚点数与标签数相同，改变标签的选中状态
            if(posArr.length == self.$tabItem.length) {
                self.changeTabSelect(getIndex(positionVal));
            }
        },

        /*
         * 切换标签选中
         * @method changeTabSelect
         * @return
         */
        changeTabSelect: function (index) {
            var self = this;
            var active = self.options.tabActiveClass;

            //选中项添加active类名，兄弟元素去除active类名
            return self.$tabItem.eq(index).addClass(active).siblings().removeClass(active);
        },

        /*
        * 获取指定锚点到上边界的像素数
        * @method getAchorPosition
        * @return
        * */
        getAchorPosition: function (index) {
            var self = this;
            return self.$anchor.eq(index).position().top;
        },

        /*
        * 获取每个锚点位置信息的数组
        * @method getAllAnchorPosition
        * @return [allPosArr]
        * */
        getAllAnchorPosition: function () {
            var self = this;
            var allPosArr = []; //

            for(var i = 0; i < self.$anchor.length; i++) {
                allPosArr.push(self.$content[0].scrollTop + self.getAchorPosition(i));
            }
            return allPosArr;
        }
    });
    scrollObj.CusScrollBar = CusScrollBar;

})(window, document, jQuery);



//实例化
new scrollObj.CusScrollBar({
    contentSelector  : '.scrollContent',
    barSelector      : '.scrollBar',
    sliderSelector   : '.scrollSlider'
});


