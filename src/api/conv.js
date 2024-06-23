import {request} from '@/utils/request'

export function getConvList(params, data) {
    return request({url: '/dy/conv/list', method: 'get', params, data})
}

// 增加会话
export function checkConv(params, data) {
    return request({url: '/dy/conv/check', method: 'post', params, data})
}
