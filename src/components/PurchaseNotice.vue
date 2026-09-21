<template>
  <div class="popup-overlay" v-if="show" @click="close">
    <div class="popup-container" @click.stop>
      <!-- 加载状态 -->
      <div v-if="loading" class="popup-loading">
        <div class="loading-content">
          <div class="loading-text">加载中...</div>
        </div>
      </div>

      <div v-else class="popup-content">
        <!-- 头部 -->
        <div class="popup-header">
          <div class="popup-title">
            <h3>{{ productDetail.name }}</h3>
          </div>
          <button class="popup-close" @click="close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18" stroke="#666" stroke-width="2" stroke-linecap="round" />
              <path d="M6 6L18 18" stroke="#666" stroke-width="2" stroke-linecap="round" />
            </svg>
          </button>
        </div>

        <!-- 场次选择 -->
        <div class="popup-section" v-if="showSession">
          <div class="section-title">场次</div>
          <div class="session-select">
            <div class="session-name" v-if="priceList?.length">
              <div class="session-item" 
                   :class="{ active: resourceList?.name == item3?.name }"
                   v-for="(item3, index3) in priceList" 
                   :key="index3" 
                   @click="changeshowings(item3)">
                {{ item3?.name || '' }} 
                <span v-if="index3 == 0 && item3?.advanceBooking?.time">
                  (最晚{{ item3.advanceBooking.time }})
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- 日期选择 -->
        <div class="popup-section" v-if="showDate">
          <div class="section-title">日期</div>
          <div class="date-select">
            <div v-if="resourceList?.resourceList?.[0]?.calendarDetailList?.length">
              <div class="dateBox canBook flex">
                <div class="date-item"
                     :class="{ 
                       canBookLabel2: selectDate == item2?.date, 
                       dateItem2: !item2?.stock || item2.stock <= 0 
                     }"
                     v-for="(item2, index2) in resourceList.resourceList[0].calendarDetailList" 
                     :key="index2"
                     @click="changeDate(item2, resourceList.resourceList[0])">
                  <div v-if="item2?.date">
                    {{ getDayLabel(item2.date) }}
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
        <div class="popup-price" v-if="showPrice && selectedTicket.price">
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
                可订 {{ getEarliestAvailableDate() }}，
                {{ productDetail?.bookingEffectiveTimeDescription || '' }}<br 
                  v-if="productDetail?.bookingEffectiveTimeDescription">
                （说明：日期为最早可订日期）您最晚可在游玩前1天
                {{ resourceList?.advanceBooking?.time || '--' }}
                (景区当地时间)前下单
              </div>
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

            <!-- 品类说明 -->
            <div class="instructions-title">品类说明</div>
            <div>
              <div class="flex canBook" v-if="productDetail.category">
                <div class="canBookLabel">品类信息</div>
                <div class="flex-1">{{ productDetail.category.categoryName }}</div>
              </div>
            </div>

            <!-- 费用说明 -->
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

            <div class="explain explain2"></div>
            <div class="flex tableBox">
              <div class="tableLeft tableRight">
                <div class="tableTr">具体描述</div>
                <div class="tableth">{{ productDetail.usageTime }}</div>
              </div>
            </div>

            <div class="explain explain2"></div>
            <div>
              <div class="otherBox" v-if="priceList.length > 0">
                <div class="otherText">限购说明</div>
                <div>每笔订单最多预定{{ priceList[0].resourceList[0].maxQuantity }}张</div>
              </div>
              <div class="otherBox" v-if="productDetail.exclusion">
                <div class="otherText">其他消费</div>
                <div>{{ productDetail.exclusion }}</div>
              </div>
              <div class="otherBox">
                <div class="otherText">发票说明</div>
                <div>此产品由景区开具发票，若有疑问，可在消费前联系景区确认开具方法。</div>
              </div>
              <div class="otherBox" v-if="productDetail.attention">
                <div class="otherText">注意事项</div>
                <div v-html="productDetail.attention"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { scenicgetList } from "@/api/city";

export default {
  name: 'PurchaseNotice',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    productId: {
      type: [String, Number],
      required: true
    },
    showSession: {
      type: Boolean,
      default: false
    },
    showDate: {
      type: Boolean,
      default: false
    },
    showPrice: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: false,
      productDetail: {},
      priceList: [],
      resourceList: {},
      selectDate: "",
      dateItem: {},
      selectedTicket: {
        price: null,
        name: "",
        date: ""
      }
    }
  },
  watch: {
    show(newVal) {
      if (newVal) {
        this.loadData();
      }
    }
  },
  methods: {
    async loadData() {
      this.loading = true;
      try {
        // 获取产品详情
        const datalist = {
          "productIds": this.productId
        };

        const res = await scenicgetList({
          data: JSON.stringify(datalist),
          interfaceCode: 'findProductDetail',
        });

        if (res.code == 200) {
          this.productDetail = res.data[0];
          
          // 获取价格列表
          await this.getPriceList();
        }
      } catch (error) {
        console.error('加载购买须知失败:', error);
        this.$toast("加载失败，请重试");
      } finally {
        this.loading = false;
      }
    },

    async getPriceList() {
      const datalist = {
        "productId": this.productId
      };

      const res = await scenicgetList({
        data: JSON.stringify(datalist),
        interfaceCode: 'findPriceList'
      });

      if (res.code == 200) {
        this.priceList = res.data;
        if (this.priceList.length > 0) {
          this.resourceList = this.priceList[0];
        }
      }
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

    getDisplayPrice(item) {
      return item.marketPrice ? item.marketPrice : item.salePrice;
    },

    getDateRange() {
      if (!this.selectedTicket.date) return "--";
      const dateStr = this.selectedTicket.date.split(" ")[0];
      const parts = dateStr.split("-");
      if (parts.length >= 3) {
        return `${parts[1]}-${parts[2]}`;
      }
      return dateStr;
    },

    getEarliestAvailableDate() {
      if (!this.resourceList?.resourceList?.[0]?.calendarDetailList?.length) {
        return '--';
      }
      const availableDate = this.resourceList.resourceList[0].calendarDetailList.find(item => item.stock > 0);
      if (!availableDate || !availableDate.date) {
        return '已售罄';
      }
      const dateStr = availableDate.date;
      let displayDate = '';
      if (dateStr.includes(' - ')) {
        const parts = dateStr.split(' - ');
        if (parts[0]) {
          const dateParts = parts[0].split('-');
          if (dateParts.length >= 3) {
            displayDate = `${dateParts[1]}-${dateParts[2]}`;
          }
        }
      } else {
        const dateParts = dateStr.split(' ')[0]?.split('-');
        if (dateParts && dateParts.length >= 3) {
          displayDate = `${dateParts[1]}-${dateParts[2]}`;
        }
      }
      return displayDate || '--';
    },

    changeshowings(item3) {
      this.resourceList = item3;
      this.selectDate = "";
      this.dateItem = {};
    },

    changeDate(item2, resourceItem) {
      if (item2.stock <= 0) return;
      this.selectDate = item2.date;
      this.dateItem = item2;
      this.selectedTicket.price = this.getDisplayPrice(item2);
      this.selectedTicket.name = this.resourceList.name;
      this.selectedTicket.date = item2.date;
    },

    close() {
      this.$emit('close');
    }
  }
};
</script>

<style scoped lang="less">
/* 复制详情页的弹窗样式 */
.tableth,.otherBox{
  color: #342C2C;font-size: 14px;
}
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
  from { opacity: 0; }
  to { opacity: 1; }
}

.popup-container {
  width: 100%;
  background: white;
  border-radius: 16px 16px 0 0;
  animation: slideUp 0.3s ease;
  max-height: 80vh;
  overflow-y: auto;
}

.popup-content {
  padding: 20px;
  padding-bottom: 80px;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.popup-title h3 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 4px 0;
}

.popup-close {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  margin: -8px -8px -8px 0;
}

.popup-section {
  margin-bottom: 10px;
}

.section-title {
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
  font-weight: 500;
}

.session-select {
  display: inline-block;
}

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
}

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
  
  &.canBookLabel2 {
    background: rgba(40, 175, 180, 0.05);
    border-radius: 8px;
    border: 1px solid #28AFB4;
  }
}

.dateItem2 {
  opacity: 0.5;
  cursor: not-allowed !important;
  border-color: #ccc !important;
}

.popup-price {
  padding: 16px;
  background: linear-gradient(135deg, #f4fbfb, #e6f7ff);
  border-radius: 12px;
  margin: 20px 0;
}

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

.popup-instructions {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 20px;
}

.instructions-title {
  font-size: 16px;
  color: #333;
  font-weight: 600;
  margin-bottom: 12px;
}

.canBook {
  display: flex;
  padding: 6px 0;
  font-size: 14px;
  color: #342C2C;
  align-items: flex-start;
}

.canBookLabel {
  width: 60px;
  margin-right: 10px;
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

.tableBox {
  margin-bottom: 16px;
}

.otherBox {
  margin-bottom: 12px;
}

.otherText {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 4px;
}

/* 加载状态样式 */
.popup-loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  border-radius: 16px 16px 0 0;
}

.loading-content {
  text-align: center;
  padding: 20px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.loading-text {
  font-size: 14px;
  color: #ffffff;
  font-weight: 500;
}

.popup-container::-webkit-scrollbar {
  width: 4px;
}

.popup-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 2px;
}

.popup-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}

.popup-container::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>