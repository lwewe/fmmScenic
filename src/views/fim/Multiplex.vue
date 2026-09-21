<template>
  <!--  影城-->
  <div class="pageView">
    <NProgress v-if="loadingflag"/>
    <!--    头部-->
    <div class="topPage">
      <!--      <div class="title">悦享聚汇</div>-->
      <div class="searchBox">
        <div>
          <!--      地址-->
          <City></City>
        </div>
        <div class="searchValue">
          <van-search background="#fff0" placeholder="输入影院搜索" @input="searchList" v-model="searchValue"/>
        </div>
      </div>
    </div>
    <!--   banner -->
    <div class="banner">
      <van-swipe :autoplay="3000" indicator-color="white">
        <van-swipe-item class="bannerImg" v-for="item in bannerList" :key="item.id" @click="toFDetail(item.url)">
          <img class="img"
               :src=" item.img"
               alt="">
        </van-swipe-item>
      </van-swipe>
    </div>
    <!--    center-->
    <div class="centerBox" >
      <div class="address" :class="{chooseAddress:show}">
        <div class="choose" @click="chooseAddress">{{ region }}</div>
        <div class="pull-down" @click="chooseAddress">
          <van-icon class="" color="#564A3F" name="arrow-down" size="13px"/>
        </div>
      </div>
      <!--      区域选择-->
      <div>
        <van-popup position="top" v-model="show">
          <div>
            <div class="content" @click="allRegion">
              <div class="addRegion">
                <span :class="region=='请选择区域'?'':'region'">全部区域</span>
                <span class="regionNum"
                      :class="region=='请选择区域'?'':'number'">{{ total }}</span>
              </div>
              <div v-if="region == '请选择区域'">
                <van-icon color="#ED3137" name="success" size="16px"/>
              </div>
            </div>
            <div class="content" v-for="item in countyList" :key="item.name" @click="changeRegion(item)">
              <div class="addRegion">
                <span :class="{region:item.name != region}">{{ item.name }}</span>
                <span class="regionNum" :class="{number:item.name!= region}">{{ item.num }}</span>
              </div>
              <div v-if=" item.name== region">
                <van-icon color="#ED3137" name="success" size="16px"/>
              </div>
            </div>
          </div>
        </van-popup>
      </div>
      <!--      列表-->
      <div class="listMax" v-if="this.allCinemaList.length>0">
        <div class="listBox" v-for="(item,index) in allCinemaList" :key="index" @click="toDetail(item)">
          <div class="nameBox">
            <div class="nameNone">{{ item.flag == 1?item.name:item.name1 }}</div>
            <div class="detailAdress">{{  item.flag == 1?item.address:item.address1 }}</div>
          </div>
          <div class="form">{{ Number(item.juli).toFixed(2) }}km</div>
        </div>
      </div>
      <div v-else class="noneList">暂无影院</div>
    </div>

    <div ref="bottom" style="height: 10px;"></div>
    <!--    导航tab-->
    <NavigationTab :active="1"></NavigationTab>
  </div>
</template>
<script>
import NavigationTab from "@/components/NavigationTab.vue";
import {getCinemaList, getFilmplace} from "@/api/cinema";
import BMap from "BMap"
import {getBannerList} from "@/api/locality/banner";
import City from "@/components/City.vue";
import wx from "weixin-js-sdk";
import {getLocations} from "@/api/locality/login";
import {getFilmCinemas} from "@/api/newFilm";
import {getCinemaListLoca, getCityList} from "@/api/city";
// import {createMap} from '../utils/orientation'

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Multiplex",
  components: {
    NavigationTab, City
  },
  data() {
    return {
      parameter: {
        appkey: this.$store.state.appkey,
        timestamp: this.$store.state.timestamp,
        v: "1.0",
      },
      searchValue: "",
      cinemaList: [],
      // 我的经纬度
      center: {lng: "", lat: ""},
      zoom: 10,
      location: '',
      distance: 0,
      show: false,
      countyList: [],
      total: 0,
      allCinemaList: [],
      pageNum: 0,
      pageSize: 100,
      page_no: 0,
      stopAdd: true,
      region: "请选择区域",
      bannerList: [],

      city: "正在定位",
      urlcityid: null,
      urldata: "",
      urlid: null,
      targetId: "",
      cityList: [],
      hide: true,
      cinemaids: "",
      iscinemaids: true,
      allLength: [],
      element: null,
      loadingflag: false,
      arry: [],
      arry1: [],
      allCinemaList1: [],
      info: {},
      moveName: "",
      newCityId: "",
      timer: null,
      movieCode:""
    }
  },
  methods: {
    toFDetail(url) {
    console.log(url)
      if (url) {
        // window.location.href = url+"&cityid="+ this.cityid
        this.$router.push({path: url + "&cityid=" + this.targetId})
      }
    },
    // 获取定位
    getLocation1() {
      let purl = /(Android)/i.test(navigator.userAgent) ? location.href.split('#')[0] : window.localStorage.getItem('scanUrl');
      getLocations({
        url: purl
      }).then(res => {
        console.log('定位最新')
        console.log(res)
        if (res.code == 200) {
          this.info = res.data
          this.getSign()
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
    toDetail(item) {
      sessionStorage.removeItem("selectMovieCode")
      sessionStorage.removeItem("activeIndex")
      if (item.flag == 1) {
        this.$router.push({path: "/multiplexDetail", query: {id: item.cinemaid1, city: this.city,moveName:this.moveName}})
      } else {
        this.$router.push({path: "/multiplexNewDetail", query: {id: item.cinemaid2, city: this.city,moveId: this.urlid,movieCode:this.movieCode}})
      }
    },
    getBanner() {
      // 影城-轮播图
      getBannerList().then(res => {
        // console.log(res)
        if (res.code == 200) {
          this.bannerList = res.data.list
        }
      })
    },
    // 获取定位
    selcity(latitude, longitude) {
      var _this = this
      _this.center.lng = latitude;
      _this.center.lat = longitude;
      _this.getFilmCinemasList()
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
            this.selcity(res.longitude, res.latitude)
            sessionStorage.setItem("longitude", res.longitude)
            sessionStorage.setItem("latitude", res.latitude)
          }, fail: () => {
            this.createMap2()
          }
        });
      });
      wx.error(function (res) {
      });
    },
    createMap2() {
      var _this = this
      if (_this.center.lng == '' || _this.center.lng == null) {
        //获取经纬度
        var geolocation = new BMap.Geolocation();
        geolocation.getCurrentPosition(function (position) {
          if (this.getStatus() == BMAP_STATUS_SUCCESS) {
            var mk = new BMap.Marker(position.point);
            let latitude = position.latitude
            let longitude = position.longitude
            let city = position.address.city.substring(0, position.address.city.length - 1); //获取城市信息
            _this.city = city
            let province = position.address.province; //获取省份信息
            _this.center.lng = longitude;
            _this.center.lat = latitude;
            // _this.getCity( _this.city)
            _this.getFilmCinemasList()
          }
        }, {enableHighAccuracy: true});
      }
    },
    createMap() {
      var _this = this
      if (_this.center.lng == '' || _this.center.lng == null) {
        //获取经纬度
        var geolocation = new BMap.Geolocation();
        geolocation.getCurrentPosition(function (position) {
          if (this.getStatus() == BMAP_STATUS_SUCCESS) {
            var mk = new BMap.Marker(position.point);
            let latitude = position.latitude
            let longitude = position.longitude
            let city = position.address.city.substring(0, position.address.city.length - 1); //获取城市信息
            _this.city = city
            let province = position.address.province; //获取省份信息

            if (_this.isWeiXin()) {
              if (sessionStorage.getItem("longitude")) {
                _this.center.lng = sessionStorage.getItem("longitude");
                _this.center.lat = sessionStorage.getItem("latitude")
                // _this.getCity( _this.city)
                _this.getFilmCinemasList()
              } else {
                _this.getLocation1()
              }
            } else {
              _this.center.lng = longitude;
              _this.center.lat = latitude;
              // _this.getCity( _this.city)
              _this.getFilmCinemasList()
            }
          }
        }, {enableHighAccuracy: true});
      }
    },
    // 获取所有城市
    getCity(cityName) {
      getCityList({
        keyword: cityName
      }).then(res => {
        this.cityList = res.data || []
        if (this.cityList.length > 0) {
          this.newCityId = this.cityList[0].id
          let city = sessionStorage.getItem("cityName")
          if (city != cityName) {
            this.newCityId = Number(sessionStorage.getItem("cityId2"))
          }
          // console.log( this.cityid2)
          this.getFilmCinemasList()
          // this.getDramaProjectList()
        }
      })
    },
    chooseAddress() {
      this.show = !this.show
    },
    // 搜索框
    searchList() {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(() => {
        this.getFilmCinemasList()
        this.timer = undefined;
      }, 1000)
    },
    allRegion() {
      this.show = false
      this.region = "请选择区域"
      this.getFilmCinemasList()
    },
    // 选择区域
    changeRegion(item) {
      this.searchValue = ""
      this.region = item.name
      this.getFilmCinemasList(item.id)
      this.show = false
    },
    // 获取新影院列表
    getFilmCinemasList(quid = "") {
      // 114.507817,38.042323
      getCinemaListLoca({
        lat: this.center.lat,
        lng: this.center.lng,
        cityid: this.newCityId,
        quid,
        keyword: this.searchValue,
        movieId: this.urlid,
        // pageno:1,pagesize:10
    }).then(res => {
        // console.log(res, "1111")
        if (res.code == 200) {
          this.loadingflag = false
          this.total = res.data.city_num
          this.countyList = res.data.qu_list
          this.allCinemaList = res.data.yingyuan || []
          //.filter(item=>item.flag==1)
        }
      })
    },

  },
  created() {
    //
    this.getLocation1();
    this.loadingflag = true
    this.getBanner()
    // 获取点击购票按钮传过来的数据
    // this.urlcityid = Number(this.$route.query.cityid)
    this.urlid = Number(this.$route.query.movieId) || ""
    this.movieCode = this.$route.query.movieCode || ""
    this.moveName = this.$route.query.moveName || ""
    // this.urldata = this.$route.query.data
    // this.moveName = this.$route.query.moveName
    // if (this.urlcityid) {
    //   this.hide = false
    // }
    if (sessionStorage.getItem("cityName")) {
      this.targetId = sessionStorage.getItem("targetId")
      this.city = sessionStorage.getItem("cityName")
      this.newCityId = sessionStorage.getItem("cityId2")
    }
    this.createMap()
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
    // this.element = document.documentElement
    this.page_no = 0
  },
  // beforeDestroy() {
  //   window.removeEventListener('scroll', this.handleScroll);
  // },
}
</script>
<style scoped lang="less">
.pageView {
  min-height: calc(100vh - 46px);
  background-image: linear-gradient(to right, #FFE8C3, #FEE9C4);
}

//头部
.topPage {
  background-image: linear-gradient(to bottom, #F93B37, #FB806F);
  padding: 5px 15px 5px;

  .title {
    text-align: center;
    color: white;
    font-size: 14px;
  }

  .address {
    display: flex;
    align-items: center;
    gap: 8px;
    color: white;
  }

  .searchBox {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }


  .searchValue {
    width: 80%;
  }

  .van-search {
    padding-right: 5px;
  }

  .van-search .van-cell {
    background-color: transparent;
  }

  .van-search__content {
    background-color: #ffffff;
    border-radius: 30px;
  }

  /deep/ .van-field__control {
    color: #92716D;
  }
}

//banner
.banner {
  //background-color: #92716D;
  width: 100%;
  //height: 168px;
  height: 21vh;
  overflow: hidden;
}

//center
.centerBox {
  padding: 10px 10px 62px;
  min-height: calc(100vh - 76px - 23vh - 99px);
  position: relative;
  margin-top: -5px;

  .choose {
    font-weight: bold;
    color: #564A3F;
  }

  .pull-down {
    width: 12px;
    height: 13px;
  }

  .listMax {
    margin-top: 10px;
  }

  .listBox {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: white;
    padding: 18px 15px;
    border-radius: 5px;
    font-weight: 600;
    color: #393939;
    margin-top: 13px;

    .nameBox {
      width: 80%;
    }

    .nameNone {
      white-space: nowrap;
      overflow: hidden;
      width: 85%;
      text-overflow: ellipsis;
      font-weight: bold;
    }

    .detailAdress {
      color: #727272;
      font-size: 12px;
      font-weight: 500;
      margin-top: 7px;
      white-space: nowrap;
      overflow: hidden;
      width: 90%;
      text-overflow: ellipsis;
    }

    .form {
      color: #EE4D53;
      font-size: 13px;
    }
  }
}

//弹框选择地址
.van-overlay {
  background-color: rgba(0, 0, 0, .5);
}

.van-popup {
  top: 38px;
  width: 100%;
  transition: none;
  height: calc(49vh - 60px);
  position: absolute;
  padding-top: 12px;
}

.chooseAddress {
  position: relative;
  z-index: 55555;
  background-color: white;
  width: calc(100% + 20px);
  left: -10px;
  border-bottom: 1px #A4A4A4 solid;
  //font-size: 13px;
}

.addRegion {
  color: #EC2B31;
  font-weight: bold;
  font-size: 13px;
}

.regionNum {
  padding-left: 13px;
}

.content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px #E5E5E5 solid;
  padding: 10px 20px;
}

.number {
  color: #A2A2A2;
}

.region {
  color: #070707;
}

.address {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #433B32;
  justify-content: center;
  padding: 10px 0px;
}

.pull-down {
  width: 12px;
  height: 12px;
}

.city {
  white-space: nowrap;
}

.noneList {
  text-align: center;
  padding: 10px 0;
}
</style>
