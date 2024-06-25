import BaseHeader from '../components/BaseHeader.vue'
import Back from '../components/Back.vue'
import Loading from '../components/Loading.vue'
import BaseFooter from '../components/BaseFooter.vue'
import BaseMask from '../components/BaseMask.vue'
import NoMore from '../components/NoMore.vue'
import CONST_VAR from './const_var'

export default {
    components: {
        BaseHeader,
        'dy-back': Back,
        Loading,
        BaseFooter,
        BaseMask,
        NoMore,
    },
    data() {
        return {
            SUCCESS: 200,
            RELATE_ENUM: CONST_VAR.RELATE_ENUM
        }
    },
    directives: {
        longpress: {
            beforeMount: function (el, binding, vNode) {
                // 确保提供的表达式是函数
                if (typeof binding.value !== 'function') {
                    // 获取组件名称
                    const compName = vNode.context.name
                    // 将警告传递给控制台
                    let warn = `[longpress:] provided expression '${binding.expression}' is not afunction, but has to be `
                    if (compName) {
                        warn += `Found in component '${compName}' `
                    }
                    console.warn(warn)
                }
                // 定义变量
                let pressTimer = null
                // 定义函数处理程序
                // 创建计时器（ 1秒后执行函数 ）
                const start = (e) => {
                    if (e.type === 'click' && e.button !== 0) {
                        return
                    }
                    if (pressTimer === null) {
                        pressTimer = setTimeout(() => {
                            // 执行函数
                            handler(e)
                        }, 300)
                    }
                }
                // 取消计时器
                const cancel = () => {
                    // 检查计时器是否有值
                    if (pressTimer !== null) {
                        clearTimeout(pressTimer)
                        pressTimer = null
                    }
                }
                // 运行函数
                const handler = (e) => {
                    // e.stopImmediatePropagation()
                    e.stopPropagation()
                    e.preventDefault()
                    // 执行传递给指令的方法
                    binding.value(e)
                }
                // 添加事件监听器
                el.addEventListener('touchstart', start)
                // 取消计时器
                el.addEventListener('click', cancel)
                el.addEventListener('touchend', cancel)
                el.addEventListener('touchcancel', cancel)
            }
        }
    }
}