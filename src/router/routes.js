const routes = [{
    path: '/',
    name: '首页',
    component: () => import('../views/Home/index.vue')
},{
    path: '/video',
    name: '视频',
    component: () => import('../views/game/jgg.vue')
},{
    path: '/publish',
    name: '发布',
    component: () => import('../views/Publish/index.vue')
},{
    path: '/message',
    name: '消息',
    component: () => import('../views/Message/index.vue')
},{
    path: '/me',
    name: '我',
    component: () => import('../views/User/Me.vue')
},]

export default routes