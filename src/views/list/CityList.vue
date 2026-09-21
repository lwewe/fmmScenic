<template>
  <div class="citylist">
    <div>
      <div class="citysearch">
        <van-icon class="quit" size="1.5em" name="arrow-left" @click="quit()"/>
        <van-search class="search" v-model="searchQuery" @input="inpchange" @clear="searchQuery=''" placeholder="城市/拼音" style="padding: 0;"/>
      </div>
      <div class="nowCity" v-if="!searchQuery">当前城市:{{ city }}</div>
    </div>
    <!-- 搜索显示的列表 -->
    <div class="searchlist" v-if="searchQuery">
      <div v-if="cityList.length>0">
        <div v-for="(city,index) in cityList" :key="index"
             @click="editCity(city)"
             style="padding-left: 3vw;border-bottom: 1px solid #f0f0f0;font-size: 0.8rem;padding-top: 10px;padding-bottom: 10px;">
          {{ city.name }}
        </div>
      </div>
      <div v-else class="noneSearch">暂无搜索城市</div>
    </div>
    <!-- 不搜索显示的列表 -->
<div  v-else>
  <div class="inner">

    <div class="hotcity">
      <!-- 定位/最近访问 -->
      <div class="font13 title">定位/最近访问</div>
      <div class="cityblockBox">
        <div class="cityblock" v-for="(item2,index2) in cityItem"  @click="editCity(item2)">
          <van-icon name="location" color="red"/>
          <span class="font13">{{ item2.name }}</span>
        </div>
        <div class="cityblock" v-for="(item,index) in lately" :key="index" @click="editCity(item)">
          <span class="font13">{{ item.name }}</span>
        </div>
      </div>
    </div>
    <!-- 热门城市 -->
    <div class="font13 title hotTitle">热门城市</div>
    <div class="cityblockBox">
      <div @click="editCity(item)" class="cityblock" style="font-size: 0.8rem;" v-for="(item,index) in hotcitylist"
           :key="index">{{ item.name }}
      </div>
    </div>
  </div>
  <!-- 城市列表 -->
  <div class="list" v-if="cityList.length>0">
    <div class="wordtitleBox" v-for="(item,index) in cityList" :key="index">
      <div class="wordtitle" :id="item.pinyin.charAt(0)"
           v-if="index === 0 || item.pinyin.charAt(0) != cityList[index - 1].pinyin.charAt(0)">{{
          item.pinyin[0]
        }}</div>
      <div  class="cityoneBox">
        <div class="cityone" @click="editCity(item)">{{ item.name }}</div>
      </div>
    </div>
  </div>
  <!-- 右侧锚点列表 -->
  <ul class="find">
    <li style="margin-bottom: 5px;" :class="{idnames:idname=='#'+item}" v-for="(item,index) in findword"
        :key="index"><a @click="changeHash('#'+item)">{{
        item
      }}</a></li>
  </ul>
</div>
  </div>

</template>

<script>
//引入
import moment from 'moment';
import 'moment/locale/zh-cn';

moment.locale('zh-cn');
//调用城市列表接口
import {getCityList, getHotCityList} from "@/api/city";
import {getCitiesList} from "@/api/newFilm";

export default {
  data() {
    return {
      findword: ["热门"],
      city: "定位中",
      hotcitylist: [],
      popusearch: "",
      // 城市列表
      cityList: [],
      //首字母
      wordtitle: [],
      searchQuery: "",
      idname: "",
      timer: null,
      lately: [],
      cityItem:[]
    };
  },
  methods: {
    // 搜索
    inpchange(e) {
      this.cityList = []
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(() => {
        this.getCity(e)
        // console.log("ppppppppp")
        this.timer = undefined;
      }, 1000)
    },
    // 左上角返回
    quit() {
      this.$router.go(-1);
    },
    //获取城市列表
    getCity(keyword = "") {
      getCityList({
        keyword
      }).then(res => {
        if (res.code == 200) {
          this.cityList = res.data || []
        }
      })
    },
    getHotCity() {
      getHotCityList().then(res => {
        if (res.code == 200) {
          this.hotcitylist = res.data
          //生成26英文字母,为锚点准备
          for (var i = 65; i < 91; i++) {
            this.findword.push(String.fromCharCode(i))
          }
        }
      })
    },
    //锚点跳转
    changeHash(idname) {
      this.idname = idname
      if(document.querySelector(idname)){
        document.querySelector(idname).scrollIntoView(true);
      }
    },
    unique(arr) {
      const res = new Map();
      return arr.filter((arr) => !res.has(arr.id) && res.set(arr.id, 1)
      );
    },
    //修改城市
    editCity(item) {
      // console.log(item);
      // return
      this.lately.unshift(item)
      if(this.cityItem.length>0){
        this.lately = this.unique(this.lately).filter(item2=>item2.name!==this.cityItem[0].name)
      }
      sessionStorage.setItem("targetId", item.cityid1)
      sessionStorage.setItem("targetId2", item.cityid2)
      sessionStorage.setItem("cityName", item.name)
      sessionStorage.setItem("cityId2", item.id)
      sessionStorage.setItem("lately", JSON.stringify(this.lately))
      // this.$router.options.routes.forEach(item => {
      //   if (item.meta) {
      //     if (item.meta.keep) {
      //       item.meta.keepAlive = false
      //     }
      //   }
      // })
      this.$router.go(-1)
    },
    goindex() {
      this.$router.go(-1)
    }

  },
  created() {
    this.city = this.$route.query.city
    if (sessionStorage.getItem("cityItem")) {
      this.cityItem = JSON.parse(sessionStorage.getItem("cityItem")) || []
    }
    if (sessionStorage.getItem("lately")) {
      this.lately = JSON.parse(sessionStorage.getItem("lately"))
    }
    this.getCity()
    this.getHotCity()
  }
};
</script>

<style scoped lang="less">
// html {
//   scroll-behavior: smooth;
// }
.font13 {
  font-size: 13px;
}

.title {
  color: #626262;
}

.hotTitle {
  margin-top: 8px;
}

.citylist {
  position: relative;
  //padding-top: 13px;
  background-color: #f0f0f0;

  .citysearch {
    background-color: #f9f9f9;
    padding: 13px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;

  }

  .quit {
    margin-left: 1vw;
  }

  .van-search .van-cell {
    background-color: #ececec;
    border-radius: 50px;
    padding-left: 15px;

  }

  .search {
    width: 80vw;
    margin-right: 5vw;
    height: 3vh;
  }

  .van-icon-search:before {
    margin-left: 25vw;
  }
}
.searchlist{
  background-color: white;
  min-height:calc(100vh - 77px);
}
.list {
  .wordtitleBox{
    .cityoneBox{
      background-color: white;
      padding: 0px 16px;
    }
    .cityone {
      font-size: 13px;
      padding: 8px 0;
      border-bottom: 1px solid #F4F4F4;
    }

    .wordtitle {
      font-size: 13px;
      color: #6E6E6E;
      padding: 9px 16px;
    }
  }


}

.cityblockBox {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 12px;

  .cityblock {
    width: 29.5%;
    background-color: #fff;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 32px;

  }
}


.idnames {
  color: #1A73E8;
}

.noneSearch {
  text-align: center;
  padding-top: 24px;
  font-size: 13px;
  color: #888888;
}

.nowCity {
  text-align: center;
  font-size: 13px;
  padding: 8px 0;
  background-color: white;
}

.inner {
  padding: 8px 16px;
  background-color: #f0f0f0;

  .hotcity {

  }
}

.find {
  z-index: 1000;
  position: fixed;
  top: 18vh;
  right: 5px;
  text-align: center;
  font-size: 12px;
}
</style>