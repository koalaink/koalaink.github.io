(function($){

    var Turntable, privateMethod;

    Turntable = (function(){

        function Turntable(element, options){

            /* extend options */
            this.settings = $.extend({}, $.fn.turntable.defaults, options);

            this.el = $(element);

            //console.log((new Date()).getTime());

            this.init();

            //console.log((new Date()).getTime());
        }

        Turntable.prototype = {
            PI : Math.PI,
            init : function(){

                var cxt = this.initElement();

                this.renderCanvas(cxt.face,cxt.pointer);

                this.startTurntable();

            },
            initElement : function(){

                var width = this.el.width();

                this.el.height(width);

                this.faceCanvas = this.el.children(".turntable-face");

                var cxt = {
                    face : this.faceCanvas.attr({width: width, height: width})[0].getContext("2d"),
                    pointer : this.el.children(".turntable-pointer").attr({width: width*.2236, height: width*.2774})[0].getContext("2d")
                };

                this.images = {
                    gift : document.getElementById("turntableGift"),
                    smile :document.getElementById("turntableSmile"),
                    pointer :document.getElementById("turntablePointer")
                };

                return cxt;
            },
            renderCanvas : function(face,pointer){

                var radius = this.el.width()/ 2,
                    r1 = radius*.91,r2,
                    w1 = radius*.06,
                    baseAngle = this.PI/18,
                    i, j,linear,
                    len = this.settings.items.length,
                    imgWidth = radius*.154,
                    imgHeight = radius*.189;

                face.clearRect(0,0,radius*2,radius*2);
                /* 外圈 */
                face.translate(radius,radius);

                face.save();

                face.arc(0,0,r1,0,this.PI*2);

                face.lineWidth = w1;
                face.shadowBlur = w1;
                face.shadowColor = "#691c14";
                face.strokeStyle = "#691c14";
                face.stroke();

                /* 边框小灯 */
                w1 = radius*.015;
                face.shadowBlur = w1;
                face.shadowColor = "#fecb02";
                face.fillStyle = "#fecb02";

                for(i=j=0;i<36;++i,j+=baseAngle){
                    face.beginPath();
                    face.arc(r1*Math.sin(j),-r1*Math.cos(j),w1,0,this.PI*2);
                    face.fill();
                }

                /* 内圈 */
                r1 = radius*.87;
                w1 = radius*.02;
                face.beginPath();
                face.arc(0,0,r1,0,this.PI*2);

                face.shadowBlur = 0;
                face.lineWidth = w1;
                face.strokeStyle = "#fc5d01";
                face.stroke();

                /* 内圆 */
                r1 = radius*.86;
                face.beginPath();
                face.arc(0,0,r1,0,this.PI*2);

                linear = face.createRadialGradient(0,0,0,0,0,r1);
                linear.addColorStop(0,"#ffd267");
                linear.addColorStop(1,"#fdc236");
                face.fillStyle = linear;
                face.fill();

                /* 内圈分割 */
                baseAngle = this.PI*2/len;
                linear = face.createRadialGradient(0,0,0,0,0,r1);
                linear.addColorStop(0,"#ffd13d");
                linear.addColorStop(1,"#ff9c01");
                face.fillStyle = linear;
                for(i=0,j=baseAngle;i<len;++i,j+=baseAngle){
                    if(i&1) continue;

                    face.beginPath();
                    face.arc(0,0,r1,j,j+baseAngle);
                    face.lineTo(0,0);
                    face.closePath();

                    face.fill();
                }

                /* 块分割线 */
                face.lineWidth = radius*.004;
                face.strokeStyle = "#fc5d01";

                face.beginPath();
                for(i=j=0;i<len;++i,j+=baseAngle){
                    face.moveTo(0,0);
                    face.lineTo(r1*Math.sin(j),-r1*Math.cos(j));
                }

                face.stroke();

                /* 块信息 */
                r1 = radius*.805;
                r2 = radius*.571;

                face.restore();
                face.save();
                face.font = r2*.35*Math.tan(baseAngle/2)+"px Helvetica";
                face.textBaseline = "top";
                face.textAlign = "center";
                face.fillStyle = "#691c14";
                face.rotate(-baseAngle/2);
                for(i=0;i<len;++i){
                    face.rotate(baseAngle);
                    if(this.settings.items[i].img === "gift"){
                        this.images.gift.onload = function(){
                            face.drawImage(this,-imgWidth/2,-r1,imgWidth,imgHeight);
                        };
                        face.drawImage(this.images.gift,-imgWidth/2,-r1,imgWidth,imgHeight);
                    }
                    else if(this.settings.items[i].img === "smile") {
                        this.images.smile.onload = function(){
                            face.drawImage(this,-imgWidth/2,-r1,imgWidth,imgWidth);
                        };
                        face.drawImage(this.images.smile,-imgWidth/2,-r1,imgWidth,imgWidth);
                    }
                    face.fillText(this.settings.items[i].text,0,-r2);
                }

                /* 指针 */
                r1 = radius * .4472;
                r2 = radius * .5548;
                this.images.pointer.onload = function(){
                    pointer.drawImage(this,0,0,r1,r2);
                };
                pointer.drawImage(this.images.pointer,0,0,r1,r2)
            },
            startTurntable : function(){

                var $this = this;

                $this.phoD = $("#phoDialogue");

                $this.rstD = $("#rstDialogue");

                $this.btn = this.el.children("#turntable-btn");

                $this.remainingNumber = $("#remainingNumber");

                $this.shareBtn = $(".share-btn");
                $this.shareGuide = $(".share-guide");
                $this.guideImg = $(".guide-img");

                $this.isRotating = false;

                $this.btn.on("click tap",function(){

                    if($this.isRotating) return;

                    $this.phoD.show();
                });

                $("#pho-submit").on("click tap",function(){

                    this.preventDefault;

                    $this.phoD.hide();

                    var tmp = parseInt($this.remainingNumber.text());

                    if(isNaN(tmp) || tmp <= 0){
                        return;
                    }

                    $this.remainingNumber.text(tmp-1);

                    $this.rotate();
                });
            },
            rotate : function(){

                if(this.isRotating) return;

                var $this = this;

                $this.isRotating = true;

                $this.faceCanvas.addClass("rotating");

                setTimeout(function(){

                    $this.rotateTo();

                },800);

            },
            rotateTo : function(num){

                var $this = this;

                if(!$this.faceCanvas.hasClass("rotating")) return;

                isNaN(num) && (num =privateMethod.randRange(0,$this.settings.items.length));

                var deg = 360*(privateMethod.randRange(6,8) - (num+.5)/$this.settings.items.length),msg;

                $this.faceCanvas.removeClass("rotating").css({
                    "-webkit-transform" : "rotate("+deg+"deg)",
                       "-moz-transform" : "rotate("+deg+"deg)",
                        "-ms-transform" : "rotate("+deg+"deg)",
                         "-o-transform" : "rotate("+deg+"deg)",
                            "transform" : "rotate("+deg+"deg)"
                }).addClass("rotateTo");

                setTimeout(function(){

                    $this.rstD.show();

                    if($this.settings.items[num].img === "smile"){
                        $this.rstD.find("#rst-success").hide();
                        $this.rstD.find("#rst-failed").show();
                    } else {
                        $this.rstD.find("#rst-failed").hide();
                        $this.rstD.find("#rst-success").show();
                        $this.rstD.find("#rstNum").html($this.settings.items[num].text);
                    }

                    var tmp = parseInt($this.remainingNumber.text());

                    if(tmp>0){
                        $this.shareBtn.text("再来一次");
                    }
                    else{
                        $this.shareBtn.text("分享活动");
                    }

                    $this.shareBtn.off("click tap").on("click tap",function(){
                        if(tmp>0){
                            $this.rstD.hide();
                        }
                        else{
                            $this.shareGuide.show();
                            $this.guideImg.show();
                        }
                    });

                    $this.faceCanvas.removeClass("rotateTo");

                    $this.isRotating = false;

                },5200);

            },
            pointTo : function(num){
                var $this = this;

                if(!$this.faceCanvas.hasClass("rotating")) return;

                isNaN(num) && (num =privateMethod.randRange(0,$this.settings.items.length));

                var deg = -360*(num+.5)/$this.settings.items.length;

                $this.faceCanvas.css({
                    "-webkit-transform" : "rotate("+deg+"deg)",
                       "-moz-transform" : "rotate("+deg+"deg)",
                        "-ms-transform" : "rotate("+deg+"deg)",
                         "-o-transform" : "rotate("+deg+"deg)",
                            "transform" : "rotate("+deg+"deg)"
                });
            }
        };

        return Turntable;
    })();

    privateMethod = {
        drawImage : function(img,callback){
            if( img.complete ){
                callback.call(img);
                return;
            }

            img.onload = function(){
                callback.call(img);
            }
        },
        randRange : function(min,max){
            return Math.floor(this.rand()*(max-min)+min);
        },
        rand : function(){
            var s = (new Date()).getTime();
            s = ( s * 9301 + 49297 ) % 233280;
            return s / ( 233280.0 );
        }
    };

    $.fn.turntable = function(options){

        return this.each(function () {
            var me = $(this),
                instance = $.fn.turntable.lookup[me.data("turntable")];

            if(!instance){
                $.fn.turntable.lookup[++$.fn.turntable.lookup.i] = new Turntable(me,options);
                me.data("turntable", $.fn.turntable.lookup.i);
                instance = $.fn.turntable.lookup[me.data('turntable')];
            }

            if(typeof options === "string"){
                instance[options]();
            }

        });

    };

    $.fn.turntable.lookup = {
        i: 0
    };

    $.fn.turntable.defaults = {

    };
})(Zepto);