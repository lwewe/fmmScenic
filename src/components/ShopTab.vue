<template>
  <!--  首页tabbbr-->
  <div>
    <van-tabbar v-model="activeNum" active-color="#CA403E">
      <van-tabbar-item @click="toMine('/index')">
        <span>首页</span>
        <img
            slot="icon"
            slot-scope="props"
            :src="props.active ? icon.active : icon.normal"
        >
      </van-tabbar-item>
      <van-tabbar-item @click="toMine('/classification')">
        <span>分类</span>
        <img
            slot="icon"
            slot-scope="props"
            :src="props.active ? classification.active : classification.normal"
        >
      </van-tabbar-item>
      <van-tabbar-item @click="toMine('/shopCart')">
        <span>购物车</span>
        <img
            slot="icon"
            slot-scope="props"
            :src="props.active ? mulIcon.active : mulIcon.normal"
        >
      </van-tabbar-item>
      <van-tabbar-item to="/securitycards" :replace="true">
        <span>福利卡</span>
        <img
            slot="icon"
            slot-scope="props"
            :src="props.active ? flkIcon.active : flkIcon.normal"
        >
      </van-tabbar-item>
      <van-tabbar-item @click="toMine('/mine')">
        <span>我的</span>
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
  name: "ShopTab",
  props: {
    active: [Number, String]
  },
  data() {
    return {
      activeNum: 0,
      // 首页
      icon: {
        normal: require('@/assets/icon2/syh.png'),
        active: require('@/assets/icon2/syx.png')
      },
      classification: {
        normal: require('@/assets/icon2/flh.png'),
        active: require('@/assets/icon2/flx.png')
      },
      mulIcon: {
        normal: require('@/assets/icon2/dh.png'),
        active: require('@/assets/icon2/dx.png')
      },
      flkIcon: {
        normal: require('@/assets/icon2/flkh.png'),
        active: require('@/assets/icon2/flkx.png')
      },
      mineIcon: {
        normal: require('@/assets/icon2/gh.png'),
        active: require('@/assets/icon2/gx.png')
      },
    }
  },
  methods: {
    // toFreea() {
    //   window.location.href = this.$store.state.freea
    // }
    toMine(path) {
      // window.location.href = this.$store.state.shopUrl + path+"?token=" + localStorage.getItem("token")
      window.location.replace(this.$store.state.shopUrl + path+"?token=" + localStorage.getItem("token")+"&isFirst=" + sessionStorage.getItem("isFirst"))
    }
  },
  created() {
    this.activeNum = this.active
  }
}
</script>


<style scoped>
.van-tabbar--fixed {
  z-index: 99999 !important;
}

.van-tabbar-item__icon img {
  width: 100%;
  height: 100%;
}

/deep/ .van-tabbar-item__icon {
  position: relative;
  font-size: 18%;
  margin-bottom: 5px;
  width: 25px;
}

/deep/ .van-tabbar {
  height: auto;
  padding: 4px 0px;
}
</style>