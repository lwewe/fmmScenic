<template>
  <div class="orderpage">
    <ReturnBack :rcolor="'#fff'" :bcolor="'#00000087'"></ReturnBack>
    <NProgress v-if="loadingflag"/>
    <div class="topBox">
      <div class="header">
        <div class="cinemaname">{{ orderDetail.cinemaname }}</div>
        <div class="orderinfo">
          <div class="topIcon"></div>
          <div class="movieBox">
            <div class="movieLeft">
              <div class="moviename">{{ orderDetail.moviename }}</div>
              <div class="edition">{{ orderDetail.edition }} &nbsp; {{ orderDetail.quantity }}张</div>
              <div class="centerBox">
                <div class="playdataBox">
                  <div class="playdata">{{ playdata }}</div>
                  <div class="playtime">{{ playtime }}开场</div>
                </div>
                <div>
                  <div class="roomname">{{ orderDetail.roomname }}</div>
                  <div v-if="orderDetail.seats" class="seats" :class="{seats2:orderDetail.seats.split(',').length>2}">
                    <div v-for="(item,index) in orderDetail.seats.split(',')" :key="index" class="seats">
                      <div class="line" v-if="(index+1)%2==0"></div>
                      <div> {{ item }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="movielogo">
              <img class="img" :src="orderDetail.movielogo" alt="">
            </div>
          </div>
          <div class="xLine">
            <div class="cicle"></div>
            <div class="cicle cicle2"></div>
          </div>
          <!--          提示-->
          <div class="tipis" v-if="orderDetail.type==1">
          <span v-if="orderstatus=='N'">
            <span @click="gozhifu()">去支付</span>
          </span>
            <div v-if="orderstatus=='C'">
              已取消
            </div>
            <!-- E -->
            <div v-if="orderstatus=='E'">
              订单失效
            </div>
            <div v-if="orderstatus=='P'">
              待出票
            </div>
            <div v-if="orderstatus=='T'">
              处理中
            </div>
            <!-- S -->
            <div v-if="orderstatus=='S'">
              <div class="qrBox" v-if="order.ticketcodeList.length>0">
                <div class="qrText">二维码取票</div>
                <div class="qrcode">
                  <canvas id="QRCode_header" class="img"></canvas>
                </div>
                <div>取票号: <span v-for="item in order.ticketcodeList[0]" :key="item.value">{{item.value+"|"}}</span></div>
              </div>
            </div>
            <div v-if="orderstatus=='F'">
              出票失败
            </div>
            <div v-if="orderstatus=='R'">
              已退款
            </div>
          </div>
          <div class="tipis" v-else>
            <div class="time" v-if="orderstatus==0">待付款</div>
            <div class="otherType" v-if="orderstatus==1">待出票</div>
            <div class="otherType" v-if="orderstatus==2">已取消</div>
<!--            v-if="orderstatus==4"-->
            <div class="otherType" v-if="orderstatus==4">
<!--              <div class="qrBox">-->
<!--                <div class="qrText">二维码取票</div>-->
<!--                <div class="qrcode">-->
<!--                  <canvas id="QRCode_header" class="img"></canvas>-->
<!--                </div>-->
<!--              </div>-->
              <div class="qrBox" v-if="order.ticketCode">
                <div class="qrText">二维码取票</div>
                <div class="qrcode" v-for="(item,index) in order.ticketCode.split(',')" :key="item">
                 <div>
                   <canvas :id="'QRCode_header-' + index"  class="img"></canvas>
                 </div>
                  <div style="margin-top: 5px">取票号:{{item}}</div>
                </div>
              </div>
            </div>
            <div class="otherType" v-if="orderstatus==7">出票失败(退款)</div>
            <div class="otherType" v-if="orderstatus=='8'">超时未付(取消)</div>
            <div class="otherType" v-if="orderstatus=='11'">正在出票</div>
          </div>
        </div>
      </div>
      <div class="orderdetail">
        <div class="titleText">订单详情</div>
        <div class="contentBox">
          <p v-if="orderDetail.type==1">
            <span>订单状态:</span>&nbsp;&nbsp;
            <span class="colorback" v-if="orderstatus=='N'">
            待支付
          </span>
            <span class="colorback" v-if="orderstatus=='C'">
            已取消
          </span>
            <span class="colorback" v-if="orderstatus=='E'">
            订单失效
          </span>
            <span class="colorback" v-if="orderstatus=='P'">
            待出票
          </span>
            <span class="colorback" v-if="orderstatus=='T'">
            处理中
          </span>
            <span class="colorback" v-if="orderstatus=='S'">
            出票成功
          </span>
            <span class="colorback" v-if="orderstatus=='F'">
            出票失败
          </span>
            <span class="colorback" v-if="orderstatus=='R'">
            已退款
          </span>
          </p>
          <p v-else>
            <span>订单状态:</span>&nbsp;&nbsp;
            <span class="colorback" v-if="orderstatus==0">待付款</span>
            <span class="colorback" v-if="orderstatus==1">待出票</span>
            <span class="colorback" v-if="orderstatus==1">已取消</span>
            <span class="colorback" v-if="orderstatus==4">出票成功</span>
            <span class="colorback" v-if="orderstatus==7">出票失败(退款)</span>
            <span class="colorback" v-if="orderstatus=='8'">超时未付(取消)</span>
            <span class="colorback" v-if="orderstatus=='11'">正在出票</span>
          </p>
          <p>
            <span>应付金额:</span>&nbsp;&nbsp;
            <span class="colorback">￥{{ orderDetail.showamount }} ({{ orderDetail.quantity }}张电影票)</span>
          </p>
          <p>
            <span>手机号码:</span>&nbsp;&nbsp;
            <span class="colorback">{{ orderDetail.mobile }}</span>
          </p>
          <p>
            <span>订单号码:</span>&nbsp;&nbsp;
            <span class="colorback">{{ orderDetail.order_id }}</span>
          </p>
          <p>
            <span>订单时间:</span>&nbsp;&nbsp;
            <span class="colorback">{{ ordertime }}</span>
          </p>
        </div>
      </div>
    </div>
    <div class="footer">
      <div class="orderphoneinfo" v-if="order.smscontent">
        <span>取票短信: {{ order.smscontent }}</span>
      </div>
      <div class="orderphoneinfo" :class="{notice:order.smscontent}">
        <div class="titleText">{{ single.title }}</div>
        <div class="single" v-html="single.content"></div>
      </div>
    </div>
  </div>
</template>

<script>
//引入
import moment from 'moment';
import 'moment/locale/zh-cn';

moment.locale('zh-cn');
import {getmoveOrderList} from "@/api/locality/order";
import {getCinemaDetail} from "@/api/cinema";
import QRCode from "qrcode";

export default {

  data() {
    return {
      orderDetail: [],
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
      if(this.orderDetail.type==1){
        let msg = document.getElementById("QRCode_header");
        // 将获取到的数据(val)画到msg(canvas)上
        QRCode.toCanvas(msg, qrCode, opts, function (error) {
          if (error) {
            // console.log("二维码加载失败", error);
            this.$toast("二维码加载失败");
          }
        })
      }else {
        this.order.ticketCode.split(",").forEach((item,index) =>{
          let msg = document.getElementById("QRCode_header-"+index);
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
    getmoveOrder(id) {
      let token = localStorage.getItem("token")
      let qrCode = ""
      getmoveOrderList({
        token, id
      }).then(res => {
        this.loadingflag = false
        if (res.code == 200) {
          if (res.data == "") {
          } else {
            this.orderDetail = res.data.order_show
            this.single = res.data.single
            // 获取播放日期
            this.playdata = this.orderDetail.playtime.substring(0, 10)
            // 获取播放开始时间
            this.playtime = this.orderDetail.playtime.substring(10, this.orderDetail.playtime.length - 3)
            if (res.data.order) {
              this.order = res.data.order
              // 获取订单状态
              this.orderstatus = this.order.orderstatus||this.order.orderState
              // if(){
              //   this.orderstatus =this.order.orderState
              // }
              // 获取取票列表
              if (this.order.ticketcodeList) {
                this.tickcodelist = this.order.ticketcodeList[0]
              }
              this.tickcodelist.forEach(item => {
                qrCode += item.value + "|"
              })

              qrCode = qrCode.slice(0, -1)

              // if (this.orderDetail.type == 1) {
              //   qrCode = qrCode.slice(0, -1)
              // console.log(qrCode)
              // } else {
              //   qrCode = this.orderDetail.ticketcode
              // }
              setTimeout(() => {
                if (qrCode) {
                  this.getQRCode(qrCode)
                }
              }, 200)
            }
            if(this.orderDetail.type==2){
              let qrCode = this.orderDetail.ticketcode
              setTimeout(() => {
                if (qrCode) {
                  this.getQRCode(qrCode)
                }
              }, 200)
            }
            // 计算播放结束时间
            this.cinemaid = this.orderDetail.cinemaid
            // 获取订单时间
            this.ordertime = this.timestampToTime(this.orderDetail.add_time)
          }

        }
      })
    },
    gozhifu() {
      var id = this.$route.query.id
      this.$router.push({path: "/paymentpage", query: {order: id, change: 0}})
    }
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
  min-height: 100vh;
  box-sizing: border-box;
  background-color: #F0F0F0;
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
  background-image: linear-gradient(to bottom, #F8605D, #F0F0F0);
  padding: 15px 10px 10px;

  .header {
    background-color: #E35C60;
    border-radius: 10px;

    .cinemaname {
      color: white;
      text-align: center;
      padding: 11px;
      font-size: 17px;
      position: relative;
      z-index: 5;
    }

    .orderinfo {
      background-color: white;
      border-radius: 10px;
      padding: 15px 20px 25px;
      overflow: hidden;
      position: relative;

      .topIcon {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background-color: #E35C60;
        position: absolute;
        top: -35px;
        left: calc(50% - 25px);
      }

      .movieBox {
        display: flex;
        gap: 20px;
        align-items: flex-start;

        .movieLeft {
          width: calc(100% - 90px);
        }

        .moviename {
          font-weight: bold;
          font-size: 17px;
          margin-top: 7px;
        }

        .edition {
          font-size: 12px;
          margin-top: 10px;
        }

        .centerBox {
          display: flex;
          align-items: flex-start;
          gap: 40px;
          margin-top: 18px;
          white-space: nowrap;

          .playdataBox {

            .playdata {
              font-size: 13px;
              color: #707070;
            }

            .playtime {
              font-size: 14px;
              margin-top: 5px;
            }
          }

          .roomname {
            font-size: 13px;
            color: #707070;
            white-space: break-spaces;
          }

          .seats {
            display: flex;
            align-items: center;
            font-size: 14px;
            margin-top: 5px;
            gap: 0px 10px;

            .line {
              width: 2px;
              height: 10px;
              background-color: #E2E2E2;
            }
          }

          .seats2 {
            flex-wrap: wrap;
          }
        }

        .movielogo {
          width: 70px;
          border-radius: 6px;
          overflow: hidden;
          display: flex;
        }
      }

      .xLine {
        border-bottom: 2px dashed #F0F0F0;
        width: calc(100% + 16px);
        margin-left: -20px;
        padding: 12px;
        position: relative;

        .cicle {
          position: absolute;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          left: -10px;
          top: 15px;
          background-image: linear-gradient(to bottom, #F68C89, #F59391);
        }

        .cicle2 {
          left: initial;
          top: 15px;
          right: -10px;
        }
      }

      .tipis {
        text-align: center;
        padding: 10px 0px 0px;
        font-size: 14px;
      }
    }
  }

  .orderdetail {
    border-radius: 10px;
    background-color: white;
    padding: 15px 20px;
    margin-top: 10px;
    font-size: 14px;

    .contentBox {
      margin-top: 8px;
    }
  }

  .orderdetail p {
    margin: 5px 0px;
  }
}

.qrBox {
  padding: 20px 0px 15px;
  width: 100%;
  background-size: 17px 2px;
  background-repeat: repeat-x;
  font-size: 15px;
  position: relative;

  .qrText {
    text-align: start;
  }

  .qrcode {
    width: 150px;
    height: 150px;
    margin: auto;
    padding: 16px 0px 25px;

  }
}
</style>