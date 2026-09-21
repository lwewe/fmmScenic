<template>
  <div>
    <div class="address" @click="showPopup()">
      <div class="city">{{ city }}</div>
      <img :src="pull" alt="">
      <!-- <div class="pull-down">
        <van-icon class="" name="arrow-down" size="13px" />
      </div> -->
    </div>
  </div>
</template>
<script>
  
import BMap from "BMap"
import wx from "weixin-js-sdk";
import { getLocations } from "@/api/locality/login";
import { getCityList } from "@/api/city";
export default {
  name: "City",
  props: {
    cityName: [Number, String],
  },
  data() {
    return {
      pull:require('@/assets/menpiao/pull1.png'),
      city: "定位中",
      info: {},
      parameter: {
        appkey: this.$store.state.appkey,
        timestamp: this.$store.state.timestamp,
        v: "1.0",
      },
    }
  },
   watch: {
    // 监听prop变化，更新显示
    cityName: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.city = newVal;
        } else if (sessionStorage.getItem("cityName")) {
          this.city = sessionStorage.getItem("cityName");
        }
      }
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
    // 城市跳转
    showPopup() {
      this.$router.push({ path: "/citylist", query: { city: '' + this.city, change: true } })
    },
    // 获取定位
    getLocation() {
      let purl = /(Android)/i.test(navigator.userAgent) ? location.href.split('#')[0] : window.localStorage.getItem('scanUrl');
      getLocations({
        url: purl
      }).then(res => {
        // console.log(res)
        if (res.code == 200) {
          this.info = res.data
          this.getSign()
        }
      })
    },
    getSign() {
      //请求后端，获取微信签名信息
      let configData = {
        debug: false,
        appId: this.info.appid, // 必填，公众号的唯一标识
        timestamp: "" + this.info.time, // 必填，生成签名的时间戳
        nonceStr: this.info.nonceStr, // 必填，生成签名的随机串
        signature: this.info.signature,// 必填，签名
        jsApiList: ['getLocation']
      }
      // console.log(configData)
      wx.config(configData);
      wx.ready((res1) => {
        wx.getLocation({
          type: 'wgs84',
          success: (res) => {
            this.getCityName(res.longitude, res.latitude)
            sessionStorage.setItem("longitude", res.longitude)
            sessionStorage.setItem("latitude", res.latitude)
            
          }, fail: () => {
            // console.log("定位失败")
            // wx.getLocation({
            //   type: 'wgs84',
            //   success: (res) => {
            //     this.selcity(res.longitude, res.latitude)
            //     sessionStorage.setItem("longitude",res.longitude)
            //     sessionStorage.setItem("latitude",res.latitude)
            //   }, fail: () => {
            //     this.createMap()
            //   }
            // });
            this.createMap2()
          }
        });
      });
      wx.error(function (res) {
      });
    },
    createMap2() {
      // console.log("[[[")
      const geolocation = new BMap.Geolocation();
      var _this = this
      geolocation.getCurrentPosition(function getinfo(position) {
        let latitude = position.latitude
        let longitude = position.longitude
        let city = position.address.city.substring(0, position.address.city.length - 1); //获取城市信息
        _this.city = city
        if (sessionStorage.getItem("promptcity") != 2 && sessionStorage.getItem("change") != 1) {
          _this.messageinfo()
        }
        sessionStorage.setItem("cityName", _this.city)
        _this.getCity(_this.city)
        let province = position.address.province; //获取省份信息
        // console.log(city)
      }, { enableHighAccuracy: true }, function (e) {
        // console.log(e)
      }, {
        provider: 'baidu'
      });
    },
    createMap() {
      // console.log("[[[")
      const geolocation = new BMap.Geolocation();
      var _this = this
      geolocation.getCurrentPosition(function getinfo(position) {
        let latitude = position.latitude
        let longitude = position.longitude
        let city = position.address.city.substring(0, position.address.city.length - 1); //获取城市信息
        if (_this.isWeiXin()) {
          _this.getLocation()
        } else {
          _this.city = city
          if (sessionStorage.getItem("promptcity") != 2 && sessionStorage.getItem("change") != 1) {
            _this.messageinfo()
          }
          sessionStorage.setItem("cityName", _this.city)
          _this.getCity(_this.city)
        }
        let province = position.address.province; //获取省份信息
        // console.log(city)
      }, { enableHighAccuracy: true }, function (e) {
        // console.log(e)
      }, {
        provider: 'baidu'
      });
    },
    //   获取targetId
    // 获取所有城市
    getCity(keyword) {
      getCityList({
        keyword
      }).then(res => {
        this.cityList = res.data || []
        if (this.cityList.length > 0) {
          sessionStorage.setItem("targetId", this.cityList[0].cityid1)
          sessionStorage.setItem("targetId2", this.cityList[0].cityid2)
          sessionStorage.setItem("cityName", this.cityList[0].name)
          sessionStorage.setItem("cityId2", this.cityList[0].id)
          sessionStorage.setItem("cityItem", JSON.stringify(this.cityList))
        }
      })
    },
    // 提示当前城市是否需要切换
    messageinfo() {
      this.$dialog.confirm({
        message: '当前定位"' + this.city + '"，是否需要切换到其他城市？',
        confirmButtonColor: 'red',
        cancelButtonColor: 'red',
        confirmButtonText: '切换',        // 确认按钮文字
        cancelButtonText: '确认',
      }).then(() => {
        this.$router.push({ path: "/citylist", query: { city: '' + this.city } })
        sessionStorage.setItem("promptcity", "2")
      }).catch(() => {
        sessionStorage.setItem("promptcity", "2")
      })

    },
    getCityName(lng, lat) {
      // 创建一个坐标点
      let point = new BMap.Point(lng, lat);

      // 创建一个地理编码实例
      let geoc = new BMap.Geocoder();

      // 根据坐标点进行逆地理编码
      geoc.getLocation(point, (rs) => {
        let addComp = rs.addressComponents;
        // console.log(addComp,"addComp")
        this.city = addComp.city;
        sessionStorage.setItem("cityName", this.city)
        if (sessionStorage.getItem("promptcity") != 2 && sessionStorage.getItem("change") != 1) {
          this.messageinfo()
        }
        sessionStorage.getItem("cityName", this.city)
        this.getCity(this.city)
      });
    },
  },
  created() {
    // if (sessionStorage.getItem("cityName")) {
    //   this.city = sessionStorage.getItem("cityName")
    //   // console.log(this.city,"this.city")
    // } else {
    //   this.createMap()
    //   sessionStorage.getItem("cityName", this.city)
    // }
  },
  updated() {
    // if(sessionStorage.getItem("cityName")){
    //   this.city = sessionStorage.getItem("cityName")
    //   // console.log(this.city,"this.city")
    // }
  }
}
</script>

<style scoped>
.address {
  display: flex;
  align-items: center;
  gap: 8px;
  color: white;
  justify-content: center;
  padding: 10px 0px;
}

.pull-down {
  width: 12px;
  height: 12px;
}

.city {
  white-space: nowrap;
  max-width: 80px;
  text-overflow: ellipsis;
  overflow: hidden;
  font-size: 14px;
}
</style>