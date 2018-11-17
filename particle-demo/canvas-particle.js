

const ParticleCanvas = window.ParticleCanvas = function({
	id = "p-canvas",
	num = 80,
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

	class Particle {
		constructor({context,x, y, r, color, opacity,lineColor = "#fff", lineOpacity = 0.1, lineWidth = 1}) {
			this.context = context
			this.r = r > 1 ? r : 1 //粒子尺寸
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
			if (userCache) {
				//是否使用 离屏渲染
				this.cacheCanvas = document.createElement("canvas")
				this.cacheContext = this.cacheCanvas.getContext("2d")
				this.cacheCanvas.width = this.cacheCanvas.height = this.r * this._ratio 
				this.cache()
			}
		}
		draw() {
			if (!userCache) {
				this.context.fillStyle = this.color
				this.context.beginPath()
				this.context.arc(this.x, this.y, this.r, 0, 360)
				this.context.closePath()
				this.context.fill()
			} else {
				this.context.drawImage(this.cacheCanvas, this.x - this.r * this.ratio, this.y - this.r * this.ratio)
			}
		}
		drawLine(_round) {
			let dx = this.x - _round.x
			let dy = this.y - _round.y
			if (Math.sqrt(dx * dx + dy * dy) < 150) {
				this.context.beginPath()
				if (userCache) {
					this.context.moveTo(this.x + this.r / this._ratio, this.y + this.r / this._ratio)
					this.context.lineTo(_round.x + _round.r / this._ratio, _round.y + _round.r / this._ratio)
				} else {
					this.context.moveTo(this.x, this.y)
					this.context.lineTo(_round.x, _round.y)
				}
				this.context.closePath()
				this.context.lineWidth = this.lineWidth
				this.context.strokeStyle = this.lineColor
				this.context.stroke()
			}
		}
		move() {
			this.moveX = this.x + this.r * 2 < width && this.x > 0 ? this.moveX : -this.moveX
			this.moveY = this.y + this.r * 2 < height && this.y > 0 ? this.moveY : -this.moveY
			this.x += this.moveX
			this.y += this.moveY
			this.draw()
		}
		cache() {
			this.cacheContext.save()
			this.cacheContext.fillStyle = this.color
			this.cacheContext.arc(this.r * this.ratio, this.r * this.ratio, this.r, 0, 360)
			this.cacheContext.closePath()
			this.cacheContext.fill()
			this.cacheContext.restore()
			
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
	let currentParticle // 独立粒子
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
		canvas.width = width
		canvas.height = height
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
				currentParticle.x = e.clientX
				currentParticle.y = e.clientY
			}
			const outEvent = () => {currentParticle.x = currentParticle.y = null}

			canvas.removeEventListener("mousemove",moveEvent)
			canvas.removeEventListener("mouseout", outEvent)
			canvas.addEventListener("mousemove",moveEvent)
			canvas.addEventListener("mouseout", outEvent)
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
				context
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

const canvas = ParticleCanvas({})
console.log(canvas)