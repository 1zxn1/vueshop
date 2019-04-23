import Vue from 'vue'
import App from './App'
import router from './router'

// 引入css文件
import './assets/css/global.css'

// 引入axios
import axios from 'axios'

// 引入icon图标库样式文件
import './assets/fonts/iconfont.css'
// 引入并注册组件
import ElementUI from 'element-ui'
Vue.use(ElementUI)
// Vue.config.productionTip = false

// axios配置请求公共根地址
axios.defaults.baseURL = 'http://127.0.0.1:11333/api/private/v1/'

// 添加请求拦截器
axios.interceptors.request.use(
  config => {
    // Do something before request is sent
    // return config;
    // console.dir(config)
    var token = window.sessionStorage.getItem('token')
    config.headers.Authorization = token
    return config
  },
  error => {
    // Do something with request error
    return Promise.reject(error)
  }
)

// 给axios配置成为Vue的成员
Vue.prototype.$http = axios

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
