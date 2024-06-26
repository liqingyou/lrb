const routes2 = [{
    path: '/signup',
    name: '注册',
    component: () => import('../views/User/Signup.vue')
}, {
    path: '/login',
    name: '登录',
    component: () => import('../views/User/Login.vue')
}, {
    path: '/me/edit-userinfo-item',
    name: '编辑资料',
    component: () => import('@/views/User/UserInfo/EditUserInfoItem.vue')
}, {
    path: '/message/chat',
    component: () => import('@/pages/message/chat/Chat.vue')
}, {
    path: '/message/chat/detail',
    component: () => import('@/pages/message/chat/ChatDetail.vue')
},]

export default routes2