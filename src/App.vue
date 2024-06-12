<script setup>
import { toRefs } from 'vue';
import TabBar from './components/TabBar.vue';
import DetailPanel from './components/DetailPanel.vue';
import useHooks from '@/hooks/useHooks'
const { isOpenDetail } = toRefs(useHooks.state)
</script>

<template>
  <router-view v-slot="{ Component }">
    <KeepAlive>
      <component :is="Component"></component>
    </KeepAlive>
  </router-view>
  <TabBar></TabBar>
  <DetailPanel v-if="isOpenDetail"></DetailPanel>
</template>

<style scoped></style>
