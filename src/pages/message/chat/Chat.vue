<template>
    <div class="Chat">
        <div class="chat-content" @touchstart="data.tooltipTop = -1">
            <div class="header">
                <div class="left">
                    <dy-back @click="router.back"></dy-back>
                    <div class="badge">12</div>
                    <span>{{ convNick }}</span>
                </div>
                <div class="right">
                    <img
                        @click="bus.emit(EVENT_KEY.SHOW_AUDIO_CALL)"
                        src="../../../assets/img/icon/message/chat/call.png"
                        alt=""
                    />
                    <img @click="_no" src="../../../assets/img/icon/message/chat/video-white.png" alt=""/>
                    <img
                        src="../../../assets/img/icon/menu-white.png"
                        alt=""
                        @click="nav('/message/chat/detail')"
                    />
                </div>
            </div>
            <div class="message-wrapper" ref="msgWrapper" :class="isExpand ? 'expand' : ''">
                <ChatMessage
                    @itemClick="clickItem"
                    v-longpress="showTooltip"
                    :message="item"
                    :key="index"
                    v-for="(item, index) in data.messages"
                ></ChatMessage>
            </div>
            <div class="footer">
                <div class="toolbar" v-if="!data.recording">
                    <img src="../../../assets/img/icon/message/camera.png" alt="" class="camera"/>
                    <input
                        @click="data.typing = true"
                        @blur="data.typing = false"
                        type="text"
                        placeholder="发送信息..."
                        v-model="inputValue"
                    />
                    <img @click="handleClick" src="../../../assets/img/icon/message/voice-white.png" alt=""/>
                    <img src="../../../assets/img/icon/message/emoji-white.png" alt=""/>
                    <!--                    <img-->
                    <!--                        @click="data.showOption = !data.showOption"-->
                    <!--                        src="../../../assets/img/icon/message/add-white.png"-->
                    <!--                        alt=""-->
                    <!--                    />-->
                    <img
                        @click="sendMsg"
                        src="../../../assets/img/icon/message/add-white.png"
                        alt=""
                    />
                </div>
                <div class="record" v-else>
                    <span>按住 说话</span>
                    <img
                        @click="data.recording = false"
                        src="../../../assets/img/icon/message/keyboard.png"
                        alt=""
                    />
                </div>
                <div class="options" v-if="data.showOption">
                    <div class="option-wrapper">
                        <div class="option">
                            <img src="../../../assets/img/icon/message/photo.png" alt=""/>
                            <span>照片</span>
                        </div>
                        <div class="option">
                            <img src="../../../assets/img/icon/message/camera2.png" alt=""/>
                            <span>拍摄</span>
                        </div>
                        <div class="option">
                            <img src="../../../assets/img/icon/message/redpack.png" alt=""/>
                            <span>红包</span>
                        </div>
                        <div class="option">
                            <img src="../../../assets/img/icon/message/video.png" alt=""/>
                            <span>视频通话</span>
                        </div>
                        <div class="option">
                            <img src="../../../assets/img/icon/message/audio.png" alt=""/>
                            <span>语音通话</span>
                        </div>
                        <div class="option">
                            <img src="../../../assets/img/icon/message/come-on.png" alt=""/>
                            <span>一起看视频</span>
                        </div>
                        <div class="option">
                            <img src="../../../assets/img/icon/message/come-chang.png" alt=""/>
                            <span>一起唱</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!--  长按工具栏  -->
        <transition name="tooltip">
            <!--      TODO 定位也有问题-->
            <div class="tooltip" :style="{ top: data.tooltipTop + 'px' }" v-if="data.tooltipTop !== -1">
                <div class="options">
                    <img src="../../../assets/img/icon/message/chat/like.png" alt=""/>
                    <span>点赞</span>
                </div>
                <div class="options">
                    <img src="../../../assets/img/icon/message/chat/copy.png" alt=""/>
                    <span>复制</span>
                </div>
                <div class="options">
                    <img src="../../../assets/img/icon/message/chat/send.png" alt=""/>
                    <span>转发</span>
                </div>
                <div class="options">
                    <img src="../../../assets/img/icon/message/chat/comment.png" alt=""/>
                    <span>回复</span>
                </div>
                <div class="options">
                    <img src="../../../assets/img/icon/message/chat/return.png" alt=""/>
                    <span>回复</span>
                </div>
                <div class="options">
                    <img src="../../../assets/img/icon/message/chat/del.png" alt=""/>
                    <span>删除</span>
                </div>
                <!--      TODO 官方的三角头会随着点击位置变动，先注释掉-->
                <!--      <div class="arrow" :class="tooltipTopLocation"></div>-->
            </div>
        </transition>

        <div class="preview-img" v-if="false">
            <div class="header">
                <dy-back mode="light"/>
                <img src="../../../assets/img/icon/search-light.png" alt=""/>
            </div>
            <img :src="data.previewImg" alt="" class="img-src"/>
            <div class="footer"></div>
        </div>

        <!--  红包  -->
        <transition name="scale">
            <div class="red-packet" v-if="data.isShowOpenRedPacket">
                <BaseMask @click="data.isShowOpenRedPacket = false"/>
                <div class="content">
                    <template v-if="data.isOpened">
                        <img src="../../../assets/img/icon/message/chat/bg-open.png" alt="" class="bg"/>
                        <div class="wrapper">
                            <div class="top">
                                <div class="money">0.01元</div>
                                <div class="belong">{{ store.userinfo.nickname }}的红包</div>
                                <div class="password">大吉大利</div>
                            </div>
                            <div class="notice" @click="nav('/message/chat/red-packet-detail')">
                                查看红包详情>
                            </div>
                        </div>
                    </template>
                    <template v-else>
                        <img src="../../../assets/img/icon/message/chat/bg-close.png" alt="" class="bg"/>
                        <div class="wrapper">
                            <div class="top">
                                <img
                                    :src="_checkImgUrl(store.userinfo.cover_url[0].url_list[0])"
                                    alt=""
                                    class="avatar"
                                />
                                <div class="belong">{{ store.userinfo.nickname }}的红包</div>
                                <div class="password">大吉大利</div>
                            </div>

                            <div class="l-button" :class="{ opening: data.opening }" @click="openRedPacket">
                                <template v-if="data.opening">
                                    <img src="../../../assets/img/icon/loading-white.png" alt=""/>
                                    正在打开
                                </template>
                                <span v-else>开红包</span>
                            </div>
                        </div>
                    </template>
                    <img
                        src="../../../assets/img/icon/message/chat/close.png"
                        alt=""
                        class="close"
                        @click="data.isShowOpenRedPacket = false"
                    />
                </div>
            </div>
        </transition>

        <Loading v-if="data.loading"/>
    </div>
</template>
<script setup lang="ts">
import ChatMessage from '../components/ChatMessage.vue'
import {computed, nextTick, onMounted, onUnmounted, reactive, ref, watch} from 'vue'
import {useBaseStore} from '@/store/pinia'
import {_checkImgUrl, _no, _sleep} from '@/utils'
import {useRoute, useRouter} from 'vue-router'
import {useNav} from '@/utils/hooks/useNav'
import bus, {EVENT_KEY} from '@/utils/bus'
import {addMsg, getAi, getMsgList} from '@/api/msg'

let CALL_STATE = {
    REJECT: 0,
    RESOLVE: 1,
    NONE: 2
}
let VIDEO_STATE = {
    VALID: 0,
    INVALID: 1
}
let AUDIO_STATE = {
    NORMAL: 0,
    SENDING: 1
}
let READ_STATE = {
    SENDING: 0,
    ARRIVED: 1,
    READ: 1
}
let MESSAGE_TYPE = {
    TEXT: 0,
    TIME: 1,
    VIDEO: 2,
    DOUYIN_VIDEO: 9,
    AUDIO: 3,
    IMAGE: 6,
    VIDEO_CALL: 4,
    AUDIO_CALL: 5,
    MEME: 7, //表情包
    RED_PACKET: 8 //红包
}
let RED_PACKET_MODE = {
    SINGLE: 1,
    MULTIPLE: 2
}

defineOptions({
    name: 'Chat'
})

const router = useRouter()
const route = useRoute();
const nav = useNav()
const store = useBaseStore()
const msgWrapper = ref<HTMLDivElement>()
const data = reactive({
    previewImg: new URL('../../../assets/img/poster/3.jpg', import.meta.url).href,
    videoCall: [],
    MESSAGE_TYPE,
    //
    messages: [],
    typing: false,
    loading: false,
    opening: false,
    isOpened: false,
    recording: false,
    showOption: false,
    isShowOpenRedPacket: false,
    tooltipTop: -1,
    tooltipTopLocation: ''
})
const inputValue = ref("")
const convNick = ref(route.query.nick)

async function setListData() {
    let res = await getMsgList({
        "convId": route.query.key,
        "skip": 0,
        "size": 10
    }, {});
    data.messages = res.data.result.list.reverse()
    scrollBottom()
}

// 发送消息
async function sendMsg() {
    let res = await addMsg({}, {
        "convId": route.query.key,
        "type": MESSAGE_TYPE.TEXT,
        "data": inputValue.value,
    });
    data.messages.push(res.data.result)
    scrollBottom()
    data.messages.push({
        type: MESSAGE_TYPE.TEXT,
        data: "加载中,请耐心等待...",
        user: {
            id: "ai",
            avatar: "https://d1wreqdqr6ieyc.cloudfront.net/bm/img/woman.jpg"
        }
    })
    scrollBottom()
    let res2 = await getAi({}, {
        "convId": route.query.key,
        "type": MESSAGE_TYPE.TEXT,
        "data": inputValue.value,
    })
    data.messages[data.messages.length - 1] = res2.data.result
    scrollBottom()
}

watch(() => route.query.key, (oldVal, newVal) => {
    data.messages = []
    setListData()
})

onMounted(async () => {
    msgWrapper.value
        .querySelectorAll('img')
        .forEach((item) => item.addEventListener('load', scrollBottom))
    scrollBottom()

    await setListData()
})

onUnmounted(() => {
    if (msgWrapper) {
        msgWrapper.value
            .querySelectorAll('img')
            .forEach((item) => item.removeEventListener('load', scrollBottom))
    }
})

const isExpand = computed(() => {
    return data.showOption
})

function handleClick() {
    data.recording = true
    data.showOption = false
}

function scrollBottom() {
    nextTick(() => {
        let wrapper = msgWrapper.value
        // console.log('wrapper.clientHeight', wrapper.clientHeight)
        // console.log('wrapper.scrollHeight', wrapper.scrollHeight)
        wrapper.scrollTo({top: wrapper.scrollHeight - wrapper.clientHeight})
    })
}

function openRedPacket() {
    data.opening = true
    setTimeout(() => {
        data.opening = false
        nav('/message/chat/red-packet-detail')
    }, 1000)
}

async function clickItem(e) {
    if (e.type === data.MESSAGE_TYPE.RED_PACKET) {
        data.loading = true
        await _sleep(500)
        data.loading = false
        data.isOpened = e.data.state === '已过期'
        data.isShowOpenRedPacket = true
    }
}

function showTooltip(e) {
    console.log(e)
    let wrapper = null
    e.path.map((v) => {
        if (v && v.classList) {
            if (v.classList.value === 'chat-wrapper') {
                wrapper = v
            }
        }
    })
    if (wrapper) {
        // console.log(wrapper.getBoundingClientRect())
        if (wrapper.getBoundingClientRect().y - 61 > 70) {
            data.tooltipTopLocation = 'top'
            data.tooltipTop = wrapper.getBoundingClientRect().y - 70
        } else {
            data.tooltipTopLocation = 'bottom'
            data.tooltipTop =
                wrapper.getBoundingClientRect().y + wrapper.getBoundingClientRect().height + 10
        }
    }
}
</script>

<style>
.scale-enter-active,
.scale-leave-active {
    transition: transform 0.2s ease;
}

.scale-enter-from,
.scale-leave-to {
    transform: scale(0);
}
</style>
<style scoped lang="less">
@import '../../../assets/less/index';

.Chat {
    z-index: 100;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    overflow: auto;
    color: white;
    font-size: 0.875rem;
    background: var(--color-message);

    .chat-content {
        > .header {
            z-index: 2;
            width: 100%;
            box-sizing: border-box;
            height: var(--common-header-height);
            padding: 0 0.625rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid var(--line-color);

            img {
                height: 1.25rem;
                margin: 0 0.625rem;
            }

            .left {
                max-width: 60%;
                overflow: hidden;
                display: flex;
                align-items: center;

                .badge {
                    margin-right: 0.625rem;
                    font-size: 0.75rem;
                    display: block;
                    padding: 1px 6px;
                    border-radius: 10px;
                    color: white;
                    background: var(--second-btn-color);
                }
            }

            .right {
                display: flex;
            }
        }

        .message-wrapper {
            height: calc(var(--vh, 1vh) * 100 - 7.8125rem);
            overflow: auto;

            &.expand {
                height: calc(var(--vh, 1vh) * 100 - (7.8125rem + var(--vh, 1vh) * 30));
            }
        }

        .footer {
            @chat-bg-color: rgb(105, 143, 244);
            @normal-bg-color: rgb(57, 57, 57);
            padding: 0.625rem 0;

            .toolbar {
                box-sizing: border-box;
                height: 2.75rem;
                margin: 0 0.625rem;
                padding: 0.3125rem;
                background: @normal-bg-color;
                border-radius: 1.25rem;
                display: flex;
                align-items: center;

                img {
                    width: 1.5rem;
                    border-radius: 50%;
                    margin-left: 0.9375rem;
                }

                input {
                    flex: 1;
                    outline: none;
                    border: none;
                    background: @normal-bg-color;
                    color: #FFFFFF;
                }

                .camera {
                    margin-left: 0;
                    margin-right: 0.3125rem;
                    width: 0.875rem;
                    padding: 0.3125rem;
                    border-radius: 50%;
                    background: @chat-bg-color;
                }
            }

            .record {
                box-sizing: border-box;
                height: 2.75rem;
                margin: 0 0.625rem;
                padding: 0.625rem 0.3125rem;
                background: @normal-bg-color;
                border-radius: 1.25rem;
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;

                img {
                    right: 0.3125rem;
                    position: absolute;
                    width: 1.5rem;
                    border-radius: 50%;
                    margin-left: 0.9375rem;
                }
            }

            .options {
                font-size: 0.875rem;
                width: 100vw;
                padding: 0.9375rem;
                height: calc(var(--vh, 1vh) * 30);
                box-sizing: border-box;

                .option-wrapper {
                    box-sizing: border-box;
                    @grid-width: calc((100vw - 1.875rem) / 4);
                    color: gray;
                    display: grid;
                    grid-template-columns: @grid-width @grid-width @grid-width @grid-width;

                    .option {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        flex-direction: column;
                        margin-bottom: 0.625rem;

                        img {
                            border-radius: 0.25rem;
                            background: @normal-bg-color;
                            padding: 0.625rem;
                            width: 1.875rem;
                            margin-bottom: 0.625rem;
                        }
                    }
                }
            }
        }
    }

    .preview-img {
        position: fixed;
        z-index: 9;
        top: 0;
        background: black;
        width: 100vw;
        height: calc(var(--vh, 1vh) * 100);

        .header {
            position: fixed;
            width: 100vw;
            box-sizing: border-box;
            padding: var(--page-padding);
            display: flex;
            justify-content: space-between;

            img {
                width: 1.375rem;
            }
        }
    }

    .tooltip {
        z-index: 9;
        left: 50%;
        margin-left: -33%;
        position: fixed;
        font-size: 0.75rem;
        border-radius: 0.375rem;
        //padding: 0.0625rem;
        background: rgb(55, 58, 67);
        display: flex;

        .options {
            width: 2.8125rem;
            height: 3.75rem;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;

            img {
                margin-bottom: 0.25rem;
                width: 1.125rem;
            }
        }

        .arrow {
            width: 0;
            height: 0;
            position: absolute;
            left: 50%;
            transform: translateX(-50%);

            &.bottom {
                top: -0.875rem;
                border: 0.4375rem solid transparent;
                border-bottom: 0.4375rem solid var(--second-btn-color);
            }

            &.top {
                bottom: -0.875rem;
                border: 0.4375rem solid transparent;
                border-top: 0.4375rem solid var(--second-btn-color);
            }
        }
    }

    .red-packet {
        z-index: 9;
        top: 0;
        position: fixed;
        width: 100vw;
        height: calc(var(--vh, 1vh) * 100);
        display: flex;
        align-items: center;
        justify-content: center;

        .content {
            width: 75vw;
            height: 55vh;
            z-index: 10;
            position: fixed;
            display: flex;
            align-items: center;
            flex-direction: column;

            .bg {
                z-index: 9;
                position: absolute;
                width: 100%;
                height: 100%;
            }

            .wrapper {
                width: 100%;
                height: 100%;
                box-sizing: border-box;
                padding: 1.25rem;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: space-between;
                color: #fdd9b3;
                z-index: 10;
                position: relative;

                .top {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }

                .avatar {
                    margin-top: 3.75rem;
                    width: 3.4375rem;
                    height: 3.4375rem;
                    border-radius: 50%;
                    margin-bottom: 1.25rem;
                }

                .money {
                    color: rgb(193, 135, 79);
                    font-size: 2.5rem;
                    font-weight: bold;
                    margin-top: 0.9375rem;
                    margin-bottom: 4.0625rem;
                }

                .belong {
                    font-size: 0.75rem;
                    margin-bottom: 1.875rem;
                }

                .password {
                    font-size: 1rem;
                }

                .notice {
                    margin-top: 9.375rem;
                    font-size: 0.75rem;
                }

                .l-button {
                    font-size: 1rem;
                    border-radius: 0.03125rem;
                    margin-bottom: 1.875rem;
                    padding: 0.75rem 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: rgb(120, 48, 45);
                    width: 65vw;
                    background: rgb(255, 217, 132);
                    box-shadow: 0 0 1px;

                    &.opening {
                        background: rgb(228, 77, 58);

                        img {
                            width: 1.125rem;
                            margin-right: 0.625rem;
                            animation: animal 0.8s infinite linear;

                            @keyframes animal {
                                0% {
                                    transform: rotate(-360deg);
                                }
                                100% {
                                    transform: rotate(0deg);
                                }
                            }
                        }
                    }
                }
            }

            .close {
                bottom: -8vh;
                position: absolute;
                width: 1.875rem;
            }
        }
    }
}
</style>
