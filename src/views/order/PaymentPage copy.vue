<template>
  <div class="paymentpage">
    <ReturnBack :rcolor="'#fff'" :bcolor="'#00000087'"></ReturnBack>
    <NProgress v-if="loadingflag"/>
    <div class="centerBox">
      <div class="paydetail" style="position: relative;">
        <p class="paytime" style="">支付剩余时间 {{ countdown }}</p>
        <div class="top">
          <div class="imgbox">
            <img class="img" :src="orderDetail.movielogo" alt="">
          </div>
          <div class="detail">
            <p class="filmtitle">
              <span>{{ orderDetail.moviename }}</span>
              <span>共{{ orderDetail.quantity }}张</span>
            </p>
            <p class="filmtime" v-if="orderDetail.playtime">
              <span class="font07">{{ orderDetail.playtime.split(" ")[0].split("-").splice(1).join("-") }}</span>
              <span class="font07" style="padding-left: 5px">{{
                  orderDetail.playtime.split(" ")[0].split("-").splice(1).join("-") == nowDate ? "今天" : ""
                }}{{ orderDetail.playtime.split(" ")[0].split("-").splice(1).join("-") == days ? "明天" : "" }}
            {{ orderDetail.playtime.split(" ")[1].split(":").splice(0, 2).join(":") }}</span>
              <span class="font07" style="padding-left: 5px">{{ orderDetail.edition }}</span>
            </p>
            <p class="filmaddress">
              <span class="font07">{{ orderDetail.cinemaname }}</span>
            </p>
            <p class="filmseat">
              <span class="font07">{{ orderDetail.roomname }}</span>&nbsp;&nbsp;
              <span class="font07" v-if="orderDetail.seats">{{ orderDetail.seats.split(",").join(" ") }}</span>
            </p>
            <p class="filmprice">
              <span>{{ orderDetail.showamount }}元</span>
            </p>
          </div>
        </div>
        <div class="bottom">
          <van-icon name="clear" color="red" size="1.2em"/>&nbsp;&nbsp;
          <span>不支持退票</span>&nbsp;&nbsp;&nbsp;
          <van-icon name="clear" color="red" size="1.2em"/>&nbsp;&nbsp;
          <span>不支持改签</span>
        </div>
      </div>
      <div class="phone">
        <div class="pic" style="margin-left: 15px;">
          <img src="../../assets/phone.png" alt="" style="width: 10vw;height: auto;">
        </div>
        <div style="margin-left: 3vw;">
          <p style="font-size: 1em;" v-if="orderDetail.mobile">{{
              orderDetail.mobile.slice(0, 3)
            }}****{{ orderDetail.mobile.slice(orderDetail.mobile.length - 4, orderDetail.mobile.length) }}</p>
          <p style="font-size: 0.8em;margin-top: 0.5vh;color: #999;">手机号用于接收验票短信手机号码</p>
        </div>
      </div>
      <!--      支付-->
      <Payment :result1="result" :cardList="cardList" @getResult="getResult"></Payment>
    </div>
    <div class="footer"
         style="display: flex;justify-content: space-between;padding: 0px 15px;align-items: center;box-sizing: border-box">
      <span>应支付: <b style="font-size: 1.2em;color: red;">{{ orderDetail.showamount }}元</b></span>
      <button style="" @click="toPay">立即支付</button>
    </div>
    <!--  支付密码-->
    <van-popup v-model="show" position="bottom">
      <div class="passwordBox">
        <div class="close" @click="show=false">
          <van-icon size="18px" name="cross"/>
        </div>
        <div class="title">请输入支付密码</div>
        <div class="flex">
          <div>付款方式</div>
          <div>福利卡</div>
        </div>
        <!-- 密码输入框 -->
        <van-password-input
            style="margin-top: 15px"
            :value="pass"
            @focus="showKeyboard = true"
        />
        <!-- 数字键盘 -->
        <van-number-keyboard
            :show="showKeyboard"
            @input="onInput"
            @delete="onDelete"
            @blur="showKeyboard = false"
        />
      </div>
    </van-popup>
  </div>
</template>


<script>
//引入
import moment from 'moment';
import 'moment/locale/zh-cn';
import {filmPaySuccess, filmWxpay, jsordershow, unlockseat} from "@/api/locality/order";
import {getcardList, getopenid, pay_date, toflkpay} from "@/api/locality/card";
import Payment from "@/components/Payment.vue";
import {
  getMoviecard,
  getMovieflkpay,
  getMoviepayDate,
  getMoviepaySuccess,
  getMoviewxpay,
  getPayOrdershow
} from "@/api/city";

moment.locale('zh-cn');
export default {
  components: {
    Payment
  },
  data() {
    return {
      // 支付方式选中
      checked: "",
      // 支付倒计时
      createtime: "",//开始时间
      daoTim: "",  //倒计时时间
      msg: "",
      orderNo: "",
      orderDetail: {},
      nowDate: "",
      days: "",
      timeDowm: "",
      countdown: "",
      name: "1",
      token: "",
      cardList: [],
      result: [],
      wxprice: 0,
      dkprice: 0,
      show: false,
      pass: "",
      showKeyboard: true,
      ka_ids: [],
      openid: "",
      wxCode: "",
      change: "",
      loadingflag: false,
      newMove: 0,
      countdownInterval:null
    }
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
    // ///////微信登录
    onBridgeReady(params, order_no) {
      var that = this
      // "jsApiParameters": { //支付信息
      //   "appId": "wx05cc5223511e93c3",
      //       "timeStamp": "1710496158",
      //       "nonceStr": "qx0rpl2z6aqb492cvejftx5p4dowya4u",
      //       "package": "prepay_id=wx15174918865168a10f39f811aca3ea0000",
      //       "signType": "MD5",
      //       "paySign": "F0A17328ADD15AA9171CAEB082261A47"
      // }
      WeixinJSBridge.invoke(
          'getBrandWCPayRequest', {
            "appId": params.appId,  //公众号名称，由商户传入
            "timeStamp": params.timeStamp, //支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
            "nonceStr": params.nonceStr,  //支付签名随机串，不长于 32 位
            "package": params.package,//统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
            "signType": params.signType,  //签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
            "paySign": params.paySign, //支付签名
          },
          function (res) {
            if (res.err_msg === "get_brand_wcpay_request:ok") {
              if(this.newMove == 1){
                getMoviepaySuccess({
                  token: that.token,
                  order_no
                }).then(res => {
                  if (res.data.orderstatus == 0) {
                    that.$toast("支付失败")
                  } else if (res.data.orderstatus == 1) {
                    that.$toast("支付成功")
                  } else if (res.data.orderstatus == 4) {
                    that.$toast("出票成功")
                  } else if (res.data.orderstatus == 7) {
                    that.$toast("出票失败(退款)")
                  } else if (res.data.orderstatus == 8) {
                    that.$toast("超时未付")
                  } else if (res.data.orderstatus == 11) {
                    that.$toast("正在出票")
                  }
                  if (this.change == 0) {
                    setTimeout(() => {
                      that.$router.go(-1)
                    }, 1000)
                  } else {
                    setTimeout(() => {
                      that.$router.replace({path: "/orderInfo", query: {tabIndex: 0}})
                    }, 1000)
                  }
                })
                return
              }
              filmPaySuccess({
                token: that.token,
                order_no
              }).then(res => {
                if (res.data.orderstatus == "N") {
                  that.$toast("支付失败")
                } else if (res.data.orderstatus == "C") {
                  that.$toast("已取消")
                } else if (res.data.orderstatus == "E") {
                  that.$toast("订单已过期")
                } else if (res.data.orderstatus == "P") {
                  that.$toast("支付成功")
                } else if (res.data.orderstatus == "T") {
                  that.$toast("通知处理中")
                } else if (res.data.orderstatus == "S") {
                  that.$toast("出票成功")
                } else if (res.data.orderstatus == "F") {
                  that.$toast("出票失败，等待退款")
                } else if (res.data.orderstatus == "R") {
                  that.$toast("退款完成")
                }
                if (this.change == 0) {
                  setTimeout(() => {
                    that.$router.go(-1)
                  }, 1000)
                } else {
                  setTimeout(() => {
                    if (sessionStorage.getItem("change") == 1) {
                      window.location.href = that.$store.state.shopUrl + "/orderInfo?tabIndex=0" + "&token=" + localStorage.getItem("token")
                    } else {
                      that.$router.replace({path: "/orderInfo", query: {tabIndex: 0}})
                    }
                  }, 1000)
                }
              })
            } else if (res.err_msg === "get_brand_wcpay_request:fail") {
              that.$toast("支付失败")
            }
            // if (res.err_msg) {
            //
            // }
          });
    },
    // // 询问是否取消锁座
    // messageinfo(orderid){
    //   this.$dialog.confirm({
    //     title:'您还有订单未支付是否继续支付',
    //     message:'',
    //     confirmButtonColor:'red'
    //   }).then(()=>{
    //     // console.log('点击了确认')
    //   }).catch(()=>{
    //     // console.log('点击了取消')
    //     this.cancelOrder(orderid)
    //   })
    // },
    // // 取消锁座
    // cancelOrder(oid){
    //   unlockseat({
    //     token:this.token,
    //     oid
    //   }).then(res=>{
    //     console.log(res)
    //     if(res.code == 200){
    //       this.$toast(res.data)
    //       setTimeout(()=>{
    //         this.$router.replace("/")
    //       },1000)
    //     }
    //   })
    // },
    onInput(key) {
      this.pass = (this.pass + key).slice(0, 6);
      if (this.pass.length == 6) {
        this.show = false
        this.flkpay(this.pass)
        this.pass = ""
      }
    },
    onDelete() {
      this.pass = this.pass.slice(0, this.pass.length - 1);
    },
    getResult(result, checked) {
      this.result = result
      this.checked = checked
    },
    // 支付
    // 福利卡支付
    flkpay(pass) {
      if(this.newMove == 1){
        getMovieflkpay({
          token: this.token,
          ka_ids: this.ka_ids,
          oid: this.orderNo,
          pass: pass
        }).then(res => {
          this.$toast(res.msg)
          if (res.code == 200 && res.data) {
            this.getcard()
            if (this.change == 0) {
              setTimeout(() => {
                this.$router.go(-1)
              }, 1000)
            } else {
              setTimeout(() => {
                if (sessionStorage.getItem("change") == 1) {
                  window.location.href = this.$store.state.shopUrl + "/orderInfo?tabIndex=0" + "&token=" + localStorage.getItem("token")
                } else {
                  this.$router.replace({path: "/orderInfo", query: {tabIndex: 0}})
                }
              }, 1000)
            }
          }
        })
        return
      }
      toflkpay({
        token: this.token,
        ka_ids: this.ka_ids,
        oid: this.orderNo,
        pass: pass
      }).then(res => {
        this.$toast(res.msg)
        if (res.code == 200 && res.data) {
          this.getcard()
          if (this.change == 0) {
            setTimeout(() => {
              this.$router.go(-1)
            }, 1000)
          } else {
            setTimeout(() => {
              if (sessionStorage.getItem("change") == 1) {
                window.location.href = this.$store.state.shopUrl + "/orderInfo?tabIndex=0" + "&token=" + localStorage.getItem("token")
              } else {
                this.$router.replace({path: "/orderInfo", query: {tabIndex: 0}})
              }
            }, 1000)
          }
        }
      })
    },
    // 计算福利卡是否够支付
    isPay_date() {
      if(this.newMove == 1){
        getMoviepayDate({
          token: this.token,
          fulika: this.result.join(","),
          oid: this.orderNo
        }).then(res => {
          if (res.code == 200) {
            // 福利卡支付价格
            this.dkprice = res.data.dkprice
            this.wxprice = res.data.wxprice
            this.ka_ids = res.data.ka_ids
            if (this.wxprice != 0) {
              //   微信支付
              // 去支付
              if (!this.isWeiXin()) {
                this.$toast("请使用微信打开进行支付")
                return;
              }
              getMoviewxpay({
                token: this.token,
                oid: this.orderNo,
                ka_ids: res.data.ka_ids,
                openid: this.openid,
              }).then(res => {
                if (res.code == 200) {
                  this.onBridgeReady(res.data.jsApiParameters, res.data.order_no)
                } else {
                  this.$toast(res.msg)
                }
              })
            } else {
              if (this.dkprice != 0) {
                this.show = true
              }
            }
          } else {
            this.$toast(res.msg)
          }
        })
        return
      }
      pay_date({
        token: this.token,
        fulika: this.result.join(","),
        oid: this.orderNo
      }).then(res => {
        if (res.code == 200) {
          // 福利卡支付价格
          this.dkprice = res.data.dkprice
          this.wxprice = res.data.wxprice
          this.ka_ids = res.data.ka_ids
          if (this.wxprice != 0) {
            //   微信支付
            // 去支付
            if (!this.isWeiXin()) {
              this.$toast("请使用微信打开进行支付")
              return;
            }
            filmWxpay({
              token: this.token,
              oid: this.orderNo,
              ka_ids: res.data.ka_ids,
              openid: this.openid,
            }).then(res => {
              if (res.code == 200) {
                this.onBridgeReady(res.data.jsApiParameters, res.data.order_no)
              } else {
                this.$toast(res.msg)
              }
            })
          } else {
            if (this.dkprice != 0) {
              this.show = true
            }
          }
        } else {
          this.$toast(res.msg)
        }
      })
    },
    toPay() {
      if (this.result.length == 0 && this.checked == "") {
        this.$toast("请选择支付方式")
        return
      }
      // if (this.result.length == 0 && this.checked != "") {
      //   // 去支付
      //   if (!this.isWeiXin()) {
      //     this.$toast("请使用微信打开进行支付")
      //     return;
      //   }
      //   filmWxpay({
      //     token: this.token,
      //     oid: this.orderNo,
      //     ka_ids: [],
      //     openid: this.openid,
      //   }).then(res => {
      //     if (res.code == 200) {
      //       this.onBridgeReady(res.data.jsApiParameters, res.data.order_no)
      //     } else {
      //       this.$toast(res.msg)
      //     }
      //   })
      // } else {
        this.isPay_date()
      // }
    },
    // 福利卡列表
    getcard() {
      this.result = []
      getcardList({
        token: this.token
      }).then(res => {
        if (res.code == 200) {
          this.cardList = res.data
          if (this.cardList.length !== 0) {
            this.result.push(this.cardList[0].id)
          }
        }
      })
    },
    getNewcard() {
      this.result = []
      getMoviecard({
        token: this.token
      }).then(res => {
        if (res.code == 200) {
          this.cardList = res.data
          if (this.cardList.length !== 0) {
            this.result.push(this.cardList[0].id)
          }
        }
      })
    },
    // 获取当前的时间
    getNowTime() {
      let dt = new Date()
      var y = dt.getFullYear()
      var mt = (dt.getMonth() + 1).toString().padStart(2, '0')
      var day = dt.getDate().toString().padStart(2, '0')
      var h = dt.getHours().toString().padStart(2, '0')
      var m = dt.getMinutes().toString().padStart(2, '0')
      this.nowtime = y + "-" + mt + "-" + day + " " + h + ":" + m
      // console.log('此刻时间',this.nowtime)
    },
    // 获取订单的下单时间
    // 计算过期时间
    getadver() {
      let time = parseInt(new Date().getTime() / 1000) + '';
      this.timeDowm = Number(this.orderDetail.expiretime) - time
      this.countdownInterval = setInterval(() => {
        const minutes = Math.floor(this.timeDowm / 60);
        const seconds = this.timeDowm % 60;
        this.countdown = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        this.timeDowm--;
        if (this.timeDowm <= 0) {
          clearInterval( this.countdownInterval);
          // 倒计时结束后的操作
          this.$toast("订单过期")
          setTimeout(() => {
            this.$router.replace("/")
          }, 1000)
        }
      }, 1000);
    },
    // 获取订单详情’
    getOrderDetail() {
      jsordershow({
        token: this.token,
        oid: this.orderNo
      }).then(res => {
        if (!res.data) {
          this.$toast("订单已失效")
          this.$router.go(-1)
          return
        }
        this.loadingflag = false
        this.orderDetail = res.data
        this.getadver()
      })
    },
    // 获取订单详情’
    getNewOrderDetail() {
      getPayOrdershow({
        token: this.token,
        oid: this.orderNo
      }).then(res => {
        if (!res.data) {
          this.$toast("订单已失效")
          this.$router.go(-1)
          return
        }
        this.loadingflag = false
        this.orderDetail = res.data
        this.getadver()
      })
    },
  },
  mounted() {
  },
  created() {
    this.loadingflag = true
    this.token = localStorage.getItem("token")
    this.timestamp = moment(new Date()).format('yyyy-MM-DD HH:mm:ss');
    this.nowDate = moment(new Date()).format('MM-DD');
    this.days = moment(new Date()).add(1, 'days').format('MM-DD');
    this.orderNo = this.$route.query.order
    this.newMove = this.$route.query.new
    if (this.newMove == 1) {
      this.getNewOrderDetail()
      this.getNewcard()
    } else {
      this.getOrderDetail()
      this.getcard()
    }

    if (localStorage.getItem("openid")) {
      this.openid = localStorage.getItem("openid")
    }
    this.change = this.$route.query.change
  },
  // beforeRouteLeave(to, from, next) {
  //   console.log(from)
  //   // 检测用户是否要返回上一页
  //   if (from.path === '/paymentpage') {
  //     // 用户即将返回到PageA页面
  //     // if (confirm('确定要返回上一页吗？')) {
  //     //   next(); // 确认返回
  //     // } else {
  //     //   next(false); // 取消返回
  //     // }
  //     this.messageinfo(this.orderNo)
  //   } else {
  //     next(); // 其他情况直接离开当前页面
  //   }
  // }
  beforeDestroy() {
    clearInterval( this.countdownInterval);
  },
}

</script>


<style scoped>
* {
  margin: 0;
  padding: 0;
}

.centerBox {
  padding: 15px 15px 70px;
}

.paymentpage {
  background-color: #f0f0f0;
  min-height: 100vh;

  /* padding-bottom: 50px; */
}

.paymentpage .font07 {
  font-size: .8em;
  color: #999;
}

.paymentpage .paytime {
  position: absolute;
  font-size: 0.8em;
  color: red;
  background-color: #fff1d7;
  right: 0;
  padding-right: 3vw;
  border-top-right-radius: 10px;
  padding-left: 2vw;
}

.paymentpage .paydetail {
  background-color: #fff;
  display: inline-block;
  border-radius: 10px;
  padding-bottom: 10px;
  width: 100%;
}

.paymentpage .paydetail .top {
  height: 70%;
  /* background-color: #333; */
  margin-left: 5%;
  margin-right: 5%;
  margin-top: 3%;
  padding-bottom: 3%;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #f0f0f0;
}

.paymentpage .imgbox {
  width: 35%;
  height: 90%;

}

.paymentpage .imgbox img {
  border-radius: 6px;

}

.paymentpage .top .detail {
  width: 59%;
  height: 90%;
  /* background: pink; */
  margin-left: 4%;
}

.paymentpage .top .detail .filmtitle {
  /* background-color: red; */
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 3%;
}

.paymentpage .top .detail .filmtitle span:nth-of-type(1) {
  font-weight: 600;
  font-size: 1em;
}

.paymentpage .top .detail .filmtitle span:nth-of-type(2) {
  font-size: 0.7em;
}

.paymentpage .top .detail .filmtime {
  margin-top: 3.5%;
  margin-bottom: 2%;
}

.paymentpage .top .detail .filmseat {
  margin-top: 2%;
}

.paymentpage .top .detail .filmprice {
  margin-top: 4%;
  color: red;
  font-weight: 600;
  font-size: 1.1em;
}

.paymentpage .bottom {
  margin-top: 4.5%;
  margin-left: 4%;
  display: flex;
  font-size: 0.8em;
  align-items: center;
}

.paymentpage .phone {
  height: 10vh;
  background-color: #fff;
  border-radius: 10px;
  display: flex;
  align-items: center;
  margin-top: 10px;
}

.footer {
  width: 100%;
  height: 60px;
  /* background-color: red */
  position: fixed;
  bottom: 0px;
  background-color: #fff;
}

.footer button {
  width: 25vw;
  height: 5vh;
  border-radius: 50px;
  border: none;
  background-color: #ed3036;
  color: #fff;
  font-size: 0.8em;

}


.van-popup--bottom {
  height: 54%;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
}

.passwordBox {
  padding: 15px;
  position: relative;
}

.close {
  position: absolute;
  top: 10px;
  right: 10px;
}

.title {
  text-align: center;
  font-size: 13px;
}

.flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  color: #9b9b9b;
  margin-top: 15px;
  padding: 0px 10px;
}
</style>