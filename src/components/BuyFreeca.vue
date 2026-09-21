<template>
  <div class="pageCon">
    <!--    介绍-->
    <div class="info">
      <div class="imgBox">
        <img class="img" :src=" imgBox" alt="">
      </div>
      <div class="priceBox">
        <div class="price">￥<span class="priceNum">{{ fullprice }}</span></div>
        <div class="promptBox">
          <div class="prompt">
            <img class="img" src="../assets/fukaxq/ts.png" alt="">
          </div>
          <div>充值商品不支持退换货</div>
        </div>
      </div>
    </div>
    <!--    手机号 {{ this.userInfo.all_phone }}-->
    <div class="phoneBox">
      <div>
        <input v-model="phoneNumber" type="text" placeholder="请输入充值账号">
      </div>
      <div @click="phoneNumber=''">
        <van-icon color="#D9D9D9" name="clear"/>
      </div>
    </div>
    <!--    规格-->
    <div class="specifications">
      <div class="sTitle">规格</div>
      <div class="specificationsList">
        <div v-for="(item,index) in specificationsList" :key="item.id" class="card" :name="item.sku"
             :style="{backgroundColor:(selectId==item.id?'#FEDC01':'')}" @click="changeSpecifications(item,item.id)">
          {{ item.gueige }}
        </div>
      </div>
      <!--      数量-->
      <div class="numberBox">
        <div class="sTitle">数量</div>
        <div class="numberOne">
          1
          <!--          <van-stepper v-model="value"/>-->
        </div>
      </div>
    </div>
    <!--      支付方式-->
    <div>
      <Payment :result1="result" :cardList="cardList" @getResult="getResult"></Payment>
    </div>
    <!--      支付-->
    <div class="btnBox">
      <van-button type="danger" class="btn" @click="toPay">￥{{ fullprice * value }} &nbsp;立即购买</van-button>
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
import Payment from "@/components/Payment.vue";
import {getcardList, getopenid, KaquanPaySuccess, KaquanWxpay,} from "@/api/locality/card";
import {getflkpay, toPay_date} from "@/api/member";
import {getUserInfo} from "@/api/locality/login";

export default {
  name: "BuyFreeca",
  props: ['detail', 'list'],
  components: {
    Payment
  },
  data() {
    return {
      specificationsList: [],
      selectId: 0,
      value: 1,
      detaillist: [],
      result: [],
      cardList: [],
      checked: "",
      token: "",
      wxprice: 0,
      dkprice: 0,
      show: false,
      pass: "",
      showKeyboard: true,
      ka_ids: [],
      fullprice: 0,
      userInfo: {},
      openid: "",
      wxCode: "",
      imgBox: "",
      phoneNumber: ""
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
              that.$toast('支付成功！');
              KaquanPaySuccess({
                token: that.token,
                order_no
              }).then(res => {
                // that.$toast(res.msg)
                if (res.code == 200) {
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
              that.$toast('支付失败！');
            }
          });
    },
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
      getflkpay({
        token: this.token,
        ka_ids: this.ka_ids,
        pass: pass,
        ggid: this.selectId,
        number: this.value.toString(),
        phone: this.phoneNumber,
        position: 1
      }).then(res => {
        this.$toast(res.msg)
        if (res.code == 200 && res.data) {
          this.getcard()
          setTimeout(() => {
            if (sessionStorage.getItem("change") == 1) {
              window.location.href = this.$store.state.shopUrl + "/orderInfo?tabIndex=0" + "&token=" + localStorage.getItem("token")
            } else {
              this.$router.replace({path: "/orderInfo", query: {tabIndex: 0}})
            }
          }, 1000)
        }
      })
    },
    // 计算福利卡是否够支付
    isPay_date() {
      toPay_date({
        token: this.token,
        fulika: this.result.join(","),
        ggid: this.selectId,
        number: this.value,
        position: 1
      }).then(res => {
        if (res.code == 200) {
          // 福利卡支付价格
          this.dkprice = res.data.dkprice
          this.wxprice = res.data.wxprice
          this.ka_ids = res.data.ka_ids
          if (this.wxprice != 0) {
            //   微信支付
            if (!this.isWeiXin()) {
              this.$toast("请使用微信打开进行支付")
              return
            }
            KaquanWxpay({
              token: this.token,
              ka_ids: res.data.ka_ids,
              openid: this.openid,
              ggid: this.selectId,
              number: this.value,
              phone: this.phoneNumber,
              position: 1
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
        }
      })
    },
    toPay() {
      const regex = /[^\u4e00-\u9fa5a-zA-Z0-9]+/g; // 正则表达式匹配特殊字符
      this.phoneNumber = this.phoneNumber.replace(regex, '')
      if (this.phoneNumber == "") {
        this.$toast("请输入充值账号")
        return
      }
      if (this.result.length == 0 && this.checked == "") {
        this.$toast("请选择支付方式")
        return
      }
      if (this.result.length == 0 && this.checked != "") {

        //   微信支付
        if (!this.isWeiXin()) {
          this.$toast("请使用微信打开进行支付")
          return;
        }
        KaquanWxpay({
          token: this.token,
          ka_ids: [],
          openid: this.openid,
          ggid: this.selectId,
          number: this.value,
          phone: this.phoneNumber,
          position: 1
        }).then(res => {
          if (res.code == 200) {
            this.onBridgeReady(res.data.jsApiParameters, res.data.order_no)
          } else {
            this.$toast(res.msg)
          }
        })
      } else {
        this.isPay_date()
      }
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
    changeSpecifications(item, id) {
      this.selectId = id
      this.imgBox = item.img
      this.fullprice = item.price
    },
    getUserInfo() {
      getUserInfo({
        token: this.token
      }).then(res => {
        this.userInfo = res.data
        this.phoneNumber = this.userInfo.all_phone
      })
    },
  },
  created() {
    this.token = localStorage.getItem("token")
    this.getUserInfo()
    this.getcard()
    if (localStorage.getItem("openid")) {
      this.openid = localStorage.getItem("openid")
    }
  },
  mounted() {
    this.detaillist = this.detail
    this.fullprice = this.detaillist.price
    this.specificationsList = this.list
    this.selectId = this.detaillist.id
    this.imgBox = this.detaillist.img
  }
}
</script>
<style scoped lang="less">
.pageCon {
  padding: 10px 15px;
  height: 94vh;
  overflow-y: auto;
}

.info {
  display: flex;
  align-items: flex-end;
  gap: 10px;

  .imgBox {
    width: 88px;
    height: 88px;
    border-radius: 8px;
    overflow: hidden;
  }

  .priceBox {
    padding-bottom: 10px;

    .price {
      color: #ED343A;
      font-weight: bold;
    }

    .priceNum {
      font-size: 20px;
    }

    .promptBox {
      color: #FCA426;
      font-size: 10px;
      display: flex;
      align-items: center;
      margin-top: 2px;
      gap: 4px;

      .prompt {
        width: 15px;
        height: 15px;
      }
    }

  }
}

.phoneBox {
  background-color: white;
  margin-top: 10px;
  border-radius: 5px;
  padding: 15px;
  //font-weight: bold;
  font-size: 15px;
  color: #404040;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.phoneBox input {
  width: 100%;
  border: none;
}

.specifications {
  background-color: white;
  margin-top: 10px;
  border-radius: 5px;
  padding: 15px;

  .sTitle {
    font-weight: bold;
  }

  .specificationsList {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 10px;

    .card {
      background-color: #F6F6F6;
      border-radius: 30px;
      width: 60px;
      height: 32px;
      line-height: 33px;
      text-align: center;
      font-size: 13px;
      font-weight: bold;
      color: #393100;
    }
  }

  .numberBox {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 20px;
    padding-bottom: 6px;
  }
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
  width: 70%;
  margin: 15px auto;
  //position: absolute;
  //bottom: 10px;
  //left: 15%;
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

.numberOne {
  font-size: 14px;
  width: 32px;
  height: 28px;
  text-align: center;
  line-height: 28px;
  color: #676767;
}
</style>