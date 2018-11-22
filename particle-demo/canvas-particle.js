const PIXEL_RATIO = /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent) ? 3 : 2
//hidpi-canvas.min.js 核心代码
;(function(prototype) {

	var forEach = function(obj, func) {
			for (var p in obj) {
				if (obj.hasOwnProperty(p)) {
					func(obj[p], p)
				}
			}
		},

		ratioArgs = {
			"fillRect": "all",
			"clearRect": "all",
			"strokeRect": "all",
			"moveTo": "all",
			"lineTo": "all",
			"arc": [0,1,2],
			"arcTo": "all",
			"bezierCurveTo": "all",
			"isPointinPath": "all",
			"isPointinStroke": "all",
			"quadraticCurveTo": "all",
			"rect": "all",
			"translate": "all",
			"createRadialGradient": "all",
			"createLinearGradient": "all"
		}

	forEach(ratioArgs, function(value, key) {
		prototype[key] = (function(_super) {
			return function() {
				var i, len,
					args = Array.prototype.slice.call(arguments)

				if (value === "all") {
					args = args.map(function(a) {
						return a * PIXEL_RATIO
					})
				}
				else if (Array.isArray(value)) {
					for (i = 0, len = value.length; i < len; i++) {
						args[value[i]] *= PIXEL_RATIO
					}
				}

				return _super.apply(this, args)
			}
		})(prototype[key])
	})

	// Stroke lineWidth adjustment
	prototype.stroke = (function(_super) {
		return function() {
			this.lineWidth *= PIXEL_RATIO
			_super.apply(this, arguments)
			this.lineWidth /= PIXEL_RATIO
		}
	})(prototype.stroke)

	// Text
	//
	prototype.fillText = (function(_super) {
		return function() {
			var args = Array.prototype.slice.call(arguments)

			args[1] *= PIXEL_RATIO // x
			args[2] *= PIXEL_RATIO // y

			this.font = this.font.replace(
				/(\d+)(px|em|rem|pt)/g,
				function(w, m, u) {
					return m * PIXEL_RATIO + u
				}
			)

			_super.apply(this, args)

			this.font = this.font.replace(
				/(\d+)(px|em|rem|pt)/g,
				function(w, m, u) {
					return m / PIXEL_RATIO + u
				}
			)
		}
	})(prototype.fillText)

	prototype.strokeText = (function(_super) {
		return function() {
			var args = Array.prototype.slice.call(arguments)

			args[1] *= PIXEL_RATIO // x
			args[2] *= PIXEL_RATIO // y

			this.font = this.font.replace(
				/(\d+)(px|em|rem|pt)/g,
				function(w, m, u) {
					return m * PIXEL_RATIO + u
				}
			)

			_super.apply(this, args)

			this.font = this.font.replace(
				/(\d+)(px|em|rem|pt)/g,
				function(w, m, u) {
					return m / PIXEL_RATIO + u
				}
			)
		}
	})(prototype.strokeText)
})(CanvasRenderingContext2D.prototype)

//兼容 Retina 屏幕
const setRetina = (canvas,context,width,height) => {
	var ratio = PIXEL_RATIO
	canvas.style.width = width + "px"
	canvas.style.height = height + "px"
	// 缩放绘图
	context.setTransform(ratio, 0, 0, ratio, 0, 0)
	canvas.width = width * ratio
	canvas.height = height * ratio
	context._retinaRatio = ratio
	return ratio
}

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

/*16进制颜色转为RGB格式 传入颜色值和透明度 */ 
const color2Rgb = (str, op) => {
	const reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/
	let sColor = str.toLowerCase()
	// 如果不传，那就随机透明度
	op = op || (Math.floor(Math.random() * 10) + 4) / 10 / 2
	let opStr = `,${op})`
	// 这里使用 惰性返回，就是存储一下转换好的，万一遇到转换过的就直接取值
	if (this[str]) {return this[str] + opStr}
	if (sColor && reg.test(sColor)) {
	// 如果是十六进制颜色码
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
	// 不是我就不想管了
	return sColor
}
// 获取数组中随机一个值
const getArrRandomItem = (arr) => arr[Math.round(Math.random() * (arr.length - 1 - 0) + 0)]
/* 保留小数 */
const toFixed = (a, n) => parseFloat(a.toFixed(n || 1))
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

//离屏缓存
const getCachePoint = (r,color,cacheRatio) => {
	let key = r + "cache" + color
	if(this[key]){return this[key]}
	//离屏渲染
	const _ratio = 2 * cacheRatio,
		width = r * _ratio,
		cR = toFixed(r * cacheRatio),
		cacheCanvas = document.createElement("canvas"),
		cacheContext = Canvas2DContext(cacheCanvas)
	setRetina(cacheCanvas,cacheContext,width,width)
	// cacheCanvas.width = cacheCanvas.height = width
	cacheContext.save()
		.fillStyle(color)
		.arc(cR, cR, cR, 0, 360)
		.closePath()
		.fill()
		.restore()
	this[key] = cacheCanvas

	return cacheCanvas
}


const ParticleCanvas = window.ParticleCanvas = function({
	id = "p-canvas",
	num = 30,
	width = 0,
	height = 0,
	parColor = ["#fff"],
	parOpacity,
	maxParR = 4, //粒子最大的尺寸
	minParR = 8, //粒子最小的尺寸
	lineColor = ["#fff"],
	lineOpacity = 0.3,
	lineWidth = 1,
	moveX = 0,
	moveY = 0,
	isMove = true,
	targetColor = ["#fff"],
	targetPpacity = 0.6,
	targetR = 6,
	useCache = false
}){
	//这里是获取到 canvas 对象，如果没获取到我们就自己创建一个插入进去
	const canvas = document.getElementById(id) || document.createElement("canvas")
	if(canvas.id !== id){ (canvas.id = id) && document.body.appendChild(canvas)}
    
	//通过调用上面的方法来获取到一个可以链式操作的上下文
	const context = Canvas2DContext(canvas)
	let currentParticle,
		isWResize = width,
		isHResize = height,
		myReq = null
	let particles = []
	//这里默认的是网页窗口大小，如果传入则取传入的值
	width = width || document.documentElement.clientWidth
	height = height || document.documentElement.clientHeight

	class Particle {
		constructor({context, x, y, r, parColor, parOpacity, lineWidth, lineColor, lineOpacity, moveX, moveY, useCache}){
			this.context = context
			this.x = x
			this.y = y 
			this.r = toFixed(r)
			this.ratio = 3
			this.color = color2Rgb(typeof parColor === "string" ? parColor : getArrRandomItem(parColor), parOpacity) // 颜色
			this.lineColor = color2Rgb(typeof lineColor === "string" ? lineColor : getArrRandomItem(lineColor), lineOpacity)            
			if(lineColor === "#fff"){
				this.color = this.lineColor
			}else{
				this.lineColor = this.color
			}
			this.lineWidth = lineWidth
			//防止初始化越界
			this.x = x > this.r ? x - this.r : x
			this.y = y > this.r ? y - this.r : y
			//初始化最开始的速度
			this.moveX = Math.random() + moveX
			this.moveY = Math.random() + moveY
			this.useCache = useCache
			this.draw()
		}
		draw(){
			if(this.x >= 0 && this.y >= 0){
				if(this.useCache){
					this.context.drawImage(
						getCachePoint(this.r,this.color,this.ratio), 
						toFixed(this.x - this.r) * this.context._retinaRatio, 
						toFixed(this.y - this.r) * this.context._retinaRatio,
						this.r * 2 * this.context._retinaRatio,
						this.r * 2 * this.context._retinaRatio
					)
				}else{
					this.context.beginPath()
						.fillStyle(this.color)
						.arc(toFixed(this.x), toFixed(this.y), toFixed(this.r), 0, Math.PI * 2)
						.fill()
						.closePath()
				}
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
				if(x >= 0 && y >= 0 && lx >= 0 && ly >= 0){
					this.context.beginPath()
						.moveTo(toFixed(x), toFixed(y))
						.lineTo(toFixed(lx), toFixed(ly))
						.closePath()
						.lineWidth(this.lineWidth)
						.strokeStyle(this.lineColor)
						.stroke()
				}
				
			}
		}
		move() {
			//边界判断
			this.moveX = this.x + this.r * 2 < width && this.x > 0 ? this.moveX : -this.moveX
			this.moveY = this.y + this.r * 2 < height && this.y > 0 ? this.moveY : -this.moveY
			//通过偏移量，改变x y的值，绘制
			this.x += this.moveX
			this.y += this.moveY
			this.draw()
		}
	}
    
	//动画函数
	const animate = () => {
		//每次调用要首先清除画布，不然你懂的
		context.clearRect(0, 0, width, height)
		for (let i = 0; i < particles.length; i++) {
			//粒子移动
			particles[i].move()
			for (let j = i + 1; j < particles.length; j++) {
				//粒子连线
				particles[i].drawLine(particles[j])
			}
		}
		/** 
         * 这个放在外面的原因
         * 我不开启isMove的时候，或者currentParticle.x 没有值的情况
         * 放在上面的循环需要每次走循环都判断一次
         * 而放在下面的话只需要执行一次就知道有没有必要再执行 N 次
         * 当然你也可以放里面，问题也不大
        */
		if (isMove && currentParticle.x) {
			for (let i = 0; i < particles.length; i++) {
				currentParticle.drawLine(particles[i])
			}
			currentParticle.draw()
		}
		myReq = requestAnimationFrame(animate)
	}

	//准备一个 init() 方法 初始化画布
	const init = () => {
		// canvas.width = width
		// canvas.height = height
		setRetina(canvas, context, width, height)
		//独立粒子
		if (isMove && !currentParticle) {
			currentParticle = new Particle({
				x: 0,
				y: 0, 
				r: targetR, 
				parColor: targetColor, 
				parOpacity: targetPpacity,
				lineColor,
				lineOpacity, 
				lineWidth,
				context,
				useCache
			}) //独立粒子
			
			const moveEvent = (e = window.event) => {
				//改变 currentParticle 的 x y
				currentParticle.x = e.clientX || e.touches[0].clientX
				currentParticle.y = e.clientY || e.touches[0].clientY
			}
			const outEvent = () => {currentParticle.x = currentParticle.y = null}
            
			const eventObject = {
				"pc": {
					move: "mousemove",
					out: "mouseout"
				},
				"phone": {
					move: "touchmove",
					out: "touchend"
				}
			}
			const event = eventObject[/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent) ? "phone" : "pc"]

			canvas.removeEventListener(event.move,moveEvent)
			canvas.removeEventListener(event.out, outEvent)
			canvas.addEventListener(event.move,moveEvent)
			canvas.addEventListener(event.out, outEvent)
		}
		//自由粒子
		for (let i = 0; i < num; i++) {
			particles.push(new Particle({
				context,
				x: Math.random() * width,
				y: Math.random() * height,
				r: Math.round(Math.random() * (maxParR - minParR) + minParR),
				parColor,
				parOpacity,
				lineWidth, 
				lineColor, 
				lineOpacity,
				moveX,
				moveY,
				useCache
			}))
		}
		//执行动画
		animate()
		/*
            这个判断在于，假设用户只需要一个 500*500 的画布的时候。其实是不需要 resize 的
            而用户如果只是输入其中一个值，另一个值自适应，则认为其需要 resize。
            如果全部都自适应，那则肯定是需要 resize 的
            此逻辑是我自己瞎想的，其实不用也行，只是我觉得这样更符合我自己的需求。
            全部 resize 也是可以的。
        */
		if(!isWResize || !isHResize){
			//防抖走一波
			throttle("resize", "optimizedResize")
			window.addEventListener("optimizedResize",resize)
		}
	}
	const resize = () => {
		//清除 定时器
		if(this.timeout){clearTimeout(this.timeout)}
		//清除 AnimationFrame
		if(myReq){window.cancelAnimationFrame(myReq)}
		//清空 粒子数组
		particles = []
		//设置新的 宽高
		width = isWResize ? width : document.documentElement.clientWidth
		height = isHResize ? height : document.documentElement.clientHeight
		this.timeout = setTimeout(init, 20)
	}
	init()
	return canvas
}

const canvas = ParticleCanvas({})
console.log(canvas)