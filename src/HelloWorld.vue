<template>
  <div>{{LocationCity}}</div>
</template>

<script>
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
// import BMap from 'BMap';
import {getCityList} from "@/api/city";
import {getFilmList} from "@/api/film";
export default {
  data(){
    return {
      LocationCity: "正在定位",
      timestamp:null
    }
  },
  methods: {
    getFilm(){
      let data = {
        method: "xuankua.movie.hot.list",
        citycode:310100,
        appkey:this.$store.state.appkey,
        timestamp:this.timestamp.toString(),
        v:"1.0"
      }
      let sign = this.$utils.getASCII(data)
      getFilmList({
        ...data,
        
        sign:sign,
        
      }).then(res=>{
      })
    },
    getCity(){
      let data = {
        appkey:this.$store.state.appkey,
        method:"xuankua.city.list",
        timestamp:this.$store.state.timestamp,
        v:"1.0"
      }
      let sign = this.$utils.getASCII(data)
      getCityList({
        ...data,
        sign:sign,
      }).then(res=>{
      })
    },
    // createMap() {
    //   const geolocation = new BMap.Geolocation();
    //   var _this = this
    //   geolocation.getCurrentPosition(function getinfo(position) {
    //     console.log(position,"position")
    //     let latitude = position.latitude
    //     let longitude = position.longitude
    //     let city = position.address.city; //获取城市信息
    //     let province = position.address.province; //获取省份信息
    //     console.log(city,province,latitude,longitude)
    //     _this.LocationCity = city.substr(0,city.length-1);
    //   }, function(e) {
    //     console.log(e)
    //     _this.LocationCity = "定位失败"
    //   }, {
    //     provider: 'baidu'
    //   });
    // }
  },
  created() {
    this.timestamp  = moment(new Date()).format('yyyy-MM-DD HH:mm:ss');
    this.getCity()
    // this.getFilm()
  },
  mounted() {
    // this.createMap();
  }
}
</script>