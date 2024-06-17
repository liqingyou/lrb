<template>
    <div class="home-container">
        <div class="home-swiper-head">
            <i class="iconfont">
                <img src="@/assets/font/more.svg" alt="more.svg" style="height: 1.1rem">
            </i>
            <div class="swiper-name" ref="moduleRef">
                <span v-for="(item, idx) in moduleList" @click="changeSwiper(idx)"
                    :class="{ active: idx === moduleIdx }">{{ item }}</span>
                <div class="red-line" ref="redLineRef">
                    <div></div>
                </div>
            </div>
            <i class="iconfont">
                <img src="@/assets/font/search.svg" alt="search.svg" style="height: 1.1rem">
            </i>
        </div>
        <swiper @swiper="onSwiper" @slideChange="onSlideChange" @progress="onProgress" :initialSlide="moduleIdx"
            class="my-swiper">
            <swiper-slide>
                <div class="slide-content">1</div>
            </swiper-slide>
            <swiper-slide>
                <Explore></Explore>
            </swiper-slide>
            <swiper-slide>
                <div class="slide-content">3</div>
            </swiper-slide>
        </swiper>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import Explore from './Explore.vue'

const moduleList = reactive(['关注', '发现', '附近'])

// 点击切换
let moduleIdx = ref(1)
const changeSwiper = (idx) => {
    console.log("切换:", idx)
    moduleIdx.value = idx
    mySwiper?.slideTo(idx)
}

// 初始化swiper
let mySwiper = null
const onSwiper = (swiper) => {
    mySwiper = swiper
}

const onSlideChange = ({ activeIndex }) => {
    moduleIdx.value = activeIndex
}

const redLineRef = ref(null)
const moduleRef = ref(null)

// 计算每个关键位置, 红线的偏移量
let posList = []
const getModuleParams = () => {
    const modules = moduleRef.value.querySelectorAll('span')
    const redLineWidth = redLineRef.value.getBoundingClientRect().width
    for (let i = 0; i < modules.length; i++) {
        let moduleRect = modules[i].getBoundingClientRect()
        posList.push(moduleRect.left + moduleRect.width / 2 - redLineWidth / 2)
    }
}

// 监听滑动过程
const onProgress = ({ progress }) => {
    if (posList.length === 0) return
    // 滑动到最后一个
    if (progress === 1) {
        redLineRef.value.style.transform = `translateX(${posList[posList.length - 1]}px)`
        redLineRef.value.children[0].style.transform = `scaleX(1)`
    }
    // 计算偏移量
    let nowPosIdx = progress * (moduleList.length - 1)
    let nowPosIdxInt = Math.floor(nowPosIdx)
    let trans = (posList[nowPosIdxInt + 1] - posList[nowPosIdxInt]) * (nowPosIdx - nowPosIdxInt) + posList[nowPosIdxInt]

    redLineRef.value.style.transform = `translateX(${trans}px)`

    // 计算缩放
    let maxScale = 2 // 最大缩放比
    let gap = nowPosIdx - nowPosIdxInt
    let scale = gap <= 0.5 ? gap : 1 - gap // 先拉伸后还原
    scale = scale * maxScale + 1

    redLineRef.value.children[0].style.transform = `scaleX(${scale})`

}

onMounted(() => {
    getModuleParams()
    // 初始化位置
    onProgress({ progress: moduleIdx.value == 0 ? 0 : moduleIdx.value / (moduleList.length - 1) })
    window.addEventListener('resize', () => {
        nextTick(() => {
            posList = []
            getModuleParams()
        })
    })
})

</script>

<style lang="scss" scoped>
.home-container {

    .my-swiper {
        height: 100vh;
        background-color: #f5f5f5;

        .slide-content {
            @include flexcc;
            height: 50vh;
        }
    }

    .home-swiper-head {
        position: fixed;
        top: 0;
        left: 0;
        height: 3rem;
        right: 0;
        background-color: #fff;
        padding: 0 1rem;
        z-index: 2;
        @include flexbc;

        .iconfont {
            font-size: 1.2rem;
            color: rgb(51, 51, 51);
            @include flexcc;
        }

        .iconfont:nth-child(1) {
            color: rgb(248, 230, 28);
        }

        .swiper-name {
            @include flexcc;
            font-size: 0.9rem;
            color: rgb(149, 149, 149);

            span {
                padding: .9365rem;
                box-sizing: content-box;
                transition: all .2s linear; // 动画

                &.active {
                    // font-size: 1rem;
                    color: rgb(51, 51, 51);
                    font-weight: bold;
                }
            }

            .red-line {
                position: absolute;
                bottom: 0.5rem;
                left: 0;
                transition: all .2s linear;

                >div {
                    border-radius: .1875rem;
                    background-color: #ff0000;
                    width: 1.875rem;
                    height: .1875rem;
                    transition: all .2s linear;
                }
            }

        }
    }
}
</style>