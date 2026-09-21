<template>
<!--  首页tabbbr-->
  <div>
    <van-tabbar v-model="activeNum"  active-color="#28AFB4" @change="onChange">
      <van-tabbar-item  to="/index">
        <span>景区门票</span>
        <img
            slot="icon"
            slot-scope="props"
            :src="props.active ? icon.active : icon.normal"
        >
      </van-tabbar-item>
      <!-- <van-tabbar-item to="/multiplex">
        <span>影城</span>
        <img
            slot="icon"
            slot-scope="props"
            :src="props.active ? mulIcon.active : mulIcon.normal"
        >
      </van-tabbar-item> -->
      <van-tabbar-item v-if="!change" to="/personCenter">
      <!-- <van-tabbar-item   to="/personCenter"> -->
        <span>订单</span>
        <img
            slot="icon"
            slot-scope="props"
            :src="props.active ? mineIcon.active : mineIcon.normal"
        >
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>
<script>
export default {
  name: "NavigationTab",
  props:{
    active:[Number,String]
  },
  data(){
    return {
      activeNum:0,
      // 首页
      icon: {
        normal: require('@/assets/menpiao/jqmph.png'),
        active: require('@/assets/menpiao/jqmpx.png')
      },
      mulIcon:{
        normal: require('@/assets/icon/yh.png'),
        active: require('@/assets/icon/yx.png')
      },
      mineIcon:{
        normal: require('@/assets/menpiao/ddh.png'),
        active: require('@/assets/menpiao/ddxx.png')
      },
      change:null
    }
  },
  methods:{
    onChange(){
      // if(!to.meta.keepAlive){
      document.body.scrollTop = 0

// firefox

      document.documentElement.scrollTop = 0

// safari

      window.pageYOffset = 0
    },
    toMine(){
      // if(this.change == 1){
      //   window.location.href = this.$store.state.shopUrl+"/mine?film=1"
      // }else{
      //   this.$router.push("/personCenter")
      // }
    }
  },
  created() {
    this.activeNum = this.active
    this.change = sessionStorage.getItem("change")
  }
}
</script>



<style scoped>
.van-tabbar--fixed {
  z-index: 99999 !important;
}
.van-tabbar-item__icon img{
  width: 100%;
  height: 100%;
}
/deep/.van-tabbar-item__icon {
  position: relative;
  font-size: 18%;
  margin-bottom: 5px;
  width: 25px;
}
/deep/.van-tabbar {
  height: auto;
  padding: 4px 0px;
}
</style>