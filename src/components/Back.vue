<template>
    <img class="close" ref="imgEl" :src="src" alt="back"/>
</template>
<script setup>
import {_css} from '@/utils/dom'
import {computed, onMounted, ref,} from 'vue'

defineOptions({
    name: 'Back'
})
const props = defineProps({
    mode: {
        type: String,
        default: 'gray'
    },
    img: {
        type: String,
        default: 'back'
    },
    direction: {
        type: String,
        default: 'left'
    },
    scale: {
        type: [Number, String],
        default: 1
    }
})

const imgEl = ref(null)
const src = computed(() => {
    return new URL(`../assets/img/icon/components/${props.mode}-${props.img}.png`, import.meta.url).href;
})

onMounted(() => {
    _css(
        imgEl.value,
        'transform',
        `rotate(${props.direction === 'left' ? '0' : '180'}deg) scale(${props.scale})`
    )
})
</script>

<style scoped lang="less">
img {
    width: 1.25rem;
}
</style>
