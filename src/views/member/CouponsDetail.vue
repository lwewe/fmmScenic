<template>
  <div class="location">
    <ReturnBack :rcolor="'#fff'" :bcolor="'#00000087'"></ReturnBack>
    <NProgress v-if="loadingflag"/>
    <!--http://192.168.3.7/ /Public/ueditor/php/upload/image/20240311/1710137954941535.jpg\ -->
    <!--    头部-->
    <div class="bnner">
      <img class="img" :src=" detail.img" alt="">
    </div>
    <div class="centerBox">
      <!--    价格-->
      <div class="priceBox">
        <div class="price">￥<span class="priceNum">{{ detail.price }}</span></div>
        <div class="title">{{ detail.title }}</div>
        <div class="introduce" v-if="detail.product">{{ 介绍 }}</div>
      </div>
      <!--  规格-->
      <div class="priceBox specifications">
        <div>规格</div>
        <div>{{ detail.gueige }}</div>
      </div>
      <!--      详情-->
      <!-- {{ contentimg }} -->
      <div class="priceBox detailBox">
        <div class="imgBox" v-html="detail.content">

        </div>
        <!-- <div class="title">商品详情</div>
        <div class="detail">
          <div class="minTitle">商品说明</div>
          <div class="info">
            <p>大将军府将军酷酷酷</p>
            <p>大将军府将军酷酷酷</p>
            <p>大将军府将军酷酷酷</p>
            <p>大将军府将军酷酷酷</p>
          </div>
        </div>
        <div class="detail detail2">
          <div class="minTitle">购买须知</div>
          <div class="info">
            <p>1.大将军府将军酷酷酷大将军府将军酷酷酷,大将军府将军酷酷酷大将军府将军酷酷酷</p>
            <p>2.大将军府将军酷酷酷</p>
          </div>
        </div>
        <div class="detail detail2">
          <div class="minTitle">温馨提示</div>
          <div class="info">
            <p>1.大将军府将军酷酷酷大将军府将军酷酷酷,大将军府将军酷酷酷大将军府将军酷酷酷</p>
            <p>2.大将军府将军酷酷酷</p>
          </div>
        </div>
        <div class="detail detail2">
          <div class="minTitle">会员权益</div>
          <div class="info">
            <div class="welfareList">
              <div class="welfare" v-for="item in welfareList" :key="item.id">
                <div class="welfareImg">
                  <img class="img" :src="item.img" alt="">
                </div>
                <div class="welfareText">{{ item.text }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="none">实际使用权益以腾讯视频官方规定为准</div> -->
      </div>
    </div>
    <!--    支付-->
    <div class="footer">
      <a :href="kefu">
        <div>
          <div class="serviceBox">
            <img class="img" src="../../assets/fukaxq/kf.png" alt="">
          </div>
          <div class="serviceText">客服</div>
        </div>
      </a>

      <div class="btnBox">
        <van-button type="danger" class="btn" @click="toPay">￥{{ detail.price }} &nbsp;立即购买</van-button>
      </div>
    </div>
    <!--    支付弹窗-->
    <van-popup v-model="show" position="bottom">
      <div>
        <BuyFreeca :detail="detail" :list="list"></BuyFreeca>
        <div class="close" @click="show=false">
          <van-icon size="18px" name="cross"/>
        </div>
      </div>
    </van-popup>
  </div>
</template>
<script>
// 获取客服
import {getLogo} from "@/api/locality/login"
import BuyFreeca from "@/components/BuyFreeca.vue";
import {geCardDetail} from "@/api/member"

export default {
  name: "CouponsDetail",
  components: {
    BuyFreeca
  },
  data() {
    return {
      welfareList: [],
      show: false,
      id: 0,
      detail: [],
      list: [],
      contentimg: "",
      loadingflag: false,
      kefu: ""
    }
  },
  mounted() {
    // if(!to.meta.keepAlive){
    document.body.scrollTop = 0

// firefox

    document.documentElement.scrollTop = 0

// safari

    window.pageYOffset = 0
    this.id = this.$route.query.id
    this.getCardDetailList()
  },

  methods: {
    isWeiXin() {
      var ua = window.navigator.userAgent.toLowerCase();
      if (ua.match(/MicroMessenger/i) == "micromessenger") {
        return true;
      } else {
        return false;
      }
    },
    toPay() {
      if (localStorage.getItem("token")) {
        this.show = true
      } else {
        this.$toast("请先登录")
        setTimeout(() => {
          if (this.isWeiXin()) {
            this.$router.replace("/quickLogin")
          } else {
            this.$router.replace("/login")
          }
        }, 1000)
      }
    },
    getCardDetailList() {
      geCardDetail({
        id: this.id
      }).then(res => {
        // console.log(res);
        this.detail = res.data.show
        this.list = res.data.list
      })
    },
    getLoginInfo() {
      getLogo().then(res => {
        // console.log(res);
        if (res.code == 200) {
          this.kefu = res.data.zxkf
        }
      })
    },
  },
  created() {
    //加载
    // this.loadingflag = true
    // var _this = this
    // setTimeout(function () {
    //   _this.loadingflag = false
    // }, 800)
    this.getLoginInfo()
  }
}
</script>


<style scoped lang="less">
.location {
  width: 100%;
  min-height: 100vh;
  background-color: #F0F0F0;
}

.bnner {
  //height: 45vh;
}

.centerBox {
  padding: 0px 15px 65px;
  //价格
  .priceBox {
    background-color: white;
    border-radius: 8px;
    margin-top: 10px;
    padding: 10px 15px 16px;
    font-weight: bold;

    .price {
      color: #ED343A;

      .priceNum {
        font-size: 24px;
      }
    }

    .title {
      margin-top: 5px;
      font-size: 17px;
      color: #222222;
    }

    .introduce {
      color: #A6A6A6;
      font-size: 12px;
      margin-top: 4px;
      font-weight: 500;
    }
  }

  //  规格
  .specifications {
    font-size: 15px;
    color: #424242;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 16px;
    padding-bottom: 15px;
  }

  //  详情
  .detailBox {
    .title {
      font-size: 15px;
      color: #424242;
    }

    .detail {
      padding: 13px 17px;

      .minTitle {
        font-size: 15px;
        color: #424242;
      }

      .info {
        font-size: 12px;
        color: #B0B0B0;
        font-weight: 500;
      }

      .info p {
        margin: 5px 0px;
        line-height: 18px;
      }
    }

    .detail2 {
      margin-top: -18px;
    }

    .welfareList {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;

      .welfare {
        width: 25%;
        margin-top: 15px;

        .welfareImg {
          width: 42px;
          margin: auto;
        }

        .welfareText {
          text-align: center;
          padding-top: 4px;
        }
      }

    }

    .none {
      text-align: center;
      font-weight: 500;
      margin-top: 15px;
      font-size: 12px;
      color: #A4A4A4;
    }
  }
}

//支付
.footer {
  background-color: white;
  width: 100%;
  height: 55px;
  position: fixed;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 25px 0px 40px;
  box-sizing: border-box;

  .serviceBox {
    width: 21px;
    margin: auto;
  }

  .serviceText {
    color: #4B4B4B;
    font-size: 10px;
    text-align: center;
  }

  .btn {
    border-radius: 30px;
    width: 100%;
    height: 38px;
    font-size: 16px;
    line-height: 38px;
    background-color: #ED3036;
  }

  .btnBox {
    width: 82%;
  }
}

.van-popup--bottom {
  height: 97vh;
  background-color: #F3F4F8 !important;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  z-index: 1500 !important;
}
/deep/.van-overlay {
  z-index: 1499 !important;
}
.close {
  position: absolute;
  top: 10px;
  right: 10px;
}

.imgBox {
  width: 100%;
}

/deep/ .imgBox img {
  width: 100%;
}
</style>