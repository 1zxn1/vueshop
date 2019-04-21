import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'

// 引入Login.vue组件
import Login from '../components/Login.vue'

Vue.use(Router)

export default new Router({
  routes: [{ path: '/login', component: Login }]
})
