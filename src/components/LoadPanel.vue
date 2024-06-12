<template>
    <div class="load-panel" ref="panelRef">
        <div class="outer">
            <slot></slot>
            <Loading v-show="isBottomLoading"></Loading>
        </div>
    </div>
</template>

<script setup>
// https://at.alicdn.com/t/c/font_4225294_9ky89jh7qmt.css
import { ref, onMounted } from 'vue'
import Loading from '@/components/Loading.vue'
const panelRef = ref(null)

let isBottomLoading = ref(false)
const emit = defineEmits(['searchMore'])

onMounted(() => {
    panelRef.value.style.height = window.innerHeight + 'px'
    window.addEventListener('resize', () => {
        panelRef.value.style.height = window.innerHeight + 'px'
    })
    // 判断是否到达底部
    let nowScrollHeight = 0
    panelRef.value.addEventListener('scroll', function () {
        let scrollTop = this.scrollTop
        let clientHeight = this.clientHeight
        let scrollHeight = this.scrollHeight

        // console.log("scroll compare", Math.ceil(scrollTop + clientHeight), scrollHeight);

        if (Math.ceil(scrollTop + clientHeight) >= scrollHeight && !isBottomLoading.value) {
            if (nowScrollHeight != scrollHeight) {
                nowScrollHeight = scrollHeight
                isBottomLoading.value = true
                emit('searchMore', () => {
                    isBottomLoading.value = false;
                })
            }
        }
    })
})

</script>

<style lang="scss" scoped>
.load-panel {
    overflow: auto;
    // height: 100%;

    .outer {
        position: relative;
        margin-top: 3rem;
        margin-bottom: 3rem;
    }
}
</style>