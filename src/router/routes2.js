const routes2 = [{
    path: '/signup',
    name: '注册',
    component: () => import('../views/User/Signup.vue')
}, {
    path: '/login',
    name: '登录',
    component: () => import('../views/User/Login.vue')
},]

export default routes2