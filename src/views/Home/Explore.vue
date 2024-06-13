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

const {isRefresh} = toRefs(useHooks.state)
const {changeRefresh} = useHooks

let exploreCards = reactive([])
let imgLen // 记录总图片数
let resList = ref([])
let skip = ref(0)

// 获取内容
async function fetchContent() {
    try {
        const {data} = await axios.get(`https://api.bameiapp.com/dy/video/list?size=10&skip=${skip.value}`)
        resList.value = data.data.list
        skip.value = skip.value + data.data.list.length
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
    if (imgCount >= imgLen) {
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