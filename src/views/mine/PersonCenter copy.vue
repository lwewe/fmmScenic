<template>
  <div class="location">
    <!--    顶部-->
    <div class="topPage">
      <!--      <div class="title">悦享聚汇</div>-->
      <div class="info">
        <!--        头像-->
        <div class="avatar">
          <van-uploader :after-read="onRead">
            <img class="img"
                 :src=" userInfo.img"
                 alt="">
          </van-uploader>
        </div>
        <!--        手机号-->
        <div class="phone">{{ userInfo.phone }}</div>
      </div>
      <!--      我的卡券-->
      <div class="coupons">
        <div class="couponsTitle">我的卡券</div>
        <div class="couponsBox">
          <div class="welfareBox" style="width: 48%;" @click="gosecuritycards()">
            <div>
              <div class="welfareCard" style="white-space: nowrap">福利卡</div>
              <div class="none" style="text-align: center;white-space: nowrap;" v-if="userInfo.card_num!=0">{{ userInfo.card_num }}张福利卡</div>
              <div class="none" style="text-align: center;white-space: nowrap;" v-else>暂无福利卡</div>
            </div>
            <div class="welfare" style="width: 39px;" @click="gosecuritycards()">
              <img class="img" src="../../assets/mine/flk.png" alt="">
            </div>
          </div>
          <div class="line"></div>
          <a :href="kefu">
            <div class="welfareBox">
            <div>
              <div class="welfareCard">在线客服</div>
              <div class="none">全年无休(9:00-21:00)</div>
            </div>
            <div class="welfare">
              <img class="img" src="../../assets/mine/kf.png" alt="">
            </div>
          </div>
          </a>

        </div>
      </div>
      <!--      我的订单-->
      <div class="coupons orderMax">
        <div class="myOrder">
          <div class="couponsTitle">我的订单</div>
          <div class="allOrder" @click="allOrder">
            <div>全部</div>
            <div class="arrow">
              <van-icon size="12px" name="arrow"/>
            </div>
          </div>
        </div>
        <!--        状态-->
        <div class="obligationMax">
          <div class="obligationBox" v-for="item in obligation" :key="item.id" @click="toOrder(item.id)">
            <div class="obligationImg">
              <img class="img" :src="item.icon" alt="">
              <div class="point" v-if="item.type&&item.id==1"></div>
              <div class="num" v-if="item.type&&item.id==2">{{ item.type }}</div>
            </div>
            <div class="obligationText">{{ item.text }}</div>
          </div>
        </div>
      </div>
      <!--      其他-->
      <div class="coupons orderMax otherMax">
        <div class="payBox" v-for="item in otherList" :key="item.id" @click="toOther(item.path,item.id)">
          <div class="leftBox">
            <div class="payPassword">
              <img class="img" :src="item.icon" alt="">
            </div>
            <div class="payText">{{ item.text }}</div>
          </div>
          <div style="margin-top: 6px;color: #DDDDDD">
            <van-icon size="17px" name="arrow"/>
          </div>
        </div>
      </div>
    </div>
<!--    <NavigationTab :active="2"></NavigationTab>-->
  </div>
</template>
<script>
import NavigationTab from "@/components/NavigationTab.vue";
import {changeAvatar, getUserInfo} from "@/api/locality/login";
import {getOrderList} from "@/api/locality/order";
// 获取客服
import {getLogo} from "@/api/locality/login"
export default {
  name: "PersonCenter",
  components: {
    NavigationTab
  },
  data() {
    return {
      phone: "15232117293",
      obligation: [
        {
          class:"daifukuan",
          id: 1,
          icon: require("../../assets/mine/dfk.png"),
          text: "待付款",
          type: null
        },
        {
          class:"daishiyong",
          id: 2,
          icon: require("../../assets/mine/dsy.png"),
          text: "待使用",
          type: null
        },
        {
          class:"wancheng",
          id: 3,
          icon: require("../../assets/mine/dpj.png"),
          text: "已完成"
        },
        {
          class:"tuikuan",
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
      kefu:""
    }
  },
  methods: {
    //   订单列表
    getOrder(type) {
      getOrderList({
        token: this.token,
        type: type,
        pageno: 1,
        pagesize: 10
      }).then(res => {
        if (res.code == 200) {
          this.orderList = res.data.list
          if (type == 2) {
            this.obligation[0].type = this.orderList.length
          } else if (type == 3) {
            this.obligation[1].type = this.orderList.length
          }
        }
      })
    },
    gosecuritycards() {
      this.$router.push({path: "/SecurityCards"})
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
        window.location.href=this.kefu
      }else{
        this.$router.push({path: "/orderInfo", query: {tabIndex: id}})
      }

    },
    allOrder() {
      this.$router.push({path: "/orderInfo", query: {tabIndex: 0}})
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
        this.$router.options.routes.forEach(item=>{
          if(item.meta){
            if(item.meta.keep){
              item.meta.keepAlive=false
            }
          }
        })
        setTimeout(()=>{
          this.$router.push({path: "/index"})
        },1000)
      }).catch(() => {
      })

    },
    getLoginInfo(){
      getLogo().then(res=>{
        if(res.code==200){
          this.kefu=res.data.zxkf
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
    if(localStorage.getItem("token")){
    this.getLoginInfo()
      this.token = localStorage.getItem("token")
      this.getUserInfo()
      this.getOrder(2)
      this.getOrder(3)
    }else{
      this.$toast("请先登录")
      if(this.isWeiXin()){
        this.$router.replace("/quickLogin")
      }else{
        this.$router.replace("/login")
      }
    }
  }
}
</script>


<style scoped lang="less">
.location {
  background-color: #F0F0F0;
  height: calc(100vh - 50px);
}

//头部
.topPage {
  background-image: linear-gradient(to bottom, #F9433D, #FC8472);
  padding: 0px 15px 5px;
  height: 201px;

  .title {
    text-align: center;
    color: white;
    font-size: 18px;
  }

  .info {
    display: flex;
    align-items: center;
    padding: 41px 0px 0px 20px;
  }

  .avatar {
    width: 70px;
    height: 70px;
    overflow: hidden;
    border-radius: 50%;
    border: 1px #fff solid;
  }

  .phone {
    color: white;
    font-size: 18px;
    letter-spacing: 1px;
    padding: 20px 0px 0px 12px;
  }
}

//我的卡券
.coupons {
  background-color: white;
  border-radius: 8px;
  margin-top: 8px;
  padding: 15px;

  .couponsTitle {
    font-weight: bold;
    color: #383838;
  }

  .welfare {
    min-width: 43px;
    width: 43px;
  }

  .welfareBox {
    display: flex;
    align-items: center;
    justify-content: space-between;
    //width: 42%;
    padding: 19px 10px 0px;
    gap: 5px;
  }

  .none {
    font-size: 12px;
    color: #696969;
    margin-top: 5px;
  }

  .welfareCard {
    font-weight: bold;
    font-size: 15px;
    color: #343434;
    white-space: nowrap;
  }

  .couponsBox {
    display: flex;
    align-items: center;
    //justify-content: space-between;
  }

  .line {
    width: 1px;
    background-color: #CECECE;
    height: 45px;
  }
}

//我的订单
.orderMax {
  margin-top: 10px;

  .myOrder {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .allOrder {
    color: #9D9D9D;
    display: flex;
    align-items: center;
    font-size: 13px;
  }

  .arrow {
    height: 11px;
    padding-left: 3px;
  }

  .obligationBox {
    text-align: center;
  }

  .obligationImg {
    width: 28px;
    height: 28px;
    margin: auto;
    position: relative;
  }

  .obligationText {
    color: #676767;
    margin-top: 3px;
    font-size: 13px;
    font-weight: bold;
  }

  .point {
    position: absolute;
    width: 8px;
    height: 8px;
    background-color: #ED3036;
    border-radius: 50%;
    top: 0px;
    right: 0px;
  }

  .num {
    position: absolute;
    min-width: 13px;
    height: 10px;
    border-radius: 50%;
    top: -10px;
    left: 17px;
    border: 1px solid #ed3036;
    color: #ed3036;
    font-size: 10px;
    padding: 1px 1px 3px;
  }

  .obligationMax {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 20px 5px;
  }
}

//其他
.otherMax {
  padding-top: 0px;
  padding-bottom: 0px;

  .payPassword {
    width: 27px;
    height: 27px;
  }

  .leftBox {
    display: flex;
    align-items: center;
  }

  .payText {
    color: #6C6C6C;
    font-weight: bold;
    padding-left: 6px;
  }

  .payBox {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px #F8F8F8 solid;
    padding: 13px 0px;
  }
}

</style>
