<template>
    <div class="Me">
        <div ref="float" class="float" :class="floatFixed ? 'fixed' : ''">
            <div
                :style="floatFixed ? 'opacity: 0;' : ''"
                class="left"
                @click="$nav('/me/edit-userinfo')"
            >
                <Icon icon="ri:edit-fill"/>
                <span>编辑资料</span>
            </div>
            <transition name="fade">
                <div class="center" v-if="floatShowName">
                    <p class="name f14 mt1r mb1r">{{ userinfo.nickname }}</p>
                </div>
            </transition>
            <div class="right">
                <div
                    class="item"
                    :style="floatFixed ? 'opacity: 0;' : ''"
                    @click="$nav('/me/request-update')"
                >
                    <Icon class="finger" icon="fluent-emoji-high-contrast:middle-finger"/>
                </div>
                <div
                    class="item"
                    :style="floatFixed ? 'opacity: 0;' : ''"
                    @click="$nav('/message/visitors')"
                >
                    <Icon icon="eva:people-outline"/>
                </div>
                <div class="item" @click="_no">
                    <Icon icon="ic:round-search"/>
                </div>
                <div class="item" @click.stop="baseActiveIndex = 1">
                    <Icon icon="ic:round-menu"/>
                </div>
            </div>
        </div>
    </div>
</template>
<script>

</script>

<style scoped lang="less">

</style>
