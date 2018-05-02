(function($){

    var Sudoku, privateMethod;

    Sudoku = (function(){

        function Sudoku(element, options){

            var $this = this;

            $this.el = element;

            $this.options = $.extend({}, $.fn.sudoku.defaults, options);

            $this.init();
        }

        Sudoku.prototype = {
            init : function(){

                var $this = this;

                var cxt = $this.initElement();

                $this.render(cxt.face);

                $this.ready(cxt.rotation);

            },
            initElement : function(){

                var $this = this;

                $this.width = $this.el.width();
                $this.height = $this.el.height();

                $this.boxWidth = $this.width*290/1024;
                $this.boxHeight = $this.height*243/865;

                $this.boxBorderTop = $this.height*7/865;
                $this.boxBorderLeft = $this.width*9/1024;

                var ml = $this.width*61/1024,
                    mt = $this.height*50/865,
                    bm = $this.width/64, i,j;

                $this.boxs = [];

                for(i=0;i<3;++i){
                    for(j=0;j<3;++j){
                        $this.boxs.push({x: ml+j*($this.boxWidth+bm), y: mt+i*($this.boxHeight+bm)});
                    }
                }

                $this.controlBtn = $this.el.children(".controlBtn").css({top: $this.boxs[4].y, left: $this.boxs[4].x, width: $this.boxWidth, height: $this.boxHeight});

                return {
                    face : $this.el.children(".face").attr({width: $this.width, height: $this.height})[0].getContext("2d"),
                    rotation : $this.el.children(".rotation").attr({width: $this.width, height: $this.height})[0].getContext("2d")
                };

            },
            render : function(cxt){

                cxt.clearRect(0,0,this.width,this.height);

                var $this = this,
                    x, y, sw,
                    i, j, len;
                sw = $this.width*3/512;
                x = $this.width*39/1024 + sw;
                y = $this.height*33/865 + sw;

                cxt.save();
                cxt.beginPath();
                privateMethod.rect(cxt,sw,sw,$this.width-2*sw,$this.height-2*sw,false);
                privateMethod.rect(cxt,x,y,$this.width-2*x,$this.height-2*y,true);

                cxt.fillStyle = "#691c14";
                cxt.shadowBlur = $this.width*3/256;
                cxt.shadowColor = "#691c14";
                cxt.fill();
                cxt.restore();

                cxt.save();
                cxt.beginPath();
                privateMethod.rect(cxt,x,y,$this.width-2*x,$this.height-2*y,true);

                cxt.fillStyle = "#340808";
                cxt.fill();

                cxt.restore();

                x = $this.width*21/1024 + sw;
                y = $this.height*18/865 + sw;
                sw = $this.width*7/1024;

                var lights = [
                    {x: x, y: y, ax: ($this.width-2*x)/12, ay: 0, num: 12},
                    {x: $this.width-x, y: y, ax: 0, ay:($this.height-2*y)/11, num: 11},
                    {x: $this.width-x, y: $this.height-y, ax: -($this.width-2*x)/12, ay: 0, num: 12},
                    {x: x, y: $this.height-y, ax: 0, ay: -($this.height-2*y)/11, num: 11}
                ];

                cxt.shadowBlur = sw;
                cxt.shadowColor = "#fecb02";
                cxt.fillStyle = "#fecb02";
                for(i=0;i<lights.length;++i){
                    x = lights[i].x;
                    y = lights[i].y;
                    for(j=0;j<lights[i].num;++j){

                        cxt.save();

                        cxt.translate(x,y);

                        cxt.beginPath();
                        cxt.arc(0,0,sw,0,Math.PI*2);
                        cxt.closePath();

                        cxt.fill();

                        cxt.restore();

                        x += lights[i].ax;
                        y += lights[i].ay;
                    }
                }

                var linear1 = cxt.createLinearGradient(0,0,0,$this.boxHeight),
                    linear2 = cxt.createLinearGradient(0,0,0,$this.boxHeight),
                    linear3 = cxt.createLinearGradient(0,0,$this.boxWidth,$this.boxHeight);

                linear1.addColorStop(0,"#ffe484");
                linear1.addColorStop(1,"#ffeba1");

                linear2.addColorStop(0,"#fdd135");
                linear2.addColorStop(1,"#ffbf12");

                linear3.addColorStop(0,"#e92121");
                linear3.addColorStop(.076,"#e92121");

                linear3.addColorStop(.076,"#f03e3e");
                linear3.addColorStop(.152,"#f03e3e");

                linear3.addColorStop(.152,"#e92121");
                linear3.addColorStop(.228,"#e92121");

                linear3.addColorStop(.228,"#f03e3e");
                linear3.addColorStop(.304,"#f03e3e");

                linear3.addColorStop(.304,"#e92121");
                linear3.addColorStop(.38,"#e92121");

                linear3.addColorStop(.38,"#f03e3e");
                linear3.addColorStop(.456,"#f03e3e");

                linear3.addColorStop(.456,"#e92121");
                linear3.addColorStop(.532,"#e92121");

                linear3.addColorStop(.532,"#f03e3e");
                linear3.addColorStop(.608,"#f03e3e");

                linear3.addColorStop(.608,"#e92121");
                linear3.addColorStop(.684,"#e92121");

                linear3.addColorStop(.684,"#f03e3e");
                linear3.addColorStop(.76,"#f03e3e");

                linear3.addColorStop(.76,"#e92121");
                linear3.addColorStop(.836,"#e92121");

                linear3.addColorStop(.836,"#f03e3e");
                linear3.addColorStop(.912,"#f03e3e");

                linear3.addColorStop(.912,"#e92121");
                linear3.addColorStop(1,"#e92121");

                len = $this.options.items.length;

                cxt.shadowBlur = 0;

                cxt.font = $this.boxWidth*36/290+"px Helvetica";
                cxt.textBaseline = "top";
                cxt.textAlign = "center";

                x = $this.boxWidth/2;
                y = $this.boxHeight*165/243;

                var w = $this.boxWidth*104/290,
                    h = $this.boxHeight*128/243,
                    x1 = ($this.boxWidth-w)/ 2,
                    y1 = $this.boxHeight*30/243,
                    imgs = {
                        gift : document.getElementById("gift"),
                        smile : document.getElementById("smile")
                    };

                for(i=0;i<len;++i){
                    cxt.save();
                    cxt.translate($this.boxs[i].x,$this.boxs[i].y);

                    cxt.beginPath();
                    privateMethod.rect(cxt,0,0,$this.boxWidth,$this.boxHeight,true);
                    cxt.closePath();

                    i&1 && (cxt.fillStyle = linear1) || i !== Math.floor(len/2) && (cxt.fillStyle = linear2);

                    cxt.fill();

                    cxt.fillStyle = "#691c14";

                    cxt.fillText($this.options.items[i].text,x,y);

                    if(i&1){
                        imgs.smile.onload = function(){
                            cxt.drawImage(this,x1,y1,w,w);
                        };
                        cxt.drawImage(imgs.smile,x1,y1,w,w);
                    }
                    else{
                        imgs.gift.onload = function(){
                            cxt.drawImage(this,x1,y1,w,h);
                        };
                        cxt.drawImage(imgs.gift,x1,y1,w,h);
                    }

                    cxt.restore();
                }

                cxt.save();
                cxt.translate($this.boxs[4].x,$this.boxs[4].y);

                cxt.beginPath();
                privateMethod.rect(cxt,0,0,$this.boxWidth,$this.boxHeight,true);
                cxt.closePath();

                cxt.fillStyle = linear3;
                cxt.fill();

                cxt.fillStyle = "#fd5354";
                privateMethod.rectBorder(cxt,0,0,$this.boxBorderTop,$this.boxBorderLeft,$this.boxWidth,$this.boxHeight);
                cxt.fill();

                cxt.fillStyle  ="#fdf402";
                cxt.font = $this.boxWidth*8/29+"px Microsoft YaHei";
                cxt.textBaseline = "bottom";
                cxt.textAlign = "center";
                cxt.fillText("开始",$this.boxWidth/2,$this.boxHeight/2);
                cxt.textBaseline = "top";
                cxt.fillText("抽奖",$this.boxWidth/2,$this.boxHeight/2);
                cxt.restore();
            },
            ready : function(cxt){

                cxt.clearRect(0,0,this.width,this.height);

                cxt.fillStyle = "#e92121";
                privateMethod.rectBorder(cxt,this.boxs[0].x,this.boxs[0].y,this.boxBorderTop,this.boxBorderLeft,this.boxWidth,this.boxHeight);
                cxt.fill();

                this.next = 1;

                this.dir = [0,1,2,5,8,7,6,3];

                this.isRotating = false;

                var $this = this;

                $this.phoD = $("#phoDialogue");
                $this.phoB = $("#pho-submit");
                $this.rstD = $("#rstDialogue");
                $this.rstS = $("#rst-success");
                $this.rstF = $("#rst-failed");
                $this.shareB = $(".share-btn");

                $this.remT = $("#remainingNumber");
                $this.shareGuide = $(".share-guide");
                $this.guideImg = $(".guide-img");

                this.controlBtn.on("click tap",function(){

                    if($this.isRotating) return;

                    var tmp = parseInt($this.remT.text());

                    if(isNaN(tmp) || tmp <= 0) return;

                    $this.phoD.show();


                });

                $this.phoB.on("click tap",function(){

                    $this.phoD.hide();

                    var tmp = parseInt($this.remT.text());

                    if(isNaN(tmp) || tmp <= 0) return;

                    $this.remT.text(tmp-1);

                    $this.isRotating = true;

                    var num = Math.floor(Math.random()*$this.options.items.length);

                    num = privateMethod.indexOf($this.dir,num);

                    num === -1 && (num = 0);

                    $this.rotate(cxt, 200, $this.next, num);

                });
            },
            rotate : function(cxt, speed, index, num){

                cxt.clearRect(0,0,this.width,this.height);

                var len = this.dir.length,
                    $this = this;

                privateMethod.rectBorder(cxt,this.boxs[this.dir[index%len]].x,this.boxs[this.dir[index%len]].y,this.boxBorderTop,this.boxBorderLeft,this.boxWidth,this.boxHeight);
                cxt.fill();

                if(index >= (privateMethod.baseRounds+2)*len && index%len === num){
                    clearTimeout(this.timer);

                    setTimeout(function(){

                        $this.rstD.show();
                        if($this.options.items[$this.dir[num]].text === "谢谢参与"){
                            $this.rstS.hide();
                            $this.rstF.show();
                        }
                        else{
                            $this.rstF.hide();
                            $this.rstS.show();
                            $this.rstD.find("#rstNum").html($this.options.items[$this.dir[num]].text);
                        }

                        var tmp = parseInt($this.remT.text());

                        if(tmp > 0){
                            $this.shareB.text("再来一次");

                        }
                        else{
                            $this.shareB.text("分享活动");
                        }

                        $this.shareB.off("click tap").on("click tap",function(){
                            if(tmp > 0){
                                $this.rstD.hide();

                            }
                            else{
                                $this.shareGuide.show();
                                $this.guideImg.show();
                            }
                        });

                        $this.next = (num+1)%len;
                        $this.isRotating = false;
                    },1000);
                }
                else{
                    if(index < privateMethod.baseRounds*len){
                        speed -= 10;
                    }
                    else{
                        speed += 30;
                    }
                    speed = speed<80 ? 80 : speed;

                    this.timer = setTimeout(function(){
                        $this.rotate(cxt,speed,++index,num)
                    },speed);
                }

            }

        };

        return Sudoku;

    })();

    privateMethod = {
        baseRounds : 6,
        drawImage : function(img,callback){

            if( img.complete ){
                callback.call(img);
                return;
            }

            img.onload = function(){
                callback.call(img);
            }

        },
        rect : function(cxt, x, y, width, height, c){

            cxt.moveTo(x,y);
            if(c){
                cxt.lineTo(x, y+height);
                cxt.lineTo(x+width, y+height);
                cxt.lineTo(x+width, y);
                cxt.lineTo(x, y);
            }
            else {
                cxt.lineTo(x+width, y);
                cxt.lineTo(x+width, y+height);
                cxt.lineTo(x, y+height);
                cxt.lineTo(x, y);
            }

        },
        rectBorder : function(cxt, x, y, borderTop, borderLeft, width, height){

            cxt.beginPath();

            privateMethod.rect(cxt,x,y,width,height,true);

            privateMethod.rect(cxt,x+borderLeft,y+borderTop,width-2*borderLeft,height-2*borderTop,false);

            cxt.closePath();
        },
        arc : function(cxt, x, y, radius, c){

            cxt.beginPath();

            cxt.arc(x,y,radius,0,Math.PI*2,c);

            cxt.closePath();
        },
        indexOf : function(arr, val){
            var l = arr.length,i;
            for(i=0;i<l;++i) if(arr[i]===val) return i;
            return -1;
        }
    };

    $.fn.sudoku = function(options){

        return this.each(function(){
            var $this = $(this),
                instance = $.fn.sudoku.lookup[$this.data("sudoku")];

            if(!instance){

                instance = new Sudoku($this, options);

                $.fn.sudoku.lookup[++$.fn.sudoku.lookup.i] = instance;

                $this.data("sudoku", $.fn.sudoku.lookup.i)

            }

            if(typeof options === "string"){
                instance[options]();
            }

        });
    };

    $.fn.sudoku.lookup = {
        i : 0
    };

    $.fn.sudoku.defaults = {

    };
})(Zepto);