!function(t){var e,o;e=function(){function e(e,o){var i=this;i.el=e,i.options=t.extend({},t.fn.sudoku.defaults,o),i.init()}return e.prototype={init:function(){var t=this,e=t.initElement();t.render(e.face),t.ready(e.rotation)},initElement:function(){var t=this;t.width=t.el.width(),t.height=t.el.height(),t.boxWidth=290*t.width/1024,t.boxHeight=243*t.height/865,t.boxBorderTop=7*t.height/865,t.boxBorderLeft=9*t.width/1024;var e,o,i=61*t.width/1024,r=50*t.height/865,h=t.width/64;for(t.boxs=[],e=0;e<3;++e)for(o=0;o<3;++o)t.boxs.push({x:i+o*(t.boxWidth+h),y:r+e*(t.boxHeight+h)});return t.controlBtn=t.el.children(".controlBtn").css({top:t.boxs[4].y,left:t.boxs[4].x,width:t.boxWidth,height:t.boxHeight}),{face:t.el.children(".face").attr({width:t.width,height:t.height})[0].getContext("2d"),rotation:t.el.children(".rotation").attr({width:t.width,height:t.height})[0].getContext("2d")}},render:function(t){t.clearRect(0,0,this.width,this.height);var e,i,r,h,d,a,l=this;r=3*l.width/512,e=39*l.width/1024+r,i=33*l.height/865+r,t.save(),t.beginPath(),o.rect(t,r,r,l.width-2*r,l.height-2*r,!1),o.rect(t,e,i,l.width-2*e,l.height-2*i,!0),t.fillStyle="#691c14",t.shadowBlur=3*l.width/256,t.shadowColor="#691c14",t.fill(),t.restore(),t.save(),t.beginPath(),o.rect(t,e,i,l.width-2*e,l.height-2*i,!0),t.fillStyle="#340808",t.fill(),t.restore(),e=21*l.width/1024+r,i=18*l.height/865+r,r=7*l.width/1024;var n=[{x:e,y:i,ax:(l.width-2*e)/12,ay:0,num:12},{x:l.width-e,y:i,ax:0,ay:(l.height-2*i)/11,num:11},{x:l.width-e,y:l.height-i,ax:-(l.width-2*e)/12,ay:0,num:12},{x:e,y:l.height-i,ax:0,ay:-(l.height-2*i)/11,num:11}];for(t.shadowBlur=r,t.shadowColor="#fecb02",t.fillStyle="#fecb02",h=0;h<n.length;++h)for(e=n[h].x,i=n[h].y,d=0;d<n[h].num;++d)t.save(),t.translate(e,i),t.beginPath(),t.arc(0,0,r,0,2*Math.PI),t.closePath(),t.fill(),t.restore(),e+=n[h].ax,i+=n[h].ay;var s=t.createLinearGradient(0,0,0,l.boxHeight),f=t.createLinearGradient(0,0,0,l.boxHeight),x=t.createLinearGradient(0,0,l.boxWidth,l.boxHeight);s.addColorStop(0,"#ffe484"),s.addColorStop(1,"#ffeba1"),f.addColorStop(0,"#fdd135"),f.addColorStop(1,"#ffbf12"),x.addColorStop(0,"#e92121"),x.addColorStop(.076,"#e92121"),x.addColorStop(.076,"#f03e3e"),x.addColorStop(.152,"#f03e3e"),x.addColorStop(.152,"#e92121"),x.addColorStop(.228,"#e92121"),x.addColorStop(.228,"#f03e3e"),x.addColorStop(.304,"#f03e3e"),x.addColorStop(.304,"#e92121"),x.addColorStop(.38,"#e92121"),x.addColorStop(.38,"#f03e3e"),x.addColorStop(.456,"#f03e3e"),x.addColorStop(.456,"#e92121"),x.addColorStop(.532,"#e92121"),x.addColorStop(.532,"#f03e3e"),x.addColorStop(.608,"#f03e3e"),x.addColorStop(.608,"#e92121"),x.addColorStop(.684,"#e92121"),x.addColorStop(.684,"#f03e3e"),x.addColorStop(.76,"#f03e3e"),x.addColorStop(.76,"#e92121"),x.addColorStop(.836,"#e92121"),x.addColorStop(.836,"#f03e3e"),x.addColorStop(.912,"#f03e3e"),x.addColorStop(.912,"#e92121"),x.addColorStop(1,"#e92121"),a=l.options.items.length,t.shadowBlur=0,t.font=36*l.boxWidth/290+"px Helvetica",t.textBaseline="top",t.textAlign="center",e=l.boxWidth/2,i=165*l.boxHeight/243;var c=104*l.boxWidth/290,u=128*l.boxHeight/243,g=(l.boxWidth-c)/2,b=30*l.boxHeight/243,p={gift:document.getElementById("gift"),smile:document.getElementById("smile")};for(h=0;h<a;++h)t.save(),t.translate(l.boxs[h].x,l.boxs[h].y),t.beginPath(),o.rect(t,0,0,l.boxWidth,l.boxHeight,!0),t.closePath(),1&h&&(t.fillStyle=s)||h!==Math.floor(a/2)&&(t.fillStyle=f),t.fill(),t.fillStyle="#691c14",t.fillText(l.options.items[h].text,e,i),1&h?(p.smile.onload=function(){t.drawImage(this,g,b,c,c)},t.drawImage(p.smile,g,b,c,c)):(p.gift.onload=function(){t.drawImage(this,g,b,c,u)},t.drawImage(p.gift,g,b,c,u)),t.restore();t.save(),t.translate(l.boxs[4].x,l.boxs[4].y),t.beginPath(),o.rect(t,0,0,l.boxWidth,l.boxHeight,!0),t.closePath(),t.fillStyle=x,t.fill(),t.fillStyle="#fd5354",o.rectBorder(t,0,0,l.boxBorderTop,l.boxBorderLeft,l.boxWidth,l.boxHeight),t.fill(),t.fillStyle="#fdf402",t.font=8*l.boxWidth/29+"px Microsoft YaHei",t.textBaseline="bottom",t.textAlign="center",t.fillText("开始",l.boxWidth/2,l.boxHeight/2),t.textBaseline="top",t.fillText("抽奖",l.boxWidth/2,l.boxHeight/2),t.restore()},ready:function(e){e.clearRect(0,0,this.width,this.height),e.fillStyle="#e92121",o.rectBorder(e,this.boxs[0].x,this.boxs[0].y,this.boxBorderTop,this.boxBorderLeft,this.boxWidth,this.boxHeight),e.fill(),this.next=1,this.dir=[0,1,2,5,8,7,6,3],this.isRotating=!1;var i=this;i.phoD=t("#phoDialogue"),i.phoB=t("#pho-submit"),i.rstD=t("#rstDialogue"),i.rstS=t("#rst-success"),i.rstF=t("#rst-failed"),i.shareB=t(".share-btn"),i.remT=t("#remainingNumber"),i.shareGuide=t(".share-guide"),i.guideImg=t(".guide-img"),this.controlBtn.on("click tap",function(){if(!i.isRotating){var t=parseInt(i.remT.text());isNaN(t)||t<=0||i.phoD.show()}}),i.phoB.on("click tap",function(){i.phoD.hide();var t=parseInt(i.remT.text());if(!(isNaN(t)||t<=0)){i.remT.text(t-1),i.isRotating=!0;var r=Math.floor(Math.random()*i.options.items.length);r=o.indexOf(i.dir,r),r===-1&&(r=0),i.rotate(e,200,i.next,r)}})},rotate:function(t,e,i,r){t.clearRect(0,0,this.width,this.height);var h=this.dir.length,d=this;o.rectBorder(t,this.boxs[this.dir[i%h]].x,this.boxs[this.dir[i%h]].y,this.boxBorderTop,this.boxBorderLeft,this.boxWidth,this.boxHeight),t.fill(),i>=(o.baseRounds+2)*h&&i%h===r?(clearTimeout(this.timer),setTimeout(function(){d.rstD.show(),"谢谢参与"===d.options.items[d.dir[r]].text?(d.rstS.hide(),d.rstF.show()):(d.rstF.hide(),d.rstS.show(),d.rstD.find("#rstNum").html(d.options.items[d.dir[r]].text));var t=parseInt(d.remT.text());t>0?d.shareB.text("再来一次"):d.shareB.text("分享活动"),d.shareB.off("click tap").on("click tap",function(){t>0?d.rstD.hide():(d.shareGuide.show(),d.guideImg.show())}),d.next=(r+1)%h,d.isRotating=!1},1e3)):(i<o.baseRounds*h?e-=10:e+=30,e=e<80?80:e,this.timer=setTimeout(function(){d.rotate(t,e,++i,r)},e))}},e}(),o={baseRounds:6,drawImage:function(t,e){return t.complete?void e.call(t):void(t.onload=function(){e.call(t)})},rect:function(t,e,o,i,r,h){t.moveTo(e,o),h?(t.lineTo(e,o+r),t.lineTo(e+i,o+r),t.lineTo(e+i,o),t.lineTo(e,o)):(t.lineTo(e+i,o),t.lineTo(e+i,o+r),t.lineTo(e,o+r),t.lineTo(e,o))},rectBorder:function(t,e,i,r,h,d,a){t.beginPath(),o.rect(t,e,i,d,a,!0),o.rect(t,e+h,i+r,d-2*h,a-2*r,!1),t.closePath()},arc:function(t,e,o,i,r){t.beginPath(),t.arc(e,o,i,0,2*Math.PI,r),t.closePath()},indexOf:function(t,e){var o,i=t.length;for(o=0;o<i;++o)if(t[o]===e)return o;return-1}},t.fn.sudoku=function(o){return this.each(function(){var i=t(this),r=t.fn.sudoku.lookup[i.data("sudoku")];r||(r=new e(i,o),t.fn.sudoku.lookup[++t.fn.sudoku.lookup.i]=r,i.data("sudoku",t.fn.sudoku.lookup.i)),"string"==typeof o&&r[o]()})},t.fn.sudoku.lookup={i:0},t.fn.sudoku.defaults={}}(Zepto);