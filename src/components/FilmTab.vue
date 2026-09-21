<template>
<!--  电影tabbar-->
  <div>
    <van-tabbar v-model="active">
      <van-tabbar-item info="3">
        <span>首页</span>
        <img
            slot="icon"
            slot-scope="props"
            :src="props.active ? icon.active : icon.normal"
        >
      </van-tabbar-item>
      <van-tabbar-item icon="search">标签</van-tabbar-item>
      <van-tabbar-item icon="setting-o">标签</van-tabbar-item>
    </van-tabbar>
  </div>
</template>
<script>
export default {
  name: "FilmTab",
  data(){
    return {
      active: 0,
      icon: {
        normal: 'https://img2.baidu.com/it/u=1353985200,3860684873&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
        active: 'https://img2.baidu.com/it/u=489697929,2316327210&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500'
      }
    }
  }
}
</script>



<style scoped>

</style>