<template>
  <div class="cardorderinfo">
    <ReturnBack :rcolor="'#fff'" :bcolor="'#00000087'"></ReturnBack>
    <NProgress v-if="loadingflag"/>
    <div class="wrap">
      <div class="top" v-if="kaquan">
        <div class="flex">
          <div class="imgBox">
            <img class="img" v-if="kaquan" :src=" kaquan.img" alt="">
          </div>
          <div class="font">
            <div>{{ kaquan.title }}</div>
            <div class="gueige">{{  kaquan.gueige }}</div>
          </div>
        </div>
        <div class="number">×{{ orderDetail.number }}</div>
      </div>
      <!--    订单明细-->
      <div v-if="child.length>0">
        <div class="addressBox addressBox2" style="padding-top: 3px"  v-for="(item,index) in child" :key="item.id">
          <div class="orderInfo" >
            <div class="shopPrice shopPrice2" style="margin-top: 0" v-if="item.num">
              <div class="leftBoxx">
                <div class="shopPriceText shopPriceText2">卡号</div>
                <div class="price price2">{{ item.num }}</div>
              </div>
              <div class="price copy" @click="copyText(item.num)">复制</div>
            </div>
            <div class="shopPrice shopPrice2" style="margin-top: 0"
                 v-if="!item.pass.startsWith('http') && !item.pass.startsWith('https')">
              <div class="leftBoxx">
                <div class="shopPriceText shopPriceText2">密码</div>
                <div class="price price2">{{ item.pass }}</div>
              </div>
              <div class="price copy" @click="copyText(item.pass)">复制</div>
            </div>
            <div class="shopPrice shopPrice2" style="margin-top: 0;display: block;width: 100%;" v-else>
              <div class="leftBoxx" style="align-items: flex-start">
                <div class="shopPriceText shopPriceText2">链接</div>
                <div class="price price2">{{ item.pass }}</div>
              </div>
              <div class="leftBoxx" style="gap: 10px;justify-content: flex-end;margin-top: 8px">
                <div class="price copy" @click="copyText(item.pass)">复制</div>
                <div class="price copy" @click="openUrl(item.pass)">打开</div>
              </div>
            </div>
            <div class="shopPrice" style="justify-content: flex-start;gap: 8px"  v-if="kaquan">
              <div class="shopPriceText shopPriceText2">有效期至</div>
              <div class="price price2">{{ timestampToTime2(kaquan.end_time) }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="center1">
        <p>
          <span>订单状态</span>
          <span>交易成功</span>
        </p>
        <p>
          <span>充值帐号</span>
          <span>{{ orderDetail.phone }}</span>
        </p>
        <p>
          <span>商品金额</span>
          <span>￥{{ orderDetail.total_fee }}</span>
        </p>
        <p>
          <span>实付金额</span>
          <span style="color: red;">￥{{ orderDetail.total_fee }}</span>
        </p>
      </div>
      <div class="center2">
        <p>
          <span>下单时间：</span>
          <span>{{ timestampToTime(orderDetail.add_time) }}</span>
        </p>
        <p>
          <span>订单号码：</span>
          <span>{{ orderDetail.order_no }}</span>
        </p>
        <p v-if="orderDetail.fuli">
          <span>支付方式：</span>
          <span class="price" v-if="JSON.parse(orderDetail.fuli).filter(item=>item.id=='wx').length==JSON.parse(orderDetail.fuli).length">微信</span>
          <span class="price" v-if="JSON.parse(orderDetail.fuli).filter(item=>item.id=='wx').length>0&&JSON.parse(orderDetail.fuli).filter(item=>item.id=='wx').length!=JSON.parse(orderDetail.fuli).length">微信和福利卡</span>
          <span class="price" v-if="JSON.parse(orderDetail.fuli).filter(item=>item.id=='wx').length==0">福利卡</span>
        </p>
      </div>
      <a :href="kefu">
      <div class="bottom">
          <span>如有问题，请联系客服 全年无休(9:00-21:00)</span>

            <div class="kefu">
              <img class="img" src="../../assets/fukaxq/kf.png" alt="">
            </div>
      </div>
      </a>
    </div>
  </div>
</template>

<script>


import {getcardOrderList} from "@/api/locality/order";
// 获取客服
import {getLogo} from "@/api/locality/login"
export default {
  data() {
    return {
      orderDetail: {},
      kaquan: {},
      kefu:"",
      child:[],
      loadingflag:true
    };
  },
  mounted() {

  },
  methods: {
    copyText(text) {
      const input = document.createElement('input');
      input.value = text;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      this.$toast("已复制到剪贴板")
    },
    openUrl(url) {
      window.location.href = url
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
    timestampToTime2(time) {
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
      return y + '-' + MM + '-' + d
    },
    getmoveOrder(id) {
      let token = localStorage.getItem("token")
      getcardOrderList({
        token, id
      }).then(res => {
        this.loadingflag = false
        if (res.code == 200) {
          this.orderDetail = res.data.kqorder
          this.kaquan = res.data.kqorder.kaquan
          if(this.orderDetail.type==2){
            this.child = res.data.xunika
          }
        }
      })
    },
      getLoginInfo(){
        getLogo().then(res=>{
          if(res.code==200){
            this.kefu=res.data.zxkf
          }
      })
    },
  },
  created() {
    this.getLoginInfo()
    this.getmoveOrder(this.$route.query.id)
  }
};
</script>
<style scoped lang="less">
.cardorderinfo {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0px;
  background-color: #f0f0f0;
  padding: 10px;
  box-sizing: border-box;
}

.top {
  padding: 10px 15px;
  //margin-top: 10px;
  background: #fff;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.imgBox {
  width: 67px;
}

.top .font {
  margin-left: 10px;

}

.top .number {
  margin-left: 45px;
  margin-top: 30px;
  color: #AEAEAE;
  font-size: 15px;
}


.center1 {
  background: #fff;
  margin-top: 10px;
  border-radius: 10px;
  padding: 1px 0px;
}

.center1 p {
  display: flex;
  justify-content: space-between;
  font-size: 15px;
  margin: 15px;
}

.center1 p span:nth-of-type(1) {
  color: #333;

}


.center2 {
  background: #fff;
  margin-top: 10px;
  color: #AEAEAE;
  border-radius: 10px;
  padding: 1px 0px;
}

.center2 p {
  margin-left: 15px;
  font-size: 14px;
}

.bottom {
  background: #Fff;
  border-radius: 10px;
  margin-top: 10px;
  height: 40px;
  line-height: 40px;
  font-size: 14px;
  color: #AEAEAE;
  display: flex;
  padding: 0px 15px;

  align-items: center;
  justify-content: space-between;
}
.flex{
  display: flex;
  align-items: center;
}
.kefu{
  width: 18px;
  height: 18px;
  line-height: 18px;
}
.gueige{
  margin-top: 5px;
  font-size: 13px;
  color: #A7A7A7;
}
.addressBox {
  padding: 13px 10px;
  background-color: white;
  border-radius: 10px;

}

.addressBox2 {
  margin-top: 10px;
  padding: 13px 15px 15px;
  position: relative;
}
.orderInfo {
  .shopPrice {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 12px;
  }

  .shopPriceText {
    color: #828282;
    font-size: 14px;
    white-space: nowrap;
  }

  .price {
    font-size: 14px;
    color: #828282;
    word-break: break-all;
  }
}

.shopPriceText2 {
  color: #1a1a1a !important;
  font-weight: bold;
}

.leftBoxx {
  display: flex;
  align-items: center;
  gap: 20px;
}

.copy {
  color: white !important;
  background-color: #FF7675;
  border-radius: 30px;
  width: 44px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  font-size: 10px !important;
}

.shopPrice2 {
  border-bottom: 1px solid #F7F7F7;
  padding: 10px 0px;
}
</style>