<template>
  <div class="filmdetail" style="position: relative;">
    <ReturnBack :rcolor="'#000'" :bcolor="'rgb(255 255 255 / 84%)'"></ReturnBack>
    <NProgress v-if="loadingflag"/>
    <div class="headlogo" v-if="detailList.img">
      <img class="img" :src="detailList.img" alt="">
      <div class="zhezhao" style=""></div>
    </div>
    <div class="detailbox" style="position: relative;display: none">
      <div class="detailtitle">
        <div class="titleleft">
          <!--                <img :src="detailList.logo" alt="">-->
          <div class="imgBox" :style="'background-image: url('+detailList.img+')'"></div>
        </div>
        <div class="titleright">
          <p class="title">{{ detailList.name }}</p>
          <p>导演:<span>{{ detailList.director }}</span></p>
          <p>主演:<span>{{ detailList.actors }}</span></p>
          <p>{{ detailList.type }}</p>
          <p><span>{{ detailList.playdate }} 上映</span> / <span>{{ detailList.duration }}分钟</span></p>
        </div>
      </div>
      <div class="detail">
        <p class="jianjie">
          <span class="jianjietitle" style="">剧情简介</span>
          <span class="zhankaiguanbi" v-if="seeflag" @click="detailzhankai()">展开</span>
          <span class="zhankaiguanbi" v-if="!seeflag" @click="detailguanbi()">关闭</span>
        </p>
        <div class="zhankai inner" v-if="seeflag">
          {{ detailList.content }}
        </div>
        <div class="guanbi inner" v-if="!seeflag">
          {{ detailList.content }}
        </div>
      </div>
      <div class="photo">
        <span class="phototitle" style="margin-bottom: 2vh;">剧照</span>
        <div class="swiper-container">
          <div class="swiper-wrapper">
            <div class="swiper-slide" style="width: 186.5px;
    height: 150px;
    overflow: hidden;
    display: flex;
    align-items: center;
    margin-right: 10px;
    background: rgb(219 219 219 / 29%);
    justify-content: center;border-radius: 10px;"
                 v-for="(item,index) in trailers" :key="index">
              <div style="width: 100%;height:100%">
                <img style="width: 100%;height:100%;border-radius: 10px;object-fit: cover" :src="item" alt="">
              </div>
            </div>

          </div>
        </div>
        <!-- <ul>
            <li style="width: 100%;height: 100%;margin-bottom: 10px;" v-for="(item,index) in trailers" :key="index">
                <img style="width: 100%;height: 100%;" :src="item" alt="">
            </li>
        </ul> -->
      </div>
      <div style="height: 70px;"></div>
    </div>
    <!--信息-->
    <div class="centerBox">
      <div class="detailListCenter">
        <div class="detailListImg">
          <img class="img" :src="detailList.img" alt="">
        </div>
        <div class="nmBox">
          <div class="nm">{{ detailList.nm }}</div>
          <div class="starBox" v-if="detailList.director">
            <div class="font1">导演:</div>
            <div class="font2 elips1">{{ detailList.director }}</div>
          </div>
          <div class="starBox" v-if="detailList.star">
            <div class="font1">主演:</div>
            <div class="font2 elips1">{{ detailList.star.split(" ").join("/") }}</div>
          </div>
          <div class="starBox starBox2" v-if="detailList.cat">
            <div class="font2 elips1">{{ detailList.cat.split("|").join(" ") }}</div>
          </div>
          <div class="starBox2">
            <span>{{ detailList.pubDesc }} </span>
            <span>/ {{ detailList.dur }}分钟</span>
          </div>
        </div>
      </div>
      <div class="bottomBox">
<!--        剧情简介-->
        <div class="descBox" v-if="detailList.desc">
          <div class="unfold">
            <div class="unfoldTitle">剧情简介</div>
            <div class="unfoldText" @click="seeflag=!seeflag">{{ seeflag ? '收起' : '展开' }}
              <van-icon v-if="!seeflag" name="arrow-down"/>
              <van-icon v-else name="arrow-up"/>
            </div>
          </div>
          <div class="desc" :class="{desc2:seeflag}" v-html="detailList.desc"></div>
        </div>
<!--        演职人员-->
        <div class="descBox descBox2" v-if="workerList.length>0">
          <div class="unfold">
            <div class="unfoldTitle">演职人员</div>
          </div>
          <div class="workerBox">
            <div class="workerList" v-for="item in workerList" :key="item.actorName" v-if="item.avatarUrl">
              <div class="avatarUrl">
                <img class="img" :src="item.avatarUrl" alt="">
              </div>
              <div class="actorName">{{ item.actorName }}</div>
              <div class="characterName">{{ item.characterName }}</div>
            </div>
          </div>
        </div>
<!--        剧照-->
<!--        <div class="descBox descBox2" v-if="workerList.length>0">-->
<!--          <div class="unfold">-->
<!--            <div class="unfoldTitle">剧照</div>-->
<!--          </div>-->
<!--          <div class="workerBox">-->
<!--            <div class="workerList" v-for="item in workerList" :key="item.actorName">-->
<!--              <div class="avatarUrl">-->
<!--                <img class="img" :src="item.avatarUrl" alt="">-->
<!--              </div>-->
<!--              <div class="actorName">{{ item.actorName }}</div>-->
<!--              <div class="characterName">{{ item.characterName }}</div>-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->
      </div>
    </div>
    <div class="btnBox">
      <div class="paybtn" :class="{paybtn2:showSt==2}" @click="buyticket()">立即{{showSt==2?'预购':'购票'}}</div>
    </div>

  </div>
</template>

<script>
import Swiper from 'swiper'; // 引入的Swiper
import 'swiper/css/swiper.min.css'
//引入
import moment from 'moment';
import 'moment/locale/zh-cn';

moment.locale('zh-cn');

//调用热映电影详情接口
import {getFilmDetail} from "@/api/film";
import toast from "vant/lib/toast";
import router from "@/router";
import {getMovieDetail} from "@/api/newFilm";

export default {
  data() {
    return {
      timestamp: null,
      // 电影的id
      id: "",
      cityid: "",
      // 获取的该影片详情
      detailList: [],
      // 剧情简介的展开关闭
      seeflag: false,
      // 剧照
      trailers: [],
      loadingflag: false,
      workerList: [],
      showSt:""

    }
  },
  methods: {
    // 得到电影的详情信息
    getDetails() {
      getMovieDetail({
        movieId: this.id
      }).then(res => {
        // console.log(res)
        this.loadingflag = false
        if (res.code == 0) {
          this.detailList = res.data
          this.workerList = res.data.workerList
          // this.trailers = res.data.movie.trailers.split(",")
        } else {
          this.$toast("暂无数据")
          setTimeout(() => {
            this.$router.go(-1)
          }, 1000)
        }
      })
    },
    // 简介展开
    detailzhankai() {
      this.seeflag = !this.seeflag
    },
    // 简介关闭
    detailguanbi() {
      this.seeflag = !this.seeflag
    },
    // 买票
    buyticket() {
      this.$router.push({
        path: "/multiplex",
        query: {movieId: '' + this.detailList.movieId,movieCode:this.detailList.movieCode,moveName:this.detailList.nm}
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
    // 调用接口得到详情所有数据
    this.getDetails()
  },
  created() {
    this.loadingflag = true
    this.id = this.$route.query.id
    this.cityid = this.$route.query.cityid
    this.showSt = this.$route.query.showSt//上映状态 1热映 2待映
  },
};
</script>

<style scoped lang="less">
.elips1 {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  font-weight: 500;
  //width: 100% !important;
}

/* swiper */
.filmdetail {
  background-color: #F0F0F0;
  min-height: 100vh;
  padding-bottom: 70px;
  box-sizing: border-box;
  font-size: 13px;
}

.headlogo {
  width: 100%;
  height: 151px;
  position: relative;

  .img {
    object-fit: cover;
  }

  .zhezhao {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: #000000a8;
    top: 0;
    left: 0;
  }
}

.centerBox {

}

.detailListCenter {
  background-color: white;
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
  padding: 17px 16px 9px;
  margin-top: -18px;
  position: relative;
  z-index: 10;
  display: flex;
  gap: 13px;

  .detailListImg {
    width: 120px;
    min-width: 120px;
    display: flex;
    border-radius: 5px;
    overflow: hidden;
    margin-top: -56px;
  }

  .nmBox {
    width: calc(100% - 133px);

    .nm {
      font-size: 16px;
      margin-bottom: 10px;
      font-weight: bold;
    }

    .starBox {
      display: flex;
      align-items: center;
      gap: 2px;
      white-space: nowrap;
      margin-top: 4px;
    }

    .starBox2 {
      font-size: 10px;
      color: #AAAAAA;
    }
  }

}

.bottomBox {
  padding: 10px 17px;

  .descBox {
    border-radius: 10px;
    background-color: white;
    padding: 12px 15px;

    .unfold {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .unfoldTitle {
        font-size: 14px;
        font-weight: bold;
      }

      .unfoldText {
        color: #ABABAB;
      }
    }

    .desc {
      color: #838383;
      font-size: 13px;
      line-height: 1.5;
      margin-top: 10px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .desc2 {
      display: flex;
    }
  }

  .descBox2 {
    margin-top: 10px;

    .workerBox {
      display: flex;
      overflow: auto;
      width: 100%;
      gap: 6px;
      margin-top: 10px;

      .workerList {
        text-align: center;

        .avatarUrl {
          width: 80px;
          height: 111px;
          overflow: hidden;
          display: flex;
          border-radius: 5px;

          .img {
            object-fit: cover;
          }
        }

        .actorName {
          margin-top: 2px;
        }

        .characterName {
          font-size: 10px;
          color: #A0A0A0;
        }
      }
    }

    /* 隐藏滚动条 */

    .workerBox::-webkit-scrollbar {
      display: none; /* 对于 Chrome, Safari 和 Opera */
    }
  }
}

.btnBox {
  position: fixed;
  z-index: 10;
  bottom: 0px;
  background-color: white;
  width: 100%;
  padding: 10px;
  box-sizing: border-box;

  .paybtn {
    width: 100%;
    height: 38px;
    background-color: #ED3036;
    border: none;
    border-radius: 30px;
    color: #fff;
    line-height: 38px;
    text-align: center;
  }
  .paybtn2{
    background-color: #40A6FB;
  }
}
</style>