<template>
  <div class="page">
    <ReturnBack :rcolor="'#fff'" :bcolor="'#00000087'"></ReturnBack>
    <!--  头部-->
    <div class="topBox">
      <!--    超级卡-->
      <div class="card">
        <div class="cardImg">
          <img class="img" src="../../assets/fukaxq/tc.png" alt="">
        </div>
        <div class="cardInfo">
          <div>
<!--          "pid": "3", //卡类型 1-超级卡,2-蛋糕卡,3-电影卡,4-图书卡,5-超级券,6-蛋糕券,7-电影券,8-图书券 全部返回-->
            <div class="title">
              <div v-if="cardInfo.pid==1">超级卡</div>
              <div v-if="cardInfo.pid==2">蛋糕卡</div>
              <div v-if="cardInfo.pid==3">电影卡</div>
              <div v-if="cardInfo.pid==4">图书卡</div>
              <div v-if="cardInfo.pid==5">超级券</div>
              <div v-if="cardInfo.pid==6">蛋糕券</div>
              <div v-if="cardInfo.pid==7">电影券</div>
              <div v-if="cardInfo.pid==8">图书券</div>
              <div v-if="cardInfo.pid==9">悦享卡</div>
            </div>
            <div class="cardNo">{{cardInfo.num}}</div>
          </div>
          <div>
            <div class="title">有效期</div>
            <div class="cardNo">{{cardTime}}</div>
          </div>
        </div>
        <div class="balance">
          <span>余额(点)</span>
          <span class="number">{{cardInfo.price}}</span>
        </div>
      </div>
    </div>
    <!--    选择套餐-->
    <div class="centerBox">
      <div class="cTitle">请选择充值套餐</div>
      <div class="list">
        <div class="listItem" @click="changePackage(item.id,item.price,item.num)"
             :style="{borderColor:selectId==item.id?'#E0C69D':'#F1F1F1',backgroundColor:selectId==item.id?'#FFF5E9':''}"
             v-for="item in packageList" :key="item.id">
          <div class="point">{{item.num}}点</div>
          <div class="price">￥<span class="priceNum">{{item.price}}</span></div>
          <div class="unit-price">{{item.danjia}}</div>
        </div>
        <!--      其他-->
        <div class="otherBox">
          <div class="inpBox" v-if="isChange">
            <input @input="changePrice" v-model="number"  class="inp" type="number" placeholder="请输入充值点数">
          </div>
          <div class="other">
            <div @click="changeOther">其他点数</div>
            <div class="icon" @click="changeOther">
              <van-icon v-if="!isChange" name="arrow-down"/>
              <van-icon v-else name="arrow-up"/>
            </div>
          </div>
        </div>
      </div>
      <!--      客服-->
      <a :href="kefu">
      <div class="service">
          <div>如有问题，请联系客服 全年无休(9:00-21:00)</div>
          <div class="serviceBox">
            <img class="img" src="../../assets/fukaxq/kf.png" alt="">
          </div>
      </div>
      </a>
    </div>
    <!--      支付-->
    <div class="footer" :class="{footer2:isInput}">
      <div>
        实际支付:
        <span class="nprice">￥<span class="npriceNum">{{ fullPrice }}</span></span>
      </div>
      <div class="btnBox">
        <van-button type="danger" class="btn" @click="toPay">立即支付</van-button>
      </div>
    </div>
    <NProgress v-if="loadingflag"/>
  </div>
</template>
<script>
import {cxpay_success, czwxpay, getopenid, getPackage} from "@/api/locality/card";
import {getLogo} from "@/api/locality/login";

export default {
  name: "Package",
  data() {
    return {
      packageList: [],
      selectId: null,
      isChange: false,
      fullPrice: 0,
      isInput: false,
      docmHeight: document.documentElement.clientHeight,  //默认屏幕高度
      showHeight: document.documentElement.clientHeight,   //实时屏幕高度
      khid:"",
      cardTime:"",
      cardInfo:{},
      number:null,
      wxCode:"",
      openid:"",
      num1:0,
      aaaaaa:{},
      loadingflag:false,
      kefu:""
    }
  },
  methods: {
    getLoginInfo(){
      getLogo().then(res=>{
        // console.log(res);
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
    // 去支付
    toPay(){
      let token = localStorage.getItem("token")
      var num = 0
      if(this.selectId){
        num = this.num1
      }else{
        num = this.number
      }
      if(!this.isWeiXin()){
        this.$toast("请使用微信打开进行支付")
        return;
      }
      czwxpay({
        token,
        num,
        price:this.fullPrice,
        card_id:this.khid,
        openid:this.openid,
      }).then(res=>{

        if(res.code == 200){
          this.onBridgeReady(res.data.jsApiParameters,res.data.order_no)
        }
      })
    },
    onBridgeReady(params,order_no) {
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
            // if (res.err_msg === "get_brand_wcpay_request:ok") {
            //   alert('支付成功！');
            //   that.$router.push({path: '/myOrder'})
            // } else if (res.err_msg === "get_brand_wcpay_request:fail") {
            //   alert('支付失败！');
            // }
           if(res.err_msg){
             let token = localStorage.getItem("token")
             cxpay_success({
               token,
               order_no
             }).then(res=>{
               that.$toast(res.msg)
               if(res.code == 200){
                 this.getPackageList()
               }
             })
           }
          });
    },
    changePrice(){
      if(this.number>9999)this.number=9999
      if(this.number<1)this.number=1
      if(this.number>1){
        this.number = (this.number.match(/^\d*(\.?\d{0,2})/g)[0]) || null
      }
      this.fullPrice = this.number
      this.selectId = null
    },
    getPackageList(){
      let token = localStorage.getItem("token")
      getPackage({
        token,khid:this.khid
      }).then(res=>{
        this.loadingflag = false
        if(res.code==200){
          this.cardInfo = res.data.card_num
          this.cardTime = this.timestampToTime(res.data.card.end_time)
          this.packageList = res.data.taocan
          this.fullPrice = this.packageList[0].price
          this.selectId = this.packageList[0].id
          this.num1 = this.packageList[0].num
        }
      })
    },
    changePackage(id, price,num) {
      this.number = null
      this.selectId = id
      this.fullPrice = price
      this.num1 = num
    },
    changeOther() {
      this.isChange = !this.isChange
    },
    timestampToTime (time) {
      // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var date = new Date(time * 1000)
      let y = date.getFullYear()
      let MM = date.getMonth() + 1
      MM = MM < 10 ? ('0' + MM) : MM
      let d = date.getDate()
      d = d < 10 ? ('0' + d) : d
      let h = date.getHours()
      h = h < 10 ? ('0' + h) : h
      let m = date.getMinutes()
      m = m < 10 ? ('0' + m) : m
      let s = date.getSeconds()
      s = s < 10 ? ('0' + s) : s
      return y + '-' + MM + '-' + d
    },
  },
  created() {
    //加载
    this.loadingflag=true

    this.khid = this.$route.query.cardId
    this.getPackageList()
    if(localStorage.getItem("openid")){
      this.openid = localStorage.getItem("openid")
    }
    this.getLoginInfo()
  },
  mounted() {
    // window.onresize监听页面高度的变化
    window.onresize = () => {
      return (() => {
        this.showHeight = document.body.clientHeight;
      })()
    }
  },
//监听
  watch: {
    showHeight: function () {
      if (this.docmHeight > this.showHeight) {
        this.isInput = true
      } else {
        this.isInput = false
      }
    }
  }

}
</script>

<style scoped lang="less">
.page {
  background-color: #F0F0F0;
  min-height: 100vh;
}

.topBox {
  //height: 14vh;
  height: 94px;
  background-image: linear-gradient(to bottom, #EBC893, #DEB56E);
  padding: 25px 15px 0px;
  box-sizing: border-box;

  .card {
    background-color: white;
    border-radius: 10px;
    height: 100px;
    padding: 17px 15px 0px;
    position: relative;
    overflow: hidden;

    .cardImg {
      width: 150px;
      position: absolute;
      top: -9px;
      right: -23px;
    }

    .cardInfo {
      display: flex;
      align-items: center;
      gap: 20%;
      color: #5E4A33;
    }

    .balance {
      padding-top: 18px;
      color: #7B6B57;
      font-weight: bold;
      font-size: 15px;
    }

    .number {
      font-size: 20px;
      padding-left: 15px;
    }

    .title {
      font-weight: bold;
      font-size: 15px;
    }

    .cardNo {
      font-size: 12px;
      color: #9F9385;
      margin-top: 6px;
    }
  }
}

//
.centerBox {
  padding: 65px 15px 90px;

  .cTitle {
    color: #786854;
    font-weight: bold;
  }

  .list {
    background-color: white;
    border-radius: 10px;
    margin-top: 12px;
    padding: 0px 15px 15px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;

    .listItem {
      text-align: center;
      width: 30%;
      border-radius: 8px;
      border: 1px #F1F1F1 solid;
      padding: 12px 0px;
      margin-top: 15px;

      .point {
        color: #523D23;
        font-weight: bold;
        font-size: 18px;
      }

      .price {
        color: #F16469;
        //font-weight: bold;
        margin-top: 8px;

        .priceNum {
          font-size: 25px;
        }
      }

      .unit-price {
        color: #737373;
        font-size: 13px;
        margin-top: 8px;
      }
    }

    .otherBox {
      margin-top: 15px;
      width: 100%;

      .other {
        color: #9F9285;
        font-size: 15px;
        display: flex;
        align-items: center;
        width: 100%;
        justify-content: flex-end;
        gap: 3px;

        .icon {
          height: 15px;
        }
      }

      .inpBox {
        width: 100%;
        border-bottom: 1px solid #F1F1F1;
        padding-bottom: 10px;
        margin-bottom: 10px;

        .inp {
          border: none;
          font-size: 15px;
          width: 100%;
        }
      }
    }
  }

  //客服
  .service {
    background-color: white;
    color: #8a8989;
    font-size: 13px;
    border-radius: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 15px;
    margin-top: 10px;

    .serviceBox {
      width: 18px;
      padding-top: 1px;
    }
  }
}

.footer {
  position: fixed;
  bottom: 20px;
  left: 0px;
  width: 100%;
  background-color: white;
  height: 55px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px 15px;
  box-sizing: border-box;
  font-size: 15px;

  .btn {
    border-radius: 30px;
    width: 100%;
    height: 38px;
    font-size: 15px;
    line-height: 37px;
    background-color: #ED3036;
  }

  .btnBox {
    width: 30%;
  }

  .nprice {
    color: #F05358;
    //font-weight: bold;
    .npriceNum {
      font-size: 24px;
    }
  }
}

.footer2 {
  position: static;
}
</style>