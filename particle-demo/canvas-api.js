const canvas = document.getElementById("canvas")
const context = canvas.getContext("2d")

/** 矩形
 * fillRect(x,y,width,height)：绘制一个填充的矩形
 * strokeRect(x,y,width,height)：绘制一个矩形的边框
 * clearRect(x, y, width, height)：清除指定矩形区域，让清除部分完全透明。
 * rect(x, y, width, height)：绘制一个左上角坐标为（x,y），宽高为width以及height的矩形。将一个矩形路径增加到当前路径上！
 */
/* #region  */
context.lineWidth = 1
context.fillStyle = "#000"
context.fillRect(0, 0, 50, 50)
context.strokeStyle = "#000"
context.strokeRect(60, 0, 50, 50)
context.rect(0, 60, 50, 50)
context.stroke()

/* #endregion */

/**路径 落笔 线段
 * beginPath()：新建一条路径，生成之后，图形绘制命令被指向到路径上生成路径。
 * closePath()：闭合路径之后图形绘制命令又重新指向到上下文中。
 * stroke()：通过线条来绘制图形轮廓。
 * fill()：通过填充路径的内容区域生成实心的图形
 * moveTo(x,y)：将笔移动到指定的坐标x以及y上。
 * lineTo(x,y)：绘制一条从当前位置到指定x以及y位置的直线。
 */
context.beginPath()
context.moveTo(130, 0) // 从(130, 0) 开始
context.lineTo(180, 0) // 到(180, 0)
context.lineTo(180, 50)
context.lineTo(130, 50)
context.lineTo(130, 0)
context.lineWidth = 4
context.lineCap = "round" // 线条末端线帽为圆角
context.lineJoin = "round" // 拐角时候为圆角
context.strokeStyle = "green" // 描边颜色为绿色
context.fill()
context.stroke()
context.closePath()

/** 圆 圆弧
 * arc(x, y, radius, startAngle, endAngle, anticlockwise)：
 * 画一个以（x,y）为圆心的以radius为半径的圆弧（圆），从startAngle开始到endAngle结束，
 * 按照anticlockwise给定的方向（默认为顺时针）来生成。
 * x：圆心的 x 坐标
 * y：圆心的 y 坐标
 * r：圆的半径
 * sAngle：起始角，以弧度计（弧的圆形的三点钟位置是 0 度）
 * eAngle：结束角，以弧度计
 * counterclockwise：可选。规定应该逆时针还是顺时针绘图。false 为顺时针，true 为逆时针
 * 
 * arcTo(x1, y1, x2, y2, radius)：根据给定的控制点和半径画一段圆弧，再以直线连接两个控制点
 * x1：第一个控制点的 x 轴坐标。
 * y1：第一个控制点的 y 轴坐标。
 * x2：第二个控制点的 x 轴坐标。
 * y2：第二个控制点的 y 轴坐标。
 * radius：圆弧的半径。
 */

/* #region  */
context.beginPath()
context.arc(230, 30, 25, 0, Math.PI * 1.5, false)
context.closePath()
context.lineWidth = 1
context.strokeStyle = "#000"
context.stroke()
context.fillStyle = "red"
context.fill()

context.beginPath()
context.moveTo(300, 10)
context.arcTo(300,100,350,30,30)
context.stroke()
/* #endregion */

/**贝塞尔曲线
 * quadraticCurveTo(cp1x, cp1y, x, y)：
 * 绘制二次贝塞尔曲线，cp1x,cp1y为一个控制点，x,y为结束点。
 * bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y)：
 * 绘制三次贝塞尔曲线，cp1x,cp1y为控制点一，cp2x,cp2y为控制点二，x,y为结束点。
 */
/* #region 贝塞尔曲线 */
//二次贝塞尔曲线
context.beginPath()
context.moveTo(400, 10)
context.quadraticCurveTo(380, 20, 400, 30)
context.quadraticCurveTo(380, 40, 400, 50)
context.quadraticCurveTo(400, 50, 400, 50)
context.quadraticCurveTo(420, 40, 400, 30)
context.quadraticCurveTo(420, 20, 400, 10)
context.lineTo(400,10)
context.stroke()
context.closePath()
// 三次贝塞尔曲线
context.beginPath()
context.moveTo(450, 10)
context.bezierCurveTo(450, 10, 430, 20, 450, 30)
context.bezierCurveTo(450, 30, 430, 40, 450, 50)
context.bezierCurveTo(450, 50, 470, 40, 450, 30)
context.bezierCurveTo(450, 30, 470, 20, 450, 10)
context.lineTo(450,10)
context.stroke()
context.closePath()
/* #endregion */

/**
 * 颜色、阴影、样式、渐变
 * fillStyle	设置图形的填充颜色。
 * strokeStyle	设置图形轮廓的颜色。
 * shadowColor	用于设定阴影颜色效果，默认是全透明的黑色
 * shadowBlur	用于设定阴影的模糊程度
 * shadowOffsetX	设定阴影在 X 轴的延伸距离
 * shadowOffsetY	设定阴影在 Y 轴的延伸距离
 * createLinearGradient(x1, y1, x2, y2)：接受 4 个参数，表示渐变的起点 (x1,y1) 与终点 (x2,y2)。
 * createRadialGradient(x1, y1, r1, x2, y2, r2)：
 * 接受 6 个参数，前三个定义一个以 (x1,y1) 为原点，
 * 半径为 r1 的圆，后三个参数则定义另一个以 (x2,y2) 为原点，半径为 r2 的圆。
 * gradient.addColorStop(position, color)：
 * 接受 2 个参数，position 参数必须是一个 0.0 与 1.0 之间的数值，表示渐变中颜色所在的相对位置。
 */

/* #region */
context.beginPath()
context.fillStyle = "#ed2"
context.shadowColor = "#ed2"
context.strokeStyle = "#fff"
context.shadowBlur = 20
context.arc(85, 85, 20, 0, Math.PI * 2, true)
context.fill()
context.stroke()
context.shadowBlur = 0                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
context.closePath()
context.beginPath()
let lingrad = context.createLinearGradient(130, 60, 180, 110)
lingrad.addColorStop(0, "#00ABEB")
lingrad.addColorStop(1, "#eee")
context.fillStyle = lingrad
context.fillRect(130, 60, 50, 50)
let lingrad2 = context.createLinearGradient(205, 65, 245, 105)
context.strokeStyle = lingrad2
lingrad2.addColorStop(0, "#00ABEB")
lingrad2.addColorStop(1, "#000")
context.arc(225, 85, 20, 0, Math.PI * 2, true)
context.stroke()
let lingrad3 = context.createLinearGradient(205, 65, 245, 105)
lingrad3.addColorStop(0, "#fff")
lingrad3.addColorStop(1, "#00ABEB")
context.fillStyle = lingrad3
context.fill()
let radgrad = context.createRadialGradient(305, 85, 5, 305, 85, 30)
radgrad.addColorStop(0, "#A7D30C")
radgrad.addColorStop(0.5, "#019F62")
radgrad.addColorStop(1, "#A7D30C")
context.fillStyle = radgrad
context.fillRect(280, 60, 50, 50)
context.strokeRect(280, 60, 50, 50)

let testImg = document.getElementById("testImg")
testImg.onload = ()=>{
	console.log(testImg)
	let ptrn = context.createPattern(testImg, "repeat")
	context.fillStyle = ptrn
	context.strokeStyle = ptrn
	context.fillRect(350, 60, 100, 100)
	context.fillStyle = "#fff"
	context.shadowOffsetX = 2
	context.shadowOffsetY = 2
	context.shadowBlur = 20
	context.shadowColor = "rgba(0, 0, 0, 0.5)"
	context.fillRect(470, 60, 100, 100)
	context.strokeRect(470, 60, 100, 100)
	context.shadowBlur = 0
	/**
     * 绘图
     * drawImage(image, x, y)
     * image：规定要使用的图像、画布或视频
     * x、y：起始的 x 、y 坐标位置
     * 
     * drawImage(image, x, y, width, height)
     * image, x, y 参数同上
     * width、height：width 和 height，这两个参数用来控制 当向canvas画入时应该缩放的大小
     * 
     * context.drawImage(img, sx, sy, swidth, sheight, x, y, width, height)
     * image, x, y, width, height 参数同上
     * sx：在图像的 x 坐标位置
     * sy：在图像的 y 坐标位置
     * swidth：要使用的图像的宽度（伸展或缩小图像）
     * sheight：要使用的图像的高度（伸展或缩小图像）
     */
	/* #region 绘图代码 */
	context.drawImage(testImg, 0, 240, 100, 100)
	// 从图片的 (20, 20)开始，裁切一个宽高 30 的图片 ，从 画布 上 (10, 350) 开始绘制一个 宽高 50 的图像
	context.drawImage(testImg, 20, 20, 30, 30, 10, 350, 50, 50)
	/* #endregion */
}

/** 文本
 * fillText(text, x, y [, maxWidth])：在指定的(x,y)位置填充指定的文本，绘制的最大宽度是可选的.
 * strokeText(text, x, y [, maxWidth])：在指定的(x,y)位置绘制文本边框，绘制的最大宽度是可选的.
 * font = value：当前我们用来绘制文本的样式. 默认的字体是 10px sans-serif。
 * textAlign = value：文本对齐选项. 可选的值包括：start, end, left, right or center. 默认值是 start。
 * textBaseline = value：基线对齐选项. 可选的值包括：top, hanging, middle, alphabetic, ideographic, bottom。默认值是 alphabetic。
 * direction = value：文本方向。可能的值包括：ltr, rtl, inherit。默认值是 inherit。
 * measureText() 将返回一个 TextMetrics对象的宽度、所在像素，这些体现文本特性的属性。
 */
context.font = "30px serif"
context.strokeStyle = "#000"
context.fillStyle = "#000"
context.textAlign = "left"
context.direction = "ltr"
context.textBaseline = "top"
let text = context.measureText("落雨Ly")
context.fillText("落雨Ly", 0, 150, text.width)
context.strokeText("落雨Ly", 0, 190, text.width)
/* #endregion */

/**
 * save() 保存 canvas 状态
 * restore() 恢复 canvas 状态
 * 图像转换
 * scale(x,y)	缩放当前绘图至更大或更小
 * rotate(angle)	它用于以原点为中心旋转 canvas ，以弧度为单位的值 x = r*Math.cos(a); y = r*Math.sin(a)
 * translate(x, y)	移动 canvas 和它的原点到一个不同的位置 x、y 是偏移量
 * transform(m11, m12, m21, m22, dx, dy)	当前的变形矩阵乘上一个基于自身参数的矩阵
 * m11：水平方向的缩放
 * m12：水平方向的倾斜偏移
 * m21：竖直方向的倾斜偏移
 * m22：竖直方向的缩放
 * dx：水平方向的移动
 * dy：竖直方向的移动
 * setTransform(m11, m12, m21, m22, dx, dy)	将当前转换重置为单位矩阵，然后运行 transform()
 * resetTransform() 重置当前变形为单位矩阵
 */
/* #region 转换代码 */
context.strokeStyle = "#000"
context.save()
context.scale(1.5, 1.5)
context.rotate(Math.PI * 2 / 25)
context.strokeRect(100, 100, 30, 30) 
context.translate(30, 30)
context.strokeRect(100, 100, 30, 30) 
context.restore()
context.save()
context.setTransform(1.1, 0, 0, 1, 20, 20)
context.strokeStyle = "red"
context.strokeRect(200, 130, 30, 30) 
context.restore()
/* #endregion */



