//index.js
import './css/style-css.css';
import './less/style-less.less';
// import './scss/style-scss.scss';
import(/* webpackChunkName: "utils" */ './utils.js').then(({default:utils}) => console.log(utils))

let a = () => {
  console.log('webpack 配置简单!!!')
}
a()
window.onload = () => {
  document.getElementById('webpack').onclick = e =>{
    import(
      /* webpackChunkName: "lodash" */ 
      `lodash`).then((_) =>{
        console.log(_.uniq([1,1,2,3,3]))
    }) 
    import(
      /* webpackChunkName: "style" */ 
      `./scss/style-scss.scss`).then((_) =>{
        console.log('style-load')
    }) 
  }
}