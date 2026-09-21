<template>
  <div class="filmdetail" style="position: relative;">
    <ReturnBack :rcolor="'#000'" :bcolor="'rgb(255 255 255 / 84%)'"></ReturnBack>
    <NProgress v-if="loadingflag" />

    <!-- 头部轮播图 -->
    <div class="swiper-container headlogo" v-if="trailers.length > 0">

      <div class="">
        <!-- swiper-wrapper -->
        <div class="swiper-slide" v-for="(item, index) in trailers" :key="index">
          <img :src="item.img" class="img" style="width: 100%; height: 100%;" />
        </div>

      </div>

      <!-- 分页器 -->
      <!-- <div class="swiper-pagination"></div> -->
    </div>

    <!-- 景点信息 -->
    <div class="spot-info">
      <div class="spot-title">{{ travelScenicArea.name || travelScenicArea.poiName }}</div>
      <div class="spot-rating">
        <div>
          <!-- <span >4.0分</span> -->
          <span class="score" v-if="travelScenicArea.star">{{ travelScenicArea.star }}A</span>
          <span class="score" v-if="travelScenicArea.rating && travelScenicArea.rating > 0">{{ travelScenicArea.rating
          }}分</span>

          <span class="category" v-if="travelScenicArea.poiTagListStr && travelScenicArea.poiTagListStr != 'null'"
            v-for="item2 in (travelScenicArea.poiTagListStr || []).slice(0, 2)" :key="item2.tagId">
            {{ item2.tagName }}
          </span>
        </div>
        <div class="popularity" v-if="travelScenicArea.poiTagListStr"><img :src="Areas" alt=""> {{
          travelScenicArea.cityName }}人气榜</div>
      </div>
      <div class="spot-address">
        <div class="address-title">门店地址</div>
        <div class="address-content">{{ travelScenicArea.poiAddress }}</div>
      </div>
    </div>
    <!-- shijian -->

    <!-- 分类导航 + 内容区域 -->
    <div class="category-container">
      <!-- 左侧分类导航 -->
      <div class="category-nav" ref="categoryNav">
        <div v-for="category in categories" :key="category.id" class="category-item" :class="{
          active: activeCategory === category.id,
          'has-new': category.hasNew
        }" @click="scrollToCategory(category.id)">
          <span>{{ category.title }}</span>

        </div>
      </div>

      <!-- 右侧内容区域 -->
      <div class="category-content" ref="contentWrapper">
        <!-- 景点门票 -->
        <div id="category-ticket" class="category-section" ref="sectionTicket">
          <div class="section-header">
            <h3 class="section-title">景点门票</h3>
            <!-- <span class="section-desc">多种票型可选</span> -->
          </div>

          <div v-if="productLists && productLists.length > 0">
            <div class="section-content">
              <!-- 门票列表 -->
              <div class="ticket-list">

                <div class="ticket-item" v-for="(item, index) in productLists" :key="index">
                  <div class="ticket-name"> {{ item.productName || item.name || item.title || '门票' }}</div>
                  <div class="ticket-left">
                    <div style="display: flex; justify-content: space-between;">
                      <div class="ticket-desc" @click="showTicketPopup(item)">
                        <span style="color: #1ac3ca;">随时退</span> | 无需换票

                        <div style="color: black;display: flex; align-items: center;">
                          购买须知
                          <div class="time-icon">
                            <img :src="mores" alt="更多" />
                          </div>
                        </div>
                      </div>



                      <div class="ticket-right">
                        <div class="price-box">
                          <div class="price">
                            <span class="price-symbol">¥</span>
                            <span class="price-value">
                               
                              {{ item.marketPrice ? calculatePrice(item.marketPrice) :  calculatePrice(item.salePrice) }}
                              <span
                                class="price-symbol">起</span></span>
                          </div>
                          <button class="buy-btn" @click="showTicketPopup(item)">
                            订
                          </button>
                        </div>
                      </div>
                    </div>

                    <!-- <div class="ticket-features">
                    <span 
                      v-for="feature in ticket.features" 
                      :key="feature" 
                      class="feature-tag"
                    >
                      {{ feature }}
                    </span>
                  </div> -->
                  </div>

                </div>
              </div>
            </div>
          </div>
          <div v-else class="empty-ticket">
            <span>已售罄</span>
          </div>



        </div>

        <!-- 详情介绍 -->
        <div id="category-detail" class="category-section" ref="sectionDetail">
          <div class="section-header">
            <h3 class="section-title">详情介绍</h3>

          </div>
          <div class="section-content">
            <div class="jdContent" v-if="travelScenicArea.poiDesc" v-html="travelScenicArea.poiDesc">
            </div>
            <div class="jdContent" v-else>暂无介绍</div>
          </div>
        </div>

        <!-- 开放时间 -->
        <div id="category-time" class="category-section" ref="sectionTime">
          <div class="section-header">
            <h3 class="section-title">开放时间</h3>

          </div>
          <div class="section-content">
            {{ travelScenicArea.openTimeDesc ? travelScenicArea.openTimeDesc : "暂未设置开放时间" }}
          </div>
        </div>
      </div>
    </div>

    <!-- 底部弹出层 -->
    <div class="popup-overlay" v-if="showPopup" @click="closePopup">
      <div class="popup-container" @click.stop>
        <!-- 加载状态 -->
        <div v-if="loadingPopup" class="popup-loading">
          <div class="loading-content">

            <div class="loading-text">加载中...</div>
          </div>
        </div>
        <!--  -->

        <div v-else class="popup-content">
          <!-- 头部 -->
          <div class="popup-header">
            <div class="popup-title">
              <h3>{{ productDetail.name }}</h3>

            </div>
            <button class="popup-close" @click="closePopup">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18" stroke="#666" stroke-width="2" stroke-linecap="round" />
                <path d="M6 6L18 18" stroke="#666" stroke-width="2" stroke-linecap="round" />
              </svg>
            </button>
          </div>

          <!-- 场次选择 -->
          <div class="popup-section">
            <div class="section-title">场次</div>
            <div class="session-select">

              <div class="session-name" v-if="priceList?.length">
                <div class="session-item" :class="{ active: resourceList?.name == item3?.name }"
                  v-for="(item3, index3) in priceList" :key="index3" @click="changeshowings(item3)">

                  {{ item3?.name || '' }} <span v-if="index3 == 0 && item3?.advanceBooking?.time">(最晚{{
                    item3.advanceBooking.time }})</span>
                </div>
              </div>




            </div>
          </div>

          <!-- 日期选择 -->
          <div class="popup-section">
            <div class="section-title">日期</div>
            <div class="date-select">
              <div v-if="resourceList?.resourceList?.[0]?.calendarDetailList?.length">
                <div class="dateBox canBook flex">

                  <div class="date-item"
                    :class="{ canBookLabel2: selectDate == item2?.date, dateItem2: !item2?.stock || item2.stock <= 0 }"
                    v-for="(item2, index2) in resourceList.resourceList[0].calendarDetailList" :key="index2"
                    @click="changeDate(item2, resourceList.resourceList[0])">
                    <div v-if="item2?.date">{{ getDayLabel(item2.date) }}
                      {{ item2.date.split(" ")[0]?.split("-").slice(1)?.join("-") || '' }}
                    </div>
                    <div class="price">￥{{ getDisplayPrice(item2) }}</div>
                  </div>
                </div>
              </div>
              <div class="date-items" v-else>
                {{ resourceList?.resourceList?.[0]?.calendarDetailList === null ? '已售罄' : '暂无日期' }}
              </div>
            </div>
          </div>

          <!-- 价格 -->
          <div class="popup-price" v-if="selectedTicket.price">
            <div class="price-title">￥{{ selectedTicket.price }}</div>
            <div class="price-subtitle">可订 {{ getDateRange() }}，预订成功后立即生效</div>
          </div>

          <!-- 预定说明 -->
          <div class="popup-instructions">
            <div class="instructions-title">预定说明</div>
            <div class="instructions-content">
              <div class="flex canBook" v-if="priceList?.length > 0">
                <div class="canBookLabel">最早可订</div>


                <div class="flex-1" v-if="resourceList?.resourceList?.[0]?.calendarDetailList?.length">
                  <!-- 修改这里的日期显示逻辑 -->
                  可订 {{ getEarliestAvailableDate() }}，
                  {{ productDetail?.bookingEffectiveTimeDescription || '' }}<br
                    v-if="productDetail?.bookingEffectiveTimeDescription">
                  （说明：日期为最早可订日期）您最晚可在游玩前1天
                  {{ resourceList?.advanceBooking?.time || '--' }}
                  (景区当地时间)前下单
                </div>
                <!-- <div class="flex-1" v-if="resourceList?.resourceList?.[0]?.calendarDetailList?.length">
                  可订
                  {{ resourceList.resourceList[0].calendarDetailList[0].date?.split(" ")[0]?.split(" -")?.slice(1)?.join("-")}}，
                  {{ productDetail?.bookingEffectiveTimeDescription || '' }}<br
                    v-if="productDetail?.bookingEffectiveTimeDescription">（说明：日期为最早可订日期）您最晚可在游玩前1天
                  {{ resourceList?.advanceBooking?.time || '--' }}
                  (景区当地时间)前下单

                </div> -->
                <div v-else>已售罄</div>

              </div>
              <div class="flex canBook">
                <div class="canBookLabel">无需换票</div>
                <div class="flex-1" v-html="productDetail.instruction"></div>
              </div>
              <div class="flex canBook">
                <div class="canBookLabel">随时退</div>
                <div class="flex-1" v-html="productDetail.refundDescription"></div>
              </div>

              <!--  -->
              <div class="instructions-title">品类说明</div>
              <div>
                <div class="flex canBook" v-if="productDetail.category">
                  <div class="canBookLabel">品类信息</div>
                  <div class="flex-1">{{ productDetail.category.categoryName }}</div>
                </div>
              </div>


              <div class="instructions-title">费用说明</div>
              <div class="flex tableBox">

                <div class="tableLeft tableRight">

                  <div class="tableth" v-for="(item, index) in productDetail.bandList" :key="index">
                    {{ item.bandTitle }}
                  </div>
                  <div class="tableth tableth3">
                    <div v-html="productDetail.inclusion"></div>
                  </div>
                </div>
              </div>



              <div class="explain explain2"> </div>
              <div class="flex tableBox">

                <div class="tableLeft tableRight">
                  <div class="tableTr">具体描述</div>
                  <div class="tableth">{{ productDetail.usageTime }}</div>
                </div>
              </div>
              <!--  -->

              <div class="explain explain2"> </div>
              <div>
                <div class="  otherBox" v-if="priceList.length > 0">
                  <div class="otherText">限购说明</div>
                  <div>每笔订单最多预定{{ priceList[0].resourceList[0].maxQuantity }}张</div>
                </div>
                <div class="  otherBox" v-if="productDetail.exclusion">
                  <div class="otherText">其他消费</div>
                  <div>{{ productDetail.exclusion }}</div>
                </div>
                <div class="  otherBox">
                  <div class="otherText">发票说明</div>
                  <div>此产品由景区开具发票，若有疑问，可在消费前联系景区确认开具方法。</div>
                </div>


                <div class="  otherBox" v-if="productDetail.attention">
                  <div class="otherText">注意事项</div>
                  <div v-html="productDetail.attention"></div>
                </div>
              </div>
              <!--  -->

            </div>
          </div>

          <!-- 底部按钮 -->
          <!-- 底部价格 + 按钮固定区域 -->
          <div class="popup-bottom-fixed">
            <div class="price-summary">
              <div class="price-total">
                <!-- <span class="total-label">总计：</span> -->
                <span class="total-price">¥{{ selectedTicket.price || '--' }}</span>
              </div>

            </div>
            <button class="fixed-buy-btn" @click="goToPurchase" :disabled="!selectedTicket.price">
              去购票
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import   { calculatePrice } from '@/utils/price'
import Swiper from 'swiper';
import 'swiper/css/swiper.min.css';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { scenicgetList } from "@/api/city";
import { getMovieDetail } from "@/api/newFilm";

moment.locale('zh-cn');

export default {
  data() {
    return {
      mores: require('@/assets/menpiao/genduo.png'),
      Areas: require('@/assets/menpiao/xing.png'),
      // 添加弹层加载状态
      loadingPopup: false,
      // 添加全局加载提示
      showLoadingToast: false,
      // 其他数据保持不变...
      selectDate: "",         // 选择的日期
      fullPrice: "--",        // 完整价格显示
      dateItem: {},          // 选择的日期对象
      resourceList: {},      // 当前选择的场次
      selectedTicket: {      // 选择的票务信息
        price: null,
        name: "",
        date: ""
      },
      productDetail: '',

      travelScenicArea: {}, productLists: [],
      trailers: [],
      id: "",
      cityid: "",
      // detailList: [],
      loadingflag: false,
      // workerList: [],
      showSt: "",
      swiperInstance: null,

      // 分类相关数据
      activeCategory: 'ticket',
      categories: [
        { id: 'ticket', title: '景点门票', hasNew: true },
        { id: 'detail', title: '详情介绍', hasNew: false },
        { id: 'time', title: '开放时间', hasNew: false }
      ],

      // 门票数据
      tickets: [
        {
          id: 1,
          name: '成人票',
          price: 38,
          description: '随时退，无需换票', relations: '购买须知',
          features: ['即买即用', '无需预约', '有效期至2024-12-31']
        },
        {
          id: 2,
          name: '儿童票',
          price: 20,
          description: '随时退，无需换票', relations: '购买须知',
          features: ['即买即用', '需监护人陪同', '有效期至2024-12-31']
        },
        {
          id: 3,
          name: '老人票',
          price: 20,
          description: '随时退，无需换票',
          relations: '购买须知',
          features: ['即买即用', '需携带身份证', '有效期至2024-12-31']
        }
      ],

      // Intersection Observer实例
      observer: null,
      sectionElements: {},

      // 弹出层相关
      showPopup: false,
      // selectedTicket: {},
      detailLists: '',
      productId: 0,
      priceList: [],
      packageID: "",
      appointmentTimes: "",
      resourceID: ''

    }
  },
  methods: {
     // 获取显示价格（已修改为增加10%）
    calculatePrice(price) {
      // 调用导入的工具函数
      return calculatePrice(price);
    },
    // 获取最早可用日期
    getEarliestAvailableDate() {
      if (!this.resourceList?.resourceList?.[0]?.calendarDetailList?.length) {
        return '--';
      }

      // 找到第一个有库存的日期
      const availableDate = this.resourceList.resourceList[0].calendarDetailList.find(item => item.stock > 0);

      if (!availableDate || !availableDate.date) {
        return '已售罄';
      }

      // 格式化日期显示
      const dateStr = availableDate.date;

      // 处理多种可能的日期格式
      let displayDate = '';

      // 尝试第一种格式：包含 " - " 分隔符
      if (dateStr.includes(' - ')) {
        const parts = dateStr.split(' - ');
        if (parts[0]) {
          // 只取第一部分（开始日期）
          const dateParts = parts[0].split('-');
          if (dateParts.length >= 3) {
            displayDate = `${dateParts[1]}-${dateParts[2]}`;
          }
        }
      }
      // 尝试第二种格式：标准的日期字符串
      else {
        const dateParts = dateStr.split(' ')[0]?.split('-');
        if (dateParts && dateParts.length >= 3) {
          displayDate = `${dateParts[1]}-${dateParts[2]}`;
        }
      }

      return displayDate || '--';
    },
    getDayLabel(dateStr) {
      const inputDate = new Date(dateStr);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      inputDate.setHours(0, 0, 0, 0);

      const diffTime = inputDate - today;
      const oneDay = 24 * 60 * 60 * 1000;

      if (diffTime === 0) {
        return '今天';
      } else if (diffTime === oneDay) {
        return '明天';
      } else {
        const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
        return weekdays[inputDate.getDay()];
      }
    },
    // 修改日期选择方法
    changeDate(item2, resourceItem) {
      // 如果库存不足，不选择
      if (item2.stock <= 0) return;

      this.selectDate = item2.date;
      this.dateItem = item2;


      // 更新 resourceID
      this.resourceID = resourceItem.resourceID;

      // 计算显示价格
      const displayPrice = this.getDisplayPrice(item2);
      this.fullPrice = displayPrice;

      // 更新选择的票务信息
      this.selectedTicket.price = displayPrice;
      this.selectedTicket.name = this.resourceList.name;
      this.selectedTicket.date = item2.date;
      this.selectedTicket.dateObj = item2;
      this.selectedTicket.resource = resourceItem;
    },
    // 获取显示价格
    getDisplayPrice(item) {
      return item.marketPrice ? calculatePrice( item.marketPrice) : calculatePrice (item.salePrice);
      // return item.salePrice;
    },

    // 修改场次选择方法
    // 修改场次选择方法
    changeshowings(item3) {
      console.log('选择场次:', item3);

      this.resourceList = item3;
      this.selectDate = "";
      this.fullPrice = "--";
      this.dateItem = {};

      // 更新 packageID 和 resourceID
      this.packageID = item3.packageID;

      // 如果有 resourceList，取第一个的 resourceID
      if (item3.resourceList && item3.resourceList.length > 0) {
        this.resourceID = item3.resourceList[0].resourceID;
      } else {
        this.resourceID = null;
      }

      // 如果有可用的日期，选择第一个
      if (item3.resourceList && item3.resourceList[0] &&
        item3.resourceList[0].calendarDetailList &&
        item3.resourceList[0].calendarDetailList.length > 0) {
        const firstDate = item3.resourceList[0].calendarDetailList[0];
        // 检查第一个日期是否有库存，如果没有则找下一个有库存的
        const availableDate = item3.resourceList[0].calendarDetailList.find(item => item.stock > 0);
        if (availableDate) {
          this.changeDate(availableDate, item3.resourceList[0]);
        } else {
          // 重置选择
          this.selectedTicket.price = null;
          this.selectedTicket.name = item3.name;
          this.selectedTicket.date = "";
        }
      } else {
        // 重置选择
        this.selectedTicket.price = null;
        this.selectedTicket.name = item3.name;
        this.selectedTicket.date = "";
      }
    },
    // changeshowings(item3) {
    //   console.log(item3)
    //   this.resourceList = item3;
    //   this.selectDate = "";
    //   this.fullPrice = "--";
    //   this.dateItem = {};

    //   // 如果有可用的日期，选择第一个
    //   if (item3.resourceList && item3.resourceList[0] &&
    //     item3.resourceList[0].calendarDetailList &&
    //     item3.resourceList[0].calendarDetailList.length > 0) {
    //     const firstDate = item3.resourceList[0].calendarDetailList[0];
    //     console.log()
    //     this.changeDate(firstDate, item3.resourceList[0]);
    //   } else {
    //     // 重置选择
    //     this.selectedTicket.price = null;
    //     this.selectedTicket.name = item3.name;
    //     this.selectedTicket.date = "";
    //   }
    // },
    // scenicGetist444() {
    //   const datalist = {
    //     "travelScenicAreaId": this.id
    //   };

    //   scenicgetList({
    //     data: JSON.stringify(datalist),
    //     interfaceCode: 'findProductTicketList',
    //   }).then(res => {
    //     this.loadingflag = false;

    //      console.log('接口4')
    //      console.log(res)


    //   })
    // },
    scenicGetist() {
      const datalist = {
        "travelScenicAreaId": this.id
      };

      scenicgetList({
        data: JSON.stringify(datalist),
        interfaceCode: 'findTravelScenicArea',
      }).then(res => {
        this.loadingflag = false;

        if (res.code == 200) {
          this.travelScenicArea = res.data.travelScenicArea;
          this.trailers.push({
            img: this.travelScenicArea.coverImageUrl
          })
          if (res.data.productLists == null || res.data.productLists == '') {
            this.productLists = [];
          } else {
            console.log(res.data.productLists)
            this.detailLists = res.data.list;
            this.productLists = res.data.productLists.filter(items => {
              return items.saleAvailable != false;
            })
            this.$nextTick(() => {
              this.initSwiper();
            });
          }

        } else {


        }


      })
    },
    // 初始化 Intersection Observer
    initIntersectionObserver() {
      const options = {
        root: this.$refs.contentWrapper,
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0
      };

      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.id.replace('category-', '');
            if (this.activeCategory !== id) {
              this.activeCategory = id;
              this.scrollCategoryToActive();
            }
          }
        });
      }, options);

      ['ticket', 'detail', 'time'].forEach(category => {
        const element = this.$refs[`section${category.charAt(0).toUpperCase() + category.slice(1)}`];
        if (element) {
          this.sectionElements[category] = element;
          this.observer.observe(element);
        }
      });
    },

    // 点击分类滚动到对应位置
    scrollToCategory(categoryId, event) {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }

      this.activeCategory = categoryId;

      const element = this.sectionElements[categoryId];
      const container = this.$refs.contentWrapper;

      if (element && container) {
        const containerRect = container.getBoundingClientRect();
        const elementRect = element.getBoundingClientRect();

        const scrollTop = elementRect.top - containerRect.top + container.scrollTop;

        container.scrollTo({
          top: scrollTop - 10,
          behavior: 'smooth'
        });
      }

      this.scrollCategoryToActive();
    },

    // 滚动左侧分类导航使当前激活项居中
    scrollCategoryToActive() {
      this.$nextTick(() => {
        const nav = this.$refs.categoryNav;
        const activeItem = nav.querySelector('.category-item.active');

        if (activeItem && nav) {
          const navHeight = nav.clientHeight;
          const itemOffset = activeItem.offsetTop;
          const itemHeight = activeItem.clientHeight;

          nav.scrollTo({
            top: itemOffset - (navHeight / 2) + (itemHeight / 2),
            behavior: 'smooth'
          });
        }
      });
    },

    // 显示门票弹出层

    async showTicketPopup(item) {
      console.log('点击订按钮');

      // 显示全局加载提示
      this.showLoadingToast = true;
      console.log('showLoadingToast:', true);

      this.productId = item.productID;

      // 重置选择状态
      this.selectDate = "";
      this.fullPrice = "--";
      this.dateItem = {};
      this.selectedTicket = {
        price: null,
        name: "",
        date: ""
      };

      try {
        // 设置弹层加载状态
        this.loadingPopup = true;
        console.log('loadingPopup:', true);

        // 立即显示弹层（但只显示加载状态）
        this.showPopup = true;
        console.log('showPopup:', true);

        document.body.style.overflow = 'hidden';

        // 添加一个短暂的延迟，确保用户能看到加载状态
        await new Promise(resolve => setTimeout(resolve, 300));

        // 获取产品详情
        await this.getProductDetail();

        console.log('数据加载完成');

      } catch (error) {
        console.error('加载失败:', error);
        this.$toast("加载失败，请重试");
        // 关闭弹层
        this.showPopup = false;
        this.loadingPopup = false;
      } finally {
        // 隐藏加载状态
        this.loadingPopup = false;
        this.showLoadingToast = false;
        console.log('loadingPopup:', false, 'showLoadingToast:', false);
      }
    },
    // 获取日期范围
    getDateRange() {
      if (!this.selectedTicket.date) return "--";

      const dateStr = this.selectedTicket.date.split(" ")[0];
      const parts = dateStr.split("-");
      if (parts.length >= 3) {
        return `${parts[1]}-${parts[2]}`;
      }
      return dateStr;
    },
    // 修改 getProductDetail 方法，使其返回 Promise
    getProductDetail() {
      return new Promise((resolve, reject) => {
        const datalist = {
          "productIds": this.productId
        };

        scenicgetList({
          data: JSON.stringify(datalist),
          interfaceCode: 'findProductDetail',
        }).then(res => {
          if (res.code == 200) {
            this.productDetail = res.data[0];
            this.getPriceList().then(() => {
              resolve();
            }).catch(reject);
          } else {
            reject(new Error('获取详情失败'));
          }
        }).catch(reject);
      });
    },
    // 修改 getPriceList 方法，使其返回 Promise
    getPriceList() {
      return new Promise((resolve, reject) => {
        const datalist = {
          "productId": this.productId
        };

        scenicgetList({
          data: JSON.stringify(datalist),
          interfaceCode: 'findPriceList'
        }).then(res => {
          if (res.code == 200) {
            this.priceList = res.data;
            // this.packageIDs = res.data[0].packageID;

            // 设置默认场次（第一个）
            if (this.priceList.length > 0) {
              this.resourceList = this.priceList[0];
              this.resourceID = this.resourceList.resourceList[0].resourceID;
              this.packageID = this.priceList[0].packageID;
              // 设置默认日期（第一个有库存的日期）
              if (this.resourceList.resourceList &&
                this.resourceList.resourceList[0] &&
                this.resourceList.resourceList[0].calendarDetailList) {

                const availableDate = this.resourceList.resourceList[0].calendarDetailList
                  .find(item => item.stock > 0);

                if (availableDate) {
                  this.changeDate(availableDate, this.resourceList.resourceList[0]);
                }
              }
            }
            resolve();
          } else {
            reject(new Error('获取价格列表失败'));
          }
        }).catch(reject);
      });
    },
    // 关闭弹出层
    closePopup() {
      this.showPopup = false;
      this.loadingPopup = false;

      // 恢复页面滚动
      document.body.style.overflow = '';
    },

    // 去购票
    // 去购票
    goToPurchase() {
      if (!this.selectedTicket.price) {
        this.$toast("请选择日期");
        return;
      }

      console.log('去购票:', this.selectedTicket);
      // 这里可以跳转到购票页面
      this.$router.push({
        path: "/hotlist",
        query: {
          id: this.$route.query.id,
          productId: this.productId,
          date: this.selectedTicket.date,
          price: this.selectedTicket.price,
          resourceName: this.priceList.length == 1 ? "00:00-23:55" : this.selectedTicket.name,//{this.priceList.length==1?"00:00-23:55":this.resourceList.name
          resourceID: this.resourceID,
          poiName: this.travelScenicArea.poiName,
          dateItem: this.dateItem,
          maxQuantity: this.priceList[0].resourceList[0].maxQuantity,
          product: this.productLists,
          packageID: this.packageID
        }
      });
      this.closePopup();
    },


    // 初始化 Swiper
    initSwiper() {
      if (this.trailers.length > 0) {
        this.$nextTick(() => {
          if (this.swiperInstance) {
            this.swiperInstance.destroy(true, true);
          }

          this.swiperInstance = new Swiper('.swiper-container', {
            direction: 'horizontal',
            loop: true,
            autoplay: {
              delay: 3000,
              disableOnInteraction: false,
            },
            pagination: {
              el: '.swiper-pagination',
              clickable: true,
            },
            effect: 'slide',
            speed: 600,
            touchRatio: 1,
            touchAngle: 45,
            grabCursor: true,
            observer: true,
            observeParents: true,
          });
        });
      }
    },

    // 原有的方法
    // getDetails() {
    //   getMovieDetail({
    //     movieId: this.id
    //   }).then(res => {
    //     this.loadingflag = false;
    //     if (res.code == 0) {
    //       this.detailList = res.data;
    //       this.workerList = res.data.workerList;
    //     } else {
    //       this.$toast("暂无数据");
    //       setTimeout(() => {
    //         this.$router.go(-1);
    //       }, 1000);
    //     }
    //   });
    // },
  },

  mounted() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    window.pageYOffset = 0;

    // this.getDetails();
    this.scenicGetist();

    // this.scenicGetist444();
    this.$nextTick(() => {
      this.initIntersectionObserver();
    });
  },

  beforeDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
    if (this.swiperInstance) {
      this.swiperInstance.destroy(true, true);
    }
    // 确保恢复页面滚动
    document.body.style.overflow = '';
  },

  created() {
    this.loadingflag = true;
    this.id = this.$route.query.id;
    this.cityid = this.$route.query.cityid;
    this.showSt = this.$route.query.showSt;
  },
};
</script>

<style scoped lang="less">
.time-icon {
  // margin-left: 8px;
  width: 14px;
  height: 14px;

  img {
    width: 100%;
    height: 100%;
  }
}

/* 弹层加载状态样式 - 增强版 */
.popup-loading {
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  background: rgba(0, 0, 0, 0.2) !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  z-index: 9999 !important;
  border-radius: 16px 16px 0 0 !important;

  .loading-content {
    text-align: center;
    padding: 20px;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 12px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  }



  .loading-text {
    font-size: 14px;
    color: #ffffff !important;
    font-weight: 500;
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

// add
/* 基础样式 */
.filmdetail {
  background-color: #F0F0F0;
  min-height: 100vh;
  // padding-bottom: 70px;
  box-sizing: border-box;
  font-size: 13px;
  overflow: hidden;
  /* 防止页面滚动 */
}

/* 轮播图样式 */
.headlogo {
  width: 100%;
  height: 180px;
  position: relative;

  .swiper-container {
    width: 100%;
    height: 100%;

    .swiper-wrapper {
      width: 100%;
      height: 100%;

      .swiper-slide {
        width: 100%;
        height: 100%;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
    }

    .swiper-pagination {
      position: absolute;
      bottom: 10px;
      left: 0;
      width: 100%;
      text-align: center;
      z-index: 10;

      /deep/ .swiper-pagination-bullet {
        width: 6px;
        height: 6px;
        background: rgba(255, 255, 255, 0.5);
        opacity: 1;
        margin: 0 4px;
        display: inline-block;

        &.swiper-pagination-bullet-active {
          background: #fff;
        }
      }
    }
  }
}

/* 景点信息样式 */
.spot-info {
  background: white;
  padding: 10px 10px 10px 10px;
  margin-bottom: 10px;

  .spot-title {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 4px;
    line-height: 1.2;
    color: #333;
  }

  .spot-rating {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;

    .score {
      color: #ffffff;
      font-size: 10px;
      margin-right: 6px;
      background-color: #2ccfcc;
      padding: 0px 2px;
      border-radius: 4px;
    }

    .category {
      color: #666666;
      font-size: 10px;
      margin-right: 6px;
      background-color: #f7f7f7;
      padding: 0px 2px;
      border-radius: 4px;
    }

    .popularity {
      display: flex;
      align-items: center;
      font-size: 12px;

      img {
        width: 14px;
        height: 14px;
      }
    }
  }

  .spot-address {

    background-color: #f5f5f5;
    border-radius: 4px;
    padding: 6px 10px;

    .address-title {
      color: #000000;
      font-size: 14px;
      font-weight: bold;
      margin-bottom: 5px;
    }

    .address-content {
      color: #666666;
      font-size: 14px;
      line-height: 1.4;
    }
  }
}

/* 分类容器样式 */
.category-container {
  display: flex;
  height: calc(100vh - 350px);
  min-height: 400px;
  background: white;
  border-radius: 0px;
  margin: 0px;
  overflow: hidden;

}

/* 左侧分类导航 */
.category-nav {
  width: 100px;
  background: #f8f9fa;
  overflow-y: auto;
  border-right: 1px solid #eee;

  .category-item {
    padding: 16px 12px;
    text-align: center;
    position: relative;
    cursor: pointer;
    transition: all 0.3s ease;
    border-left: 3px solid transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.02);
    }

    &.active {
      // background: linear-gradient(90deg, rgba(24, 144, 255, 0.1) 0%, transparent 100%);
      color: #000000;
      font-weight: 600;
      border-left-color: #000000;

      // .active-line {
      //   position: absolute;
      //   left: 0;
      //   top: 50%;
      //   transform: translateY(-50%);
      //   width: 3px;
      //   height: 20px;
      //   background: #1890ff;
      //   border-radius: 0 2px 2px 0;
      // }
    }

    // &.has-new::after {
    //   content: '';
    //   position: absolute;
    //   top: 10px;
    //   right: 10px;
    //   width: 6px;
    //   height: 6px;
    //   background: #ff4d4f;
    //   border-radius: 50%;
    // }

    span {
      font-size: 14px;
      line-height: 1.4;
      display: block;
    }
  }
}

/* 右侧内容区域 */
.category-content {
  flex: 1;
  overflow-y: auto;
  padding: 0 10px 15px 10px;
  background: white;

  .jdContent {

    width: 100%;
    overflow: hidden;

    /* 使用 ::v-deep 或 /deep/ */
    ::v-deep img {
      max-width: 100% !important;
      height: auto !important;
      display: block;
      margin: 10px 0;
    }

    /* 或者使用 /deep/ */
    /deep/ img {
      max-width: 100% !important;
      height: auto !important;
      display: block;
      margin: 10px 0;
    }
  }

  .category-section {
    .empty-ticket {
      span {
        background-color: #cccccc;
        padding: 8px 14px;
        border-radius: 4px;
        color: #ffffff;
      }
    }

    margin-bottom: 30px;
    // padding-bottom: 20px;
    // border-bottom: 1px solid #f0f0f0;

    &:last-child {
      border-bottom: none;
      margin-bottom: 0;
    }

    .section-header {
      margin-bottom: 20px;
      padding-bottom: 8px;
      border-bottom: 1px solid #f0f0f0;

      .section-title {
        font-size: 14px;
        font-weight: bold;
        color: #333;
        margin-bottom: 5px;
      }

      .section-desc {
        font-size: 13px;
        color: #999;
      }
    }

    .section-content {
      .ticket-list {
        .ticket-item {
          display: flex;
          flex-direction: column;
          // justify-content: space-between;
          padding-bottom: 10px;
          margin-bottom: 12px;
          // background: #fafafa;
          // border-radius: 8px;
          border-bottom: 1px solid #eee;
          // transition: all 0.3s;
          // cursor: pointer;

          &:hover {
            // background: #f5f5f5;
            // border-color: #d9d9d9;
            // transform: translateY(-2px);
            // box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          }

          .ticket-name {
            font-size: 14px;
            font-weight: 600;
            color: #333;
            margin-bottom: 6px;
          }

          .ticket-left {
            flex: 1;



            .ticket-desc {
              font-size: 13px;
              color: #666;
              // margin-bottom: 8px;
              line-height: 1.4;
            }

            .ticket-features {
              display: flex;
              flex-wrap: wrap;
              gap: 6px;

              // .feature-tag {
              //   padding: 2px 8px;
              //   background: #e6f7ff;
              //   color: #1890ff;
              //   border-radius: 12px;
              //   font-size: 12px;
              //   border: 1px solid #91d5ff;
              // }
            }
          }

          .ticket-right {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            justify-content: space-between;
            min-width: 70px;

            .price-box {
              // text-align: right;
              display: flex;
              align-items: center;

              .price {
                // margin-bottom: 8px;

                .price-symbol {
                  font-size: 10px;
                  color: #dd2c37;
                }

                .price-value {
                  font-size: 18px;

                  color: #dd2c37;

                }
              }

              .buy-btn {
                padding: 0px 8px;
                background: #42c6ca;
                color: white;
                border: none;
                font-weight: bold;
                border-radius: 4px;
                font-size: 14px;

                cursor: pointer;
                transition: all 0.3s;
                height: 30px;
                margin-left: 8px;

                &:hover {
                  background: #5dc8cb;
                  transform: scale(1.05);
                }

                &:active {
                  transform: scale(0.98);
                }
              }
            }
          }
        }
      }

      .detail-content {
        h4 {
          font-size: 14px;
          color: #333;
          margin: 15px 0 10px;
          padding-bottom: 8px;
          border-bottom: 1px solid #f0f0f0;
        }

        p {
          line-height: 1.6;
          color: #666;
          margin-bottom: 12px;
        }

        .feature-list {
          list-style: none;
          padding-left: 0;

          li {
            padding: 8px 0;
            border-bottom: 1px dashed #f0f0f0;
            color: #666;

            &:last-child {
              border-bottom: none;
            }
          }
        }
      }

      .time-content {
        h4 {
          font-size: 14px;
          color: #333;
          margin: 15px 0 10px;
          padding-bottom: 8px;
          border-bottom: 1px solid #f0f0f0;
        }

        .time-table {
          .time-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px dashed #f0f0f0;

            .time-label {
              color: #666;
            }

            .time-value {
              color: #333;
              font-weight: 500;
            }
          }
        }

        .notice-list {
          list-style: none;
          padding-left: 0;

          li {
            position: relative;
            padding-left: 15px;
            margin-bottom: 8px;
            color: #666;

            &::before {
              content: '•';
              position: absolute;
              left: 0;
              color: #ff6b00;
              font-size: 16px;
            }
          }
        }
      }
    }
  }
}

/* 底部弹出层样式 */
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  align-items: flex-end;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.popup-container {
  width: 100%;
  background: white;
  border-radius: 16px 16px 0 0;
  animation: slideUp 0.3s ease;
  max-height: 80vh;
  overflow-y: auto;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }

  to {
    transform: translateY(0);
  }
}

.popup-content {
  padding: 20px;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.popup-title {
  flex: 1;

  h3 {
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin: 0 0 4px 0;
  }

  .popup-subtitle {
    font-size: 14px;
    color: #666;
    margin: 0;
  }
}

.popup-close {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  margin: -8px -8px -8px 0;
}

.popup-section {
  // margin-bottom: 10px;

  .section-title {
    font-size: 14px;
    color: #666;
    margin-bottom: 10px;
    font-weight: 500;
  }
}

.session-select {
  display: inline-block;

  .session-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 16px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    margin-bottom: 8px;
    cursor: pointer;
    margin-right: 10px;

    &.active {
      border-color: #5dc8cb;
      background-color: #f4fbfb;
    }

    .session-name {
      font-size: 14px;
      color: #333;

    }

    .session-price {
      font-size: 14px;
      color: #5dc8cb;
      font-weight: 600;
    }
  }
}

.session-name {
  display: flex;
  flex-wrap: wrap;
}

.date-select {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 8px;

  .date-items {
    background-color: #cccccc;
    width: 80px;
    padding: 8px 8px;
    color: #ffffff;
    border-radius: 4px;
    text-align: center;
  }

  .date-item {
    flex: 0 0 auto;
    width: 80px;
    padding: 8px 8px;
    border: 1px solid #5dc8cb;
    border-radius: 8px;
    text-align: center;
    cursor: pointer;

    &.active {
      border-color: #5dc8cb;
      background-color: #f4fbfb;
    }

    .date-day {
      font-size: 14px;
      color: #333;
      margin-bottom: 4px;
    }

    .date-num {
      font-size: 16px;
      color: #dd2c37;
      font-weight: 600;
    }
  }
}

.popup-price {
  padding: 16px;
  background: linear-gradient(135deg, #fff8f2, #ffe8d9);
  border-radius: 12px;
  margin: 20px 0;

  .price-title {
    font-size: 28px;
    color: #ff6b00;
    font-weight: 700;
    margin-bottom: 4px;
  }

  .price-subtitle {
    font-size: 13px;
    color: #ff9500;
  }
}

.popup-instructions {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 20px;
  padding-bottom: 100px;

  .instructions-title {
    font-size: 16px;
    color: #333;
    font-weight: 600;
    margin-bottom: 12px;
  }

  .instructions-content {
    .instruction-item {
      margin-bottom: 12px;

      &:last-child {
        margin-bottom: 0;
      }

      .instruction-label {
        font-size: 14px;
        color: #666;
        margin-bottom: 4px;
        font-weight: 500;
      }

      .instruction-text {
        font-size: 13px;
        color: #666;
        line-height: 1.5;
      }
    }
  }
}

.popup-footer {
  padding: 16px 0;

  .buy-btn {
    width: 100%;
    height: 52px;
    background: linear-gradient(135deg, #ff6b00, #ff9500);
    border: none;
    border-radius: 26px;
    color: white;
    font-size: 17px;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 4px 16px rgba(255, 107, 0, 0.3);
    transition: all 0.3s;


    &:hover {
      background: linear-gradient(135deg, #ff9500, #ff6b00);
      transform: translateY(-2px);
    }

    &:active {
      transform: translateY(0);
      box-shadow: 0 2px 8px rgba(255, 107, 0, 0.2);
    }
  }
}

/* 滚动条样式 */
.category-nav::-webkit-scrollbar,
.category-content::-webkit-scrollbar,
.popup-container::-webkit-scrollbar {
  width: 4px;
}

.category-nav::-webkit-scrollbar-track,
.category-content::-webkit-scrollbar-track,
.popup-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 2px;
}

.category-nav::-webkit-scrollbar-thumb,
.category-content::-webkit-scrollbar-thumb,
.popup-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}

.category-nav::-webkit-scrollbar-thumb:hover,
.category-content::-webkit-scrollbar-thumb:hover,
.popup-container::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 底部固定区域 */
.popup-bottom-fixed {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  padding: 12px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid #f0f0f0;
  box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.08);
  z-index: 10;
  margin-top: auto;
  border-radius: 10px;
}

.price-summary {
  flex: 1;
}

.price-total {
  display: flex;
  align-items: baseline;
  margin-bottom: 4px;
}

.total-label {
  font-size: 14px;
  color: #666;
}

.total-price {
  font-size: 22px;
  font-weight: 700;
  color: #dd2c37;
  margin-left: 4px;
}

.price-instructions {
  font-size: 12px;
  color: #999;
  line-height: 1.4;
}

.fixed-buy-btn {
  min-width: 120px;
  height: 44px;
  background: #1fc4ca;
  border: none;
  border-radius: 22px;
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;

  margin-left: 16px;
  padding: 0 24px;
  flex-shrink: 0;

  &:hover {
    background: #1fc4ca;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 8px rgba(255, 107, 0, 0.2);
  }
}

/* 移除原来的 popup-footer 和 popup-price 相关样式，或者保留但不再使用 */
.popup-price {
  display: none;
  /* 或者删除原来的 popup-price 部分 */
}

.popup-footer {
  display: none;
  /* 或者删除原来的 popup-footer 部分 */
}

/* 确保弹出层内容区域有足够的底部间距，避免内容被固定区域遮挡 */
.popup-content {
  padding-bottom: 80px;
  /* 为固定按钮区域预留空间 */
  display: flex;
  flex-direction: column;
  min-height: 100%;
}

.tableTr,
.otherText {
  font-size: 14px;
  font-weight: bold;
  width: 80px;
}

.popup-instructions {
  margin-bottom: 0;
  /* 移除底部间距，因为固定区域会处理 */
}

/* 如果需要保持原来的一些样式，可以调整如下 */
.popup-container {
  width: 100%;
  background: white;
  border-radius: 16px 16px 0 0;
  animation: slideUp 0.3s ease;
  max-height: 80vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}


.canBook {
  display: flex;
  padding: 6px 0;
  // gap: 16px;
  font-size: 14px;
  color: #342C2C;

  align-items: flex-start;

  .canBookLabel {
    width: 60px;
    margin-right: 10px;
    display: inline-block;

    background: rgba(40, 175, 180, 0.25);

    border-radius: 4px;
    border: 1px solid #28AFB4;
    font-size: 14px;
    color: #28AFB4;

    padding: 0 6px;
    text-align: center;
  }

  .flex-1 {
    flex: 1;
  }

  .canBookLabel2 {
    background: rgba(40, 175, 180, 0.05);

    border-radius: 8px;
    border: 1px solid #28AFB4;
    // color: #28AFB4;

  }
}

.dateItem2 {
  opacity: 0.5;
  cursor: not-allowed !important;
  border-color: #ccc !important;
}

.fixed-buy-btn:disabled {
  background: #ccc !important;
  cursor: not-allowed !important;
  transform: none !important;
}

/* 更新日期选择样式 */
.date-select {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 8px;

  .date-item {
    flex: 0 0 auto;
    width: 80px;
    padding: 8px;
    border: 1px solid #5dc8cb;
    border-radius: 8px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s;

    &:hover:not(.dateItem2) {
      border-color: #28AFB4;
      background-color: rgba(40, 175, 180, 0.05);
    }

    &.canBookLabel2 {
      background-color: rgba(40, 175, 180, 0.1);
      border-color: #28AFB4;
      font-weight: 600;
    }

    .price {
      font-size: 16px;
      color: #dd2c37;
      font-weight: 600;
      margin-top: 4px;
    }
  }
}

/* 更新场次选择样式 */
.session-item {
  display: inline-flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-right: 10px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: all 0.3s;

  &.active {
    border-color: #5dc8cb;
    background-color: #f4fbfb;

  }

  &:hover:not(.active) {
    border-color: #28AFB4;
    background-color: rgba(40, 175, 180, 0.05);
  }
}

/* 更新价格显示样式 */
.popup-price {
  padding: 16px;
  background: linear-gradient(135deg, #f4fbfb, #e6f7ff);
  border-radius: 12px;
  margin: 20px 0;

  .price-title {
    font-size: 28px;
    color: #dd2c37;
    font-weight: 700;
    margin-bottom: 4px;
  }

  .price-subtitle {
    font-size: 13px;
    color: #666;
  }
}

/* 底部固定区域价格样式 */
.price-summary {
  .total-price {
    font-size: 22px;
    font-weight: 700;
    color: #dd2c37;
  }

  .price-instructions {
    font-size: 12px;
    color: #999;
    line-height: 1.4;
    margin-top: 2px;
  }
}
</style>