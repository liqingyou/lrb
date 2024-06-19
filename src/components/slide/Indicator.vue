<template>
    <div class="indicator-ctn">
        <div v-if="tabRender">{ tabRender() }</div>
        <div v-else ref="tabs" class="tabs">
            <div
                v-for="(item, index) in tabTexts"
                :key="index"
                :class="{ 'active tab': currentSlideItemIndex === index, 'tab': currentSlideItemIndex !== index }"
                :style="{ width: tabStyleWidth || (100 / tabTexts.length) + '%' }"
                @click="changeIndex(index)"
            >
                <span>{{ item }}</span>
            </div>
        </div>
        <div
            ref="indicator"
            class="indicator"
            :style="{ width: tabStyleWidth || (100 / tabTexts.length) + '%' }"
        ></div>
    </div>
</template>

<script setup>
import bus from '../../utils/bus';
import { useBaseStore } from '@/store/pinia';
import { _css } from '@/utils/dom';

const { onMounted, ref } = Vue;

const props = defineProps({
    activeIndex: {
        type: Number,
        default: 0
    },
    tabStyleWidth: {
        type: String,
        default: ''
    },
    tabTexts: {
        type: Array,
        default: () => []
    },
    tabRender: Function,
    name: {
        type: String,
        default: ''
    }
});

const baseStore = useBaseStore();

let currentSlideItemIndex = ref(props.activeIndex);
let tabIndicatorRelationActiveIndexLefts = [];
let indicatorSpace = 0;
let tabsRef = ref(null);
let indicatorRef = ref(null);

const changeIndex = (index) => {
    currentSlideItemIndex.value = index;
    if (props['onUpdate:activeIndex']) {
        emit('update:activeIndex', currentSlideItemIndex.value);
    }
    _css(indicatorRef.value, 'transition-duration', `300ms`);
    _css(indicatorRef.value, 'left', `${tabIndicatorRelationActiveIndexLefts[index]}px`);
};

const initTabs = () => {
    const tabs = tabsRef.value;
    indicatorRef.value = indicatorRef.value;
    for (let i = 0; i < tabs.children.length; i++) {
        const item = tabs.children[i];
        const tabWidth = _css(item, 'width');
        tabIndicatorRelationActiveIndexLefts.push(
            item.getBoundingClientRect().x -
            tabs.children[0].getBoundingClientRect().x +
            (indicatorType === 'home' ? tabWidth * 0.15 : 0)
        );
    }
    indicatorSpace = tabIndicatorRelationActiveIndexLefts[1] - tabIndicatorRelationActiveIndexLefts[0];
    _css(indicatorRef.value, 'transition-duration', `0ms`);
    _css(indicatorRef.value, 'left', `${tabIndicatorRelationActiveIndexLefts[currentSlideItemIndex.value]}px`);
};

const move = (e) => {
    _css(
        indicatorRef.value,
        'left',
        `${tabIndicatorRelationActiveIndexLefts[currentSlideItemIndex.value] - e.x.distance / (baseStore.bodyWidth / indicatorSpace)}px`
    );
};

const end = (index) => {
    currentSlideItemIndex.value = index;
    _css(indicatorRef.value, 'transition-duration', `300ms`);
    _css(indicatorRef.value, 'left', `${tabIndicatorRelationActiveIndexLefts[index]}px`);
    setTimeout(() => {
        _css(indicatorRef.value, 'transition-duration', `0ms`);
    }, 300);
};

onMounted(() => {
    initTabs();
    bus.on(`${props.name}-moved`, move);
    bus.on(`${props.name}-end`, end);
});

export { baseStore, currentSlideItemIndex, changeIndex, initTabs, tabsRef, indicatorRef };
</script>

<style scoped>
@import '../../assets/less/index.less';

.indicator-ctn {
    font-size: 14rem;
    width: 100%;
    height: var(--indicator-height);
    top: 0;
    left: 0;
    right: 0;
    z-index: 1;
    background: var(--main-bg);

    .tabs {
        display: flex;
        justify-content: space-between;
        font-weight: bold;

        .tab {
            height: 40rem;
            width: 45%;
            display: flex;
            justify-content: center;
            align-items: center;
            color: gray;
            transition: color 0.3s;
            font-size: 16rem;

            &.active {
                color: white;
            }

            img {
                margin-left: 5rem;
                width: 12rem;
                height: 12rem;
            }
        }
    }

    .indicator {
        height: 2px;
        background: gold;
        width: 45%;
        position: relative;
        transition: all 0.3s;
    }
}
</style>
