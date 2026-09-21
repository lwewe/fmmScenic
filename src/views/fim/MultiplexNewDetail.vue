<script src="../../utils/ASCII.js"></script>
<template>
  <div class="location">
    <!--    <ReturnBack :rcolor="'#fff'" :bcolor="'#00000087'"></ReturnBack>-->
    <NProgress v-if="loadingflag"/>

    <!--  地址-->
    <div class="addressBox" v-if="cinema.cinema">
      <div class="title">{{ cinema.cinema.name }}</div>
      <div class="addressMax">
        <div>
          <div class="address">
            <div style="margin-top: 5px">
              <van-icon size="15px" name="location-o"/>
            </div>
            <div>{{ cinema.cinema.address }}</div>
          </div>
          <div class="address" style="margin-top: -4px;padding-left: 2px">
            <div style="margin-top: 5px">
              <van-icon size="15px" name="phone-o"/>
            </div>
            <div>{{ cinema.cinema.phone }}</div>
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
          <div class="swiper-slide" ref="swiper-slide" v-for="(item,index) in moveList" :key="item.movieCode"
               @click="amplify(item)">
            <div class="bannerImg" :class="{amplify:selectId==item.movieCode}">
              <img v-if="isShow" class="img" :src="item.posterUrl" alt="">
            </div>
            <!--            详情-->
            <!--           <div style="color: white"> {{selectId==item.movieCode&&isShow}}</div>-->
            <div class="detail" v-if="selectId==item.movieCode&&isShow">
              <div class="namea">
                <div>{{ item.name }}</div>
                <div class="showmark" v-if="item.showmark">{{ item.showmark }}</div>
              </div>
              <div class="duration">
                <div>{{ item.duration }}分钟</div>
                <div>/</div>
                <div>{{ item.category }}</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
    <!--    tab切换-->
    <div class="loadingBox" v-if="loading">
      <Loading v-if="loading"></Loading>
    </div>
    <div class="tab" v-if="daysList.length>0">
      <van-tabs @click="changeTime" v-model="active" title-active-color="#ED2E34" color="#F05B60"
                title-inactive-color="#B0B0B0"
                :line-width="20" :line-height="2">
        <!--                <van-tab :title="nowDate+'今天'" v-if="daysList.length"></van-tab>-->
        <!--                <van-tab :title="days+'明天'" v-if="daysList.length"></van-tab>-->
        <van-tab :title="item" v-for="(item,index) in daysList"
                 :key="index"></van-tab>
      </van-tabs>
    </div>
    <div class="nonedate" v-else-if="!loading">暂无排期</div>
    <!--    列表-->
    <div class="list">
      <div class="listItem" v-for="(item,index) in chedulingList" :key="index"
           @click="toSetMaps(item)">
        <div class="mode" v-if="!comparisonTime(item.showTime.split('T').join(' '))" @click.stop></div>
        <div class="chedulingTime">
          <div class="timeBox">
            <div class="time">{{ item.showTime.split("T")[1].split(":").slice(0, 2).join(":") }}</div>
            <div class="office">{{ item.endTime.split("T")[1].split(":").slice(0, 2).join(":") }}散场</div>
          </div>
          <div>
            <div class="language">{{item.version.includes("语")||item.version.includes("版")?'':item.language}} {{ item.version }}</div>
            <div class="officeText">{{ item.hall }}</div>
          </div>
        </div>
        <div class="rightBox">
          <div class="priceBox">
            <span class="price">{{ item.originPrice }}</span>
            <span class="first">元起</span>
          </div>
          <van-button plain type="danger" class="btn" v-if="comparisonTime(item.showTime.split('T').join(' '))">购票
          </van-button>
          <van-button plain type="default" class="btn btn1" v-else>已停售</van-button>
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
import {getCityList, getNowTime} from "@/api/city";
import {getCinemashows} from "@/api/newFilm";
import Loading from '../../components/loding.vue'

moment.locale('zh-cn');
export default {
  name: "MultiplexDetail",
  components: {
    Loading
  },
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
      moveId: "",
      nowData: {},
      cinemaId: "",
      scroolIndex: 0,
      loading: true,
      timer: null,
      nowTimes:"",
      movieCode:""
    }
  },
  methods: {
    getTimes(){
      getNowTime().then(res=>{
        if(res.code == 200){
          this.nowTimes = res.data
        }
      })
    },
    // Comparison time
    comparisonTime(times) {
      // let now = new Date().getTime()
      // let ctime = new Date(times.replace(/-/g,'/')).getTime()

      // console.log(now,ctime)
      // let futureTimestamp = now + 25 * 60 * 1000; // 25 分钟转换为毫秒
      // console.log(ctime - now?ctime - now <= 25 * 60 * 1000:true)
      let now = this.nowTimes*1000
      let ctime = moment(times).valueOf();
      // console.log(now,ctime,ctime - now)
      return ctime - now?ctime - now >= 25 * 60 * 1000:true
    },
    moveItemToFirst(arry) {
      const index = arry.findIndex(item => item.movieId == this.moveId||item.movieCode == this.movieCode); // 查找目标项的索引
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
    toSetMaps(item) {
      // console.log(item)
      // return;
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
      this.$router.push({
        path: '/filmNewSeat',
        query: {
          sessionId: item.sessionId,
          cinemaId: this.cinema.cinema.cinemaCode,
          movieId: this.selectId,
          sid: this.cinema.sourceId
        }
      })
    },
    // 获取所有城市
    getCity() {
      if (sessionStorage.getItem("promptcity") != 2) {
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
    amplify(item) {
      // console.log(item)
      // this.nowData = item
      // this.daysList = []
      // this.chedulingList =[]
      // this.selectId = item.movieCode
      // this.imgLogo = item.posterUrl
      // this.moviename = item.name
      // item.shows.forEach(item => {
      //   this.daysList.push(item.showDate)
      // })
      // if(item.shows.length>0){
      //   this.chedulingList = item.shows[this.active].sessions
      // }
    },
    changeBanner(activeIndex) {
      this.getTimes()
      this.loading = true
      // this.nowData = this.moveList[activeIndex]
      this.daysList = []
      this.chedulingList = []
      this.nowData = ""
      this.selectId = ""
      this.imgLogo = ""
      // this.scroolIndex = activeIndex

      // sessionStorage.setItem("selectMovieCode", this.selectId)
      // sessionStorage.setItem("activeIndex", activeIndex)
      // this.moviename = this.moveList[activeIndex].name
      // this.imgLogo = this.moveList[activeIndex].posterUrl
      // this.moveList[activeIndex].shows.forEach(item => {
      //   this.daysList.push(item.showDate)
      // })
      // if(this.moveList[activeIndex].shows.length>0){
      //   this.chedulingList = this.moveList[activeIndex].shows[this.active].sessions
      // }
      // console.log(activeIndex)
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(() => {
        this.selectId = this.moveList[activeIndex].movieCode
        this.getDetail(activeIndex, this.selectId)
        this.timer = undefined;
      }, 1000)
    },
    // 轮播
    getSwiper() {
      console.log(111)
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
        // moveList: [],
      });
      // this.swiper.slideTo(this.scroolIndex); // 将会滑动到第二个幻灯片
    },
    // tab切换
    changeTime(e) {
      this.chedulingList = this.nowData.shows[e].sessions
    },
    getDetail(activeIndex = 0, movieId = "") {
      this.daysList = []
      this.chedulingList = []
      getCinemashows({
        cinemaId: this.cinemaId,
        movieId
      }).then(res => {
        this.loadingflag = false
        if (res.code == 0) {
          // console.log(res)
          this.cinema = res.data
          this.moveList = res.data.movieShows
         this.moveItemToFirst(this.moveList)
          // console.log(this.moveList)
          if (this.moveList.length > 0) {
            this.nowData = this.moveList[activeIndex]
            this.selectId = this.moveList[activeIndex].movieCode
            this.imgLogo = this.moveList[activeIndex].posterUrl
            if (this.daysList.length == 0) {
              this.moveList[activeIndex].shows.forEach(item => {
                this.daysList.push(item.showDate)
              })
            }
            this.chedulingList = this.moveList[activeIndex].shows[this.active].sessions
          }
          this.loading = false
          // if(this.swiper){
          //   this.swiper.destroy(true);
          // }
          if(activeIndex==0){
          setTimeout(() => {
          // console.log(111111111111111)
          this.getSwiper()
          // this.swiper.slideTo(this.scroolIndex); // 将会滑动到第二个幻灯片
          }, 500)
          }
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
    setTimeout(() => {
      this.getSwiper()
    }, 2000)
    // setTimeout(() => {
    //   this.getSwiper()
    // }, 2000)
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
    // setTimeout(function () {
    //   _this.loadingflag = false
    // }, 1700)
    this.getTimes()
    this.nowDate = moment(new Date()).format('MM-DD');
    this.days = moment(new Date()).add(1, 'days').format('MM-DD');
    this.day = moment(new Date()).format('yyyy-MM-DD');
    this.cinemaId = this.$route.query.id
    this.city = this.$route.query.city
    this.moveId = this.$route.query.moveId
    this.movieCode = this.$route.query.movieCode
    // if (sessionStorage.getItem("selectMovieCode")) {
    //   this.scroolIndex = sessionStorage.getItem("activeIndex")
    //   this.getDetail(this.scroolIndex, sessionStorage.getItem("selectMovieCode"))
    // } else {
    this.getDetail(0,this.moveId)
    // }
    setTimeout(() => {
      this.isShow = true
    }, 2000)
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

.loadingBox {
  padding: 10px 0px 15px;
}

.tab {
  font-weight: bold;
}

.nonedate {
  background-color: white;
  height: 44px;
  line-height: 44px;
  text-align: center;
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
    position: relative;
    overflow: hidden;
  }

  .mode {
    position: absolute;
    background-color: #00000017;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 99999;
  }

  .btn {
    border-radius: 30px;
    height: 30px;
    line-height: 29px;
    color: #F05359;
    //font-weight: bold;
    white-space: nowrap;
  }

  .btn1 {
    color: #979797;
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
  height: 100px;
  border-radius: 10px;
  overflow: hidden;

  .img {
    object-fit: cover;
  }
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