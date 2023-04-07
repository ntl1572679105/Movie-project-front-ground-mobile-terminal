<template>
  <div>
    <!-- 一级路由占位符 -->
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component v-if="$route.meta.keepAlive" :is="Component" />
      </keep-alive>
    </router-view>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>

<script setup lang="ts">

</script>

<style>
* {
  margin: 0;
  padding: 0;
}
:root:root {
  --van-nav-bar-background: #f03d37;
  --van-nav-bar-title-text-color: #fff;
  --van-nav-bar-icon-color: #fff;
}
</style>