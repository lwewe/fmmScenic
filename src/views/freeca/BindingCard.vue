<template>
  <div class="bindPage">
    <ReturnBack :rcolor="'#fff'" :bcolor="'#00000087'"></ReturnBack>
    <!--    扫码绑定-->
    <div class="btn" @click="scanQRCode" v-if="isWeiXin()">扫码绑定</div>
    <div class="btn" style="margin-top: 20px" @click="toCouponCode">券密绑定</div>
    <!--    温馨提示-->
    <div class="prompt">
      <div class="title">{{ bindInfo.title }}</div>
      <div class="promptText" v-html="bindInfo.content"></div>
    </div>
  </div>
</template>
<script>
import {bindingcard, qrcodeBinging} from "@/api/locality/card";
import wx from "weixin-js-sdk";

export default {
  name: "BindingCard",
  data() {
    return {
      bindInfo: {},
      info: {},
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
    toCouponCode() {
      this.$router.push("/couponCode")
    },
    getSign() {
      // this.$toast({message:purl,duration:0})
      //请求后端，获取微信签名信息
      let configData = {
        debug: false,
        appId: this.info.appid, // 必填，公众号的唯一标识
        timestamp: "" + this.info.time, // 必填，生成签名的时间戳
        nonceStr: this.info.nonceStr, // 必填，生成签名的随机串
        signature: this.info.signature,// 必填，签名
        jsApiList: ['scanQRCode', 'checkJsApi']
      }
      wx.config(configData);
      wx.ready(function (res) {

      });
      wx.error(function (res) {
      });
    },
    scanQRCode() {
      let _that = this;
      wx.ready(function () {
        wx.checkJsApi({
          jsApiList: ['scanQRCode'],
          success: function (res) {
            if (res.checkResult.scanQRCode === true) {
              wx.scanQRCode({ // 微信扫一扫接口
                needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                scanType: ['qrCode', 'barCode'], // 可以指定扫二维码还是一维码，默认二者都有
                success: function (res) {
                  let url = res.resultStr // 当needResult 为 1 时，扫码返回的结果
                  let token = localStorage.getItem("token")
                  qrcodeBinging({
                    token,
                    content:url
                  }).then(res=>{
                    if(res.code==200){
                      setTimeout(()=>{
                        _that.$router.go(-1)
                        _that.$toast(res.data)
                      },1000)
                    }else{
                      _that.$toast(res.msg)
                    }
                  })
                }
              })
            } else {
              _that.$toast("抱歉，当前客户端版本不支持扫一扫");
            }
          },
          fail: function (res) { // 检测getNetworkType该功能失败时处理
            _that.$toast('fail' + res)
          }
        });
      });
      //错误信息
      wx.error(function (res) {
        _that.$toast("出错了：" + res.errMsg);
      });
    },
    getbindingcard() {
      let purl = /(Android)/i.test(navigator.userAgent) ? location.href.split('#')[0] : window.localStorage.getItem('scanUrl');
      let token = localStorage.getItem("token")
      // let token = "9e973380c68336429bc2a95ec2988e5834c3637e8e1e0e87776e174bcde27487"
      bindingcard({
        token,
        url: purl
      }).then(res => {
        this.bindInfo = res.data.single
        this.info = res.data
        this.getSign()
      })
    },
  },
  created() {
    this.getbindingcard()
  },
  mounted() {
    // this.initWechatSDK()
  }
}
</script>

<style scoped lang="less">
.bindPage {
  padding: 80px 55px;
}

.btn {
  background-image: linear-gradient(to right, #ED3036, #ED3036, #F26368);
  color: white;
  border-radius: 10px;
  width: 100%;
  text-align: center;
  padding: 8px 10px;
  font-size: 18px;
  letter-spacing: 4px;
  height: 28px;
  line-height: 28px;
}

.prompt {
  margin-top: 43px;
  color: #807f7f;
  font-size: 12px;
  line-height: 18px;
}

.title {
  font-size: 15px;
  color: #353535;
  font-weight: bold;
}

.promptText {
  margin-top: 8px;
}

/deep/ .promptText p {
  margin-top: 2px;
}

/deep/ .promptText p span {
  color: #807f7f !important;
}
</style>