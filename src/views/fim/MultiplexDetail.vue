<script src="../../utils/ASCII.js"></script>
<template>
  <div class="location">
<!--    <ReturnBack :rcolor="'#fff'" :bcolor="'#00000087'"></ReturnBack>-->
    <NProgress v-if="loadingflag"/>

    <!--  地址-->
    <div class="addressBox">
      <div class="title">{{ cinema.name }}</div>
      <div class="addressMax">
        <div>
          <div class="address">
            <div style="margin-top: 5px">
              <van-icon size="15px" name="location-o"/>
            </div>
            <div>{{ cinema.address }}</div>
          </div>
          <div class="address" style="margin-top: -4px;padding-left: 2px">
            <div style="margin-top: 5px">
              <van-icon size="15px" name="phone-o"/>
            </div>
            <div>{{ cinema.contactphone }}</div>
          </div>
        </div>
        <!--        <div style="color: #dbdada;">-->
        <!--          <van-icon size="18px" name="arrow"/>-->
        <!--        </div>-->
      </div>
    </div>
    <!--    轮播图电影 :style="'background-image: url('+imgLogo+')'"-->
    <div class="filmBox" :style="{backgroundImage:isShow?'url('+imgLogo+')':''}">
      <div class="masking"></div>
      <!--      电影-->
      <div class="swiper-container">
        <div class="swiper-wrapper">
          <div class="swiper-slide" ref="swiper-slide" v-for="(item,index) in moveList" :key="item.id"
               @click="amplify(item.id,item.logo,item.name)">
            <div class="bannerImg" :class="{amplify:selectId==item.id}">
              <img v-if="isShow" class="img" :src="item.logo" alt="">
            </div>
            <!--            详情-->
            <div class="detail" v-if="selectId==item.id&&isShow">
              <div class="namea">
                <div>{{ item.name }}</div>
                <div class="showmark" v-if="item.showmark">{{ item.showmark }}</div>
              </div>
              <div class="duration">
                <div>{{ item.duration }}分钟</div>
                <div>/</div>
                <div>{{ item.type }}</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
    <!--    tab切换-->
    <div class="tab">
      <van-tabs @click="changeTime" v-model="active" title-active-color="#ED2E34" color="#F05B60"
                title-inactive-color="#B0B0B0"
                :line-width="20" :line-height="2">
        <!--                <van-tab :title="nowDate+'今天'" v-if="daysList.length"></van-tab>-->
        <!--                <van-tab :title="days+'明天'" v-if="daysList.length"></van-tab>-->
        <van-tab :title="item" v-for="item in daysList"
                 :key="item"></van-tab>
      </van-tabs>
    </div>
    <!--    列表-->
    <div class="list">
      <div class="listItem" v-for="(item,index) in chedulingList" :key="index"
           @click="toSetMaps(item.opiid,item.movieid)">
        <div class="chedulingTime">
          <div class="timeBox">
            <div class="time">{{ item.playtime.split(" ")[1].split(":").slice(0, 2).join(":") }}</div>
            <div class="office">{{ item.closetime.split(" ")[1].split(":").slice(0, 2).join(":") }}散场</div>
          </div>
          <div>
            <div class="language">{{ item.edition }}</div>
            <div class="officeText">{{ item.roomname }}</div>
          </div>
        </div>
        <div class="rightBox">
          <div class="priceBox">
            <span class="price">{{ (item.showPrice / 100).toFixed(2) }}</span>
            <span class="first">元起</span>
          </div>
          <van-button plain type="danger" class="btn">购票</van-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import moment from "moment/moment";
import 'moment/locale/zh-cn';
import {getCinemaDetail, getMoveDetail, getSchedulingList} from "@/api/cinema";
import Swiper from "swiper";
import {getCityList} from "@/api/city";

moment.locale('zh-cn');
export default {
  name: "MultiplexDetail",
  data() {
    return {
      parameter: {
        appkey: this.$store.state.appkey,
        timestamp: this.$store.state.timestamp,
        v: "1.0",
      },
      active: 0,
      nowDate: "",
      days: "",
      cinema: {},
      chedulingList: [],
      isToday: false,
      swiper: null,
      moveList: [],
      selectId: "",
      movieidList: [],
      daysList: [],
      imgLogo: "",
      moviename: "",
      day: "",
      isShow: false,
      isSwiper: false,
      arryList: [],
      loadingflag: false,
      city: "",
      cityid: '',
      moveId:"",
      moveName:""
    }
  },
  // watch:{
  //   // 此处监听variable变量，当期有变化时执行
  //   isSwiper(item1,item2){
  //     // item1为新值，item2为旧值
  //     console.log(item1,item2)
  //     if(item1){
  //      setTimeout(()=>{
  //        console.log("執行力")
  //        this.getSwiper()
  //      },1000)
  //     }
  //   }
  // },
  methods: {
    moveItemToFirst(arry) {
      const index = arry.findIndex(item => item.name === this.moveId); // 查找目标项的索引
      if (index !== -1) {
        const item = arry.splice(index, 1)[0]; // 移除目标项并获取该项
        arry.unshift(item); // 将目标项放在数组的第一项
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
    toSetMaps(opiid, movieid) {
      // console.log(localStorage.getItem("token"),"localStorage.getItem(\"token\")")
      if (!localStorage.getItem("token")) {
        this.$toast("请先登录")
        setTimeout(() => {
          if (this.isWeiXin()) {
            this.$router.replace("/quickLogin")
          } else {
            this.$router.replace("/login")
          }
        }, 1000)
        return
      }
      this.$router.push({path: '/filmSeat', query: {opiid, movieid}})
    },
    // 获取所有城市
    getCity() {
      if (sessionStorage.getItem("promptcity")!=2) {
        this.messageinfo()
      }
      let data = {
        method: "xuankua.city.list",
        appkey: this.$store.state.appkey,
        timestamp: this.timestamp.toString(),
        v: "1.0"
      }
      let sign = this.$utils.getASCII(data)
      getCityList({
        ...data,
        sign: sign
      }).then(res => {
        this.cityList = res.data.cityList
        if (res.data.cityList) {
          for (var i = 0; i < this.cityList.length; i++) {
            if (this.cityList[i].name == this.city) {
              // 获取当前城市地址的id
              this.cityid = this.cityList[i].citycode
            }
          }
        }
      })
    },
    async getMove(movieid) {
      let data = {
        ...this.parameter,
        method: "xuankua.movie.detail",
        citycode: this.cityid,
        movieid: movieid,
      }
      let sign = this.$utils.getASCII(data)
      await getMoveDetail({
        ...data, sign
      }).then(res => {
        if (res.code == 200) {
          this.arryList.push(res.data.movie)
          // console.log(this.arryList,"ssssssssssssssssssss")
          this.moveList = this.arryList.slice().sort((a, b) => a.id - b.id);
          if(this.moveId){
            this.moveItemToFirst(this.moveList)
          }
          this.selectId = this.moveList[0].id
          this.imgLogo = this.moveList[0].logo
          this.moviename = this.moveList[0].name
          // console.log(this.moveList,"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
          return Promise.all(this.moviename).then(result => {
            let nowDate = moment(new Date()).format('yyyy-MM-DD');
            setTimeout(() => {
              let allOpilist = this.allOpilist
              allOpilist = allOpilist.filter(item => item.moviename == this.moviename)
              allOpilist.forEach(item => {
                this.daysList.push(item.playdate)
              })
              this.daysList = Array.from(new Set(this.daysList));
              this.daysList.sort((a, b) => new Date(a.playdate).getTime() - new Date(b.playdate).getTime());
              // this.getScheduling(this.daysList[0], this.moviename)
            }, 800)
            this.isSwiper = true
          })
        }
        // if (res.code == "9999") {
        //     this.$router.go(0)
        // }
      })
    },
    amplify(movieid, logo, moviename) {
      this.selectId = movieid
      this.imgLogo = logo
      this.moviename = moviename
      this.isToday = true
      this.active = 0
      this.daysList = []
      let allOpilist = this.allOpilist
      allOpilist = allOpilist.filter(item => item.moviename == this.moviename)
      // console.log(allOpilist, "[[[[[[[[[")
      allOpilist.forEach(item => {
        this.daysList.push(item.playdate)
      })
      this.daysList = Array.from(new Set(this.daysList));
      this.daysList.sort((a, b) => new Date(a.playdate).getTime() - new Date(b.playdate).getTime());
      this.getScheduling(this.daysList[0], this.moviename)
    },
    changeBanner(activeIndex) {
      this.selectId = this.moveList[activeIndex].id
      this.moviename = this.moveList[activeIndex].name
      this.imgLogo = this.moveList[activeIndex].logo
      // console.log( this.moviename,"cc")
      this.isToday = true
      this.daysList = []
      let allOpilist = this.allOpilist
      allOpilist = allOpilist.filter(item => item.moviename == this.moviename)
      allOpilist.forEach(item => {
        this.daysList.push(item.playdate)
      })
      this.daysList = Array.from(new Set(this.daysList));
      this.daysList.sort((a, b) => new Date(a.playdate).getTime() - new Date(b.playdate).getTime());
      this.getScheduling(this.daysList[0], this.moviename)
    },
    // 轮播
    getSwiper() {
      this.swiper = new Swiper('.swiper-container', {
        // pagination: '.swiper-pagination',
        clickable: true, // 轮播按钮支持点击
        observer: true,//修改swiper自己或子元素时，自动初始化swiper
        observeParents: true,//修改swiper的父元素时，自动初始化swiper
        //点击事件
        on: {
          click: () => {

          },
          slideChange: () => {
            // console.log('Current slide index:', this.swiper.activeIndex);
            this.changeBanner(this.swiper.activeIndex)
            this.active = 0
            // 在这里可以获取当前位于中间的图片索引
          }
        },
        // slidesPerView: 4,
        paginationClickable: true,
        // spaceBetween: 10,
        slideToClickedSlide: true, // 点击的slide会居中
        slidesPerView: 5,
        sapceBetween: 40,
        centeredSlides: true,
        allOpilist: []
      });
    },
    // tab切换
    changeTime(e) {
      this.isToday = true
      this.day = this.daysList[e]
      this.getScheduling(this.daysList[e], this.moviename)
      // this.daysList = Array.from(new Set(this.daysList));
    },
    // 排期列表
    getScheduling(days, moviename) {
      this.chedulingList = []
      let data = {
        ...this.parameter,
        method: "xuankua.opi.list.v2",
        standardid: this.cinema.standardid,
      }
      let sign = this.$utils.getASCII(data)
      getSchedulingList({
        ...data, sign
      }).then(res => {
        if (res.code == 200) {
          this.chedulingList = res.data.opilist.filter(item => item.playdate == days && item.moviename == moviename)
        }
        // if (res.code == "9999") {
        //     this.$router.go(0)
        // }
      })
    },
    getScheduling2() {
      let data = {
        ...this.parameter,
        method: "xuankua.opi.list.v2",
        standardid: this.cinema.standardid,
      }
      let sign = this.$utils.getASCII(data)
      getSchedulingList({
        ...data, sign
      }).then(res => {
        if (res.code == 200) {
          if (res.data.opilist.length == 0) {
            this.$toast("暂无排期")
            setTimeout(() => {
              this.$router.go(-1)
            }, 3700)
            return
          }
          this.allOpilist = res.data.opilist
          res.data.opilist.forEach(item => {
            this.movieidList.push(item.movieid)
          })
          this.movieidList = Array.from(new Set(this.movieidList));
          // console.log(this.movieidList.length)
          if (!this.isToday) {
            // this.movieidList.forEach(item => {
            //   setTimeout(()=>{
            //     this.getMove(item)
            //   },10)
            // })
            for(let i=0;i<this.movieidList.length;i++){
              this.getMove(this.movieidList[i])
            }
          }
          setTimeout(()=>{
            this.getScheduling(this.daysList[0], this.moviename)
          },1000)
          this.daysList = []
        }
        // if (res.code == "9999") {
        //     this.$router.go(0)
        // }
      })
    },
    getDetail(cinemaid) {
      let data = {
        ...this.parameter,
        method: "xuankua.cinema.detail",
        cinemaid: cinemaid,
      }
      let sign = this.$utils.getASCII(data)
      getCinemaDetail({
        ...data, sign
      }).then(res => {
        if (res.code == 200) {
          this.cinema = res.data.cinema
          this.getScheduling2()
        }
        // else if (res.code == "9999") {
        //     this.$router.go(0)
        // }
      })
    }
  },
  mounted() {
    // if(!to.meta.keepAlive){
    document.body.scrollTop = 0

// firefox

    document.documentElement.scrollTop = 0

// safari

    window.pageYOffset = 0
    setTimeout(()=>{
    this.getSwiper()
    },1000)
  },
  updated() {
    //实例更新完成
    // setTimeout(()=>{
    //   this.swiper.update();
    // },1000)
  },
  created() {
    this.loadingflag = true
    var _this = this
    setTimeout(function () {
      _this.loadingflag = false
    }, 1700)
    this.nowDate = moment(new Date()).format('MM-DD');
    this.days = moment(new Date()).add(1, 'days').format('MM-DD');
    this.day = moment(new Date()).format('yyyy-MM-DD');
    this.getDetail(this.$route.query.id)
    setTimeout(() => {
      this.isShow = true
    }, 1100)
    this.city = this.$route.query.city
    this.moveId = this.$route.query.moveName
    this.moveName = this.$route.query.moveName
    // this.moveId = "末路狂花钱"
  },
}
</script>

<style scoped lang="less">
body {

}

.location {
  background-color: #F0F0F0;
  min-height: 100vh;
}

.addressBox {
  background-color: white;
  padding: 15px 15px 7px;
  //margin-top: 32px;

  .title {
    font-weight: bold;
    color: #313131;
  }

  .address {
    display: flex;
    align-items: center;
    gap: 3px;
    color: #AAAAAA;
    font-size: 12px;
  }

  .addressMax {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}

.filmBox {
  width: 100%;
  height: 28vh;
  background-size: 100% auto;
  background-position-y: 32%;
  position: relative;

  .masking {
    width: 100%;
    height: 100%;
    position: absolute;
    background-color: #000000b8;
  }
}

.report-item {
  height: 200px;
}

.tab {
  font-weight: bold;
}

/deep/ .van-tab span {
  font-weight: 600 !important;
}

/deep/ .van-tabs__nav--line {
  padding-bottom: 11px;
}

.list {
  padding: 0px 10px 10px;

  .listItem {
    background-color: white;
    border-radius: 5px;
    padding: 13px 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 10px;
    gap: 10px;
  }

  .btn {
    border-radius: 30px;
    height: 30px;
    line-height: 29px;
    color: #F05359;
    font-weight: bold;
    white-space: nowrap;
  }

  .timeBox {
    //font-weight: bold;
  }

  .time {
    font-weight: bold;
    font-size: 20px;
    color: #2D2D2D;
    white-space: nowrap;
  }

  .language {
    font-size: 13px;
    color: #2C2C2C;
    //padding-left: 25px;
  }

  .text {
    font-size: 13px;
    color: #2C2C2C;
    padding-left: 10px;
  }

  .chedulingTime {
    display: flex;
    gap: 17px;
    align-items: center;
  }

  .office {
    color: #A5A5A5;
    font-size: 12px;
    white-space: nowrap;
  }

  .officeText {
    //padding-left: 14px;
    color: #A5A5A5;
    font-size: 12px;
    margin-top: 5px;
  }

  .priceBox {
    color: #F1595E;
    white-space: nowrap;
  }

  .price {
    font-size: 20px;
  }

  .first {
    font-size: 13px;
  }

  .rightBox {
    display: flex;
    align-items: center;
    gap: 18px;
  }
}

.bannerImg {
  width: 100%;
  height: 15vh;
  border-radius: 10px;
  overflow: hidden;
}


//.amplify {
//  transform: scale(1.3);
//  margin: -15px 0px 0px 10px;
//}
//
.duration {
  display: flex;
  align-items: center;
  gap: 5px;
  text-align: center;
  color: white;
  font-size: 10px;
  color: #ffffffb0;
  margin-top: 2px;
}

.namea {
  display: flex;
  align-items: center;
  gap: 10px;
  text-align: center;
  color: white;
  font-size: 16px;
}

.detail {
  white-space: nowrap;
  margin-top: 15px;
}

.showmark {
  color: #BCA48A;
  border: 1px solid;
  font-size: 10px;
  padding: 1px 3px;
  border-radius: 4px;
}

//轮播图
.swiper-container {
  width: 100%;
  height: 100%;
  padding: 18px 0px 0px;
}

.swiper-slide {
  text-align: center;
  font-size: 18px;
  transition: 200ms;
  transform: scale(0.8);
}

.swiper-slide-active, .swiper-slide-duplicate-active {
  transform: scale(1);
}
</style>