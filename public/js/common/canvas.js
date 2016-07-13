module.exports = (() => {
	class Round {
	constructor(canvas) {
		this.r = Math.floor(Math.random()*8)+8 ;
		this.diam = this.r*2;
    //随机位置
    let x = this.fnRandom(0,canvas.width - this.r);
    this.x = x<this.r?this.r:x;
    let y = this.fnRandom(0,canvas.height-this.r);
    this.y = y<this.r?this.r:y
    //随机速度
    let speed = this.fnRandom(2,4)/10;
    this.speedX = this.fnRandom(0,4)>2.5?speed:-speed;
    this.speedY = this.fnRandom(0,4)>2.5?speed:-speed;
    //颜色
    this.color = "#eee";
	}

	draw(ctx){
		//绘制函数
		ctx.fillStyle = this.color;
		ctx.beginPath()
		ctx.arc(this.x,this.y,this.r,0,Math.PI*2,true);
		ctx.closePath();
		ctx.fill();
	}

	move(canvas) {
		if(this.x>canvas.width-this.r){
			this.speedX*= -1; 

		}else if(this.x<this.r){
			this.speedX*=-1;
		}
		this.x+=this.speedX;

		if(this.y>canvas.height-this.r){
			this.speedY*= -1;
		}else if(this.y<this.r){
			this.speedY*=-1;
		}
		this.y+=this.speedY;
	}

	fnRandom(min,max) {
		return Math.floor((max-min)*Math.random()+min+1)
	}
}


let initRound = (Round, canvas, allRound) => {
  //初始化10个圆形对象,放到数组中
  for(let i = 0 ; i<10;i++){
  	let obj = new Round(canvas);
  	allRound.push(obj);
  }
}
let roundMove = (canvas, ctx, dxdy, allRound) => {
	ctx.clearRect(0,0,canvas.width,canvas.height);
  //遍历所有的圆形对象,让对象自己重绘,移动
  for (let i = 0 ;i <allRound.length;i++) {
  	let round = allRound[i];
  	round.draw(ctx);
  	round.move(canvas);


  	dxdy[i]={
  		dx:round.x,
  		dy:round.y,
  		dr:round.r,
  		dvx:round.speedX,
  		dvy:round.speedY
  	};
  	let dx = dxdy[i].dx,
  	dy =dxdy[i].dy;

  	for (let j=0;j<i;j++) {
  		let sx = dxdy[j].dx,
  		sy = dxdy[j].dy,
  		l = Math.sqrt((dx-sx)*(dx-sx)+(dy-sy)*(dy-sy)),
  		C = 1/l*7-0.0008,
  		o = C > 0.03 ? 0.02 : C;
  		ctx.strokeStyle = 'rgba(0,0,0,'+ o +')';
  		ctx.beginPath();
  		ctx.lineWidth=2;
  		ctx.moveTo(dx,dy);
  		ctx.lineTo(sx,sy);
  		ctx.closePath();
  		ctx.stroke();
  	}
  }
  window.requestAnimationFrame(() => {
  	roundMove(canvas, ctx, dxdy, allRound);
  })
}
return {
	Round: Round,
	initRound: initRound,
	roundMove: roundMove
}
})()



    

    