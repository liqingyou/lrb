<template>
    <LoadPanel @searchMore="searchMore">
        <div ref="refreshRef" class="refresh-div">
            <i class="iconfont icon-loada"></i>
        </div>
        <div ref="exploreRef">
            <MiniCard v-for="(item, index) in exploreCards" :info="item" :key="item.id" @onImgLoaded="addImgCount">
            </MiniCard>
        </div>
    </LoadPanel>
</template>

<script setup>
import {nextTick, onMounted, reactive, ref, toRefs, watch} from 'vue'
import LoadPanel from '../../components/LoadPanel.vue'
import MiniCard from '../../components/MiniCard.vue'
import computeWaterFallFlow from '../../utils/waterFallFlow'
import useHooks from '../../hooks/useHooks'
import axios from 'axios'
import {CONFIG} from "@/utils/global.js";
import router from "@/router/index.js";

const {isRefresh} = toRefs(useHooks.state)
const {changeRefresh} = useHooks

let exploreCards = reactive([])
let imgLen // 记录总图片数
let resList = ref([])
let skip = ref('0')
let pageSize = 10

// 获取内容
async function fetchContent() {
    try {
        let token = localStorage.getItem("adv_token");
        if (token != null && token !== '') {
            let skipLocal = localStorage.getItem("adv_explore_skip")
            if (null != skipLocal) {
                skip.value = skipLocal
            }
            skip.value = 100
            const result = await axios.get(`${CONFIG.base}/dy/video/list?size=${pageSize}&skip=${skip.value}`, {
                headers: {
                    'Authorization': token,
                }
            })
            console.log(result)
            if (result.data.code === 200) {
                resList.value = result.data.result.list
                let rLength = result.data.result.list.length
                if (rLength < pageSize) {
                    // 清除缓存
                    skip.value = "0"
                    localStorage.removeItem("adv_explore_skip")
                } else {
                    skip.value = parseInt(skip.value) + rLength + ""
                    localStorage.setItem("adv_explore_skip", skip.value)
                }
            } else {
                if (result.data.code === 401) {
                    await router.push({"path": "/login"})
                } else if (result.data.code === 500) {
                    alert(result.data.message)
                }
            }
        } else {
            await router.push({"path": "/login"})
        }
    } catch (error) {
        console.error('Error fetching profile content:', error)
    }
}

const initData = async () => {
    // let res = await exploreCardsMock()
    await fetchContent()
    let res = resList.value
    // 后清空数组
    exploreCards.splice(0, exploreCards.length)
    await nextTick(() => {
        imgLen = res.length
        res.forEach(item => {
            exploreCards.push(item)
        });
    })
}

// 瀑布流计算位置
const exploreRef = ref(null)

// 记录card中image是否加载完毕
let imgCount = 0
const addImgCount = () => {
    imgCount++
    if (imgCount === imgLen) {
        // 开始计算瀑布流
        computeWaterFallFlow(exploreRef.value, 2, exploreCards)
    }
}

// 加载更多
const searchMore = async (callback) => {
    // let res = await exploreCardsMock(5)
    await fetchContent()
    let res = resList.value
    res.forEach(item => {
        exploreCards.push(item)
    })
    // 简单写法
    // exploreCards.push(...res)
    imgLen = exploreCards.length
    computeWaterFallFlow(exploreRef.value, 2, exploreCards)
    callback ? callback() : ''
}

const refreshRef = ref(null)
const exploreRefresh = async () => {
    console.log("exploreRefresh")
    exploreRef.value.parentNode.parentNode.scrollTop = 0
    refreshRef.value.style.height = '100px'
    refreshRef.value.style.transition = 'all 0.3s linear'
    imgCount = 0
    await initData()
    computeWaterFallFlow(exploreRef.value, 2, exploreCards)
    // 关闭面饭
    refreshRef.value.style.height = '0px'
    setTimeout(() => {
        refreshRef.value.style.transition = 'all 0.3s linear'
    }, 200)
}

watch(() => isRefresh.value, async (newValue, oldValue) => {
    if (newValue) {
        await exploreRefresh()
        changeRefresh(false)
    }
})

// 首次打开自动加载
onMounted(async () => {
    await exploreRefresh()
})

</script>

<style lang="scss" scoped>
.refresh-div {
    height: 0;
    width: 100%;
    overflow: hidden;
    @include flexcc;

    i {
        color: rgb(154, 154, 154);
        animation: rotate .8s linear infinite;
    }
}
</style>