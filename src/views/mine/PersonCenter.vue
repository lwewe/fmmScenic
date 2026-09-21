<template>
  <div class="location">
    <div style="width: 100%;position: absolute;">
      <NProgress v-if="loadingflag" />
      <div class="location">
        <ReturnBack :rcolor="'#fff'" :bcolor="'#00000087'"></ReturnBack>
        <div class="tab">
          <van-tabs @click="changeType" v-model="active" title-active-color="#ED2E34" color="#F05B60"
            title-inactive-color="#B0B0B0" :line-width="15" :line-height="2">
            <van-tab title="全部"></van-tab>
            <van-tab title="待使用"></van-tab>
            <van-tab title="已完成"></van-tab>
            <van-tab title="已取消"></van-tab>
          </van-tabs>
        </div>
        <!--    列表-->
        <div v-if="orderList.length > 0">
          <OrderList :orderList="orderList"></OrderList>
        </div>
        <div v-else-if="loading" class="loading-state">
         
            <van-loading style="margin: auto;" size="24px">加载中...</van-loading>
           
        </div>
        <div v-else class="empty-state">
          <img :src="noOrder" alt="">
          <div>暂无订单</div>
        </div>
        <div ref="bottom" style="height: 10px;"></div>

      </div>
    </div>
  </div>
</template>
<script>
import OrderList from "@/components/OrderList.vue";
import NavigationTab from "@/components/NavigationTab.vue";
import { changeAvatar, getUserInfo } from "@/api/locality/login";
import { getOrderList } from "@/api/locality/order";
// 获取客服
import { getLogo } from "@/api/locality/login"
export default {
  name: "PersonCenter",
  components: {
    NavigationTab, OrderList
  },
  data() {
    return {
      loading: false,
      noOrder: require("@/assets/menpiao/no.png"),
      active: 0, loadingflag: false,
      orderList: [],
      phone: "",
      obligation: [
        {
          class: "daifukuan",
          id: 1,
          icon: require("../../assets/mine/dfk.png"),
          text: "待付款",
          type: null
        },
        {
          class: "daishiyong",
          id: 2,
          icon: require("../../assets/mine/dsy.png"),
          text: "待使用",
          type: null
        },
        {
          class: "wancheng",
          id: 3,
          icon: require("../../assets/mine/dpj.png"),
          text: "已完成"
        },
        {
          class: "tuikuan",
          id: 4,
          icon: require("../../assets/mine/sh.png"),
          text: "退款售后"
        },
      ],
      otherList: [
        {
          class: "payment",
          id: 1,
          icon: require("../../assets/mine/zfmm.png"),
          text: "支付密码",
          path: "/payPassword"
        },
        {
          class: "quit",
          id: 2,
          icon: require("../../assets/mine/tc.png"),
          text: "退出登录"
        },
      ],
      userInfo: {},
      token: "",
      kefu: "",
      types: 0
    }
  },
  methods: {
    changeType(e) {
      console.log(e)
      // if(this.active==e){
      //   return
      // }

      this.active = e
      this.orderList = []
      this.pageno = 2;
      this.types = e + 1;
      this.loading = true // 切换标签时显示加载中
      this.getOrder(this.types)
      //  this.$router.replace({path:'/orderInfo',query:{tabIndex:e}})
    },
    //   订单列表
    getOrder(type) {
      getOrderList({
        token: this.token,
        type: type,
        pageno: 1,
        pagesize: 10
      }).then(res => {
        if (res.code == 200) {
          this.loading = false;
          this.orderList = res.data.list
          // if (type == 2) {
          //   this.obligation[0].type = this.orderList.length
          // } else if (type == 3) {
          //   this.obligation[1].type = this.orderList.length
          // }
        }
      })
    },
    gosecuritycards() {
      this.$router.push({ path: "/SecurityCards" })
    },
    // 上传头像
    onRead(file) {
      var formdata = new FormData(); //new一个FormData
      formdata.append('img', file.file)  //把上传的图片信息放入，传给后台
      formdata.append('token', this.token)  //把上传的图片信息放入，传给后台
      formdata.append('channel_no', this.$store.state.channel_no)  //把上传的图片信息放入，传给后台
      changeAvatar(formdata).then(res => {
        if (res.code == 200) {
          this.userInfo.img = res.data
          this.$toast("修改头像成功")
        }
      })
    },
    getUserInfo() {
      getUserInfo({
        token: this.token
      }).then(res => {
        this.userInfo = res.data
      })
    },
    toOther(path, id) {
      if (id == 1) {
        this.$router.push(path)
      } else {
        this.messageinfo()
      }
    },
    toOrder(id) {
      if (id == 4) {
        window.location.href = this.kefu
      } else {
        this.$router.push({ path: "/orderInfo", query: { tabIndex: id } })
      }

    },
    allOrder() {
      this.$router.push({ path: "/orderInfo", query: { tabIndex: 0 } })
    },
    messageinfo() {
      this.$dialog.confirm({
        title: '退出',
        message: '是否退出？',
        confirmButtonColor: 'red'
      }).then(() => {
        localStorage.removeItem("token")
        localStorage.removeItem("uid")
        this.$toast("退出登录成功")
        this.$router.options.routes.forEach(item => {
          if (item.meta) {
            if (item.meta.keep) {
              item.meta.keepAlive = false
            }
          }
        })
        setTimeout(() => {
          this.$router.push({ path: "/index" })
        }, 1000)
      }).catch(() => {
      })

    },
    getLoginInfo() {
      getLogo().then(res => {
        if (res.code == 200) {
          this.kefu = res.data.zxkf
        }
      })
    },
    isWeiXin() {
      var ua = window.navigator.userAgent.toLowerCase();
      if (ua.match(/MicroMessenger/i) == "micromessenger") {
        return true;
      } else {
        return false;
      }
    },
  },
  created() {
    this.isWeiXin()
    if (localStorage.getItem("token")) {
      this.getLoginInfo()
      this.token = localStorage.getItem("token")
      this.getUserInfo()
       this.loading = true
      this.getOrder(1)
      // this.getOrder(3)
    } else {
      this.$toast("请先登录")
      if (this.isWeiXin()) {
        this.$router.replace("/quickLogin")
      } else {
        this.$router.replace("/login")
      }
    }
  }
}
</script>


<style scoped lang="less">
.location {
  background-color: #F0F0F0;
  min-height: calc(100vh - 80px);
}

.none {
  font-size: 14px;
  text-align: center;
}

.empty-state {
  padding: 50px 20px;
  text-align: center;
  color: #999;
  font-size: 14px;

  img {
    width: 100%;
  }
}

.loading-state {
  margin: auto;
  text-align: center;
  padding: 50px 0;
}
</style>
