<template>
    <div class="container" v-if="movie">
        <!-- 广告 -->
        <app-header></app-header>

        <!-- 顶部区域开始 -->
        <div class="movie-detail">
          <div class="movie-filter"></div>
          <!-- 背景图开始 -->
          <div 
              class="poster-background"  
              :style="{'background-image': `url(${movie.cover})`}">
          </div>
          <!-- 背景图结束 -->
          <div class="detail">
              <!--海报帧开始-->
              <div class="poster">
                  <img :src="movie.cover">
              </div>
              <!--海报帧结束-->
              <!-- 内容区域开始 -->
              <div class="content">
                  <div class="title line-ellipsis">{{ movie.title }}</div>
                  <div class="score line-ellipsis">{{ movie.score }}</div>
                  <div class="type line-ellipsis">主演: {{ movie.star_actor }}</div>
                  <div class="type line-ellipsis">{{ movie.type }}</div>
                  <div class="type line-ellipsis">{{ movie.showingon }} 上映</div>
              </div>
              <!-- 内容区域结束 -->
          </div>
        </div>
        <!-- 顶部区域结束 -->
        <!-- 简介区域开始 -->
        <div 
          @click="isOpen = !isOpen"
          class="introduction" bindtap="tapIntro">
          <div 
            :class="{'line-clamp': !isOpen}" 
            v-html="movie.description">
          </div>
          <div class="more">
              <img v-show="isOpen" src="@/assets/icon/arrow_up.png">
              <img v-show="!isOpen" src="@/assets/icon/arrow_down.png">
          </div>
        </div>
        <!-- 简介区域结束 -->
        <!-- 演职人员开始 -->
        <div class="actors">
            <div class="title">演职人员</div>
            <div class="actors-list">
              <!-- 遍历演员表 -->
              <div v-for="item in actors" class="actors-item" >
                  <img :src="item.avatar">
                  <text>{{ item.name }}</text>
              </div>    
            </div>
        </div>
        <!-- 演职人员结束 -->
        <!-- 剧照开始 -->
        <div class="photos">
        <div class="title">视频和剧照</div>
        <div class="photos-list">
          <!-- 遍历剧照列表 -->
          <div v-for="(item, i) in thumbs" class="photos-item">              
            <van-image
              @click.native="previewImage(i)"
              width="100%"
              height="100%"
              fit="cover"
              :src="item"></van-image>
          </div>

        </div>
        </div>
        <!-- 剧照结束 -->
        <app-footer></app-footer>
        <div style="height: 50px"></div>
        <!-- 提示若热映类别则显示购票，若待映类别则显示暂未上映，若经典类别则什么都不显示 -->
        <div class="buyblock">
          <van-button 
            round type="danger" block 
            @click="$router.push('/cinema-selection/'+id)">特惠购票</van-button>
          <!-- <van-button round type="danger" disabled block>暂未上映</van-button> -->
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';

import httpApi from '@/http';
import Movie from '@/types/Movie';
import Actor from '@/types/Actor';

import { showImagePreview } from 'vant';
import 'vant/es/image-preview/style';

onMounted(()=>{
  console.log('detail onMounted...')
})
onUnmounted(()=>{
  console.log('detail onUnmounted...')
})



let route = useRoute()  // 当前路由对象

const movie = ref<Movie>()

// 接收上一页通过route传来的参数  /detail/233
const id = route.params.id 
const actors = reactive<Actor[]>([])
const thumbs = reactive<string[]>([])
httpApi.movieApi.queryById({id}).then(res=>{
  console.log(res) 
  movie.value = res.data.data   // 存入movie代理对象
  // 处理一下actor属性, 转换成js数组
  if(movie.value && movie.value.actor){
    let list = JSON.parse(movie.value.actor) // 演员列表
    actors.push(...list)
  }
  // 处理一下thumb属性, 转换成js数组
  if(movie.value && movie.value.thumb){
    let list = JSON.parse(movie.value.thumb)
    thumbs.push(...list)
  }
})

// 控制简介的展开与收起
const isOpen = ref(false)

// 控制剧照图片的全屏预览
function previewImage(index:number = 0){
  // 处理一下所有图片的后缀, 得到高清大图url数组
  let urls:string[] = []
  thumbs.forEach(item => {
    // item: https://p1.meituan.net/56248956234537459.jpg@106w_106h
    urls.push(item.split('@')[0])
  });
  showImagePreview({
    images: urls, 
    startPosition: index
  })
}

</script>

<style scoped>
.buyblock {
  padding:10px; 
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #fff;
}

.container{
  background-color: #f5f5f5;
}
.movie-detail {
  overflow: hidden;
  z-index: 1;
  height: 188px;
  position: relative;
  cursor: pointer;
}
.movie-detail .movie-filter {
  position: absolute;
  z-index: -1;
  width: 100%;
  height: 100%;
  background-color: #333;
}
.poster-background{
  width: 100%;
  height: 100%;
  z-index: -1;
  overflow: hidden;
  position: absolute;
  -webkit-filter: blur(1.2rem);
  filter: blur(1.2rem);
  background-size: cover;
  background-repeat: no-repeat;
  opacity: .55;
}
.movie-detail .detail {
  height: 150px;
  padding: 19px 30px 19px 15px;
}
.movie-detail .detail {
  display: flex;
  height: 150px;
  padding: 19px 30px 19px 15px;
}
.movie-detail .detail .poster img {
  width: 110px;
  height: 150px;
  box-sizing: border-box;
}
.movie-detail .detail .content {
  flex:1;
  overflow-x: hidden;
  margin-left: 12.5px;
  line-height: 1;
  color: #fff;
}
.movie-detail .detail .content .title {
  font-size: 20px;
  margin-top: 2px;
  font-weight: 700;
  overflow: hidden;
}
.line-ellipsis {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.movie-detail .detail .content .score {
  font-size: 18px;
  font-weight: 700;
  color: #fc0;
  margin-top: 17px;
}
.movie-detail .detail .content .type {
  margin-top: 17px;
  font-size: 12px;
  color: #fff;
  opacity: .8;
}
.introduction{
  padding: 10px;
  font-size:16px;
  background-color: #fff;
}
.line-clamp {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  text-overflow: ellipsis;
  word-wrap: break-word;
  word-break: break-all;
  overflow: hidden;
  line-height: 24px;
}
.introduction .more{
  text-align: center;
}
.introduction .more img{
  width:10px;
  height:10px;
}
.actors{
  margin-top:10px;
  padding: 10px;
  font-size:16px;
  background-color: #fff;
}
.actors .title{
  margin-bottom: 10px;
  font-size:16px;
}
.actors .actors-list{
  display: flex;
  flex-direction: row;
  overflow: scroll;
}
.actors .actors-list::-webkit-scrollbar{
    display: none;
}
.actors .actors-list .actors-item{
  width:80px;
  display: inline-block;
  margin-right: 10px;
  flex-shrink: 0;
}
.actors .actors-list img{
  margin-bottom: 10px;
  display: block;
  width:100%;
  height: 112px;
  border-radius: 2px;
}
.actors .actors-list text{
  display: block;
  text-align: center;
  font-size:12px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
.photos{
  margin-top:10px;
  padding: 10px;
  font-size:16px;
  background-color: #fff;
}
.photos .title{
  margin-bottom: 10px;
  font-size:16px;
}
.photos .photos-list{
  display: flex;
  flex-direction: row;
  overflow: scroll;
}
.photos .photos-list::-webkit-scrollbar{
    display: none;
}
.photos .photos-list .photos-item{
  width: 140px;
  height: 93px;
  display: inline-block;
  margin-right: 10px;
  flex-shrink: 0;
}
.photos .photos-list .photos-item img{
  width: 100%;
  height: 100%;
  float: left;
}
/*  */
.comments{
  margin-top:10px;
  background-color:#fff;
}
.comment-item{ 
    padding: 15px;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
}
.comment-item .avatar{
    height: 34px;
    width: 34px;
    border-radius: 34px;
}
.comment-item .right {
  margin-left: 11px;
  flex-grow: 1;
}

.comment-item .comment-content{
  font-size: 15px;
    color: #333;
    line-height: 21px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 7;
    text-overflow: ellipsis;
    word-wrap: break-word;
    word-break: break-all;
    overflow: hidden;
}
</style>