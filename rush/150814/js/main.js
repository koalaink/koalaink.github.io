$(document).ready(function(){
    var ox = 402;
    var oy = 474;
    var sx = 1;
    var sy = 1;
    var sin=0;
    var cos=1;
    var angle = 0;
    var k=cos/sin;
    var canShoot = false;
    var leftDown = false;
    var rightDown = false;
    var blankDown = false;
    var blankUp = false;
    var controlBall = $("#control-ball");
    var controlPanel = $("#control-panel");
    var controlBarrel = $("#control-barrel");

    var colorArr = ["red","green","blue","purple","yellow","gray"];
    var colorNum = colorArr.length;

    var nextSize = 6;
    var nextArr = new Array(nextSize+1);

    var cur=0;
    for(cur=0;cur<nextSize;++cur){
        nextArr[cur] = colorArr[Math.floor(Math.random()*colorNum)];
    }

    cur=nextSize;

    controlBall.addClass("ball-"+nextArr[cur]);

    $(document).bind("keydown",function(e){
        //alert(e.keyCode);
        if(e.keyCode == 32 ){
            blankDown = true;
            blankUp = false;
        }

        if(e.keyCode == 65 ){
            leftDown = true;
            rightDown = false;
        }

        if(e.keyCode == 68 ){
            rightDown = true;
            leftDown = false;
        }

        if(blankDown){
            shootReady();
        }
    });

    $(document).bind("keyup",function(e){

        if(e.keyCode == 32 ){
            blankDown = false;
            blankUp = true;controlBarrel
        }

        if(e.keyCode == 65 ){
            leftDown = false;
        }

        if(e.keyCode == 68 ){
            rightDown = false;
        }

        if(blankUp){
            shoot();
            shootEnd();
        }
    });

    setInterval(function(){

        if(leftDown){
            angle -= 5;
            if(angle<=-90){ angle=-90;}
            sin = Math.sin(angle*Math.PI/180);
            cos = Math.sqrt(1-Math.pow(sin,2));
            k = cos/sin;
            controlBarrel.css("transform","rotate("+angle+"deg)");
        }
        else if(rightDown){
            angle += 5;
            if(angle>=90){ angle=90;}
            sin = Math.sin(angle*Math.PI/180);
            cos = Math.sqrt(1-Math.pow(sin,2));
            k = cos/sin;
            controlBarrel.css("transform","rotate("+angle+"deg)");
        }

    },100);

    function shootReady(){
        canShoot = true;
        controlBall.addClass("ball-hover");
        controlBarrel.addClass("barrel-ready");
        controlBarrel.css("transform","rotate("+angle+"deg)");
    }

    function shootEnd(){
        sx = 1;
        sy = 1;
        controlBall.removeClass("ball-hover");
        controlBarrel.removeClass("barrel-ready");
        controlBarrel.css("transform","rotate("+angle+"deg)");
    }

    function shoot(){
        if(!canShoot) return ;
        var bullet = $("<div></div>");
        bullet.addClass("ball ball-bullet ball-"+nextArr[cur]);
        bullet.css("top","100%");
        bullet.css("left","50%");
        bullet.css("margin-left",100*sin-32);
        bullet.css("margin-top",-64-100*cos);
        controlPanel.append(bullet);
        var ty = 32;
        var tx = ox+(oy-ty)/k;
        if(tx>772){
            tx = 772;
            ty = oy-(tx-ox)*k;
        }
        else if(tx<32){
            tx = 32;
            ty = oy-(tx-ox)*k;
        }
        //bullet.css("margin-bottom",-ty);
        setTimeout(function(){
            bullet.css("top",ty-32);
            bullet.css("left",tx-32);
            bullet.css("margin",0);
        },30);
        setTimeout(function(){bullet.remove()},3000);
        canShoot = false;
        controlBall.removeClass("ball-"+nextArr[cur]);
        nextArr[cur] = colorArr[Math.floor(Math.random()*colorNum)];
        cur = (cur+1)%nextSize;
        controlBall.addClass("ball-"+nextArr[cur]);
    }

});
