<!--
 * @Author: xiaohuolong
 * @Date: 2020-12-10 14:30:00
 * @LastEditors: xiaohuolong
 * @LastEditTime: 2020-12-11 17:59:37
 * @FilePath: /tool.demo/FrameAnimation/src/App.vue
-->
<template>
  <div class='frame'>
    <div class='frame-form'>
      <input 
        ref='input' 
        type="file" 
        multiple 
        @change="fileChange"
      />
    </div>
    <div class='frame-image'>
      <div style="position: absolute; z-index: -1000;opacity: 0;">
        <img 
          v-for="(item, index) in files" 
          :key='`img-${index}`' 
          :src="item.src" 
          :alt="item.name"
          @load='(e) => loadImage(e, index)'
        />
      </div>
      <canvas ref='canvas' ></canvas>
    </div>
    <div class='frame-preview'>
      <div class='ani'></div>
    </div>
    <div class='frame-code'>
      <div v-highlight>
          <pre>
              <code>
{{animationCssText}}
              </code>
          </pre>
      </div>
      <textarea class='base64-area' v-model="animationCssBase64"></textarea>
    </div>
  </div>
</template>

<script>
// 1. 上传图片
// 2. canvas 绘制图片
// 3. 生成图片位置信息
export default {
  computed: {
    canvas(){
      return this.$refs.canvas
    },
    ctx(){
      return this.canvas.getContext('2d')
    },
  },
  data() {
    return {
      files: [],
      totalCount: 0,
      loadCount: 0,
      backgroundImage: '',
      animationCssText: ``,
      animationCssBase64: '',
      mode: 1,
    }
  },
  mounted(){
    console.log(this.canvas)
  },
  methods: {
    async fileChange(e){
      console.log(e)
      let files = Array.from(e.target.files)
      console.log(files)
      if(!window.FileReader) return alert('沙雕浏览器赶紧放弃吧');
      if(files.length < 2) return alert('一张图就不要过来凑热闹了好么');
      this.totalCount = files.length
      this.loadCount = 0
      this.files = await Promise.all(files.map(async (item, index) => {
        const src = await this.uploadFile(item)
        const file = {}
        file._origin = item
        file.src = src
        file.filename = item.name
        file.index = index
        return file
      }))
      console.log(this.files)
    },
    uploadFile(file){
      return new Promise((res, rej) => {
        let reader = new FileReader()
        reader.onload = (event) => { 
          const src = event.target.result
          res(src)
        }
        reader.readAsDataURL(file)
      })
    },
    loadImage(e, index){
      this.files[index].width = e.target.offsetWidth
      this.files[index].height = e.target.offsetHeight
      this.files[index].image = e.target
      this.loadCount += 1
      if(this.loadCount == this.totalCount) this.loadAll()
    },
    drawImage(image, x, y, width, height){
      this.ctx.drawImage(image, x, y, width, height)
      this.ctx.closePath();
    },
    loadAll(){
      console.log('loadAll')
      let maxWidth = Math.max(...this.files.map(item => item.width))
      let maxHeight = Math.max(...this.files.map(item => item.height))
      let allWidth = this.files.reduce((prev, item) => prev + item.width, 0)
      let allHeight = this.files.reduce((prev, item) => prev + item.height, 0)
      console.log(maxWidth, maxHeight, allWidth, allHeight)
      this.canvas.width = maxWidth
      this.canvas.height = allHeight
      let x = 0
      let y = 0
      let len = this.files.length
      let zen = len > 2 ? 100 / (this.files.length - 1) : 100
      let process = 0
      this.animationCssText = ''
      this.animationCssText = `@-webkit-keyframes testAni {`
      this.files.forEach(item => {
        this.drawImage(item.image, x, y, item.width, item.height)
        item.x = -x
        item.y = -y
        console.log(`${item.filename} ${item.x}px ${item.y}`)
        this.animationCssText += `
  ${Math.floor(process *  100) / 100}%{
    background-position: ${item.x}px ${item.y}px;
  }
`
        y += item.height
        process += zen
      })
      this.animationCssText += `}`
      this.ctx.mozImageSmoothingEnabled = false;
      this.ctx.webkitImageSmoothingEnabled = false;
      this.ctx.msImageSmoothingEnabled = false;
      this.ctx.imageSmoothingEnabled = false;
      this.backgroundImage = this.canvas.toDataURL()
      this.animationCssText += `
.ani{
  width: ${maxWidth}px; 
  height: ${maxHeight}px;
  background: no-repeat center center / contain;
  background-position: -0 -0;
  background-size: ${maxWidth}px;
  z-index: 2;
  -webkit-animation: testAni 5s steps(1, start) infinite;
  animation: testAni 5s steps(1, start) infinite;
  -webkit-animation-fill-mode: forwards;
  animation-fill-mode: forwards;
}
`
      this.animationCssBase64 = `.ani{background-image: url(${this.backgroundImage});}`
      document.getElementsByTagName('style')[0].appendChild(document.createTextNode(this.animationCssText + this.animationCssBase64))
    }
  }
}
</script>

<style>
  .frame{
    display: flex;
    flex-direction: column;
  }
</style>