<template>
    <div class="People">
        <img :src="_checkImgUrl(people.avatar)" alt="" class="head-image pull-left"/>
        <div class="content">
            <template v-if="mode === 'normal'">
                <div class="left">
                    <div class="name">{{ people.name }}</div>
                </div>
            </template>
            <template v-if="mode === 'normal-add-button'">
                <div class="left">
                    <div class="name">{{ people.name }}</div>
                </div>
                <div class="right">
                    <!--   他关注我   -->
                    <template v-if="people.type === RELATE_ENUM.FOLLOW_ME">
                        <div class="l-button red" @click.stop="$emit('follow')">回关</div>
                    </template>
                    <!--   我关注他   -->
                    <template v-if="people.type === RELATE_ENUM.FOLLOW_HE">
                        <div class="l-button" @click.stop="$emit('unfollow')">已关注</div>
                    </template>
                    <!--          相互关注-->
                    <template v-if="people.type === RELATE_ENUM.FOLLOW_EACH_OTHER">
                        <div class="l-button" @click.stop="$emit('unfollow')">互相关注</div>
                    </template>
                    <!--         关注请求-->
                    <template v-if="people.type === RELATE_ENUM.REQUEST_FOLLOW">
                        <div class="l-button" @click.stop="$emit('ignore')">忽略</div>
                        <div class="l-button red" @click.stop="$emit('agree')">通过</div>
                    </template>
                </div>
            </template>

            <template v-if="mode === 'search'">
                <div class="left">
                    <div class="name">
            <span v-if="people.name.indexOf(searchKey) > -1"
            >{{
                    people.name.substr(0, people.name.indexOf(searchKey))
                }}<span style="color: yellow">{{ searchKey }}</span
                >{{ people.name.substr(people.name.indexOf(searchKey) + searchKey.length) }}</span
            >
                        <span v-else>{{ people.name }}</span>
                    </div>
                    <div class="name f12">
                        抖音id:

                        <span v-if="people.account.indexOf(searchKey) > -1"
                        >{{
                                people.account.substr(0, people.account.indexOf(searchKey))
                            }}<span style="color: yellow">{{ searchKey }}</span
                            >{{
                                people.account.substr(people.account.indexOf(searchKey) + searchKey.length)
                            }}</span
                        >
                        <span v-else>{{ people.account }}</span>
                    </div>
                </div>
            </template>

            <template v-if="mode === 'fans'">
                <div class="left">
                    <div class="name">{{ people.name }}</div>
                    <div class="name">
                        <template v-if="people.type === RELATE_ENUM.REQUEST_FOLLOW">
                            发来一个关注请求
                        </template>
                        <template v-else> 关注了你</template>
                    </div>
                    <div class="detail">07-23</div>
                </div>
                <div class="right">
                    <!--   他关注我   -->
                    <template v-if="people.type === RELATE_ENUM.FOLLOW_ME">
                        <div class="l-button red" @click.stop="$emit('follow')">回关</div>
                    </template>
                    <!--   我关注他   -->
                    <template v-if="people.type === RELATE_ENUM.FOLLOW_HE">
                        <div class="l-button" @click.stop="$emit('unfollow')">已关注</div>
                    </template>
                    <!--          相互关注-->
                    <template v-if="people.type === RELATE_ENUM.FOLLOW_EACH_OTHER">
                        <div class="l-button" @click.stop="$emit('unfollow')">互相关注</div>
                    </template>
                    <!--         关注请求-->
                    <template v-if="people.type === RELATE_ENUM.REQUEST_FOLLOW">
                        <div class="l-button" @click.stop="$emit('ignore')">忽略</div>
                        <div class="l-button red" @click.stop="$emit('agree')">通过</div>
                    </template>
                </div>
            </template>

            <template v-if="mode === 'recommend'">
                <div class="left">
                    <div class="name">{{ people.name }}</div>
                    <div class="detail">可能认识的人</div>
                </div>
                <div class="right">
                    <template v-if="people.type === RELATE_ENUM.RECOMMEND_NO_REMOVE">
                        <div class="l-button red" @click.stop="$emit('follow')">关注</div>
                    </template>
                    <template v-if="people.type === RELATE_ENUM.RECOMMEND">
                        <div class="l-button" @click.stop="$emit('remove')">移除</div>
                        <div class="l-button red" @click.stop="$emit('follow')">关注</div>
                    </template>
                    <!--   我关注他   -->
                    <template v-if="people.type === RELATE_ENUM.FOLLOW_HE">
                        <div class="l-button" @click.stop="$emit('unfollow')">已关注</div>
                    </template>
                </div>
            </template>

            <template v-if="mode === 'friend'">
                <div class="left">
                    <div class="name">{{ people.name }}</div>
                    <div class="detail">4小时之内在线</div>
                </div>
                <div class="right">
                    <div class="l-button">发私信</div>
                    <img
                        src="../../../assets/img/icon/menu-white.png"
                        alt=""
                        @click.stop="showPopover = !showPopover"
                    />
                </div>
            </template>

            <template v-if="mode === 'visitor'">
                <div class="left">
                    <div class="name">{{ people.name }}</div>
                </div>
                <div class="right">
                    <!--   他关注我   -->
                    <template v-if="people.type === RELATE_ENUM.FOLLOW_ME">
                        <div class="l-button red" @click.stop="$emit('follow')">关注</div>
                    </template>
                    <!--   我关注他   -->
                    <template v-if="people.type === RELATE_ENUM.FOLLOW_HE">
                        <div class="l-button" @click.stop="$emit('unfollow')">已关注</div>
                    </template>
                    <!--          相互关注-->
                    <template v-if="people.type === RELATE_ENUM.FOLLOW_EACH_OTHER">
                        <div class="l-button" @click.stop="$emit('unfollow')">互相关注</div>
                    </template>
                </div>
            </template>
        </div>
        <!--   TODO 点了不消失，内容也变了 -->
        <transition name="scale">
            <div class="popover" v-if="people.type === 4 && showPopover">
                <div class="arrow"></div>
                <div class="item">
                    <img src="../../../assets/img/icon/feedback-white.png" alt=""/>
                    <span>设置备注名</span>
                </div>
                <div class="item">
                    <img src="../../../assets/img/icon/people-red.png" alt=""/>
                    <span>从朋友中移除</span>
                </div>
            </div>
        </transition>
    </div>
</template>
<script>
import {_checkImgUrl} from '@/utils'

export default {
    name: 'People',
    props: {
        people: {
            type: Object,
            default() {
                return {}
            }
        },
        mode: {
            type: String,
            default: 'normal'
        },
        searchKey: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            showPopover: false
        }
    },
    computed: {},
    created() {
    },
    methods: {_checkImgUrl}
}
</script>

<style scoped lang="less">
@import '../../../assets/less/index';

.scale-enter-active,
.scale-leave-active {
    transition: all 0.3s ease;
}

.scale-enter-from,
.scale-leave-to {
    //transform: scale(0);
    opacity: 0;
}

.People {
    transition: all 0.3s ease;
    width: 100%;
    height: 4.375rem;
    display: flex;
    align-items: center;
    position: relative;

    &.top {
        background: #353a4f;
    }

    .head-image {
        margin-right: 0.9375rem;
        width: 2.8125rem;
        height: 2.8125rem;
        border-radius: 50%;
    }

    .add {
        background: var(--second-btn-color-tran);
        margin-right: 0.9375rem;
        padding: 0.9375rem;
        width: 1.125rem;
        height: 1.125rem;
        border-radius: 50%;
    }

    .content {
        flex: 1;
        display: flex;
        justify-content: space-between;
        padding: 15px 0;

        .left {
            .name {
                font-size: 0.875rem;
                margin-bottom: 0.125rem;
                color: white;
            }

            .detail {
                color: var(--second-text-color);
                font-size: 0.75rem;
                margin-top: 4px;
            }
        }

        .right {
            display: flex;
            align-items: center;

            .l-button {
                margin-left: 0.5rem;
                border-radius: 0.125rem;
                background: rgb(58, 58, 67);
                font-size: 0.75rem;
                padding: 0.3125rem 0;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 3.625rem;

                &:only-child {
                    width: 4.375rem;
                }

                &.red {
                    background: var(--primary-btn-color);
                }
            }

            img {
                height: 1.125rem;
                margin-left: 1.25rem;
            }
        }
    }

    .popover {
        z-index: 9;
        position: absolute;
        bottom: -100%;
        right: 0.625rem;
        border-radius: 0.5rem;
        background: var(--second-btn-color);

        .item {
            font-size: 0.875rem;
            padding: 0 2.5rem 0 0.625rem;
            display: flex;
            height: 2.5rem;
            align-items: center;
            border-bottom: 1px solid var(--line-color);

            &:nth-last-child(1) {
                border-bottom: none;
                color: var(--primary-btn-color);
            }

            img {
                margin-right: 0.625rem;
                height: 1.25rem;
            }
        }

        .arrow {
            width: 0;
            height: 0;
            border: 0.4375rem solid transparent;
            border-bottom: 0.4375rem solid var(--second-btn-color);
            position: absolute;
            right: 0.625rem;
            top: -0.875rem;
        }
    }
}
</style>
