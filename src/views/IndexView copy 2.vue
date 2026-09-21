<template>
  <div class="indexwrap">
    <EnterLoging v-if="loadingflag"></EnterLoging>

    <div class="indexCenter">
      <div class="header">
        <div class="headerleft">
          <City :cityName="city"></City>
        </div>
        <div class="headercenter">
          <van-search class="search" shape="round" background="#fff0" v-model="searchtext" @input="inpchange"
            @clear="searchtext = ''" placeholder="请输入景点名称" style="padding: 0;" />
        </div>
        <div class="headerright" @click="orders">
          <img style="width:16px;" src="../assets/menpiao/dan.png" alt="">
          <span class="orders">订单</span>
        </div>
      </div>

      <!-- 筛选标签 -->
      <div style="position: relative;" class="top_tag">
        <div class="pulldown">
          <div @click="tag(1)">
            <div>全部景点</div>
          </div>
          <div @click="tag(2)">筛选<img :src="pullimg" alt="" class="pulls"></div>
          <div @click="tag(3)">综合排序<img :src="pullimg" alt="" class="pulls"></div>
          <div @click="tag(4)">景区主题<img :src="pullimg" alt="" class="pulls"></div>
        </div>
        <div v-show="tagFlg" class="downBox">
          <!-- 筛选内容保持不变 -->
          <div v-show="tagFlg" class="downBox">
            <div v-show="tagFlg == 2" style="padding: 10px;" class="btn_box">

              <div class="titile">星级</div>
              <div class="themBox1">
                <span @click.stop="selectfunId(item.id)" v-for="(item, index) in kmrightList" :key="index">{{ item.text
                }}</span>
              </div>
            </div>

            <div v-show="tagFlg == 3" style="padding: 10px;" class="btn_box3">
              <div :class="{ leftText2: funId == item.id }" @click.stop="selectfunId1(item.id)"
                v-for="(item, index) in funList" :key="index">{{ item.text }}</div>
              <!-- <div><span @click="choose()">按距离由远到近</span></div> -->
            </div>


            <div v-show="tagFlg == 4" style="padding: 10px;" class="btn_box">
              <div class="themBox">
                <!-- <div class="titile">景区</div> -->
                <span @click.stop="poiName(item2.id)" v-for="(item2, index) in themeList" :key="index">{{ item2.text
                }}</span>
              </div>
              <!-- <div>
                <div class="titile">景区</div>

                <span @click="choose()">商圈</span><span @click="choose()">商圈</span><span @click="choose()">商圈</span>
              </div> -->
            </div>


          </div>


        </div>
      </div>
    </div>

    <div class="bgrgb" v-show="tagFlg" @click="tagFlg = false"></div>

    <!-- 景点列表 -->
    <div class="tourist">
      <!-- id="touristList" @scroll="handleScroll" -->
      <div>
       <div class="no-more" v-if="loads">加载中</div>
        <div v-for="(value, index) in displayedList" :key="index" class="box_div" @click="filmdetail(value.id)">
         
          <img :src="value.coverImageUrl" alt="" class="img">
          <div class="flex-1">
            <div class="titles">{{ value.poiName }}</div>
            <div class="bt">
              <span v-if="value.poiTagListStr" v-for="item2 in value.poiTagListStr" :key="item2.tagId">{{ item2.tagName
              }} | </span> {{ value.cityName }}
            </div>
            <div class="distance">距我{{ getDistanceFromLatLonInKm(latitude, longitude, value.latitude, value.longitude)
            }}km
            </div>
            <div class="fs">
              <span class="label" v-if="value.star">{{ value.star }}A</span>
              <span class="label" v-if="value.rating && value.rating > 0">{{ value.rating }}分</span>
            </div>
            <div class="tags">
              <div class="tag">
                <span class="label" v-if="value.displayPriceType == 1">免费预约</span>
                <span class="label" v-if="value.displayPriceType == 2">门票起购</span>
                <span class="label" v-if="value.displayPriceType == 3">门市场起购</span>
                <span class="label" v-if="value.displayPriceType == 4">免费</span>
                <span class="label" v-if="value.displayPriceType == 5">空</span>
                <span class="label" v-if="value.displayPriceType == 6">暂无报价</span>
                <span class="label" v-if="value.displayPriceType == 7">限时免费</span>
              </div>
              <span class="jg" v-if="value.displayPrice">

                <span class="price">￥</span>
                <span class="price1">{{ value.displayPrice }}</span>
                <span class="price2">起</span>

              </span>


            </div>
          </div>
        </div>
      </div>

      <!-- 加载更多提示 -->
      <!-- <div v-if="loadingMore" class="loading-more">
        <van-loading type="spinner" size="20px">加载中...</van-loading>
      </div> -->
      <div v-if="dataText == 1" class="no-more">
         暂无数据
      </div>
      <!-- <div v-if="displayedList == ''" class="no-more">
        
      </div> -->
      <!-- <div v-else-if="!isInitialLoad && displayedList.length > 0 && !noMoreData" class="load-more-tip">
        继续滑动加载更多
      </div> -->
    </div>
  </div>
</template>

<script>
import BMap from "BMap"
import wx from "weixin-js-sdk";
import { getLocations } from "@/api/locality/login";
import City from "@/components/City.vue";
import EnterLoging from "@/components/EnterLoging";
import { getAccessToken } from "@/api/newFilm";
import { vanLoading, vanSearch } from 'vant';
import 'vant/lib/index.css';
import { scenicgetList, getCityList } from "@/api/city";
import moment from 'moment';
import 'moment/locale/zh-cn';

moment.locale('zh-cn');
export default {
  components: { City, EnterLoging },
  data() {
    return {
loads:true,
      pullimg: require('@/assets/menpiao/pull.png'),
      tagFlg: '',
      // 所有数据
      dataList: '',
      // 当前显示的数据（初始10条）
      displayedList: [],
      // 每页加载数量
      pageSize: 500,
      // 当前页码
      currentPage: 1,
      // 是否正在加载更多
      loadingMore: false,
      // 是否没有更多数据
      noMoreData: false,
      // 是否是首次加载
      isInitialLoad: true,
      loadingflag: true,
      searchtext: "",
      info: "66666",
      isLoading: false,
      token: '',
      // baseUrl: require("../utils/baseurl.js").baseUrl,
      swiperimg: [],
      timestamp: null,
      // 地图位置
      center: { lng: "", lat: "" },
      province: "",
      // 调用接口查询的所有城市
      cityList: [],
      city: "正在定位",
      cityid: null,
      cityid2: '',
      kefu: "",
      count: 1,
      change: null,
      shopList: [],
      active: 0,
      timer: null,
      longitude: '',
      latitude: '',
      kmrightList: [
      {
          text: "全部",
          id: 0
        },  
      {
          text: "5星",
          id: 1
        },
        {
          text: "4星及以上",
          id: 2
        },

      ],
      funList: [
        {
          text: "好评优先",
          id: 1
        },
        {
          text: "按距离由近到远",
          id: 2
        },
        {
          text: "按星级由高到低",
          id: 3
        },
      ],
      themeList: [
        { text: '游乐场', id: '乐' },
        { text: '古迹遗址', id: '寺' },
        { text: '生活馆', id: '生活' },
        { text: '度假', id: '度假' },
        { text: '温泉', id: '泉' },
        { text: '酒庄', id: '酒庄' },
        { text: '花卉花海', id: '花' },
        { text: '旅游区', id: '旅游' },

        { text: '动物园', id: '动物' },
        { text: '登高爬山', id: '景区' },
        { text: '长城', id: '长城' },

        { text: '游乐游艺', id: '乐园' },
        { text: '海洋馆', id: '海洋' },
        { text: '自然山水', id: '景' },
        { text: '遛娃', id: '公园' },
        { text: '博物馆', id: '博物馆' },
      ],
      funId: "", dmSort: '', filtrationStar: 0, poiNames: '',
      distanceKm: "", filtrationPrice: 1,
      dataText:0
    }
  },
  created() {
    this.city = sessionStorage.getItem("cityName");
    if (this.city) {
      this.scenicGetist();
    }
    else {
      this.createMap();
    }
    this.getLocation1();
    this.token = localStorage.getItem("token");
    setTimeout(() => {
      this.loadingflag = false
    }, 2000)

    this.timestamp = moment(new Date()).format('yyyy-MM-DD HH:mm:ss');

    // this.createMap2()
    //判断url是否传过来值，若没传过来则证明为刚进网站，若有值则证明去地址页面选择了地址

    console.log(this.city + 'this.city ')
    this.cityid = Number(sessionStorage.getItem("targetId"))
    this.cityid2 = Number(sessionStorage.getItem("targetId2"))
    this.change = sessionStorage.getItem("change")


    if (!sessionStorage.getItem('access_token')) {

      this.getTokenKey()
    }
    // else {

    //   this.createMap()
    // }
    // 是微信端浏览器——公众号
    // let APPID = "wx05cc5223511e93c3";

  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  destroyed() {
    // window.removeEventListener('scroll', this.handleScroll, false);
    window.removeEventListener('scroll', this.handleScroll);
    window.onresize = null;
  },
  mounted() {

    // this.scenicGetist();
    // window.addEventListener('scroll', this.handleScroll);
    // 初始化显示前10条数据
    // this.loadInitialData();

    window.addEventListener('scroll', this.handleScroll);

    // 初始加载数据
    // if (this.city) {
    //   this.scenicGetist();
    // }

  },
  methods: {
    getTokenKey() {
      getAccessToken({
        entId: "101344",
        appSecret: "IALrbqLuSVtlMW3k9WlnxnCwuCA556jr"
      }).then(res => {
        // console.log(res, "1111")
        if (res.code == 0) {
          sessionStorage.setItem('token_type', res.data.token_type);
          sessionStorage.setItem('access_token', res.data.access_token);
          this.createMap()
        }
      })
    },
    // 简化 createMap 方法，移除重复定位逻辑
    createMap() {
      const geolocation = new BMap.Geolocation();
      var _this = this;

      geolocation.getCurrentPosition(function getinfo(position) {
        let latitude = position.latitude;
        let longitude = position.longitude;
        let city = position.address.city.substring(0, position.address.city.length - 1);

        // 保存到sessionStorage
        sessionStorage.setItem("cityName", city);
        _this.city = city;

        // 获取城市ID并加载数据
        _this.getCity(city);

        // 显示城市选择提示
        if (sessionStorage.getItem("promptcity") != 2 && sessionStorage.getItem("change") != 1) {
          _this.messageinfo();
        }

      }, { enableHighAccuracy: true }, function (e) {
        // 定位失败的处理
        console.log("定位失败");
        _this.city = "未知";
        sessionStorage.setItem("cityName", "未知");
      }, {
        provider: 'baidu'
      });
    },
    messageinfo() {
      // 只有第一次定位时才显示提示
      if (sessionStorage.getItem("promptcity") != 2 && sessionStorage.getItem("change") != 1) {
        this.$dialog.confirm({
          message: '当前定位"' + this.city + '"，是否需要切换到其他城市？',
          confirmButtonColor: 'red',
          cancelButtonColor: 'red',
          confirmButtonText: '切换',
          cancelButtonText: '确认',
        }).then(() => {
          this.$router.push({ path: "/citylist", query: { city: this.city } });
          sessionStorage.setItem("promptcity", "2");
        }).catch(() => {
          sessionStorage.setItem("promptcity", "2");
        });
      }
    },
    // 获取所有城市
    // 修改getCity方法
    getCity(cityName) {
      getCityList({
        keyword: cityName
      }).then(res => {
        this.cityList = res.data || [];
        if (this.cityList.length > 0) {
          this.cityid2 = this.cityList[0].cityid2;
          // 加载景点列表
          this.scenicGetist();
        }
      }).catch(error => {
        console.error("获取城市失败:", error);
        // 即使获取城市失败，也尝试加载数据
        this.scenicGetist();
      });
    },
    getLocation1() {
      let purl = /(Android)/i.test(navigator.userAgent) ? location.href.split('#')[0] : window.localStorage.getItem('scanUrl');
      getLocations({
        url: purl
      }).then(res => {

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
      wx.config(configData);
      wx.ready((res1) => {

        wx.getLocation({
          type: 'wgs84',
          success: (res) => {

            sessionStorage.setItem("longitude", res.longitude);
            sessionStorage.setItem("latitude", res.latitude);
            this.longitude = res.longitude;
            this.latitude = res.latitude;

            this.scenicGetist();
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
          console.log('position')
          console.log(position)
          if (this.getStatus() == BMAP_STATUS_SUCCESS) {
            var mk = new BMap.Marker(position.point);
            let latitude = position.latitude
            let longitude = position.longitude
            let city = position.address.city.substring(0, position.address.city.length - 1); //获取城市信息
            _this.city = city

            let province = position.address.province; //获取省份信息
            _this.longitude = longitude;
            _this.latitude = latitude;

            _this.getCity(_this.city)

            // _this.scenicGetist();

            if (_this.isWeiXin()) {
              console.log(111111)
              _this.getLocation1()

            } else {
              console.log(2222222222)

              _this.scenicGetist();
            }



          }
        }, { enableHighAccuracy: true });
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
    getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
     // 检查坐标是否有效
  if (!lat1 || !lon1 || !lat2 || !lon2) {
    return '--';
  }
      const R = 6371; // 地球半径，单位：千米
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;
      return Number(distance).toFixed(2);
    },
    //获取景区列表
// 获取景区列表
scenicGetist() {
  this.dataText = 0;
  // 如果城市还没有确定，等待一下
  if (!this.city || this.city === "定位中") {
    setTimeout(() => {
      if (this.city && this.city !== "定位中") {
        this.scenicGetist();
      }
    }, 500);
    return;
  }
  
  let listdata = {
    "pageNo": 1,
    "pageSize": this.pageSize,
    "cityName": this.city,
    poiName: this.poiNames,
    longitude: this.longitude,
    latitude: this.latitude,
    filtrationStar: this.filtrationStar,
    dmSort: this.dmSort,
    distanceKm: this.distanceKm,
    filtrationPrice: this.filtrationPrice
  };
  
  scenicgetList({
    interfaceCode: 'findTravelScenicAreaPage',
    data: JSON.stringify(listdata),
  }).then(res => {
    this.loads = false;
    const newData = res.data?.list || [];
    
    // 过滤掉演出表演相关的景点
    const filteredData = this.filterPerformanceAttractions(newData);
    
    this.dataList = filteredData;
    this.displayedList = filteredData;

    if (filteredData.length === 0) {
      // 没有数据时的处理
      this.dataText = 1;
      this.displayedList = [];
    }
  }).catch(error => {
    this.loads = false;
    console.error('获取数据失败:', error);
  });
},

// 新增过滤方法：过滤演出表演相关景点
filterPerformanceAttractions(attractions) {
  if (!attractions || !attractions.length) return [];
  
  // 定义演出表演相关的关键词
  const performanceKeywords = [
     '歌舞', '剧', 'live', '演唱会', '音乐会',
     '戏曲', '歌剧', '舞剧', '杂技', '马戏','生日会',
    'show', 'concert', 'theatre', '戏院'
  ];
  
  return attractions.filter(attraction => {
    // 检查景点名称是否包含演出关键词
    if (attraction.poiName) {
      const poiNameLower = attraction.poiName.toLowerCase();
      if (performanceKeywords.some(keyword => poiNameLower.includes(keyword.toLowerCase()))) {
        return false; // 过滤掉
      }
    }
    
    // 检查景点描述是否包含演出关键词
    if (attraction.poiDesc) {
      const poiDescLower = attraction.poiDesc.toLowerCase();
      if (performanceKeywords.some(keyword => poiDescLower.includes(keyword.toLowerCase()))) {
        return false; // 过滤掉
      }
    }
    
    // 检查标签是否包含演出相关
    if (attraction.poiTagListStr && attraction.poiTagListStr.length > 0) {
      const hasPerformanceTag = attraction.poiTagListStr.some(tag => {
        const tagNameLower = tag.tagName.toLowerCase();
        return performanceKeywords.some(keyword => tagNameLower.includes(keyword.toLowerCase()));
      });
      
      if (hasPerformanceTag) {
        return false; // 过滤掉
      }
    }
    
    // 如果都没有匹配，保留该景点
    return true;
  });
},
    //   scenicGetist() {
  //     this.dataText = 0;
  //     // 如果城市还没有确定，等待一下
  //     if (!this.city || this.city === "定位中") {
  //       setTimeout(() => {
  //         if (this.city && this.city !== "定位中") {
  //           this.scenicGetist();
  //         }
  //       }, 500);
  //       return;
  //     }

      

  //     let listdata = {
  //       "pageNo": 1,
  //       "pageSize": this.pageSize,
  //       "cityName": this.city,
  //       poiName: this.poiNames,
  //       longitude: this.longitude,
  //       latitude: this.latitude,
  //       filtrationStar: this.filtrationStar,
  //       dmSort: this.dmSort,
  //       distanceKm: this.distanceKm,
  //       filtrationPrice: this.filtrationPrice
  //     };
  //     scenicgetList({
  //       interfaceCode: 'findTravelScenicAreaPage',
  //       data: JSON.stringify(listdata),
  //     }).then(res => {
  //       this.loads = false;
  //       const newData = res.data?.list || [];
  //       // const total = res.data?.total || 0;
  //       this.dataList = newData;
  //       this.displayedList = newData;

  //       if (newData.length === 0) {
  //         // 没有数据时的处理
  //         this.dataText = 1;
  //         this.displayedList = [];
  //       }
  //       // if (res.data.list == null || res.data.list == '') {
  //       //   this.displayedList = [];
  //       // }
  //     }).catch(error => {
  //       this.loads = false;

  //       console.error('获取数据失败:', error);
  //       // this.loadingMore = false;
  //       // this.isInitialLoad = false;
  //       // this.noMoreData = false; // 出错时重置
  //     });
  // },
  orders() {
    this.$router.push("/personCenter")
  },
  poiName(e) {
    this.loads = true;
    this.poiNames = e;
    this.tagFlg = false;
    // this.noMoreData = false; // 重置状态
    this.displayedList = [];
    this.scenicGetist();
    // 筛选后滚动到顶部
    this.$nextTick(() => {
      this.scrollToTop();
    });
  },
  selectfunId(e) {
    this.loads = true;

    this.displayedList = [];
    this.filtrationStar = e;
    this.tagFlg = false;
    // this.noMoreData = false; // 重置状态
    this.scenicGetist();
    // 筛选后滚动到顶部
    this.$nextTick(() => {
      this.scrollToTop();
    });
  },
  selectfunId1(e) {
    this.loads = true;

    this.displayedList = [];
    this.dmSort = e;
    this.tagFlg = false;
    // this.noMoreData = false; // 重置状态
    this.scenicGetist();
    // 筛选后滚动到顶部
    this.$nextTick(() => {
      this.scrollToTop();
    });
  },
  choose(e) {
    this.tagFlg = false;
  },
  tag(e) {
    this.loads = true;

    if (e == 1) {
      this.displayedList = [];
      this.tagFlg = false;
      this.poiNames = '';
      this.filtrationPrice = 1;
      this.filtrationStar = 0;
      this.dmSort = '';
      // this.noMoreData = false; // 重置状态
      this.scenicGetist();
      // 筛选后滚动到顶部
      this.$nextTick(() => {
        this.scrollToTop();
      });
    } else {
      this.tagFlg = e;
    }
  },



  // 加载初始数据（前10条）
  loadInitialData() {
    this.isInitialLoad = true;
    // 首次加载10条
    this.displayedList = this.dataList.slice(0, this.pageSize);
    this.currentPage = 1;
    this.isInitialLoad = false;

    // 检查是否还有更多数据
    this.checkMoreData();
  },
  // 加载更多
  loadMore() {
    console.log('调用 loadMore 方法');
    console.log('当前状态:', {
      loadingMore: this.loadingMore,
      noMoreData: this.noMoreData,
      displayedListLength: this.displayedList.length
    });

    if (this.loadingMore) {
      console.log('正在加载中，跳过');
      return;
    }

    if (this.noMoreData) {
      console.log('没有更多数据了，跳过');
      return;
    }

    console.log('开始加载更多数据...');
    this.scenicGetist();
  },
  // 滚动事件处理
  handleScroll() {
    console.log('滚动事件触发!');
    console.log('状态:', {
      loadingMore: this.loadingMore,
      noMoreData: this.noMoreData,
      isInitialLoad: this.isInitialLoad
    });

    // 如果正在加载或没有更多数据，不处理
    if (this.loadingMore || this.noMoreData || this.isInitialLoad) {
      console.log('条件不满足，返回');
      return;
    }

    // 使用 window 的滚动，因为 .tourist 容器可能没有滚动条
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
    const windowHeight = window.innerHeight;
    const scrollHeight = document.documentElement.scrollHeight;

    

    // 距离底部 100px 时触发加载
    const distanceToBottom = scrollHeight - scrollTop - windowHeight;
    const isBottom = distanceToBottom < 100;

    

    if (isBottom) {
      console.log('触发加载更多...');
      this.loadMore();
    }
  },

 

  // 检查是否还有更多数据
  checkMoreData() {
    const totalLoaded = this.currentPage * this.pageSize;
    this.noMoreData = totalLoaded >= this.dataList.length;
  },
  // 新增：滚动到顶部的方法
  scrollToTop() {
    // 多种方式确保滚动到顶部
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // 平滑滚动
    });

    // 同时处理页面其他可能滚动的元素
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // 如果有特定容器需要滚动，也可以处理
    const touristList = document.getElementById('touristList');
    if (touristList) {
      touristList.scrollTop = 0;
    }
  },
  // 搜索功能
  inpchange(e) {


    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(() => {
      this.poiNames = this.searchtext;
      this.noMoreData = false; // 重置状态
      this.scenicGetist();
      // 筛选后滚动到顶部
      this.$nextTick(() => {
        this.scrollToTop();
      });
      this.timer = undefined;
    }, 1000)


  },

  filmdetail(id) {
    this.$router.push({ path: "/filmdetail", query: { id } })
  }
}
}
</script>

<style scoped lang="less">
.bgrgb {
  position: fixed;
  z-index: 0;
  background: rgba(0, 0, 0, 0.2);
  width: 100%;
  height: 100vh;
  top: 0;
  left: 0;
}

.top_tag {
  .pulldown {
    display: flex;
    justify-content: space-around;
    color: #ffffff;

    .pulls {
      width: 10px;
      position: relative;
      top: -2px;
    }
  }

  .downBox {
    font-size: 12px;
    background-color: #ffffff;
    width: 100%;
    height: auto;
    position: absolute;
    top: 20px;
  }

  .themBox {
    display: flex;
    flex-wrap: wrap;
    text-align: center;
    justify-content: space-between;

    span {
      width: 20%;
    }
  }

  .themBox1 {
    display: flex;
    flex-wrap: wrap;
    text-align: center;


    span {
      width: 20%;
    }
  }

  .btn_box {
    text-align: center;

    div {
      text-align: left;
      margin-bottom: 6px;
      margin-top: 4px;
      color: #222222;
    }

    span {
      display: inline-block;
      background: #f3f3f3;
      font-size: 12px;
      border-radius: 50px;
      padding: 6px 1px 6px 1px;
      margin-right: 8px;
      margin-bottom: 8px;
      color: #222222;
      text-align: center;
    }

    .titile {
      margin-bottom: 8px;
      font-size: 14px;
    }

    .leftText2 {
      text-align: left;
      margin-bottom: 8px;
      font-size: 12px;
    }
  }

  .btn_box3 div {

    font-size: 14px;
    margin-top: 4px;
    color: #222222;
    margin-top: 5px;
    ;
    margin-bottom: 8px;
  }
}

.tourist {
  padding: 0 10px;
  padding-top: 110px;
  padding-bottom: 80px;
  // height: calc(100vh - 155px);
  /* 设置固定高度以启用滚动 */
  //overflow-y: auto;
  /* 启用垂直滚动 */

  .box_div {
    margin-top: 12px;
    padding: 10px;
    border-radius: 10px;
    background-color: #ffffff;
    display: flex;
    justify-content: space-between;

    .img {
      border-radius: 6px;
      width: 84px;
      height: 110px;
      margin-right: 10px;
      object-fit: cover;
    }

    .flex-1 {
      font-size: 14px;
      flex: 1;
      display: flex;
      flex-direction: column;

      .titles {
        color: #000;
        font-size: 16px;
      }

      .distance {
        color: #878787;
        font-size: 12px;
      }

      .bt {
        margin-top: 1px;
        color: #252525;
        font-size: 12px;
      }

      .fs {
        margin-top: 0px;

        span {
          margin-right: 8px;
          border-radius: 4px;
          color: #6ab6ac;
          border: 1px solid #e9f1f1;
          padding: 0px 4px 0px 4px;
          font-size: 10px;
        }
      }

      .tags {
        margin-top: 4px;
        display: flex;
        justify-content: space-between;

        .tag span {
          border-radius: 4px;
          margin-right: 8px;
          color: #2c2c2c;
          border: 1px solid #e7e7e7;
          padding: 1px 6px 0px 6px;
          font-size: 10px;
        }

        .jg {
          color: #D7000F;

          .price {
            font-size: 12px;
          }

          .price1 {
            font-size: 19px;
          }

          .price2 {
            font-size: 12px;
          }
        }
      }
    }
  }

  /* 加载更多样式 */
  .loading-more,
  .no-more,
  .load-more-tip {
    text-align: center;
    padding: 15px 0;
    color: #666;
    font-size: 14px;
  }

  .loading-more {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
}

.indexwrap {
  min-height: 100vh;
  background-color: #f1f1f1;
}

.indexCenter {
  background: url(../assets/menpiao/topbg.png);
  z-index: 2;
  padding: 0;
  height: 104px;
  position: fixed;
  width: 100%;
  top: 0;
}

.indexwrap .header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 12px 11px;
  gap: 16px;
}

.headercenter {
  width: 100%;

  /deep/ .van-search__content {
    background-color: #ffffff;
  }

  /deep/ .van-cell {
    font-size: 13px;
  }
}

.headerright {
  width: 36px;
  align-items: inherit;
  display: flex;
  flex-direction: column;

  .orders {
    font-size: 10px;
    color: #ffffff;
  }
}

/* 响应式调整 */
// @media (max-width: 375px) {
//   .tourist {
//     padding-top: 125px;
//     //height: calc(100vh - 150px);
//   }

//   .box_div {
//     .img {
//       width: 70px;
//       height: 95px;
//     }
//   }
// }</style>