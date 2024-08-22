<template>
  <LuckyGrid
      ref="myLucky"
      width="300px"
      height="300px"
      :prizes="prizes"
      :blocks="blocks"
      :buttons="buttons"
      @start="startCallback"
      @end="endCallback"
      class="center"
      :accelerationTime="1000"
      :decelerationTime="1000"
  />
  <div style="color: white" class="center">
    倍率:<input type="number" v-model="bl">
  </div>
  <ul>
    <li v-for="item in items" :key="item" class="li-item">{{ item }}</li>
  </ul>
</template>

<style>
.center {
  width: 50%; /* 设置元素宽度 */
  margin: 0 auto;
}
.li-item {
  color: white;
}
</style>

<script>
import { ref } from 'vue'



export default {
  setup () {
    const bl = ref(1)
    const all = ref(10)

    if (localStorage.getItem('score') !== null) {
      // console.log(localStorage.getItem('score'))
      // all.value = ref(localStorage.getItem('score'))
      all.value = localStorage.getItem('score')
    }

    const items = ref(["余额: "+ all.value])

    const addItem = (str) => {
      if (items.value.length > 15) {
        items.value.shift();
      }
      items.value.push(str)
    }

    return {
      bl,
      all,
      items,
      addItem
    }
  },
  data () {
    return {
      blocks: [
        { padding: '10px', background: '#869cfa' },
        { padding: '10px', background: '#e9e8fe' },
      ],
      prizes: [
        { x: 0, y: 0, fonts: [{ text: '0', top: '35%' }] },
        { x: 1, y: 0, fonts: [{ text: '1', top: '35%' }] },
        { x: 2, y: 0, fonts: [{ text: '2', top: '35%' }] },
        { x: 2, y: 1, fonts: [{ text: '6', top: '35%' }] },
        { x: 2, y: 2, fonts: [{ text: '-1', top: '35%' }] },
        { x: 1, y: 2, fonts: [{ text: '-2', top: '35%' }] },
        { x: 0, y: 2, fonts: [{ text: '-3', top: '35%' }] },
        { x: 0, y: 1, fonts: [{ text: '-5', top: '35%' }] },
      ],
      buttons: [{
        x: 1, y: 1,
        background: '#7f95d1',
        fonts: [{ text: '开始', top: '35%' }]
      }],
    }
  },
  methods: {
    // 点击抽奖按钮会触发star回调
    startCallback () {
      // 调用抽奖组件的play方法开始游戏
      this.$refs.myLucky.play()
      // 模拟调用接口异步抽奖
      setTimeout(() => {
        // 假设后端返回的中奖索引是0
        const index = Math.floor(Math.random() * 7);
        // 调用stop停止旋转并传递中奖索引
        this.$refs.myLucky.stop(index)
      }, 1000)
    },
    // 抽奖结束会触发end回调
    endCallback (prize) {
      console.log(prize.fonts[0].text)

      let number = parseInt(prize.fonts[0].text)
      this.all = this.all + (number * this.bl)

      localStorage.setItem('score', this.all);

      this.addItem("获得: " + (number * this.bl) + ", 余额: " + this.all)
    },
  }
}
</script>