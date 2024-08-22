<template>
  <LuckyWheel
      ref="myLucky"
      width="300px"
      height="300px"
      :prizes="prizes"
      :blocks="blocks"
      :buttons="buttons"
      @start="startCallback"
      @end="endCallback"
      class="center"
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
        { padding: '10px', background: '#869cfa' }
      ],
      prizes: [
        { background: '#e9e8fe', fonts: [{ text: '-10' }] },
        { background: '#b8c5f2', fonts: [{ text: '-20' }] },
        { background: '#e9e8fe', fonts: [{ text: '-30' }] },
        { background: '#ffffff', fonts: [{ text: '-2' }] },
        { background: '#b8c5f2', fonts: [{ text: '1' }] },
        { background: '#e9e8fe', fonts: [{ text: '9' }] },
        { background: '#b8c5f2', fonts: [{ text: '20' }] },
        { background: '#ffffff', fonts: [{ text: '30' }] },
      ],
      buttons: [
        { radius: '40%', background: '#617df2' },
        { radius: '35%', background: '#afc8ff' },
        {
          radius: '30%', background: '#869cfa',
          pointer: true,
          fonts: [{ text: '开始', top: '-10px' }]
        }
      ]
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
      }, 3000)
    },
    // 抽奖结束会触发end回调
    endCallback (prize) {
      console.log(prize.fonts[0].text)

      let number = parseInt(prize.fonts[0].text)
      this.all = this.all + (number * this.bl)

      this.addItem("获得: " + (number * this.bl) + ", 余额: " + this.all)
    },
  }
}
</script>