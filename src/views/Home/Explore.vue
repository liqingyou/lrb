<template>
  <LoadPanel @searchMore="searchMore">
    <div ref="refreshRef" class="refresh-div">
      <i class="iconfont">
        <Icon icon="icon-park-outline:loading"/>
      </i>
    </div>
    <div ref="exploreRef">
      <MiniCard v-for="(item, index) in exploreCards" :info="item" :key="item.id" @onImgLoaded="addImgCount">
      </MiniCard>
    </div>
  </LoadPanel>
  <canvas ref="placeholder" :width="canvasWidth" :height="canvasHeight" style="display: none"></canvas>
</template>

<script setup>
import {nextTick, onMounted, reactive, ref, toRefs, watch} from 'vue'
import LoadPanel from '../../components/LoadPanel.vue'
import MiniCard from '../../components/MiniCard.vue'
import computeWaterFallFlow from '../../utils/waterFallFlow'
import useHooks from '../../hooks/useHooks'
import axios from 'axios'
import {CONFIG} from "@/utils/global.js";
import router from "@/router/index.js";
import {Icon} from '@iconify/vue';

const {isRefresh} = toRefs(useHooks.state)
const {changeRefresh} = useHooks

let exploreCards = reactive([])
let imgLen // 记录总图片数
let resList = ref([])
let skip = ref('0')
let pageSize = 10
let placeholder = ref(null)

// 获取内容
async function fetchContent() {
  try {
    let token = localStorage.getItem("adv_token");
    if (token != null && token !== '') {
      let skipLocal = localStorage.getItem("adv_explore_skip")
      if (null != skipLocal) {
        skip.value = skipLocal
      }
      const result = await axios.get(`${CONFIG.base}/dy/source/list?size=${pageSize}&skip=${skip.value}`, {
        headers: {
          'Authorization': token,
        }
      })
      // console.log(result)
      if (result.data.code === 200) {
        resList.value = result.data.result.list
        for (const item of resList.value) {
          item.imgPH = await generatePlaceholder(item.imgW / 10, item.imgH / 10)
        }

        let rLength = result.data.result.list.length
        if (rLength < pageSize) {
          // 清除缓存
          skip.value = "0"
          localStorage.removeItem("adv_explore_skip")
        } else {
          skip.value = parseInt(skip.value) + rLength + ""
        }
        localStorage.setItem("adv_explore_skip", skip.value)
      } else {
        if (result.data.code === 401) {
          await router.push({"path": "/login"})
        } else if (result.data.code === 500) {
          alert(result.data.message)
        }
      }
    } else {
      await router.push({"path": "/login"})
    }
  } catch (error) {
    console.error('Error fetching profile content:', error)
    alert("服务器错误")
  }
}

let canvasWidth = ref(100)
let canvasHeight = ref(100)

function generatePlaceholder(width, height) {

  canvasWidth.value = width
  canvasHeight.value = height

  return new Promise((resolve, reject) => {
    nextTick(() => {

      const context = placeholder.value.getContext('2d');
      // 生成占位图的逻辑，这里简化为填充背景和写入文字
      context.fillStyle = '#cccccc';
      context.fillRect(0, 0, width, height);
      context.fillStyle = '#000000';
      context.textAlign = 'center';
      context.textBaseline = 'middle';

      // const text = `${width}x${height}`;
      const text = `加载中`;
      context.font = width / 10 + 'px Arial';
      context.fillText(text, width / 2, height / 2);

      // 将Canvas转换为图片URL
      const dataURL = placeholder.value.toDataURL();
      resolve(dataURL);
    });
  });

}

function calculateFontSizeToFit(text, width, height) {
  let fontSize = 40; // 初始字体大小
  const maxWidth = width * 0.8; // 文本最大宽度为画布宽度的80%
  const maxHeight = height * 0.8; // 文本最大高度为画布高度的80%

  do {
    const textWidth = context.measureText(text).width;
    if (textWidth < maxWidth && fontSize < maxHeight) {
      break;
    }
    fontSize--;
  } while (fontSize > 0);

  return fontSize;
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
  if (imgCount === imgLen) {
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
  // computeWaterFallFlow(exploreRef.value, 2, exploreCards)
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
  // computeWaterFallFlow(exploreRef.value, 2, exploreCards)
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