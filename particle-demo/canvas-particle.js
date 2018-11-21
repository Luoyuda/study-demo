// 链式调用
function Canvas2DContext(canvas) {
	if (typeof canvas === "string") {
		canvas = document.getElementById(canvas)
	}
	if (!(this instanceof Canvas2DContext)) {
		return new Canvas2DContext(canvas)
	}
	this.context = this.ctx = canvas.getContext("2d")
	if (!Canvas2DContext.prototype.arc) {
		Canvas2DContext.setup.call(this, this.ctx)
	}
}
Canvas2DContext.setup = function() {
	var methods = ["arc", "arcTo", "beginPath", "bezierCurveTo", "clearRect", "clip",
		"closePath", "drawImage", "fill", "fillRect", "fillText", "lineTo", "moveTo",
		"quadraticCurveTo", "rect", "restore", "rotate", "save", "scale", "setTransform",
		"stroke", "strokeRect", "strokeText", "transform", "translate"]
  
	var getterMethods = ["createPattern", "drawFocusRing", "isPointInPath", "measureText", 
	// drawFocusRing not currently supported
	// The following might instead be wrapped to be able to chain their child objects
		"createImageData", "createLinearGradient",
		"createRadialGradient", "getImageData", "putImageData"
	]
  
	var props = ["canvas", "fillStyle", "font", "globalAlpha", "globalCompositeOperation",
		"lineCap", "lineJoin", "lineWidth", "miterLimit", "shadowOffsetX", "shadowOffsetY",
		"shadowBlur", "shadowColor", "strokeStyle", "textAlign", "textBaseline"]
  
	for (let m of methods) {
		let method = m
		Canvas2DContext.prototype[method] = function() {
			this.ctx[method].apply(this.ctx, arguments)
			return this
		}
	}
  
	for (let m of getterMethods) {
		let method = m
		Canvas2DContext.prototype[method] = function() {
			return this.ctx[method].apply(this.ctx, arguments)
		}
	}
  
	for (let p of props) {
		let prop = p
		Canvas2DContext.prototype[prop] = function(value) {
			if (value === undefined)
			{return this.ctx[prop]}
			this.ctx[prop] = value
			return this
		}
	}
}
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
// 获取数组中随机一个值
const getArrRandomItem = (arr) => arr[Math.round(Math.random() * (arr.length - 1 - 0) + 0)]

const getPixelRatio = (context) => {
	var backingStore = context.backingStorePixelRatio ||
            context.webkitBackingStorePixelRatio ||
            context.mozBackingStorePixelRatio ||
            context.msBackingStorePixelRatio ||
            context.oBackingStorePixelRatio ||
            context.backingStorePixelRatio || 1
	return (window.devicePixelRatio || 1) / backingStore
}
//兼容 Retina 屏幕
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
//离屏缓存
const getCachePoint = (r,color,cacheRatio) => {
	let key = r + "cache" + color
	if(this[key]){return this[key]}
	//离屏渲染
	const _ratio = 2 * cacheRatio,
		width = r * _ratio,
		cacheCanvas = document.createElement("canvas"),
		cacheContext = Canvas2DContext(cacheCanvas)
	
	setRetina(cacheCanvas,cacheContext,width,width)
	cacheContext.save()
		.fillStyle(color)
		.arc(r * cacheRatio, r * cacheRatio, r, 0, 360)
		.closePath()
		.fill()
		.restore()
	this[key] = cacheCanvas
	
	return cacheCanvas
}

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

const ParticleCanvas = window.ParticleCanvas = function({
	id = "p-canvas",
	num = 50,
	isMove = true,
	width = 0,
	height = 0,
	targetColor = ["#fff"],
	targetPpacity = 0.6,
	tarP = 10,
	parColor = ["#fff"],
	maxParR = 10,
	minParR = 5,
	parPpacity = null,
	lineColor = "#fff",
	lineOpacity = 0.2,
	lineWidth = 1,
	moveX = 0,
	moveY = 0,
	userCache = true
}){
	const canvas = document.getElementById(id) || document.createElement("canvas")
	if(canvas.id !== id){ (canvas.id = id) && document.body.appendChild(canvas)}

	const context = Canvas2DContext(canvas),
		isWResize = width,
		isHResize = height
	let currentParticle,	// 独立粒子
		round = [], // 粒子数组
		myReq = null // requestAnimationFrameId
	width = width || document.documentElement.clientWidth
	height = height || document.documentElement.clientHeight
	
	class Particle {
		constructor({context,x, y, r, color,moveX,moveY, opacity,lineColor = "#fff", lineOpacity = 0.1, lineWidth = 1}) {
			this.context = context
			this.r = r > 1 ? parseInt(r * 10) / 10 : 1 //粒子尺寸
			this.ratio = 3
			this._ratio = 2 * this.ratio
			this.lineWidth = lineWidth
			this.color = color2Rgb(typeof color === "string" ? color : getArrRandomItem(color), opacity) // 颜色
			this.lineColor = color2Rgb(typeof lineColor === "string" ? lineColor : getArrRandomItem(lineColor), lineOpacity)
			if(lineColor != "#fff"){
				this.color = this.lineColor
			}else{
				this.lineColor = this.color
			}
			//防止初始化越界
			this.x = x > this.r ? x - this.r : x
			this.y = y > this.r ? y - this.r : y
			//初始化最开始的速度
			this.moveX = Math.random() + moveX
			this.moveY = Math.random() + moveY
			this.userCache = userCache
		}
		draw() {
			if (!this.userCache) {
				this.context.fillStyle = this.color
					.beginPath()
					.arc(this.x, this.y, this.r, 0, 360)
					.closePath()
					.fill()
			} else {
				this.context.drawImage(getCachePoint(this.r,this.color,this.ratio), (this.x - this.r * this.ratio) * this.context._retinaRatio, (this.y - this.r * this.ratio) * this.context._retinaRatio)
			}
		}
		drawLine(_round) {
			let dx = this.x - _round.x,
				dy = this.y - _round.y
			if (Math.sqrt(dx * dx + dy * dy) < 150) {
				let x = this.x,
					y = this.y,
					lx = _round.x,
					ly = _round.y

				if(this.userCache){
					x = this.x + this.r / this._ratio
					y = this.y + this.r / this._ratio
					lx = _round.x + _round.r / this._ratio
					ly = _round.y + _round.r / this._ratio
				}

				this.context.beginPath()
					.moveTo(x, y)
					.lineTo(lx, ly)
					.closePath()
					.lineWidth(this.lineWidth)
					.strokeStyle(this.lineColor)
					.stroke()
			}
		}
		move() {
			this.moveX = this.x + this.r * 2 < width && this.x > 0 ? this.moveX : -this.moveX
			this.moveY = this.y + this.r * 2 < height && this.y > 0 ? this.moveY : -this.moveY
			this.x += this.moveX
			this.y += this.moveY
			this.draw()
		}
	}

	//动画函数
	const animate = () => {
		context.clearRect(0, 0, width, height)
		for (let i = 0; i < round.length; i++) {
			round[i].move()
			for (let j = i + 1; j < round.length; j++) {
				round[i].drawLine(round[j])
			}
		}
		if (isMove && currentParticle.x) {
			for (let i = 0; i < round.length; i++) {
				currentParticle.drawLine(round[i])
			}
			currentParticle.draw()
		}
		myReq = requestAnimationFrame(animate)
	}

   
	const init = () => {
		setRetina(canvas,context,width,height)
		/* #region 是否开启鼠标跟随 */
		if (isMove && !currentParticle) {
			currentParticle = new Particle({
				x: 0,
				y: 0, 
				r: tarP, 
				color: targetColor, 
				opacity: targetPpacity,
				lineColor,
				lineOpacity, 
				lineWidth,
				context
			}) //独立粒子
			
			const moveEvent = (e = window.event) => {
					currentParticle.x = e.clientX || e.touches[0].clientX
					currentParticle.y = e.clientY || e.touches[0].clientY
				},
				outEvent = () => {currentParticle.x = currentParticle.y = null},
				eventObject = {
					"pc": {
						move: "mousemove",
						out: "mouseout"
					},
					"phone": {
						move: "touchmove",
						out: "touchend"
					}
				},
				event = eventObject[/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent) ? "phone" : "pc"]

			canvas.removeEventListener(event.move,moveEvent)
			canvas.removeEventListener(event.out, outEvent)
			canvas.addEventListener(event.move,moveEvent)
			canvas.addEventListener(event.out, outEvent)
		}
		/* #endregion */

		/* #region 初始化粒子 */
		for (let i = 0; i < num; i++) {
			round[i] = new Particle({
				x: Math.random() * width,
				y: Math.random() * height, 
				r: Math.random() * Math.round(Math.random() * (maxParR - minParR) + minParR), 
				color: parColor, 
				opacity: parPpacity,
				lineColor,
				lineOpacity, 
				lineWidth,
				context,
				moveX,
				moveY
			})
			
		}
		/* #endregion */
		/* #region 执行动画 */
		animate()
		/* #endregion */
		
	}

	const resize = () => {
		if(this.timeout){clearTimeout(this.timeout)}
		if(myReq){window.cancelAnimationFrame(myReq)}

		context.clearRect(0,0,width,height)
		round = []
		width = isWResize ? width : document.documentElement.clientWidth
		height = isHResize ? height : document.documentElement.clientHeight
		this.timeout = setTimeout(init, 20)
	}

	throttle("resize", "optimizedResize")
	init()
	if(!isWResize || !isHResize){window.addEventListener("optimizedResize",resize)}
	return canvas
}

const canvas = ParticleCanvas({})
console.log(canvas)

