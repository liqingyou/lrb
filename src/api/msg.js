import {request} from '@/utils/request'

export function getMsgList(params, data) {
    return request({url: '/dy/msg/list', method: 'get', params, data})
}

// 增加消息
export function addMsg(params, data) {
    return request({url: '/dy/msg/insert', method: 'post', params, data})
}

// 获取ai
export function getAi(params, data) {
    return request({url: '/dy/msg/ai', method: 'post', params, data})
}
