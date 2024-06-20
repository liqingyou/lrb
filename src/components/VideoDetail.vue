<template>
    <div class="card-detail">
        <swiper class="my-swiper" @swiper="onSwiper" :direction="'vertical'"
                @slideChange="onSlideChange" :initialSlide="initSlide" :class="{ 'swiper-no-swiping': swiperLock }">
            <swiper-slide v-for="(item, index) in popPara.info.videoUrl" :key="index">

                <div class="card-head">
                    <i class="iconfont" @click="goBack()">
<!--                        <img src="@/assets/font/back-white.svg" alt="back.svg" style="height: 1.5rem">-->
                        <Icon icon="icon-park-outline:left" />
                    </i>
                    <i class="iconfont">
<!--                        <img src="@/assets/font/share-white.svg" alt="share-white.svg" style="height: 1.5rem">-->
                        <Icon icon="icon-park-outline:share" />
                    </i>
                </div>

                <div class="card-content">

                    <div class="video-content" ref="videoContentRef">
                        <VueZoomContainer>
                            <video ref="videoRef" class="video-source" :src="item"></video>
                        </VueZoomContainer>
                        <div class="video-controls" ref="playRef">
                            <i class="iconfont">
<!--                                <img src="@/assets/font/play.svg" alt="play.svg" style="height: 3.5rem">-->
                                <Icon icon="icon-park-outline:play-one" style="font-size: 6rem"/>
                            </i>
                        </div>
                    </div>

                    <div class="video-info">

                        <div class="video-info-head">
                            <img class="card-head-v" :src="popPara.info.avatar" alt=""/>
                            <div class="card-name">{{ popPara.info.author }}</div>
                            <div class="card-btn-follow">关注</div>
                        </div>

                        <div class="video-info-word">
                            <div class="video-info-pre">
                                <div class="video-info-describe"
                                     v-html="popPara.info.content ? popPara.info.content.replaceAll('<br/>','') : ''">
                                </div>
                            </div>
                            <div class="video-info-icon">
                                <i class="iconfont">
<!--                                    <img src="@/assets/font/kuo-white.svg" alt="kuo-white.svg" style="height: 0.9rem">-->
                                    <Icon icon="icon-park-outline:extend" />
                                </i>
                            </div>
                        </div>

                    </div>

                    <div class="video-progress" @touchstart="startDrag" ref="progressBar">
                        <div class="video-progress-cur" :style="`width:${curTime / totalTime * 100}%`"></div>
                    </div>

                </div>

                <div class="card-bottom" ref="cardBottomRef">
                    <div class="card-say-sth">
                        <i class="iconfont icon-aixin1"></i>
                        <p>发送弹幕...</p>
                    </div>
                    <div class="card-san-lia">
                        <div>
                            <i class="iconfont">
<!--                                <img src="@/assets/font/heart-white.svg" alt="heart.svg" style="height: 1.49rem">-->
                                <Icon icon="icon-park-outline:like" />
                            </i>
                            <p>77</p>
                        </div>
                        <div>
                            <i class="iconfont">
<!--                                <img src="@/assets/font/star-white.svg" alt="star.svg" style="height: 1.4rem">-->
                                <Icon icon="icon-park-outline:star" />
                            </i>
                            <p>88</p>
                        </div>
                        <div>
                            <i class="iconfont">
<!--                                <img src="@/assets/font/comment-white.svg" alt="comment.svg" style="height: 1.5rem">-->
                                <Icon icon="icon-park-outline:comment" style="margin-top: 0.11rem"/>
                            </i>
                            <p>99</p>
                        </div>
                    </div>
                </div>

            </swiper-slide>
        </swiper>
    </div>
</template>

<script setup>
import {onMounted, ref, toRefs, watch} from 'vue'
import {Swiper, SwiperSlide} from 'swiper/vue'
import 'swiper/css'
import useHooks from '@/hooks/useHooks';
import { Icon } from '@iconify/vue';

const emit = defineEmits(['goBack'])
const {popPara, isOpenDetail} = toRefs(useHooks.state)
let videoData = ref([1])
let initSlide = ref(0)
let aIndex = ref(0)
const swiperLock = ref(false)

let videoRef = ref(null)
let playRef = ref(null)
let videoContentRef = ref(null)

let mySwiper
const onSwiper = (swiper) => {
    mySwiper = swiper
}
const onSlideChange = ({activeIndex}) => {
    aIndex.value = activeIndex
}

// 播放暂停
let curTime = ref(0) // 当前时间
let totalTime = ref(0) // 总时间
function handlePlay() {
    curTime.value = this.currentTime
    playRef.value[aIndex.value].classList.remove('btn-show')
}

function handleTimeUpdate() {
    curTime.value = this.currentTime
    totalTime.value = this.duration
}

function handlePause() {
    curTime.value = this.currentTime
    if (playRef.value[aIndex.value]) {
        playRef.value[aIndex.value].classList.add('btn-show')
    }
}

function handleClick() {
    if (videoRef.value[aIndex.value].paused) {
        videoRef.value[aIndex.value].play();
    } else {
        videoRef.value[aIndex.value].pause();
    }
}

const bindVideoListener = (oldIndex = undefined) => {
    // 清除旧视频的监听
    if (oldIndex !== undefined) {
        let oldVideo = videoRef.value[oldIndex]
        if (oldVideo) {
            oldVideo.pause()
        }
        oldVideo.removeEventListener('play', handlePlay)
        oldVideo.removeEventListener('timeupdate', handleTimeUpdate)
        oldVideo.removeEventListener('pause', handlePause)
        videoContentRef.value[oldIndex].removeEventListener('click', handleClick)
    }
    // 新的视频上绑定监听
    let newVideo = videoRef.value[aIndex.value]
    newVideo.play()
    newVideo.addEventListener('play', handlePlay)
    newVideo.addEventListener('timeupdate', handleTimeUpdate)
    newVideo.addEventListener('pause', handlePause)
    videoContentRef.value[aIndex.value].addEventListener('click', handleClick)
}

onMounted(() => {
    bindVideoListener()
})

watch(() => aIndex.value, (newVal, oldVal) => {
    bindVideoListener(oldVal)
})

const goBack = () => {
    emit(`goBack`)
}

let progressBar = ref(null)
let progress = ref(0)
let isDragging = ref(false)

// 拖拽视频进度条
function startDrag(event) {
    isDragging.value = true
    updateProgressBar(event)
    document.addEventListener('touchmove', onDrag);
    document.addEventListener('touchend', stopDrag);
}

function onDrag(event) {
    if (isDragging.value) {
        updateProgressBar(event);
    }
}

function stopDrag(event) {
    isDragging.value = false
    updateProgressBar(event);
    document.removeEventListener('touchmove', onDrag);
    document.removeEventListener('touchend', stopDrag);
}

function updateProgressBar(event) {
    const rect = progressBar.value[aIndex.value].getBoundingClientRect();
    const clientX = event.touches ? event.touches[0].clientX : event.clientX;
    const offsetX = clientX - rect.left;
    const newProgress = Math.max(0, Math.min(100, (offsetX / rect.width) * 100));
    progress.value = newProgress;
    videoRef.value[aIndex.value].currentTime = (newProgress / 100) * totalTime.value;
}
</script>

<style lang="scss" scoped>
.card-detail {
    height: 100%;
    width: 100%;
    background-color: rgba(0, 0, 0, 1);
    overflow: hidden;
    transition: all 0.3s linear;

    .my-swiper {
        position: relative;
        width: 100%;
        height: 100%;
        @include flexcc;
    }

    .card-head {
        position: absolute;
        z-index: 900;
        width: calc(100% - 2rem);
        height: 3rem;
        overflow: hidden;
        padding: 0 1rem;
        @include flexlr;

        .iconfont {
            font-size: 1.5rem;
            color: rgb(255, 255, 255);
            @include flexcc;
        }
    }

    .card-content {
        position: relative;
        width: 100%;
        height: calc(100% - 3.1rem);
        @include flexcc;

        .video-content {
            position: relative;
            width: 100%;
            height: 100%;
            @include flexcc;
        }

        .video-source {
            width: 100%; /* 视频宽度设置为100% */
            height: auto; /* 视频高度自动调整，保持宽高比 */
            max-height: calc(100%);
        }

        .video-controls {
            position: absolute;
            z-index: 130;
            display: none;

            i {
                color: rgba(255, 255, 255, 0.35);
                font-size: 3rem;
            }
        }

        .video-info {
            position: absolute;
            z-index: 200;
            bottom: 0;
            left: 0.7rem;
            right: 0.7rem;

            .video-info-head {
                margin: 0 0 1rem;
                @include flexxl;

                .card-head-v {
                    width: 1.875rem;
                    height: 1.875rem;
                    border-radius: 50%;
                }

                .card-name {
                    color: rgb(255, 255, 255);
                    font-size: 0.875rem;
                    margin: 0 0.625rem;
                }

                .card-btn-follow {
                    border-radius: 50px;
                    background-color: rgb(254, 36, 66);
                    color: rgb(254, 254, 254);
                    font-weight: bold;
                    font-size: 0.6875rem;
                    margin: 0 0.9rem 0 0;
                    width: 3.75rem;
                    height: 1.5rem;
                    @include flexcc;
                }
            }

            .video-info-word {
                padding: 0 0 1rem;
                @include flexlr;

                .video-info-describe {
                    font-size: 0.75rem;
                    line-height: 1.2rem;
                    letter-spacing: 0.05rem;
                    color: rgb(255, 255, 255);
                    overflow: hidden;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    max-height: 2.4rem;
                    width: 80vw;
                    transition: all 0.1s linear;
                }

                .video-tag {
                    font-size: 0.75rem;
                    line-height: 1.2rem;
                    color: rgb(220, 237, 255);
                }

                .video-info-icon {
                    background-color: rgba(255, 255, 255, 0.2);
                    border-radius: 50%;
                    width: 1.8rem;
                    height: 1.8rem;
                    @include flexcc;

                    i {
                        font-size: 0.8rem;
                        color: rgb(255, 255, 255);
                    }
                }
            }
        }

        .video-progress {
            position: absolute;
            bottom: 0;
            z-index: 200;
            left: 0.7rem;
            right: 0.7rem;
            width: 94%;
            height: 2px;
            background-color: rgba(255, 255, 255, 0.5);

            .video-progress-cur {
                position: absolute;
                z-index: 165;
                // width: 20%;
                height: 100%;
                background-color: rgba(255, 255, 255, 0.8);
            }
        }
    }

    .card-bottom {
        width: calc(100% - 2rem);
        height: 3.1rem;
        overflow: hidden;
        padding: 0 1rem;
        @include flexlr;

        .card-say-sth {
            background-color: rgba(255, 255, 255, 0.2);
            border-radius: 50px;
            width: 40%;
            height: 1.875rem;
            overflow: hidden;
            @include flexl;

            i {
                font-size: 0.625rem;
                color: rgb(153, 153, 153);
                margin: 0 0.5rem 0 0.8rem;
                padding-right: 0.5rem;
                border-right: 1px solid rgb(153, 153, 153);
            }

            p {
                color: rgb(119, 119, 119);
                font-size: 0.6875rem;
                letter-spacing: 1px;
                white-space: nowrap;
            }

        }

        .card-san-lia {
            width: 50%;
            @include flexlr;

            > div {
                @include flexl;

                i {
                    font-size: 1.3rem;
                    color: rgb(255, 255, 255);
                    font-weight: bold;
                    @include flexcc;
                }

                p {
                    color: rgb(255, 255, 255);
                    font-size: 0.8rem;
                    margin: 0 0 0 0.3rem;
                }
            }
        }
    }
}

.btn-show {
    display: block !important;
    animation: btnShow .2s ease forwards;
}

//.btn-hide {
//    display: none;
//}
</style>