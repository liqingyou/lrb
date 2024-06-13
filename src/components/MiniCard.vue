<template>
    <div ref="contentTab" class="card-content" @click="handleClick">
        <div class="card-top">
            <div class="card-tri-bg" v-if="props.info.isVideo">
                <svg viewBox="-30 -50 200 300" class="card-svg">
                    <polygon class="card-tri" stroke-linejoin="round" points="0,0 0,200 170,100"></polygon>
                </svg>
            </div>
            <img ref="contentImg" :src="props.info.imageUrl[0]" class="card-source hidden" @load="imageLoadOk" alt=""/>
        </div>
        <div class="card-title">
            {{ props.info.title ? props.info.title : '' }}
            {{ props.info.content ? props.info.content : '' }}
        </div>
        <div class="card-bottom">
            <div class="card-b-left">
                <img :src="props.info.avatar" class="card-head" alt=""/>
                <div class="card-name">{{ props.info.author }}</div>
            </div>
            <div class="card-b-right">
                <i class="iconfont icon-aixin1 icon-card-small"></i>
                <p class="card-like" v-if="props.info.likeCount > 0">{{ props.info.likeCount }}</p>
                <p class="card-like" v-else>赞</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import {ref, toRefs, watch} from 'vue'
import useHooks from '@/hooks/useHooks';
// import { exploreCardsMock } from '../mock/homeData'
// let info = reactive({})
// info = exploreCardsMock()

const props = defineProps(['info'])
const emits = defineEmits(['onImgLoaded'])

const {popPara, isOpenDetail} = toRefs(useHooks.state)
const {changeOpenStatus} = useHooks

const contentTab = ref(null)
const contentImg = ref(null)

function imageLoadOk() {
    contentImg.value.classList.remove('hidden')
    contentImg.value.classList.add('visible')
    setTimeout(function () {
        contentImg.value.classList.add("fade-in");
    }, 50);
    emits('onImgLoaded')
}

function handleClick() {
    // handleClick(_this)
    // handleClick(this)
    // popPara.value = {
    //     x: _this.$el.getBoundingClientRect().x,
    //     y: _this.$el.getBoundingClientRect().y,
    //     width: _this.$el.getBoundingClientRect().width,
    //     height: _this.$el.getBoundingClientRect().height,
    //     imgH: contentImg.value.height,
    //     imgW: contentImg.value.width
    // }
    popPara.value = {
        x: contentTab.value.getBoundingClientRect().x,
        y: contentTab.value.getBoundingClientRect().y,
        width: contentTab.value.getBoundingClientRect().width,
        height: contentTab.value.getBoundingClientRect().height,
        imgH: contentImg.value.height,
        imgW: contentImg.value.width
    }
    // console.log(popPara.value)
    popPara.value.info = props.info
    changeOpenStatus(true)
    contentTab.value.style.opacity = 0
}

watch(() => isOpenDetail.value, (newVal, oldVal) => {
    if (!newVal) {
        contentTab.value.style.opacity = 1
    }
})
</script>

<style lang="scss" scoped>

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}

.loading-spinner {
    border: 16px solid #f3f3f3;
    border-top: 16px solid #3498db;
    border-radius: 50%;
    width: 60px;
    height: 60px;
    animation: spin 2s linear infinite;
    position: re;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

img.hidden {
    opacity: 0;
}

img.visible {
    transition: opacity 1s ease-in-out;
}

img.fade-in {
    opacity: 1;
}

.card-content {
    width: 50vw;
    height: auto;
    background-color: #fefefe;
    border: 1px solid #e0e0e0;
    border-radius: 0.5rem;
    box-shadow: 0 .125rem .3125rem rgba(181, 181, 191, 0.1);
    overflow: hidden;
    position: absolute;

    .card-top {
        position: relative;

        .card-tri-bg {
            position: absolute;
            right: 0.675rem;
            top: 0.625rem;
            width: 1.5rem;
            height: 1.5rem;
            border-radius: 50%;
            background-color: rgba(0, 0, 0, 0.2);
            @include flexcc;

            .card-svg {
                width: 0.8rem;
                height: 0.8rem;

                .card-tri {
                    fill: rgb(254, 254, 254);
                    stroke: rgb(254, 254, 254);
                    stroke-width: 50;
                }
            }
        }

        .card-source {
            width: 100%;
            //min-height: 9rem;
            //max-height: 16rem;
            //object-fit: cover;
            //object-position: center;
            //filter: blur(5px); /* 调整模糊度 */
        }
    }

    .card-title {
        width: calc(100% - 1rem);
        font-size: 0.75rem;
        letter-spacing: 0.05rem;
        color: rgb(51, 51, 51);
        line-height: 1.125rem;
        padding: 0 0.5rem;
        font-weight: 600;

        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    .card-bottom {
        padding: 0.8rem 0.5rem;
        @include flexlr;

        .card-b-left {
            @include flexxl;

            .card-head {
                width: 1.2rem;
                height: 1.2rem;
                border-radius: 50%;
            }

            .card-name {
                color: rgb(133, 133, 133);
                font-size: 0.625rem;
                margin: 0 0 0 .4375rem;
            }
        }

        .card-b-right {
            @include flexxl;

            .icon-card-small {
                font-size: 0.625rem;
                color: rgb(153, 153, 153);
            }

            .card-like {
                margin: 0 0 0 0.3rem;
                color: rgb(153, 153, 153);
                font-size: 0.625rem;
            }

        }

    }
}
</style>