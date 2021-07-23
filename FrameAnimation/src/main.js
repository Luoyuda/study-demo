/*
 * @Author: xiaohuolong
 * @Date: 2020-12-11 14:29:50
 * @LastEditors: xiaohuolong
 * @LastEditTime: 2020-12-11 17:40:36
 * @FilePath: /tool.demo/FrameAnimation/src/main.js
 */
import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
import hljs from "highlight.js";
import 'highlight.js/styles/monokai-sublime.css';

const app = createApp(App)
//自定义一个代码高亮指令
app.directive('highlight', function (el) {
    const blocks = el.querySelectorAll('pre code');
    blocks.forEach((block) => {
        hljs.highlightBlock(block)
    })
})
app.mount('#app')
