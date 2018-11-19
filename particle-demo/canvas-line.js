const LineCanvas = window.LineCanvas = function({
	id = "p-canvas",
	num = 15,
	width = 0,
	height = 0,
	parColor = ["#fff"],
	pointR = 3,
	parPpacity = 0.7,
	lineColor = "#fff",
	lineOpacity = 0.5,
	lineWidth = 1,
	moveX = 0.8,
	moveY = 0.8,
	userCache = true,
	cacheRatio = 5
}){
	/*16进制颜色转为RGB格式*/ 
	const color2Rgb = (str, op) => {
		const reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/
		let sColor = str.toLowerCase()
		op = op || (Math.floor(Math.random() * 10) + 4) / 10 / 2
		let opStr = `,${op})`
		//惰性返回
		if (this[str]) {return this[str] + opStr}

		if (sColor && reg.test(sColor)) {
			if (sColor.length === 4) {
				let sColorNew = "#"
				for (let i = 1; i < 4; i += 1) {
					sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1))
				}
				sColor = sColorNew
			}
			//处理六位的颜色值  
			let sColorChange = []
			for (let i = 1; i < 7; i += 2) {
				sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)))
			}
			let result = `rgba(${sColorChange.join(",")}`
			this[str] = result
			return result + opStr
		}
		return sColor
	}
	const getArrRandomItem = (arr) => arr[Math.round(Math.random() * (arr.length - 1 - 0) + 0)]
    
	const segmentsIntr = (a, b, c, d) => {  
		// 三角形abc 面积的2倍  
		var area_abc = (a.x - c.x) * (b.y - c.y) - (a.y - c.y) * (b.x - c.x)  
		// 三角形abd 面积的2倍  
		var area_abd = (a.x - d.x) * (b.y - d.y) - (a.y - d.y) * (b.x - d.x)   
		// 面积符号相同则两点在线段同侧,不相交 (对点在线段上的情况,本例当作不相交处理);  
		if ( area_abc * area_abd >= 0 ) {  
			return false  
		}  
		// 三角形cda 面积的2倍  
		var area_cda = (c.x - a.x) * (d.y - a.y) - (c.y - a.y) * (d.x - a.x)  
		// 三角形cdb 面积的2倍  
		// 注意: 这里有一个小优化.不需要再用公式计算面积,而是通过已知的三个面积加减得出.  
		var area_cdb = area_cda + area_abc - area_abd   
		if ( area_cda * area_cdb >= 0 ) {  
			return false  
		}  
		//计算交点坐标  
		var t = area_cda / ( area_abd - area_abc )  
		var dx = t * (b.x - a.x),  
			dy = t * (b.y - a.y)  
		return { x: a.x + dx , y: a.y + dy }  
	}  

	const getPixelRatio = (context) => {
		var backingStore = context.backingStorePixelRatio ||
            context.webkitBackingStorePixelRatio ||
            context.mozBackingStorePixelRatio ||
            context.msBackingStorePixelRatio ||
            context.oBackingStorePixelRatio ||
            context.backingStorePixelRatio || 1
		return (window.devicePixelRatio || 1) / backingStore
	}
    
	const setRetina = (canvas,context,width,height) => {
		var ratio = getPixelRatio(context)
		if(context._retinaRatio && context._retinaRatio !== ratio){window.location.reload()}
		canvas.style.width = width + "px"
		canvas.style.height = height + "px"
		// 缩放绘图
		context.setTransform(ratio, 0, 0, ratio, 0, 0)
		canvas.width = width * ratio
		canvas.height = height * ratio
		context._retinaRatio = ratio
		return ratio
	}

	const getCachePoint = (r,color,cacheRatio) => {
		let key = r + "cache" + color
		if(this[key]){return this[key]}
		let _ratio = 2 * cacheRatio
		let width = r * _ratio
		//离屏渲染
		const cacheCanvas = document.createElement("canvas")
		const cacheContext = cacheCanvas.getContext("2d")
		setRetina(cacheCanvas,cacheContext,width,width)
		cacheContext.save()
		cacheContext.fillStyle = color
		cacheContext.arc(r * cacheRatio, r * cacheRatio, r, 0, 360)
		cacheContext.closePath()
		cacheContext.fill()
		cacheContext.restore()
		this[key] = cacheCanvas
		return cacheCanvas
	}
    
	class Line{
		constructor({x, y ,r, opacity, color ,lineWidth, lineColor, lineOpacity, context, moveX, moveY, cacheRatio, userCache}){
			this.context = context
			this.x = x
			this.y = y
			this.r = r
			this.ratio = cacheRatio
			this.color = color2Rgb(typeof color === "string" ? color : getArrRandomItem(color), opacity) // 颜色
			this.lineColor = color2Rgb(typeof lineColor === "string" ? lineColor : getArrRandomItem(lineColor), lineOpacity)
			this.lineWidth = lineWidth
            
			this.target1 = {
				x: x * Math.random(),
				moveX: Math.random() * moveX,
				y: y * Math.random(),
				moveY: Math.random() * moveY,
			}
			this.target2 = {
				x: x * Math.random(),
				moveX: Math.random() * moveX,
				y: y * Math.random(),
				moveY: Math.random() * moveY,
			}
			this.dir = Math.random() > 0.5 ? -1 : 1
            
			if(this.dir > 0){
				//横向
				this.targetA = {
					x: 0,
					y: this.target1.y
				}
				this.targetB = {
					x: this.x,
					y: this.target2.y
				}
			}else{
				//竖直
				this.targetA = {
					x: this.target1.x,
					y: 0
				}
				this.targetB = {
					x: this.target2.x,
					y: this.y
				}
			}
			this.userCache = userCache
		}
		draw(){
			// console.log("draw")
			this.context.beginPath()
			if(this.dir > 0){
				//横向
				this.targetA.y = this.target1.y
				this.targetB.y = this.target2.y
			}else{
				//竖直
				this.targetA.x = this.target1.x
				this.targetB.x = this.target2.x
			}
			this.context.moveTo(this.targetA.x, this.targetA.y)
			this.context.lineTo(this.targetB.x, this.targetB.y)
			this.context.closePath()
			this.context.lineWidth = this.lineWidth
			this.context.strokeStyle = this.lineColor
			this.context.stroke()
		}
		drawPoint(line){
			let point = segmentsIntr(this.targetA,this.targetB,line.targetA,line.targetB)
			if(point){
				if(!this.userCache){
					this.context.fillStyle = this.color
					this.context.beginPath()
					this.context.arc(point.x, point.y, this.r, 0, 360)
					this.context.closePath()
					this.context.fill()
				}else{
					this.context.drawImage(getCachePoint(this.r,this.color,this.ratio), (point.x - this.r * this.ratio) * this.context._retinaRatio, (point.y - this.r * this.ratio) * this.context._retinaRatio)
				}
			}
		}
		move(){
			this.target1.moveX = this.target1.x < this.x && this.target1.x > 0 ? this.target1.moveX : -this.target1.moveX
			this.target2.moveX = this.target2.x < this.x && this.target2.x > 0 ? this.target2.moveX : -this.target2.moveX
			this.target1.moveY = this.target1.y < this.y && this.target1.y > 0 ? this.target1.moveY : -this.target1.moveY
			this.target2.moveY = this.target2.y < this.y && this.target2.y > 0 ? this.target2.moveY : -this.target2.moveY
            
			this.target1.x += this.target1.moveX
			this.target2.x += this.target2.moveX
			this.target1.y += this.target1.moveY
			this.target2.y += this.target2.moveY
			
			this.draw()
		}
	}
    
	const canvas = document.getElementById(id) || document.createElement("canvas")
	if(canvas.id !== id){
		canvas.id = id
		document.body.appendChild(canvas)
	}
	let context = canvas.getContext("2d")
	let round = [] // 粒子数组
	let myReq = null // requestAnimationFrameId
	let isWResize = width 
	let isHResize = height 
	width = width || document.documentElement.clientWidth
	height = height || document.documentElement.clientHeight
	
	//动画函数
	const animate = () => {
		context.clearRect(0, 0, width, height)
		for (let i = 0; i < round.length; i++) {
			round[i].move()
			for (let j = i + 1; j < round.length; j++) {
				round[i].drawPoint(round[j])
			}
		}
		myReq = requestAnimationFrame(animate)
	}
   
	const init = canvas.init = () => {
		setRetina(canvas,context,width,height)
		/* #region 初始化粒子 */
		for (let i = 0; i < num; i++) {
			round[i] = new Line({
				x: width,
				y: height, 
				r: pointR, 
				color: parColor, 
				opacity: parPpacity,
				lineColor,
				lineOpacity, 
				lineWidth,
				context,
				moveX,
				moveY,
				userCache,
				cacheRatio
			})
		}
		/* #endregion */
		/* #region 执行动画 */
		animate()
		/* #endregion */
	}

	const resize = () => {
		if(this.timeout){clearTimeout(this.timeout)}
		context.clearRect(0,0,width,height)
		round = []
		if(myReq){window.cancelAnimationFrame(myReq)}
		width = isWResize ? width : document.documentElement.clientWidth
		height = isHResize ? height : document.documentElement.clientHeight
		this.timeout = setTimeout(init, 20)
	}

	(function() {
		//防抖，避免resize占用过多资源
		const throttle = function(type, name, obj) {
			obj = obj || window
			let running = false
			let func = function() {
				if (running) { return }
				running = true
				requestAnimationFrame(function() {
					obj.dispatchEvent(new CustomEvent(name))
					running = false
				})
			}
			obj.addEventListener(type, func)
		}
	
		throttle("resize", "optimizedResize")
		init()
		if(!isWResize || !isHResize){window.addEventListener("optimizedResize",resize)}
	})()
	

	return canvas
}

const canvas = LineCanvas({})
console.log(canvas)

