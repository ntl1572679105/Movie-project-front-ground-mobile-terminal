<template>
  <div>
    <van-sticky>
      <!-- 标题栏 -->
      <van-nav-bar title="百慕大影城">
        <template #right>
          <van-popover
            placement="bottom-end" 
            v-model:show="showPopover" 
            :actions="actions">
            <template #reference>
              <van-icon name="apps-o" size="22" />
            </template>
          </van-popover>
        </template>
      </van-nav-bar>

      <!-- AppHeader 广告栏 -->
      <!-- <AppHeader></AppHeader> -->
      <app-header style="background-color: #fff;"></app-header>

      <!-- 导航 -->
      <div  class="nav">
        <div class="loc">北京</div>
        <span class="loc arrow"></span>
        <!-- tabs -->
        <van-tabs 
          color="#f03d37" 
          class="tabs" 
          v-model:active="navActive">
          <van-tab title="热映" name="1"></van-tab>
          <van-tab title="待映" name="2"></van-tab>
          <van-tab title="经典" name="3"></van-tab>
        </van-tabs>
        <!-- 搜索 -->
        <van-icon style="font-weight: bold;" name="search" size="24" color="#f03d37"/>
      </div>
    </van-sticky>

    <!-- 电影列表 -->
      
    <van-pull-refresh 
      v-model="refreshing" 
      @refresh="onRefresh"
      success-text="列表加载完成"
      success-duration="1000">
      <van-list
        v-if="movies.length != 0"
        style="margin-bottom: 50px;"
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad">
        <movie-item 
          v-for="item in movies" :key="item.id"
          @click.native="$router.push(`/detail/${item.id}`)"
          :movie-info="item" >
        </movie-item>
      </van-list>
    </van-pull-refresh>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, reactive, watch } from 'vue';
import httpApi from '@/http'
import Movie from '@/types/Movie'

// 页面挂载完毕后, 自动加载热映类别下的列表
const movies = reactive<Movie[]>([])
// const movies = ref<Movie[]>([])
onMounted(()=>{
  console.log('index onMounted...')
})
onUnmounted(()=>{
  console.log('index onUnmounted...')
})


// 右上角菜单
const showPopover = ref(false)
const actions =  [
  { text: '首页' },
  { text: '榜单' },
  { text: '热点' },
  { text: '商城' }
];

// 处理导航
const navActive = ref(0)
watch(navActive, (newVal, oldVal)=>{
  // 将窗口的滚动条滚到顶部
  window.scrollTo(0, 0)
  finished.value = false  // 重置finished变量 使得可以加载下一页
  console.log(`new ${newVal}, old ${oldVal}`)
  
  // 查询缓存localstorage, 看一下以前存过没有, 如果有, 则直接获取
  let val = localStorage.getItem(newVal+"")

  // 判断缓存数据是否过期?

  if(val){ // 找到了  json字符串转成数组 更新列表即可
    let ary = JSON.parse(val)
    movies.splice(0, movies.length, ...ary)
    return;
  }

  // 发请求
  let params = {cid:newVal, page:1, pagesize:20}
  httpApi.movieApi.queryByCategoryId(params).then(res=>{
    console.log(res)
    movies.splice(0, movies.length, ...res.data.data.result)
    
    // 此处将查询到的数据存入缓存 LocalStorage
    localStorage.setItem(
      newVal+"", JSON.stringify(res.data.data.result))
  })
})

// 处理触底事件的监听
const loading = ref(false)
const finished = ref(false)
function onLoad(){ // 当触底后自动调用onLoad
  // onLoad执行时, vant会自动将loading改为true
  console.log('到底了...')
  // 发送请求, 加载下一页数据   下一页数据的page=?  与movies.length
  let nextPage = Math.floor(movies.length/20) + 1  // 下一页页码
  let cid = navActive.value  // 当前类别ID
  let pagesize = 20  // 每页多少条
  let params = {cid, page: nextPage, pagesize}
  httpApi.movieApi.queryByCategoryId(params).then(res=>{
    console.log(res)
    movies.push(...res.data.data.result)
    loading.value = false
    
    // 判断当前列表是否已经到底
    if(res.data.data.total == movies.length) {
      finished.value = true
    }

  })
}


// 处理下拉刷新
const refreshing = ref(false)
function onRefresh(){  // 下拉刷新被触发时执行  自动freshing=true
  console.log('onRefresh...')
  // 发请求, 加载当前类别下的首页数据
  let params = {cid:navActive.value, page:1, pagesize:20}
  httpApi.movieApi.queryByCategoryId(params).then(res=>{
    refreshing.value = false
    // 替换掉当前列表
    movies.splice(0, movies.length, ...res.data.data.result)
    // 顺便还要更新缓存
    localStorage.setItem(
      navActive.value+"", JSON.stringify(res.data.data.result))
  })
}


</script>

<style scoped>
.nav {
  display: flex;
  align-items: center;
  padding: 0px 15px;
  border-bottom: 1px solid #eee;
  background-color: #fff;
}

.nav .loc {
  color: #666;
}

.nav .arrow {
  display: block;
  border: 4px solid transparent;
  border-top-color: #666;
  margin-top: 6px;
  margin-left: 3px;
}

.nav .tabs {
  flex: 1;
  margin: 0px 30px;
}

</style>