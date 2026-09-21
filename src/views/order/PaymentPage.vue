<template>
  <div class="paymentpage">
    <ReturnBack :rcolor="'#fff'" :bcolor="'#00000087'"></ReturnBack>
    <NProgress v-if="loadingflag" />
    <div class="centerBox">
      <div class="box">
        <div>共需支付</div>
        <div class="red"><span>￥</span>{{ price }}</div>
      </div>
      <!--      支付-->
      <Payment :result1="result" :cardList="cardList" @getResult="getResult"></Payment>
    </div>
    <div class="footer"
      style="display: flex;justify-content: space-between;padding: 0px 15px;align-items: center;box-sizing: border-box">
      <span>应支付: <b style="font-size: 1.2em;color: red;">{{ price }}元</b></span>
      <button style="" @click="toPay">立即支付</button>
    </div>
    <!--  支付密码-->
    <van-popup v-model="show" position="bottom">
      <div class="passwordBox">
        <div class="close" @click="show = false">
          <van-icon size="18px" name="cross" />
        </div>
        <div class="title">请输入支付密码</div>
        <div class="flex">
          <div>付款方式</div>
          <div>福利卡</div>
        </div>
        <!-- 密码输入框 -->
        <van-password-input style="margin-top: 15px" :value="pass" @focus="showKeyboard = true" />
        <!-- 数字键盘 -->
        <van-number-keyboard :show="showKeyboard" @input="onInput" @delete="onDelete" @blur="showKeyboard = false" />
      </div>
    </van-popup>
  </div>
</template>


<script>
//引入
import moment from 'moment';
import 'moment/locale/zh-cn';
import { filmPaySuccess, filmWxpay, jsordershow, unlockseat } from "@/api/locality/order";
import { getcardList, getopenid, pay_date, toflkpay, scenicpaysuccess } from "@/api/locality/card";
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
      // total:'',
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
      countdownInterval: null,
      codes: '',
      price: '',
      quelitys: '',
      orderData: "",
        lastClickTime: 0, // 上次点击时间
    debounceTime: 2000, // 防抖时间2秒
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
            that.$toast("支付成功");     
            setTimeout(() => {
              scenicpaysuccess({
                token: that.token,
                order_no
              }).then(res => {
                if (res.code == 200) {
                    setTimeout(() => {
                      // if (sessionStorage.getItem("change") == 1) {
                      //   window.location.href = that.$store.state.shopUrl + "/orderInfo?tabIndex=0" + "&token=" + localStorage.getItem("token")
                      // } else {
                        that.$router.replace({ path: "/orderInfo", query: { tabIndex: 0 } })
                      // }
                    }, 1000)
                } else {
                  that.$toast('出票失败.')
                  that.$router.replace({ path: "/orderInfo", query: { tabIndex: 0 } }) 
                }

              })

            }, 3000)
            // 
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
    scenicPsuccess(orderId) {
      scenicpaysuccess({
        token: this.token,
        order_no: orderId,
      }).then(res => {
        console.log(res)
      })
    },
    // 福利卡支付
    flkpay(pass) {
      // if (this.newMove == 1) {
      //   getMovieflkpay({
      //     token: this.token,
      //     ka_ids: this.ka_ids,
      //     oid: this.orderNo,
      //     pass: pass
      //   }).then(res => {
      //     this.$toast(res.msg)
      //     if (res.code == 200 && res.data) {
      //       this.getcard()
      //       if (this.change == 0) {
      //         setTimeout(() => {
      //           this.$router.go(-1)
      //         }, 1000)
      //       } else {
      //         setTimeout(() => {
      //           if (sessionStorage.getItem("change") == 1) {
      //             window.location.href = this.$store.state.shopUrl + "/orderInfo?tabIndex=0" + "&token=" + localStorage.getItem("token")
      //           } else {
      //             this.$router.replace({ path: "/orderInfo", query: { tabIndex: 0 } })
      //           }
      //         }, 1000)
      //       }
      //     }
      //   })
      //   return
      // }


      toflkpay({
        token: this.token,
        ka_ids: this.ka_ids,
        oid: this.orderNo,
        pass: pass,
        code: this.codes,
        quantity: this.quelitys,
        price: this.price,
        data: this.orderData,
        name: this.names,
        piaotype: this.piaotype
      }).then(res => {
        this.$toast(res.msg)
        if (res.code == 200 && res.data) {

          this.scenicPsuccess(res.data.order_no);


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
                this.$router.replace({ path: "/orderInfo", query: { tabIndex: 0 } })
              }
            }, 1000)
          }
        }
      })
    },
    // 计算福利卡是否够支付
    isPay_date() {
      //       if (this.newMove == 1) {

      //         getMoviepayDate({
      //           token: this.token,
      //           fulika: this.result.join(","),
      //           oid: this.orderNo
      //         }).then(res => {
      //           if (res.code == 200) {
      //             // 福利卡支付价格
      //             this.dkprice = res.data.dkprice
      //             this.wxprice = res.data.wxprice
      //             this.ka_ids = res.data.ka_ids
      //             if (this.wxprice != 0) {
      //               //   微信支付
      //               // 去支付
      //               if (!this.isWeiXin()) {
      //                 this.$toast("请使用微信打开进行支付")
      //                 return;
      //               }
      //               //微信支付景区
      //               getMoviewxpay({
      //                 token: this.token,
      //                 oid: this.orderNo,
      //                 ka_ids: res.data.ka_ids,
      //                 openid: this.openid,




      //               }).then(res => {
      //                 if (res.code == 200) {
      //                   // this.onBridgeReady(res.data.jsApiParameters, res.data.order_no)
      //                    this.scenicPsuccess(res.data.order_no);
      //                 } else {
      //                   this.$toast(res.msg)
      //                 }
      //               })
      //             } else {
      //               if (this.dkprice != 0) {
      //                 this.show = true
      //               }
      //             }
      //           } else {
      //             this.$toast(res.msg)
      //           }
      //         })
      //         return
      //       }

      pay_date({
        token: this.token,
        fulika: this.result.join(","),
        // oid: this.orderNo,
        code: this.codes,
        price: this.price,
        quantity: this.quelitys
      }).then(res => {
        if (res.code == 200) {
          // 福利卡支付价格
          this.dkprice = res.data.dkprice;
          this.wxprice = res.data.wxprice;
          this.ka_ids = res.data.ka_ids || '';


          if (this.wxprice != 0) {
            //   微信支付
            if (!this.isWeiXin()) {
              this.$toast("请使用微信打开进行支付")
              return;
            }
            //add 微信支付景区
            filmWxpay({
              token: this.token,
              ka_ids: this.ka_ids,
              openid: this.openid,
              code: this.codes,
              quantity: this.quelitys,
              price: this.price,
              data: this.orderData,
              name: this.names,
              piaotype: this.piaotype
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
      
 // 防连点：2秒内只能点击一次
    const now = Date.now();
    if (now - this.lastClickTime < this.debounceTime) {
      this.$toast("请勿重复点击");
      return;
    }
    
    this.lastClickTime = now;


      if (this.result.length == 0 && this.checked == "") {
        this.$toast("请选择支付方式");
         this.lastClickTime = 0; // 验证不通过时重置时间
        return
      }
      this.isPay_date()
    },
    // 福利卡列表
    getcard() {
      this.result = []
      getcardList({
        token: this.token
      }).then(res => {

        if (res.code == 200) {
          this.loadingflag = false;
          this.cardList = res.data
          if (this.cardList.length !== 0) {
            this.result.push(this.cardList[0].id)
          }
        }
      })
    },
    // getNewcard() {
    //   this.result = []
    //   getMoviecard({
    //     token: this.token
    //   }).then(res => {
    //     if (res.code == 200) {
    //       this.cardList = res.data
    //       if (this.cardList.length !== 0) {
    //         this.result.push(this.cardList[0].id)
    //       }
    //     }
    //   })
    // },
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
          clearInterval(this.countdownInterval);
          // 倒计时结束后的操作
          this.$toast("订单过期")
          setTimeout(() => {
            this.$router.replace("/")
          }, 1000)
        }
      }, 1000);
    },
    // 获取订单详情’
    // getOrderDetail() {
    //   jsordershow({
    //     token: this.token,
    //     oid: this.orderNo
    //   }).then(res => {
    //     if (!res.data) {
    //       this.$toast("订单已失效")
    //       this.$router.go(-1)
    //       return
    //     }
    //     this.loadingflag = false
    //     this.orderDetail = res.data
    //     this.getadver()
    //   })
    // },
    // 获取订单详情’
    // getNewOrderDetail() {
    //   getPayOrdershow({
    //     token: this.token,
    //     oid: this.orderNo
    //   }).then(res => {
    //     if (!res.data) {
    //       this.$toast("订单已失效")
    //       this.$router.go(-1)
    //       return
    //     }
    //     this.loadingflag = false
    //     this.orderDetail = res.data
    //     this.getadver()
    //   })
    // },
  },
  mounted() {
  },
  created() {
    console.log(this.$route.query)
    this.loadingflag = true
    this.token = localStorage.getItem("token")
    this.timestamp = moment(new Date()).format('yyyy-MM-DD HH:mm:ss');
    this.nowDate = moment(new Date()).format('MM-DD');
    this.days = moment(new Date()).add(1, 'days').format('MM-DD');
    // add

    this.codes = this.$route.query.code;
    this.price = this.$route.query.price;
    this.quelitys = this.$route.query.quantity;

    console.log(this.price)
    this.names = this.$route.query.names;
    this.piaotype = this.$route.query.piaotype;
    // add
    this.orderNo = this.$route.query.order
    this.newMove = this.$route.query.new
    // if (this.newMove == 1) {
    //   this.getNewOrderDetail()
    //   this.getNewcard()
    // } else {
    //   this.getOrderDetail()
    this.getcard()
    // }

    if (localStorage.getItem("openid")) {
      this.openid = localStorage.getItem("openid")
    }
    this.change = this.$route.query.change;
    this.orderData = this.$route.query.orderData;

    console.log(this.orderData)
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
    clearInterval(this.countdownInterval);
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

  .box {
    font-size: 16px;
    background-color: #ffffff;
    height: 50px;
    padding-top: 30px;
    padding-bottom: 30px;
    border-radius: 6px;
    text-align: center;

    .red {
      color: red;
    }

    span {
      font-size: 10px;
    }
  }
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