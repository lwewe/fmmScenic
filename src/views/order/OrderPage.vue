<template>
  <div class="orderpage">
    <!-- <ReturnBack :rcolor="'#fff'" :bcolor="'#00000087'"></ReturnBack> -->
    <NProgress v-if="loadingflag" />
    <div class="topBox">
      <div style="font-size: 18px; line-height: 1.5;font-weight: bold;">{{ orderDetail.order_show.name }}</div>
      <div class="flex-b">
        <div>{{ orderDetail.order_show.third_party_status }}<span class="color1">￥</span><span
            class="color2">{{ orderDetail.order_show.total_price }}</span></div>
        <div> </div>
      </div>

      <div class="codeImg" v-if="qrcode != null">
         
        <img :src="qrcode" alt="">
      </div>
      <!--  -->

      <div class="details_top">
        <div class="flex-b"> <span>{{ orderDetail.order_show.piaotype }}</span> 
        <span style="width: 80px;text-align: right;">x{{
          orderDetail.order_show.passenger_data.length }}</span></div>
        <div class="flex-com mt10">
          <span class="w100">使用时间</span><span class="flex-1">{{ formatUseDate(orderDetail.order_show.resource_data[0].useDate) }}</span>

        </div>
        
        <div class="flex-com">

          <span class="w100">出游人</span>
        <div class="flex-1">
          <div v-for="(passenger, index) in orderDetail.order_show.passenger_data" :key="index" class="passenger-item">
              <div class="passenger-name">{{ getPassengerName(passenger) }}</div>
              <div class="passenger-id">{{ getPassengerId(passenger) }}</div>
            </div>
        </div>
          
        </div>

        <div class="flex-com">

          <span class="w100">包含项目</span>
          <div class="flex-1">
             <div class="project-item">景区门票 {{ orderDetail.order_show.passenger_data.length }}张</div>
            <div class="project-note" v-if="orderDetail.order_show.tickinfo">
              备注: {{ extractUseInfo(orderDetail.order_show.tickinfo) }}
            </div>
          </div>
        </div>

      </div>
      <div class="details_center">

        <div>
          <h2><img :src="imgicon" alt="" class="img1">入园说明</h2>
          <div class="pl14" v-if="orderDetail.order_show.tickinfo">
            {{ extractUseMethod(orderDetail.order_show.tickinfo) }}
            <!-- {{ orderDetail.order_show.travel_order_detail[0].voucherInfoList[0].voucherDescription }} -->
          </div>
          <div class="pl14" v-else>凭身份证至景区检票口验证使用</div>
        </div>
 <!-- <div>
          <h2><img :src="imgicon" alt="" class="img1">使用方法</h2>
          <div class="pl14">
            {{ orderDetail.order_show.travel_order_detail[0].productUseMsg }}
          </div>
        </div> -->
        <div>
          <h2><img :src="imgicon" alt="" class="img1">退改规则</h2>
          <div class="pl14">
           一笔订单多张票，不支持部分退款如需部分退，请申请取消后重新预订。<br>
            下单后不支持改期，如需修改，请申请取消后重新预订。<br>
            未使用可随时申请全额退款。
            <!-- <div v-if="orderDetail.order_show.unsubscribe === '1'" class="refund-info">
              退票手续费: ¥{{ orderDetail.order_show.unsubscribe_price }}
            </div> -->
          </div>
        </div>


        <div >
          <h2><img :src="imgicon" alt="" class="img1">订单编号</h2>
          <!-- <div class="pl14">{{ orderDetail.order_show.order_no}}</div> -->
           <div class="order-number pl14" @click="copyOrderNo">
          {{ orderDetail.order_show.order_no }}
          <van-icon name="description" size="14" style="margin-left: 5px;" />
        </div>
        </div>


      </div>
      <!--  -->

    </div>

  </div>
</template>

<script>
//引入
import moment from 'moment';
import 'moment/locale/zh-cn';

moment.locale('zh-cn');
import { getmoveOrderList } from "@/api/locality/order";
// import { getCinemaDetail } from "@/api/cinema";
import QRCode from "qrcode";

export default {

  data() {
    return {
       
    
      orderDetail: {
        order_show: {
          resource_data: [{}],
          passenger_data: []
        },
        order: {}
      },
      
      showQrCode: false,
      qrcode: '',
      imgs: require('@/assets/menpiao/ww.png'),
      imgicon: require('@/assets/menpiao/lvdd.png'),
      // orderDetail: [],
      order: {},
      ordertime: "",
      single: {},
      // 选择的座位列表
      seatlist: [],
      // 开始日期
      playdata: "",
      // 开始时间
      playtime: "",
      // 订单状态
      orderstatus: "",
      // 取票列表
      tickcodelist: [],
      timestamp: "",
      info: "",
      loadingflag: false
    };
  },
  mounted() {
    this.timestamp = moment(new Date()).format('yyyy-MM-DD HH:mm:ss');
  },

  methods: {
    // 身份证号脱敏方法
maskIdCard(idCard) {
  if (!idCard || idCard.length < 15) return idCard;
  
  // 18位身份证：保留前6位和后4位，中间用星号替换
  if (idCard.length === 18) {
    return idCard.substring(0, 6) + '********' + idCard.substring(14);
  }
  
  // 15位身份证：保留前6位和后3位，中间用星号替换
  if (idCard.length === 15) {
    return idCard.substring(0, 6) + '******' + idCard.substring(12);
  }
  
  // 其他格式：保留前4位和后4位
  if (idCard.length > 8) {
    const visibleStart = Math.min(4, Math.floor(idCard.length / 3));
    const visibleEnd = Math.min(4, Math.floor(idCard.length / 3));
    const stars = '*'.repeat(idCard.length - visibleStart - visibleEnd);
    return idCard.substring(0, visibleStart) + stars + idCard.substring(idCard.length - visibleEnd);
  }
  
  return idCard;
},
    // 复制订单号
  copyOrderNo() {
    const orderNo = this.orderDetail.order_show.order_no;
   
      // 使用vue-clipboard2
      this.$copyText(orderNo).then(
        () => {
          // 复制成功
          this.$toast({
            message: '订单号已复制',
            duration: 2000
          });
          
          // 添加成功动画
          this.showCopySuccess();
        },
        (err) => {
          // 复制失败，使用降级方案
          console.error('复制失败:', err);
          this.fallbackCopy(orderNo);
        }
      );
  },
    // 获取二维码
    getQRCode(qrCode) {
      let opts = {
        errorCorrectionLevel: "H", //容错级别
        type: "image/png", //生成的二维码类型
        quality: 0.3, //二维码质量
        margin: 0, //二维码留白边距
        width: 150, //宽
        height: 150, //高
        color: {
          dark: "#000000", //前景色
          light: "#fff", //背景色
        },
      }
      if (this.orderDetail.type == 1) {
        let msg = document.getElementById("QRCode_header");
        // 将获取到的数据(val)画到msg(canvas)上
        QRCode.toCanvas(msg, qrCode, opts, function (error) {
          if (error) {
            // console.log("二维码加载失败", error);
            this.$toast("二维码加载失败");
          }
        })
      } else {
        this.order.ticketCode.split(",").forEach((item, index) => {
          let msg = document.getElementById("QRCode_header-" + index);
          // 将获取到的数据(val)画到msg(canvas)上
          QRCode.toCanvas(msg, item, opts, function (error) {
            if (error) {
              // console.log("二维码加载失败", error);
              this.$toast("二维码加载失败");
            }
          })
        })
      }

    },
    timestampToTime(time) {
      // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var date = new Date(time * 1000)
      let y = date.getFullYear()
      let MM = date.getMonth() + 1
      MM = MM < 10 ? ('0' + MM) : MM
      let d = date.getDate()
      d = d < 10 ? ('0' + d) : d
      let h = date.getHours()
      h = h < 10 ? ('0' + h) : h
      let m = date.getMinutes()
      m = m < 10 ? ('0' + m) : m
      let s = date.getSeconds()
      s = s < 10 ? ('0' + s) : s
      return y + '-' + MM + '-' + d + " " + h + ":" + m + ":" + s
    },
    // getmoveOrder(id) {
    //   let token = localStorage.getItem("token")
    //   let qrCode = ""
    //   getmoveOrderList({
    //     token, id
    //   }).then(res => {
    //     this.loadingflag = false
    //     if (res.code == 200) {

    //       this.orderDetail = res.data;
    //       this.qrcode = res.data.order.qrcode;
    //     }
    //   })
    // },
    gozhifu() {
      var id = this.$route.query.id
      this.$router.push({ path: "/paymentpage", query: { order: id, change: 0 } })
    },
     // 格式化下单时间
    formatOrderTime(timestamp) {
      if (!timestamp) return '暂无';
      const date = new Date(timestamp * 1000);
      const y = date.getFullYear();
      const MM = String(date.getMonth() + 1).padStart(2, '0');
      const d = String(date.getDate()).padStart(2, '0');
      const h = String(date.getHours()).padStart(2, '0');
      const m = String(date.getMinutes()).padStart(2, '0');
      return `${y}-${MM}-${d} ${h}:${m}`;
    },
    
    // 格式化使用日期（处理 /Date()/ 格式）
    formatUseDate(dateStr) {
      if (!dateStr) return '暂无';
      
      // 如果是 /Date(1766419200000+0800)/ 格式
      if (dateStr.startsWith('/Date(')) {
        const matches = dateStr.match(/\/Date\((\d+)/);
        if (matches && matches[1]) {
          const timestamp = parseInt(matches[1]);
          const date = new Date(timestamp);
          const y = date.getFullYear();
          const MM = String(date.getMonth() + 1).padStart(2, '0');
          const d = String(date.getDate()).padStart(2, '0');
          return `${y}-${MM}-${d}`;
        }
      }
      
      // 如果是普通日期字符串
      if (dateStr.includes('-')) {
        return dateStr;
      }
      
      // 尝试直接解析
      try {
        const date = new Date(dateStr);
        if (!isNaN(date.getTime())) {
          return date.toLocaleDateString();
        }
      } catch (e) {
        console.error('日期解析错误:', e);
      }
      
      return dateStr;
    },
    
    // 获取乘客姓名
    getPassengerName(passenger) {
      if (!passenger || !passenger.questionAnswerList) return '未知';
      const nameQuestion = passenger.questionAnswerList.find(
        q => q.questionCode === 'P_CNAME'
      );
      return nameQuestion && nameQuestion.answerList.length > 0 
        ? nameQuestion.answerList[0] 
        : '未知';
    },
    
    // 获取乘客身份证
    getPassengerId(passenger) {
      if (!passenger || !passenger.questionAnswerList) return '';
      const idQuestion = passenger.questionAnswerList.find(
        q => q.questionCode === 'P_ID_CARD'
      );
      // return idQuestion && idQuestion.answerList.length > 0 
      //   ? idQuestion.answerList[0] 
      //   : '';
      if (idQuestion && idQuestion.answerList.length > 0) {
    const idCard = idQuestion.answerList[0];
    // 身份证脱敏处理
    return this.maskIdCard(idCard);
  }
    },
    
    // 提取使用方法
    extractUseMethod(tickinfo) {
      if (!tickinfo) return '凭身份证至景区检票口验证使用';
      // 从 tickinfo 中提取使用方法
      if (tickinfo.includes('使用方法：')) {
        const start = tickinfo.indexOf('使用方法：') + 5;
        const end = tickinfo.indexOf('使用时间：') > -1 ? tickinfo.indexOf('使用时间：') : tickinfo.length;
        return tickinfo.substring(start, end).trim();
      }
      return tickinfo;
    },
    
    // 提取使用信息
    extractUseInfo(tickinfo) {
      if (!tickinfo) return '';
      // 简单返回 tickinfo，可以根据需要进一步处理
      return tickinfo;
    },
    
    // 获取订单详情
    getmoveOrder(id) {
      this.loadingflag = true;
      const token = localStorage.getItem("token");
      
      getmoveOrderList({ token, id }).then(res => {
        this.loadingflag = false;
        if (res.code === 200) {
          this.orderDetail = res.data;
          
          // 设置二维码
          this.qrcode = res.data.order.qrcode || null;
          this.showQrCode = !!this.qrcode;
          
          console.log('订单详情:', this.orderDetail);
        } else {
          this.$toast('获取订单详情失败');
        }
      }).catch(error => {
        this.loadingflag = false;
        console.error('获取订单详情错误:', error);
        this.$toast('获取订单详情失败');
      });
    },
  },
  created() {
    //加载
    this.loadingflag = true
    this.getmoveOrder(this.$route.query.id)
    var s = ''
  }
};
</script>
<style scoped lang="less">
.orderpage {
  font-size: 14px;
  min-height: 100vh;
  box-sizing: border-box;
  background: #f7f7f7 url(../../assets/menpiao/dpback.png) top no-repeat;
}

.footer {
  padding: 0px 10px 10px;

  .orderphoneinfo {
    border-radius: 10px;
    background-color: white;
    padding: 15px 20px;
    font-size: 13px;
    line-height: 18px;
    color: #828282;
  }

  .notice {
    margin-top: 10px;
  }
}

.titleText {
  font-weight: bold;
  font-size: 17px;
  color: black;
}

.topBox {
  .codeImg {
    text-align: center;
    margin: 20px;

    img {
      width: 120px;
      height: 120px;
    }
  }

  .flex-b {
    display: flex;
    justify-content: space-between;

    .color1 {font-size: 12px;
      color: #c52622;
      font-weight: bold;
    }
    .color2{
      color: #c52622;font-size: 16px;
      font-weight: bold;
    }
  }

  .mt10 {
    margin-top: 10px;
  }

  .flex-com {
    margin-top: 6px;
    line-height: 1.5;
    display: flex;

    .w100 {
      width: 75px;
    }

    .flex-1 {
      flex: 1;
      color: #565656;
    }
  }

  padding: 15px 10px 10px;

  .details_center {
    padding: 10px;
    background-color: #ffffff;
    margin-bottom: 10px;
    border-radius: 10px;

    .pl14 {
      padding-left: 14px;
      color: #565656;
    }

    .img1 {
      width: 14px;
    }

    h2 {
      font-size: 14px;
    }
  }

  .details_top {
    margin-top: 10px;
    padding: 10px;
    background-color: #ffffff;
    margin-bottom: 10px;
    border-radius: 10px;
  }

}
.passenger-item,.order-number{
  display: flex;
}
.order-number{
  align-items: center;
}
</style>