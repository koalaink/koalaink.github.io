(function($){

    var Puzzle, privateMethod;

    Puzzle = (function(){

        function Puzzle(element, options){

            var that = this;

            that.el = $(element);

            that.btn = $("#start");

            this.progressBar = $("#progressBar");

            this.remainTime = $("#remainTime");

            that.options = $.extend({}, $.fn.puzzle.defaults, options);

            that.init();

        }

        /* 交换数组下标 i 与 j 的值 */
        Array.prototype.swap = function(i,j){
            var tmp = this[i];
            this[i] = this[j];
            this[j] = tmp;
            return this;
        };

        Array.prototype.indexOf = function(val){
            var i,l=this.length;
            for(i=0;i<l;++i) if(this[i] === val) return i;
                return -1;
        }

        Puzzle.prototype = {
            init : function(){

                var that = this,
                    side = that.el.width(),
                    i,j,curIndex,pos;

                that.offset = that.el.offset();

                /* 图块边距 */
                that.blockMargin = side*.01;

                /* 图块宽高 */
                that.blockWidth = (side-that.blockMargin*(that.options.col-1))/that.options.col;
                that.blockHeight = (side-that.blockMargin*(that.options.row-1))/that.options.row;

                that.pos = [];      //  图块坐标
                that.order = [];    //  图块顺序
                that.block = [];    //  图块

                /* 图块总数 */
                that.num = that.options.row * that.options.col;

                /* 初始化图块信息 */
                for(i=0;i<that.options.row;++i){
                    for(j=0;j<that.options.col;++j){
                        curIndex = i*that.options.col+j;

                        that.pos[curIndex] = { 
                            x : j*(that.blockWidth+that.blockMargin),
                            y : i*(that.blockHeight+that.blockMargin)
                        };

                        that.block.push($("<div>"));
                        that.block[curIndex].css({width: that.blockWidth, height: that.blockHeight, "background-size": side+"px,"+side+"px", "background-position-x": -that.pos[curIndex].x, "background-position-y": -that.pos[curIndex].y}).addClass("img-block");
                        that.el.append(that.block[curIndex]);

                        that.order[curIndex] = curIndex;

                    }
                }

                /* 定位图块 */
                that.locate();

                this.playtime = 0;
                that.refreshTime();

                this.playing = false;

                that.remainNum = $("#remainingNumber");

                var phoD = $("#phoDialogue");

                $("#pho-submit").on("click tap",function(){
                    phoD.hide();
                });

                that.btn.on("click tap",function(){

                    if(that.playing) return;

                    var tmp = parseInt(that.remainNum.text());

                    if(isNaN(tmp) || tmp <= 0) return;

                    that.remainNum.text(tmp-1);

                    that.start();
                });

            },
            /* 窗体大小变化 */
            resize : function(){
                var that = this,
                    side = that.el.width(),
                    i,j,curIndex,pos;

                that.offset = that.el.offset();

                /* 图块边距 */
                that.blockMargin = side*.01;

                /* 图块宽高 */
                that.blockWidth = (side-that.blockMargin*(that.options.col-1))/that.options.col;
                that.blockHeight = (side-that.blockMargin*(that.options.row-1))/that.options.row;

                that.pos = [];      //  图块坐标

                /* 初始化图块信息 */
                for(i=0;i<that.options.row;++i){
                    for(j=0;j<that.options.col;++j){
                        curIndex = i*that.options.col+j;

                        that.pos[curIndex] = { 
                            x : j*(that.blockWidth+that.blockMargin),
                            y : i*(that.blockHeight+that.blockMargin)
                        };

                        that.block[curIndex].css({width: that.blockWidth, height: that.blockHeight, "background-size": side+"px,"+side+"px", "background-position-x": -that.pos[curIndex].x, "background-position-y": -that.pos[curIndex].y}).addClass("img-block");
                        that.el.append(that.block[curIndex]);

                    }
                }

                /* 定位图块 */
                that.locate();

            },
            /* 根据 that.order 数组中的序列对各图块进行定位 */
            locate : function(){

                var that = this,
                    i,j,curIndex;
                for(i=0;i<that.options.row;++i) for(j=0;j<that.options.col;++j){
                        curIndex = i*that.options.col+j;
                        that.block[that.order[curIndex]].css({top: that.pos[curIndex].y, left: that.pos[curIndex].x});
                }

            },
            /* 开始游戏 */
            start : function(){

                if(this.playing) return;

                this.playing = true;

                this.playtime = 0;

                for(var i=0;i<this.num;++i){
                    this.dragBlock(this.block[i]);
                }

                this.order.sort(privateMethod.randomSort);

                this.locate();

                this.play();

            },
            refreshTime : function(){

                this.progressBar.css("width",(this.playtime/this.options.playtime)*100+"%");

                this.remainTime.text((this.options.playtime-this.playtime).toFixed(2)+"秒");

            },
            play : function(){
                var that = this;

                if(that.playtime >= that.options.playtime){

                    that.playtime = that.options.playtime;

                    clearTimeout(that.timer);

                    that.refreshTime();

                    for(var i=0;i<that.num;++i){
                        that.unDragBlock(that.block[i]);
                    }

                    setTimeout(function(){

                        that.alertInfo("高手太多</br>继续加油!");

                        that.playing = false;

                    },500);

                    return;
                }

                that.refreshTime();

                that.playtime += .01;

                that.timer = setTimeout(function(){

                    that.play();

                },10);

            },
            dragBlock : function(block){
                var that = this,
                    offset = block.offset();

                block.on("touchstart",function(event){

                    event.preventDefault();

                    var touch = event.touches[0],
                        disX = touch.pageX - block.offset().left,
                        disY = touch.pageY - block.offset().top;
                    block.css("z-index",2);

                    block.on("touchmove",function(event){

                        var touch = event.touches[0],
                            l = touch.pageX-that.offset.left-disX,
                            t = touch.pageY-that.offset.top-disY;

                        block.css({top: t, left: l});

                    });

                    block.on("touchend",function(event){

                        that.updateOrder(block.index());

                        block.off("touchmove");
                        block.off("touchend");

                    });

                });

            },
            unDragBlock : function(block){
                block.off("touchstart");
            },
            updateOrder : function(index){
                var that = this,
                    ox = that.block[index].offset().left+that.blockWidth/2,
                    oy = that.block[index].offset().top+that.blockHeight/2,
                    ex,ey,i,
                    to = -1;

                for(i=0;i<that.num;++i){
                    if(i === index) continue;
                    ex = that.block[i].offset().left;
                    ey = that.block[i].offset().top;
                    if(ox>ex&&ox<ex+that.blockWidth&&oy>ey&&oy<ey+that.blockHeight){
                        to = i;
                        break;
                    }
                }
                
                if(to === -1){
                    that.move(that.block[index],that.order.indexOf(index));
                }
                else {
                    ox = that.order.indexOf(index);
                    ex = that.order.indexOf(to);
                    that.block[to].css("z-index",1);
                    that.move(that.block[index],ex);
                    that.move(that.block[to],ox);
                    that.order.swap(ox,ex);

                    that.block[index].css("z-index",0);
                    that.block[to].css("z-index",0);

                    if(that.isSuccess()){

                        clearTimeout(that.timer);

                        for(i=0;i<that.num;++i){
                            that.unDragBlock(that.block[i]);
                        }

                        setTimeout(function(){

                            that.playing = false;

                            that.alertInfo("500M<br/>恭喜您中奖了!");

                        },500);

                    }
                }
            },
            move : function(obj, index){
                obj.css({top: this.pos[index].y, left: this.pos[index].x});
            },
            isSuccess : function(){
                var i;
                for(i=0;i<this.num;++i){
                    if(this.order[i] !== i)
                        return false;
                }
                return true;
            },
            alertInfo : function(info){
                $("#rstDialogue").show();
                $(".zp-flow").html(info);
                var tmp = parseInt(this.remainNum.text());

                if(isNaN(tmp) || tmp<=0){
                    $("#share-btn").text("分享活动").off("click tap").on("click tap",function(){
                        $(".share-guide").show();
                        $(".guide-img").show();
                    });
                }
                else{
                    $("#share-btn").text("再来一次").off("click tap").on("click tap",function(){
                        $("#rstDialogue").hide();
                    });
                }
            }
        };

        return Puzzle;

    })();

    privateMethod = {
        /* 在数组arr中查找第一个值为val的下标，未找到返回-1 */
        indexOf : function(arr, val){
            var l = arr.length,i;
            for(i=0;i<l;++i) if(arr[i]===val) return i;
            return -1;
        },
        /* 数组随机排序 */
        randomSort : function(){
            return 0.5 - Math.random();
        }
    };

    $.fn.puzzle = function(options){

        return this.each(function(){
            var that = $(this),
                instance = $.fn.puzzle.lookup[that.data("puzzle")];

            if(!instance){

                instance = new Puzzle(that, options);

                $.fn.puzzle.lookup[++$.fn.puzzle.lookup.i] = instance;

                that.data("puzzle", $.fn.puzzle.lookup.i)

            }

            if(typeof options === "string"){
                instance[options]();
            }

        });
    };

    $.fn.puzzle.lookup = {
        i : 0
    };

    $.fn.puzzle.defaults = {
        row : 3,        // 行数
        col : 3,        // 列数
        playtime : 20   // 单轮拼图时间 单位 s
    };
})(Zepto);