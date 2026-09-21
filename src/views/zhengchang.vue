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


      <div v-for="(value, index) in productList" :key="index" class="box_div" @click="filmdetail(value.id)">

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
              <span class="price1">{{ calculatePrice(value.displayPrice) }}</span>
              <span class="price2">起</span>

            </span>


          </div>
        </div>
      </div>

      <!-- 加载提示 -->
      <div v-if="isLoading" class="loading" style="text-align: center;font-size: 12px;color: #666666;margin-top: 10px;">
        <!-- <van-loading type="spinner" size="20px" /> -->
        <span>加载中...</span>
      </div>

      <div v-if="isScroll && productList.length > 0" class="no-more">
        没有更多景点了
      </div>

      <div v-if="productList.length === 0 && !isLoading && !loads" class="no-more">
        暂无景点数据
      </div>



    </div>
  </div>
</template>

<script>
import { calculatePrice } from '@/utils/price'
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

      // 核心数据（完全按照电商页面结构）
      productList: [],      // 景点列表（改为productList保持一致性）
      pageno: 1,           // 当前页码（和电商页面一样）

      isScroll: false,     // 是否没有更多数据



      loads: true,
      pullimg: require('@/assets/menpiao/pull.png'),
      tagFlg: '',
      // 所有数据
      dataList: '',
      // 当前显示的数据（初始10条）
      displayedList: [],
      // 每页加载数量
      pageSize: 10,
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
      funId: "", dmSort: 2, filtrationStar: 0, poiNames: '',
      distanceKm: "", filtrationPrice: 1,
      dataText: 0,
      canLoadMore: true,  // 是否可以加载更多（替代多个标志位）
    }
  },
  created() {
    this.city = sessionStorage.getItem("cityName");
    this.getLocation1();
    this.token = localStorage.getItem("token");
    setTimeout(() => {
      this.loadingflag = false
    }, 2000)

    this.timestamp = moment(new Date()).format('yyyy-MM-DD HH:mm:ss');
    console.log(this.city + 'this.city ')
    this.cityid = Number(sessionStorage.getItem("targetId"))
    this.cityid2 = Number(sessionStorage.getItem("targetId2"))
    this.change = sessionStorage.getItem("change")
    if (!sessionStorage.getItem('access_token')) {
      this.getTokenKey()
    }
    this.createMap2()
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
  // 添加activated和deactivated生命周期钩子

  methods: {
    calculatePrice(price) {
      // 调用导入的工具函数
      return calculatePrice(price);
    },
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
          this.loadInitialData()  // 改为调用初始加载
        }
      }).catch(error => {
        console.error("获取城市失败:", error);
        // 即使获取城市失败，也尝试加载数据
        this.loadInitialData()  // 改为调用初始加载
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
        this.dmSort = 2;
        wx.getLocation({
          type: 'wgs84',
          success: (res) => {

            localStorage.setItem("longitude",res.longitude)
            localStorage.setItem("latitude",res.latitude)

            sessionStorage.setItem("longitude", res.longitude);
            sessionStorage.setItem("latitude", res.latitude);
            this.longitude = res.longitude;
            this.latitude = res.latitude;

            // 添加这行：设置默认按距离排序
            // 确保排序方式已设置
            if (!this.dmSort) {
              this.dmSort = 2;
            }

            this.loadInitialData();  // 改为调用初始加载

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
            // _this.city = city
            // alert(_this.city +'_this.city')
            let province = position.address.province; //获取省份信息
             _this.longitude = longitude;
             _this.latitude = latitude;
            _this.dmSort = 2;


            //  localStorage.setItem("longitude",position.longitude)
            // localStorage.setItem("latitude",position.latitude)


            _this.city = sessionStorage.getItem("cityName")
            _this.getCity(_this.city)
 

            if (_this.isWeiXin()) {
               
              _this.getLocation1()

            } else {
              console.log(2222222222)
              _this.loadInitialData()
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

    // 新增过滤方法：过滤演出表演相关景点
    filterPerformanceAttractions(attractions) {
      if (!attractions || !attractions.length) return [];

      // 定义演出表演相关的关键词
      const performanceKeywords = [
        '歌舞', '剧', 'live', '演唱会', '音乐会',
        '戏曲', '歌剧', '舞剧', '杂技', '马戏', '生日会',
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


        if (attraction.coverImageUrl == '' || attraction.coverImageUrl == null) {
          return false; // 过滤掉 
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

    orders() {
      this.$router.push("/personCenter")
    },
    poiName(e) {

      this.poiNames = e;
      this.tagFlg = false;
      this.loadInitialData();
      // 添加滚动到顶部
      this.$nextTick(() => {
        this.scrollToTop();
      });
    },
    selectfunId(e) {

      this.filtrationStar = e;
      this.tagFlg = false;
      this.loadInitialData();
      // 添加滚动到顶部
      this.$nextTick(() => {
        this.scrollToTop();
      });
    },
    selectfunId1(e) {

      this.dmSort = e;
      this.tagFlg = false;
      this.loadInitialData();
      // 添加滚动到顶部
      this.$nextTick(() => {
        this.scrollToTop();
      });
    },
    choose(e) {
      this.tagFlg = false;
    },
    tag(e) {


      if (e == 1) {

        this.tagFlg = false;
        this.poiNames = '';
        this.filtrationPrice = 1;
        this.filtrationStar = 0;
        this.dmSort = '';
        this.loadInitialData();
        // 添加滚动到顶部
        this.$nextTick(() => {
          this.scrollToTop();
        });
      } else {
        this.tagFlg = e;
      }
    },



    // 滚动事件处理
    handleScroll(e) {
      let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      let scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
      let clientHeight = document.documentElement.clientHeight || document.body.clientHeight;

      // 当滚动到底部时触发
      if (Math.ceil(scrollTop + clientHeight) >= scrollHeight) {
        this.onMost()
      }
    },   // 2. 加载更多方法（完全复制电商页面）
    onMost() {
      console.log('触发onMost，isScroll:', this.isScroll);
      // if (!this.isScroll) {
      //   this.pageno++
      //   console.log('加载第', this.pageno, '页');
      //   this.getScenicProduct()
      // }
      if (!this.canLoadMore || this.isScroll) {
        return;
      }

      // 立即禁止再次加载
      this.canLoadMore = false;

      // 页码增加
      this.pageno++;

      // 请求数据
      this.getScenicProduct();
    },

    // 3. 获取景点数据方法（按照电商页面结构改造）
    getScenicProduct(pageno = this.pageno) {

      // alert(this.city +'this.city')
      // 防止重复加载
      if (this.isLoading) {
        console.log('正在加载中，跳过');
        return;
      }

      this.isLoading = true;
      // alert('列表加载1')
let newlo ='';
let newla='';
      if (this.isWeiXin()) {
        // alert(2)
          newlo = localStorage.getItem("longitude");
          newla = localStorage.getItem("latitude");
      } else {
        // alert(22)

          newlo = this.longitude;
          newla = this.latitude;
      }


      let listdata = {
        pageNo: pageno,
        pageSize: this.pageSize,
        cityName: this.city,
        poiName: this.poiNames,
        longitude:newlo,// localStorage.getItem("longitude"),//this.longitude ||
        latitude: newla,//localStorage.getItem("latitude"), //this.latitude || 
        filtrationStar: this.filtrationStar,
        dmSort: this.dmSort,
        distanceKm: this.distanceKm,
        filtrationPrice: this.filtrationPrice
      };



      scenicgetList({
        interfaceCode: 'findTravelScenicAreaPage',
        data: JSON.stringify(listdata),
      }).then(res => {


        console.log('接口返回:', res);
        this.canLoadMore = true;
        this.loads = false;
        this.isLoading = false;


        if (res.code == 200) {


          const newData = res.data?.list || [];


          if (newData.length === 0) {
            this.isScroll = true;
            return;
          }
          const filteredData = this.filterPerformanceAttractions(newData);


          if (filteredData.length == 0) {
            console.log('没有数据了，设置isScroll = true');
            this.isScroll = true;
            return;
          }

          // 追加数据（和电商页面一样）
          filteredData.forEach(item => {
            this.productList.push(item);
          });

          console.log('追加后总数据量:', this.productList.length);
        } else {
          console.log('接口返回错误码:', res.code);
          this.isScroll = true; // 如果接口错误，也设置没有更多数据
        }
      }).catch(error => {
        this.canLoadMore = true;
        console.error('获取数据失败:', error);
        this.loads = false;
        this.isLoading = false;
        this.isScroll = true; // 网络错误时也设置没有更多数据
      });
    },
    loadInitialData() {

      // 检查必要参数是否已准备就绪
      if (!this.city || this.city === "正在定位") {

        // 延迟重试
        setTimeout(() => {
          if (this.city && this.city !== "正在定位") {


            this.loadInitialData();
          } else {


            this.loads = false;
            console.log('无法获取城市信息');
          }
        }, 500);
        return;
      }

      // 检查经纬度是否已获取
      if (!this.longitude || !this.latitude) {

        // 延迟重试
        setTimeout(() => {
          if (this.longitude && this.latitude) {

            this.loadInitialData();
          } else {


            this.loads = false;
            console.log('无法获取经纬度信息');
          }
        }, 500);
        return;
      }

      // 确保排序参数已设置
      if (!this.dmSort) {
        this.dmSort = 2;
      }


      this.loads = true;
      this.isScroll = false;
      this.pageno = 1;
      this.productList = [];  // 清空列表

      this.getScenicProduct(1);
    },
    // 4. 初始加载方法
    //   loadInitialData() {
    //     this.loads = true
    //     this.isScroll = false
    //     this.pageno = 1
    //     this.productList = []  // 清空列表

    //         // 强制设置排序方式，确保不为空
    // if (!this.dmSort && this.latitude && this.longitude) {
    //   this.dmSort = 2; // 按距离由近到远
    // } else if (!this.dmSort) {
    //   this.dmSort = 2; // 即使没有经纬度也设置默认排序
    // }
    //     this.getScenicProduct(1)
    //   },
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
        this.loadInitialData();
        // 添加滚动到顶部
        this.$nextTick(() => {
          this.scrollToTop();
        });
        this.timer = undefined

      }, 800)


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