<template>
  <div id="app">
<!--    <keep-alive >-->
<!--      <router-view v-if="$route.meta.keepAlive"></router-view>-->
<!--    </keep-alive>-->
<!--    <router-view v-if="!$route.meta.keepAlive"></router-view>-->
    <router-view></router-view>
    <NavigationTab :active="$route.meta.active" v-if="$route.meta.active>=0"></NavigationTab>
  </div>
</template>

<script>

import {getopenid} from "@/api/locality/card";
import {getCityList} from "@/api/city";
import NavigationTab from "@/components/NavigationTab.vue";
import {getAccessToken} from "@/api/newFilm";

export default {
  name: 'App',
  components: {NavigationTab},
  data() {
    return {
      wxCode: "",
      openid: "",
      parameter: {
        appkey: this.$store.state.appkey,
        timestamp: this.$store.state.timestamp,
        v: "1.0",
      },
      cityList:[],
      targetId:""
    }
  },
  methods: {
    getOpenId(code) {
      getopenid({
        code
      }).then(res => {
        this.aaaaaa = res
        if (res.code == 200) {
          this.openid = res.data.openid
          localStorage.setItem("openid", this.openid)
          window.history.go(-1)
        }
      })
    },
    // ///////微信登录
    getUrl() {
      let userAgent = navigator.userAgent;
      if (userAgent.includes("iPhone") || userAgent.includes("iPad")) {
        sessionStorage.setItem("originUrl", location.href); // 用于ios分享
      }
      this.getBaseInfos();
    },

    // 编码函数
    getUrlParam(name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
      var r = window.location.search.substr(1).match(reg); //匹配目标参数

      if (r != null) return unescape(r[2]);
      return null; //返回参数值
    },

    getBaseInfos() {
      if (this.isWeiXin()) {
        const code = this.getUrlParam("code"); // 截取路径中的code
        if (code == null || code === "") {
          let url = "";
          let userAgent = navigator.userAgent;
          if (userAgent.includes("iPhone") || userAgent.includes("iPad")) {
            url = sessionStorage.getItem("originUrl");
          } else {
            url = window.location.href;
          }
          window.location.href =
              "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx05cc5223511e93c3&redirect_uri=" +
              encodeURIComponent(url) +
              "&response_type=code&scope=snsapi_base&state=1&connect_redirect=1#wechat_redirect";
          // window.close();
        }
        if (code != "" && code != null) {
          this.wxCode = code;
          // window.history.go(-1)
          this.getOpenId(code)
        }
      } else {
      }
    },

    isWeiXin() {
      var ua = window.navigator.userAgent.toLowerCase();
      if (ua.match(/MicroMessenger/i) == "micromessenger") {
        return true;
      } else {
        return false;
      }
    },
    // ///////微信登录
  //   获取targetId
  //   // 获取所有城市
    getCity(cityName) {
      getCityList({
        keyword:cityName.includes("市")?cityName.replace("市",""):cityName
      }).then(res => {
        this.cityList = res.data || []
        if(this.cityList.length>0){
          sessionStorage.setItem("targetId", this.cityList[0].cityid1)
          sessionStorage.setItem("targetId2", this.cityList[0].cityid2)
          sessionStorage.setItem("cityName", this.cityList[0].name)
          sessionStorage.setItem("cityId2", this.cityList[0].id)
          sessionStorage.setItem("cityItem", JSON.stringify(this.cityList))
        }
      })
    },
    getTokenKey(){
        getAccessToken({
          entId: "101344",
          appSecret: "IALrbqLuSVtlMW3k9WlnxnCwuCA556jr"
        }).then(res => {
          // console.log(res, "1111")
          if (res.code == 0) {
            sessionStorage.setItem('token_type', res.data.token_type);
            sessionStorage.setItem('access_token', res.data.access_token);
          }
        })
      },
  },
  created() {
    window.localStorage.setItem('scanUrl', location.href.split('#')[0])
    if (!localStorage.getItem("openid")) {
      this.getUrl()
    }
    if (!sessionStorage.getItem('access_token')) {
      this.getTokenKey()
    }
    if(this.$route.query.token){
      localStorage.setItem("token",this.$route.query.token)
    }
    if(this.$route.query.change){
      sessionStorage.setItem("change",this.$route.query.change)
      this.getCity(sessionStorage.getItem("cityName"))
    }
    if(this.$route.query.per){
      sessionStorage.setItem("per",this.$route.query.per)
    }
    if(this.$route.query.isFirst){
      sessionStorage.setItem("isFirst",this.$route.query.isFirst)
    }
    if(this.$route.query.cityName){
      sessionStorage.setItem("cityName",this.$route.query.cityName)
      // this.getCity(sessionStorage.getItem("cityName"))
    }
    // if(sessionStorage.getItem("cityName")){
    //   this.getCity(sessionStorage.getItem("cityName"))
    // }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.img {
  width: 100%;
  height: 100%;
}

.content {
  display: flex;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.van-dialog {
  border-radius: 20px !important;
}

.van-button__text {
  font-size: 13px !important;
}

/* .content{
  display: flex;
  flex-direction: column;
} */
</style>
