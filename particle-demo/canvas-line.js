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
/* 保留小数 */
const toFixed = (a, n) => parseFloat(a.toFixed(n || 1))
// 获取数组中随机一个值
const getArrRandomItem = (arr) => arr[Math.round(Math.random() * (arr.length - 1 - 0) + 0)]
// 获取两条直线的相交坐标
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

const LineCanvas = window.LineCanvas = function({
	id = "p-canvas",
	num = 12,
	width = 0,
	height = 0,
	parColor = ["#2C5364"],
	pointR = 3,
	parPpacity = 1,
	lineColor = "#fff",
	lineOpacity = 0.5,
	lineWidth = 1,
	moveX = 1.2,
	moveY = 1.2,
	userCache = true,
	cacheRatio = 5
}){
	const canvas = document.getElementById(id) || document.createElement("canvas")
	if(canvas.id !== id){ (canvas.id = id) && document.body.appendChild(canvas)}
	
	const context = Canvas2DContext(canvas),
		isWResize = width,
		isHResize = height 
	let round = [], // 粒子数组
		myReq = null // requestAnimationFrameId
	
	width = width || document.documentElement.clientWidth
	height = height || document.documentElement.clientHeight
	
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
			if(this.dir > 0){
				//横向
				this.targetA.y = this.target1.y
				this.targetB.y = this.target2.y
			}else{
				//竖直
				this.targetA.x = this.target1.x
				this.targetB.x = this.target2.x
			}
			this.context.beginPath()
				.moveTo(toFixed(this.targetA.x), toFixed(this.targetA.y))
				.lineTo(toFixed(this.targetB.x), toFixed(this.targetB.y))
				.closePath()
				.lineWidth(this.lineWidth)
				.strokeStyle(this.lineColor)
				.stroke()
		}
		drawPoint(line){
			let point = segmentsIntr(this.targetA,this.targetB,line.targetA,line.targetB)
			if(point){
				if(!this.userCache){
					this.context.fillStyle(this.color)
						.beginPath()
						.arc(toFixed(point.x), toFixed(point.y), this.r, 0, 360)
						.closePath()
						.fill()
				}else{
					this.context.drawImage(
						getCachePoint(this.r,this.color,this.ratio), 
						(point.x - this.r) * this.context._retinaRatio, 
						(point.y - this.r) * this.context._retinaRatio,
						this.r * 2 * this.context._retinaRatio,
						this.r * 2 * this.context._retinaRatio
					)
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
    
	//动画函数
	const animate = () => {
		context.clearRect(0, 0, width, height)
		for (let i = 0; i < round.length; i++) {
			round[i].move()
		}
		for (let i = 0; i < round.length; i++) {
			for (let j = i + 1; j < round.length; j++) {
				round[i].drawPoint(round[j])
			}
		}
		myReq = requestAnimationFrame(animate)
	}
   
	const init = () => {
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

const canvas = LineCanvas({})
console.log(canvas)

