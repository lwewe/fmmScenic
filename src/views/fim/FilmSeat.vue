<template>
  <!-- 选择电影座位-->
  <div class="sm" style="position: absolute;">
    <ReturnBack :rcolor="'#fff'" :bcolor="'#00000087'"></ReturnBack>
    <NProgress v-if="loadingflag"/>
    <!--    提示-->
    <div class="tiplt">
      <div class="sold" style="padding-bottom: 7px;">
        <div class="soldImg">
          <img class="img" src="../../assets/zuowei/ys.png" alt="">
        </div>
        <div class="soldText">已售</div>
      </div>
      <div class="sold">
        <div class="success">
          <van-icon color="#fff" name="success" size="12px"/>
        </div>
        <div>选中</div>
      </div>
      <div class="moneyBox" v-for="(item,index) in arryList" :key="item.area">
        <div class="sold">
          <div class="price1 price2" v-if="index==0"></div>
          <div class="price1" v-if="index!=0" :style="{ boxShadow: item.colorNum }"></div>
        </div>
        <div style="font-size: 10px;padding-left: 5px">{{ (item.price).toFixed(2) }}元</div>
      </div>
      <div style="display: flex;align-items: center;gap: 5px" v-if="isql">
        <div class="price1 lovers"></div>
        <div style="font-size: 10px">情侣座</div>
      </div>
    </div>
    <div class="sm-title">
      <img src="../../assets/zuowei/ym.png" alt="">
    </div>
    <div class="sm-line"></div>
    <div class="screen"> 银幕方向</div>
    <!--    座位-->
    <div class="maxBox" id="container">
      <div>
        <div class="sequence" :class="{amplify2:isamplify}" :style="'height: '+colNoMax*20+'px;'">
          <div v-for="(item, index) in setList"
               class="seatClass2"
               :key="item.id"
               :style="{
          height: height + 'rem',
          width: width + 'rem',
          top: item.row * positionDistin + 'rem',
        }">
            <div>{{ item.rowname }}</div>
          </div>
        </div>
      </div>
      <!--      座子-->
      <div class="box1" :style="{ left: boxLeft + 'px', top: boxTop + 'px' }" @touchstart="startMove"
           @touchmove="onMove"
           @touchend="endMove">
        <div class="box" :class="{amplify:isamplify}"
             :style="'left:calc(40.7% - '+(rowNoMax*16+6)/2+'px)'" ref="ball">
          <div v-for="(item, index) in setList"
               class="seatClass2"
               :class="{price1:item.status==1, price2:item.status==1&&item.change==0||item.status==1&&item.any=='', set:item.status==1,lovers:item.status==1&&item.flag==1||item.flag==2}"
               :key="item.id"
               :style="{
          height: height + 'rem',
          width: width + 'rem',
          top: item.row * positionDistin + 'rem',
          left: item.column * positionDistin + 'rem',
          boxShadow: item.status==1&&item.change!=0?item.colorNum:'box-shadow: inset 0 0 0 1px #f5dfcd;'
        }"
               @click="seatClk(item,index)"
          >
            <div v-if="item.status==0" class="setImg" style="width: 16px;height:16px;">
              <img class="img" src="../../assets/zuowei/ys.png" alt="">
            </div>
            <div class="success set" v-if="item.status==5" style="padding: 0;">
              <van-icon color="#fff" name="success" size="12px"/>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer">
      <!--    电影详情-->
      <div class="moveDetail">
        <div class="move" style="border-bottom: 1px solid #F3F3F3">
          <div class="moviename">{{ moveDetail.moviename }}</div>
          <div class="time" v-if="moveDetail.playtime">
            <span>{{ moveDetail.playtime.split(" ")[0].split("-").splice(1).join("-") }}</span>
            <span class="toleft days">{{
                moveDetail.playtime.split(" ")[0].split("-").splice(1).join("-") == nowDate ? "今天" : ""
              }}{{ moveDetail.playtime.split(" ")[0].split("-").splice(1).join("-") == days ? "明天" : "" }}</span>
            <span class="toleft">{{ moveDetail.playtime.split(" ")[1].split(":").splice(0, 2).join(":") }}</span>
            <span class="toleft">{{ moveDetail.edition }}</span>
          </div>
        </div>
        <div class="move" v-if="selectedList.length==0">
          <div class="moviename">请选座位</div>
          <div class="time">每次最多可选4个座位，再次点击取消</div>
        </div>
        <!--        已选-->
        <div v-else class="selected">
          <div class="seletedItem" v-for="(item,index) in selectedList" :key="item.seatid">
            <div>
              <div class="selectedName">{{ item.name }}</div>
              <div class="money">{{ (item.price).toFixed(2) }}元</div>
            </div>
            <div @click="deleteSeat(item,index)">
              <van-icon color="#97989A" name="cross" size="12px"/>
            </div>
          </div>
        </div>
      </div>
      <van-button class="btnno" type="danger" v-if="selectedList.length==0">请先选座</van-button>
      <van-button class="btnno none" type="danger" v-else @click="comfire">{{ fillPrice }}元 确认选座</van-button>
    </div>
    <!--    购票须知-->
    <van-popup class="popup1" v-model="instructions">
      <div class="popupBox">
        <div class="popupTitle"  v-if="goupiao">购票须知</div>
        <div class="popupText" v-if="goupiao">
          <p v-html="goupiao.content"></p>
        </div>
        <div class="popupTitle" style="padding-top: 20px"  v-if="guanying">观影须知</div>
        <div class="popupText"  v-if="guanying">
          <p v-html="guanying.content"></p>
        </div>
        <div class="btnBox">
          <van-button class="btn" plain type="danger" @click="goPay">确定</van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import {getSeatMaps} from "@/api/cinema";
import moment from "moment";
import 'moment/locale/zh-cn';
import {lockSeatOrder, unlockseat, unpayorder} from "@/api/locality/order";
import {getCinemaGuide} from "@/api/city";

export default {
  name: 'sysIndex',
  components: {},
  data() {
    return {
      parameter: {
        appkey: this.$store.state.appkey,
        timestamp: this.$store.state.timestamp,
        v: "1.0",
      },
      // 页面渲染的数据
      seatList: [],
      // 后端返回的数据
      setList: [],
      moveDetail: {},
      width: 1, // 每个座位的宽
      height: 1, // 每个座位的高
      positionDistin: 1.1, // 每个座位偏移距离,
      colNoMax: 0,
      rowNoMax: 0,
      nowDate: "",
      days: "",
      selectedList: [],
      colNoMaxList: [],
      areaPrice: [],
      areaPrice2: [],
      areaPrice3: [],
      areaPrice4: [],
      isamplify: false,
      fillPrice: 0,
      instructions: false,
      boxLeft: 0,
      boxTop: 0,
      startX: 0,
      startY: 0,
      offsetX: 0,
      offsetY: 0,
      isMoving: false,
      // 下单
      token: "",
      opiid: "",
      movieid: "",
      loadingflag: false,
      arryList: [],
      isql: false,
      goupiao:"",
      guanying:""
    };
  },
  methods: {
    // 购票/观影须知
    getCinemaGuide() {
      getCinemaGuide().then(res => {
        if (res.code == 200) {
          // console.log(res)
          this.goupiao = res.data.goupiao
          this.guanying = res.data.guanying
        }
      })
    },
    // 询问是否取消锁座
    messageinfo(orderid) {
      this.$dialog.confirm({
        title: '您还有订单未支付是否前去支付',
        message: '',
        confirmButtonColor: 'red'
      }).then(() => {
        setTimeout(() => {
          this.$router.replace({path: "/paymentpage", query: {order: orderid}})
        }, 1500)
      }).catch(() => {
        this.cancelOrder(orderid)
      })
    },
    // 取消锁座
    cancelOrder(oid) {
      unlockseat({
        token: this.token,
        oid
      }).then(res => {
        if (res.code == 200) {
          this.$toast(res.data)
        }
      })
    },
    // 支付（（（（
    goPay() {
      var seatids = ""
      var seatnames = ""
      this.selectedList.forEach(item => {
        seatids += item.seatid + "|"
        seatnames += item.name + "|"
      })
      lockSeatOrder({
        token: this.token,
        opiid: this.opiid,
        seatids:seatids.slice(0, -1),
        seatnames:seatnames.slice(0, -1),
        totalSettleAmount: this.fillPrice,
        playtime: this.moveDetail.playtime,
        movieid: this.movieid
      }).then(res2 => {
        if (res2.code == 200 && res2.data != undefined) {
          this.$toast("锁座成功")
          setTimeout(() => {
            this.$router.replace({path: "/paymentpage", query: {order: res2.data.orderid}})
          }, 1000)
        } else {
          this.instructions = false
          this.$toast(res2.msg)
        }
      })
    },
    // 支付end
    startMove(event) {
      this.isMoving = true;
      this.startX = event.touches[0].clientX;
      // this.startY = event.touches[0].clientY;
      this.offsetX = this.boxLeft;
      // this.offsetY = this.boxTop;
    },
    onMove(event) {
      if (this.isMoving) {
        const moveX = event.touches[0].clientX - this.startX;
        this.boxLeft = this.offsetX + moveX;
      }
    },
    endMove() {
      this.isMoving = false;
    },
    //  // 检测是否有未支付订单
    toOrder() {
      if (localStorage.getItem("token")) {
        this.token = localStorage.getItem("token")
      }
      unpayorder({
        token: this.token
      }).then(res => {
        if (res.code == 200) {
          if (!res.data) {
          } else {
            this.messageinfo(res.data.orderid)
          }
        }
      })
    },
    // 确认选座
    comfire() {
      this.instructions = true
      this.getCinemaGuide()
    },
    getfillPrice(arry) {
      var fillPrice = 0
      arry.forEach(item => {
        fillPrice += item.price
      })
      this.fillPrice = fillPrice.toFixed(2)
    },
    // 放大
    toamplify() {
      this.isamplify = true
    },
    unique(arr) {
      const res = new Map();
      return arr.filter((arr) => !res.has(arr.price) && res.set(arr.price, 1)
      );
    },
    getMaps(opiid) {
      this.setList = []
      let data = {
        ...this.parameter,
        method: "xuankua.opi.seat",
        opiid: opiid,
      }
      let sign = this.$utils.getASCII(data)
      getSeatMaps({
        ...data, sign
      }).then(res => {
            // console.log(res)
            if (res.code == 200) {
              // this.setList = res.data.seatList
              this.moveDetail = res.data.opi
              if (this.moveDetail.areaPrice) {
                var arry3 = []
                var areaPrice = ""
                res.data.seatList.forEach(item => {
                  if (item.flag == 1 || item.flag == 2) {
                    arry3.push(item)
                  }
                })
                if (arry3.length == 0) {
                  areaPrice = this.moveDetail.areaPrice.split(";") || this.moveDetail.areaPrice.split(",")
                  this.isql = false
                } else {
                  areaPrice = this.moveDetail.areaPrice.split(";") || this.moveDetail.areaPrice.split(",")
                  this.isql = true
                }
                areaPrice = areaPrice.sort((a, b) => a.split(",")[1].split(":")[1] - b.split(",")[1].split(":")[1])
                areaPrice.forEach((item, index) => {
                  this.areaPrice4.push({
                    area: item.split(",")[0].split(":")[1],
                    price: Number(item.split(",")[1].split(":")[1]),
                    change: index
                  })
                  this.areaPrice.push({
                    area: item.split(",")[0].split(":")[1],
                    price: Number(item.split(",")[1].split(":")[1]),
                    colorNum: `inset 0 0 0 1px rgb(${255 - (index + 1) * 50}, ${135 - (index + Number(item.split(",")[1].split(":")[1])) / 3}, ${152 - (index + Number(item.split(",")[1].split(":")[1])) / 12.5}, 0.5)`,
                    change: index
                  })
                })
                // this.areaPrice = this.areaPrice.sort((a, b) => a.price - b.price)
                this.arryList = this.areaPrice
                this.arryList = this.unique(this.arryList)
                // console.log(this.arryList,"1111111111")
                // this.areaPrice = this.unique(this.areaPrice)
                for (let i = 0; i < this.areaPrice.length - 1; i++) {
                  for (let j = 1; j < this.areaPrice.length; j++) {
                    if (this.arryList.length == 1) {
                      this.areaPrice[j].colorNum = `inset 0 0 0 1px #f5dfcd`
                    } else  if (this.areaPrice[j].price == this.areaPrice[i].price) {
                        this.areaPrice[j].colorNum = this.areaPrice[i].colorNum
                    }
                  }
                }
                res.data.seatList.forEach(item2 => {
                  this.areaPrice.forEach(item => {
                    if (item2.area == item.area) {
                      this.setList.push({
                        ...item, ...item2
                      })
                    }
                  })
                })
              } else {
                var isAny = []
                res.data.seatList.forEach(item => {
                  if (item.flag == 1 || item.flag == 2) {
                    isAny.push(item)
                    this.isql = true
                  } else {
                    this.isql = false
                  }
                })
                // if (isAny.length == 0) {
                this.areaPrice.push({
                  price: (this.moveDetail.price / 100),
                  any: ""
                })
                // } else {
                //   this.areaPrice.push(
                //       {
                //         price: (this.moveDetail.price / 100),
                //         any: ""
                //       }, {
                //         price: (this.moveDetail.price / 100),
                //         any: "5200"
                //       })
                // }
                this.arryList = this.areaPrice
                // console.log(this.arryList)
                this.areaPrice2.push({
                  price: (this.moveDetail.price / 100),
                  any: "5200"
                })
                this.areaPrice3.push({
                  price: (this.moveDetail.price / 100),
                  any: "",
                  colorNum: `inset 0 0 0 1px #f5dfcd`
                })
                this.areaPrice2.forEach(item => {
                  res.data.seatList.forEach(item2 => {
                    if (item2.flag == 1 || item2.flag == 2) {
                      this.setList.push({
                        ...item, ...item2
                      })
                    }
                  })
                })
                this.areaPrice3.forEach(item => {
                  res.data.seatList.forEach(item2 => {
                    if (item2.flag != 1 && item2.flag != 2) {
                      this.setList.push({
                        ...item, ...item2
                      })
                    }
                  })
                })
              }
              // console.log(this.setList)
              this.loadingflag = false
              // 找到列的最大值
              const colMax = this.findObjInArrMax(this.setList, 'row', true);
              const colNoMax = parseInt(colMax.row);
              this.colNoMax = colNoMax
              //   找到行的最大值
              const rowMax = this.findObjInArrMax(this.setList, 'column', true);
              const rowNoMax = parseInt(rowMax.column);
              this.rowNoMax = rowNoMax
            }else{
              this.loadingflag = false
            }
            if(this.setList.length==0){

            }
          }
      )
    }
    ,
// 删除座位表
    deleteSeat(item, index) {
      if (item.flag == 1) {
        this.setList.forEach(item2 => {
          if (item2.row == item.row && item2.flag == 2 && item2.column == item.column + 1) {
            item2.status = 1;
            this.selectedList = this.selectedList.filter(item3 => item3.seatid != item2.seatid)
          }
        })
      } else if (item.flag == 2) {
        this.setList.forEach(item2 => {
          if (item2.row == item.row && item2.flag == 1 && item2.column == item.column - 1) {
            item2.status = 1;
            this.selectedList = this.selectedList.filter(item3 => item3.seatid != item2.seatid)
          }
        })
      }
      this.selectedList = this.selectedList.filter(item2 => item2.seatid != item.seatid)
      item.status = 1
      this.getfillPrice(this.selectedList)
    }
    ,
// 点击座位表
    seatClk(item, index) {
      if (item.status == 1) {
        if (this.selectedList.length >= 4) {
          this.$toast('每组订单最多选择四个座位');
          return
        }
        if (item.flag == 1) {
          this.setList.forEach(item2 => {
            if (item2.row == item.row && item2.flag == 2 && item2.column == item.column + 1) {
              item2.status = 5;
              this.selectedList.push(item2)
            }
          })
        } else if (item.flag == 2) {
          this.setList.forEach(item2 => {
            if (item2.row == item.row && item2.flag == 1 && item2.column == item.column - 1) {
              item2.status = 5;
              this.selectedList.push(item2)
            }
          })
        }
        item.status = 5;
        this.selectedList.push(item)
      } else if (item.status == 5) {
        if (item.flag == 1) {
          this.setList.forEach(item2 => {
            if (item2.row == item.row && item2.flag == 2 && item2.column == item.column + 1) {
              item2.status = 1;
              this.selectedList = this.selectedList.filter(item3 => item3.seatid != item2.seatid)
            }
          })
        } else if (item.flag == 2) {
          this.setList.forEach(item2 => {
            if (item2.row == item.row && item2.flag == 1 && item2.column == item.column - 1) {
              item2.status = 1;
              this.selectedList = this.selectedList.filter(item3 => item3.seatid != item2.seatid)
            }
          })
        }
        item.status = 1
        // this.selectedList.splice(index,1)
        this.selectedList = this.selectedList.filter(item2 => item2.seatid != item.seatid)
      }
      this.getfillPrice(this.selectedList)
    }
    ,
// 找到数组对象中的最大值
    findObjInArrMax(list, atr, returnVal) {
      let res = Math.max.apply(
          Math,
          list.map((item) => {
            return item[atr];
          })
      );
      if (returnVal) {
        return list.filter((item) => {
          return item[atr] == res;
        })[0];
      } else {
        return res;
      }
    }
    ,
// 找到数组对象中的最小值
    findObjInArrMin(list, atr, returnVal) {
      let res = Math.min.apply(
          Math,
          list.map((item) => {
            return item[atr];
          })
      );
      if (returnVal) {
        return list.filter((item) => {
          return item[atr] == res;
        })[0];
      } else {
        return res;
      }
    }
  }
  ,
  created() {
    //加载
    this.loadingflag = true
    this.opiid = this.$route.query.opiid
    this.movieid = this.$route.query.movieid
    this.getMaps(this.$route.query.opiid)

  }
  ,
  mounted() {
    this.toOrder()
  }
}
;
</script>

<style scoped lang="less">
.sm-img {
  width: 26px;
  height: 26px;
}

.sm {
  position: relative;
  background-color: #F0F0F0;
  min-height: 100vh;
  width: 100%;
  overflow: hidden;
}

.sm-line {
  width: 0;
  height: calc(100vh - 116px);
  border: 1px dashed #ccc;
  position: absolute;
  top: 116px;
  left: 50%;
}

.sm-title {
  width: 200px;
  margin: 15px auto 0px;
}

.screen {
  text-align: center;
  font-size: 10px;
  margin-top: -6px;
  color: #999999;
}

img {
  width: 100%;
  height: 100%;
}

.sold {
  display: flex;
  align-items: flex-start;
  font-size: 10px;
  gap: 5px;
}

.soldImg {
  width: 16px;
  height: 16px;
  padding-top: 7px;
}

.soldText {
  margin-top: 7px;
}

.tiplt {
  display: flex;
  align-items: center;
  //justify-content: center;
  width: 76%;
  margin: auto;
  padding-top: 20px;
  min-width: 226px;
  gap: 20px;
  flex-wrap: wrap;
}

.price1 {
  width: 16px;
  height: 16px;
  background: white;
  box-shadow: inset 0 0 0 1px #C4D9EF;
  border-radius: 3px;
  position: relative;
  z-index: 2;
}

.price2 {
  box-shadow: inset 0 0 0 1px #F5DFCD;
}

.lovers {
  box-shadow: inset 0 0 0 1px #F388ED !important;
}

.seatClass2 {
  position: absolute;
}

.success {
  width: 16px;
  height: 16px;
  background: #6DB97A;
  border-radius: 3px;
  text-align: center;
  padding-top: 2px;
  box-sizing: border-box;
}


.box {
  position: relative;

}

.amplify {
  transform-origin: 0px 0px;
  transition-timing-function: cubic-bezier(0.1, 0.57, 0.1, 1);
  transition-duration: 200ms;
  transform: translate(-126px, 0px) scale(1.6) translateZ(0px);
}

.amplify2 {
  transform-origin: 0px 0px;
  transition-timing-function: cubic-bezier(0.1, 0.57, 0.1, 1);
  transition-duration: 10ms;
  transform: translate(0px, 0px) scale(1.6) translateZ(0px);
}

.row {
  position: absolute;
  left: -8px;
}

.set {
  //margin-left: 17px;
}

.setImg {
  //margin-left: 13px;
  //margin-left: -3px;
}

.moviename {
  font-weight: bold;
}

.footer {
  padding: 15px;
  position: absolute;
  width: 100%;
  bottom: 0px;
  left: 0px;
  box-sizing: border-box;
}

.moveDetail {
  background-color: white;
  border-radius: 5px;
  padding: 5px 15px;
}

.time {
  font-size: 10px;
  color: #727272;
  margin-top: 3px;
}

.move {
  padding: 5px 0px;
}

.toleft {
  margin-left: 5px;
}

.btnno {
  background-color: #ED3036 !important;
  color: #F7A6A9 !important;
  border-radius: 30px !important;
  width: 100%;
  height: 40px !important;
  line-height: 39px !important;
  margin-top: 10px;
}

.days {
  color: #ED4449;
}

.seletedItem {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #F5F6F8;
  border-radius: 5px;
  padding: 5px 10px;
  min-width: 74px;
  margin-top: 9px;
  margin-bottom: 8px;
}

.selected {
  overflow-x: scroll;
  display: flex;
  gap: 10px;
  overflow-x: auto;
  width: 100%;
}

.selected::-webkit-scrollbar {
  display: none
}

.money {
  font-size: 12px;
  color: #ED454A;
}

.selectedName {
  font-size: 14px;
  font-weight: bold;
  color: #424243;
}

.sequence {
  text-align: center;
  background-color: #b4b4b4a3;
  color: #E2E2E2;
  border-radius: 30px;
  height: 285px;
  width: 20px;
  position: absolute;
  left: 11px;
  z-index: 99;
  font-size: 13px;
  padding-bottom: 20px;
}

.moneyBox {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.maxBox {
  //overflow: scroll;
  height: 84vh;
  //width: 98%;
}

.none {
  color: white !important;
}

.popupBox {
  background-color: white;
  border-radius: 5px;
  padding: 15px;
  width: 100%;
  max-height: 74vh;
  overflow: auto;
}
/* 隐藏滚动条 */
.popupBox::-webkit-scrollbar {
  display: none; /* 对于 WebKit 浏览器 */
}

/deep/ .popup1 {
  background-color: #fff0;
  width: 74%;
  left: 46.5%;
  overflow-y: initial;
  top: 47.5%;
}

.popupTitle {
  font-weight: bold;
  padding-bottom: 10px;
  border-bottom: 1px solid #FAFAFA;
}

.popupText {
  color: #868686;
  font-size: 12px;
}

.popupText p {
  margin: 5px 0px;
  line-height: 17px;
}

.btn {
  border-radius: 30px;
  width: 87px;
  height: 35px;
  line-height: 35px;
  color: #ED383D !important;
  font-weight: bold;
  font-size: 16px;
}

.btnBox {
  width: 87px;
  margin: auto;
  padding-top: 75px;
}

.box1 {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
