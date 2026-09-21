<template>
  <!-- 选择电影座位-->
  <div class="sm" style="position: absolute;">
    <ReturnBack :rcolor="'#fff'" :bcolor="'#00000087'"></ReturnBack>
    <NProgress v-if="loadingflag"/>
    <!--    提示-->
    <div class="tiplt">
<!--      style="padding-bottom: 7px;"-->
      <div class="sold" >
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
        <div style="font-size: 10px;padding-left: 5px">{{ (item.originPrice).toFixed(2) }}元</div>
      </div>
      <div style="display: flex;align-items: center;gap: 5px" v-if="isql">
        <div class="price1 lovers"></div>
        <div style="font-size: 10px">情侣座</div>
      </div>
    </div>
    <!--   <div  :style="'margin-left:calc(15.5% - '+(rowNoMax*16+6)/2+'px)'">-->
    <div class="sm-title">
      <img src="../../assets/zuowei/ym.png" alt="">
    </div>
    <!--    :style="'left:calc(57.5% - '+(rowNoMax*16+6)/2+'px)'"-->
    <div class="sm-line"></div>
    <div class="screen"> 银幕方向</div>
    <!--   </div>-->
    <!--    座位-->
    <div class="maxBox" id="container">
      <div>
        <div class="sequence" :class="{amplify2:isamplify}" :style="'height: '+setList.length*20+'px;'">
          <div v-for="(item, index) in setList"
               class="seatClass2"
               :key="item.id"
               style="position: absolute"
               :style="{
          height: height + 'rem',
          width: width + 'rem',
          top: item.rowsNum * positionDistin + 'rem',
        }">
            <div>{{ item.rowsId }}</div>
          </div>
        </div>
      </div>
      <!--            座子-->
<!--      <div class="box1" :style="{ left: boxLeft + 'px', top: boxTop + 'px' }" @touchstart="startMove"-->
<!--           @touchmove="onMove"-->
<!--           @touchend="endMove">-->
<!--        &lt;!&ndash;        :style="'left:calc(40.7% - '+(rowNoMax*16+6)/2+'px)'"&ndash;&gt;-->
<!--        <div class="box" :class="{amplify:isamplify}" :style="'left:calc(7.5% - '+(rowNoMax*16+6)/2+'px)'" ref="ball">-->
<!--          <div v-for="(item2, index2) in setList" :key="index2">-->
<!--            <div v-for="(item, index) in item2.columns"-->
<!--                 class="seatClass2"-->
<!--                 :class="{price1:item.state==-1||item.state==1||item.state==10||item.state==11||item.state==5, price2:item.state==-1||item.state==1, set:item.state==1,lovers:(item.state==-1||item.state==1||item.state==10||item.state==11)&&(item.type==2||item.type==3)}"-->
<!--                 :key="item.id"-->
<!--                 :style="{-->
<!--          height: height + 'rem',-->
<!--          width: width + 'rem',-->
<!--          top: item2.rowsNum * positionDistin + 'rem',-->
<!--          left: item.colNum * positionDistin + 'rem',-->
<!--          boxShadow: item.state==-1||item.state==1?item.colorNum:'box-shadow: inset 0 0 0 1px #f5dfcd;'-->
<!--        }"-->
<!--                 @click="seatClk(item,index,item2)"-->
<!--            >-->
<!--              <div v-if="item.state==2||item.state==3||item.state==4" class="setImg" style="width: 16px;height:16px;">-->
<!--                <img class="img" src="../../assets/zuowei/ys.png" alt="">-->
<!--              </div>-->
<!--              <div class="success set" v-if="item.state==5" style="padding: 0;">-->
<!--                <van-icon color="#fff" name="success" size="12px"/>-->
<!--              </div>-->
<!--            </div>-->
<!--          </div>-->

<!--        </div>-->
<!--      </div>-->
      <!--            座子-->
      <div class="box1" :style="{ left: boxLeft + 'px', top: boxTop + 'px' }"  >
        <!--        :style="'left:calc(40.7% - '+(rowNoMax*16+6)/2+'px)'"-->
<!--        :style="'left:calc(7.5% - '+(rowNoMax*16+6)/2+'px)'"-->
        <div class="box" :class="{amplify:isamplify}"  ref="ball">
          <div v-for="(item2, index2) in setList" :key="index2" class="setList">
            <div v-for="(item, index) in item2.columns"
                 class="seatClass2"
                 :class="{price1:item.state==-1||item.state==1||item.state==10||item.state==11||item.state==5, price2:item.state==-1||item.state==1, set:item.state==1,lovers:(item.state==-1||item.state==1||item.state==10||item.state==11)&&(item.type==2||item.type==3)}"
                 :key="item.id"
                 :style="{
          height: height + 'rem',
          width: width + 'rem',
          boxShadow: item.state==-1||item.state==1?item.colorNum:'box-shadow: inset 0 0 0 1px #f5dfcd;'
        }"
                 @click="seatClk(item,index,item2)"
            >
              <div v-if="item.state==2||item.state==3||item.state==4" class="setImg" style="width: 16px;height:16px;">
                <img class="img" src="../../assets/zuowei/ys.png" alt="">
              </div>
              <div class="success set" v-if="item.state==5" style="padding: 0;">
                <van-icon color="#fff" name="success" size="12px"/>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
    <div class="footer">
      <!--    电影详情-->
      <div class="moveDetail">
        <div class="move" style="border-bottom: 1px solid #F3F3F3">
          <div class="moviename">{{ moveDetail.movieName }}</div>
          <div class="time" v-if="moveDetail.showTime">
            <span>{{ moveDetail.showTime.split("T")[0].split("-").splice(1).join("-") }}</span>
            <span class="toleft days">{{
                moveDetail.showTime.split("T")[0].split("-").splice(1).join("-") == nowDate ? "今天" : ""
              }}{{ moveDetail.showTime.split("T")[0].split("-").splice(1).join("-") == days ? "明天" : "" }}</span>
            <span class="toleft">{{ moveDetail.showTime.split("T")[1].split(":").splice(0, 2).join(":") }}</span>
            <span class="toleft">{{moveDetail.version.includes("语")||moveDetail.version.includes("版")?'':moveDetail.language}} {{ moveDetail.version }}</span>
          </div>
        </div>
        <div class="move" v-if="selectedList.length==0">
          <div class="moviename" style="font-size: 15px">请选座位</div>
          <div class="time">每次最多可选4个座位，再次点击取消</div>
        </div>
        <!--        已选-->
        <div v-else class="selected">
          <div class="seletedItem" v-for="(item,index) in selectedList" :key="item.seatid">
            <div>
              <div class="selectedName">{{ item.seatName }}</div>
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
        <div class="popupTitle">购票须知</div>
        <div class="popupText">
          <p v-html="goupiao.content"></p>
        </div>
        <div class="popupTitle" style="padding-top: 20px">观影须知</div>
        <div class="popupText">
          <p v-html="guanying.content"></p>
        </div>
        <div class="btnBox">
          <van-button class="btn" plain type="danger" :disabled="!isComPay" @click="goPay">确定</van-button>
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
import {getSession} from "@/api/newFilm";
import {creatNewOrder, getCinemaGuide, getunpayorder, unorder} from "@/api/city";

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
      sessionId: "",
      cinemaId: "",
      movieId: "",
      sid: "",
      areaPriceList: [],
      goupiao: "",
      guanying: "",
      isComPay:true
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
          this.$router.replace({path: "/paymentpage", query: {order: orderid, new: 1}})
        }, 1500)
      }).catch(() => {
        this.cancelOrder(orderid)
      })
    },
    // 取消锁座
    cancelOrder(oid) {
      unorder({
        token: this.token,
        oid
      }).then(res => {
        if (res.code == 200) {
          this.$toast(res.data)
          this.getMaps()
        }
      })
    },
    // 支付（（（（
    goPay() {
      if(!this.isComPay){
        return
      }
      this.isComPay = false
      sessionStorage.removeItem("selectMovieCode")
      sessionStorage.removeItem("activeIndex")
      var seatNames = ""
      const numbers = [];
      this.selectedList.forEach(item => {
        seatNames += item.seatName + ","
        numbers.push(item.price)
      })
      let loveSeat = this.selectedList.filter(item => item.seatType == 10 || item.seatType == 11).length > 0 ? true : false
// 使用 Math.max() 和扩展运算符找到最大值
      const originPrice = Math.max(...numbers);
      let data = {
        token: this.token,
        cinemaCode: this.cinemaId,//	是	string	影院编码
        movieCode: this.movieId,//	是	string	影片编码
        hallName: this.moveDetail.hall,//	是	string	影厅名称
        seatNames: seatNames.slice(0, -1),//	是	string	座位名称
        switchSeat: false,//	是	string	是否可调座 true/false
        sessionBeginTime: this.moveDetail.showTime,//		是	string	开场时间
        originPrice: this.fillPrice,//	是	string	原票价单价
        loveSeat,//	是	string	是否情侣座 true/false
      }
      // console.log(data)
      // return
      creatNewOrder(data).then(res2 => {
        if (res2.code == 200 && res2.data != undefined) {
          this.$toast("锁座成功")
          setTimeout(() => {
            this.$router.replace({path: "/paymentpage", query: {order: res2.data.orderid, new: 1}})
          }, 1000)
        } else {
          this.instructions = false
          this.isComPay = true
          this.$toast(res2.msg)
        }
      })
    },
    // 支付end
    startMove(event) {
      this.isMoving = true;
      this.startX = event.touches[0].clientX;
      // console.log( event.touches[0].clientX>=260)
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
      getunpayorder({
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
      getSession({
        sessionId: this.sessionId,
        cinemaId: this.cinemaId,
        movieId: this.movieId,
        sid: this.sid
      }).then(res => {
            // console.log(res)
            this.loadingflag = false
            if (res.code == 0) {
              // this.setList = res.data.seatList
              this.moveDetail = res.data
              this.setList = this.moveDetail.seatSection.seatRows
              this.areaPriceList = this.moveDetail.areaPriceList
              this.arryList = this.areaPriceList
              let inset = "inset 0 0 0 1px "
              if(this.areaPriceList.length>0){

              }else {
              this.areaPriceList.push({
                originPrice: this.moveDetail.originPrice,
                areaId:""
              })
            }
                // this.arryList = this.unique(this.areaPriceList)
                this.arryList.forEach((item, index) => {
                  if (index == 0) {
                    item.colorNum =inset+ "#F9CBA7"
                  } else if (index == 1) {
                    item.colorNum = inset+ "#A1C9F0"
                  }else if (index == 2) {
                    item.colorNum = inset+ "#FCB7B7"
                  }else if (index == 3) {
                    item.colorNum = inset+ "#B1DEB7"
                  }else if (index == 4) {
                    item.colorNum = inset+ "#FFC6E3"
                  }else if (index == 5) {
                    item.colorNum = inset+ "#ACE1ED"
                  } else {
                    item.colorNum = `inset 0 0 0 1px rgb(${255 - (index + 1) * 50}, ${135 - (index + Number(item.areaId)) / 3}, ${152 - (index + Number(item.areaId)) / 12.5}, 0.5)`
                  }
                })
                // for (let i = 0; i < this.areaPriceList.length - 1; i++) {
                //   for (let j = 1; j < this.areaPriceList.length; j++) {
                //     if (this.arryList.length == 1) {
                //       this.areaPriceList[j].colorNum = `inset 0 0 0 1px #f5dfcd`
                //     } else if (this.areaPriceList[j].price == this.areaPriceList[i].price) {
                //       this.areaPriceList[j].colorNum = this.areaPriceList[i].colorNum
                //     }
                //   }
                // }
                let arry3 = []
                this.areaPriceList.forEach((item, index) => {
                  this.setList.forEach(item2 => {
                    item2.columns.forEach(item3 => {
                      if (item3.areaId == item.areaId) {
                        item3.colorNum = item.colorNum
                        // if(item3.state==3){
                        //   item3.colorNum ="inset 0 0 0 1px #DADADA"
                        // }
                      }
                      if (item3.type == 2 || item3.type ==3) {
                        arry3.push(item)
                      }
                    })
                  })
                })
                if (arry3.length == 0) {
                  this.isql = false
                } else {
                  this.isql = true
                }


              // console.log(this.setList)
            }
          }
      )
    }
    ,
// 删除座位表
    deleteSeat(item, index) {
      // console.log(item)
      if (item.type == 2) {
        this.setList.forEach(item2 => {
          item2.columns.forEach(item3 => {
            let col  = Number(item.colNum)>item3.colNum?Number(item.colNum) - 1:Number(item.colNum) + 1
            if (item3.type == 3 && item3.colNum == col) {
              item3.state = -1;
              this.selectedList = this.selectedList.filter(item5 => item5.originSeatID != item3.originSeatID)
            }
          })
        })
      } else if (item.type == 3) {
        this.setList.forEach(item2 => {
          item2.columns.forEach(item3 => {
            let col  = Number(item.colNum)>item3.colNum?Number(item.colNum) - 1:Number(item.colNum) + 1
            if (item3.type == 2 && item3.colNum == col) {
              item3.state = -1;
              this.selectedList = this.selectedList.filter(item5 => item5.originSeatID != item3.originSeatID)
            }
          })
        })
      }
      this.selectedList = this.selectedList.filter(item2 => item2.originSeatID != item.originSeatID)
      item.state = -1
      this.getfillPrice(this.selectedList)
    }
    ,
// 点击座位表
    seatClk(item, index, items) {
      // console.log(item)
      if (item.state == -1 || item.state == 1 || item.state == 10 || item.state == 11) {
        if (this.selectedList.length >= 4) {
          this.$toast('每组订单最多选择四个座位');
          return
        }
        if(this.selectedList.filter(item2=>item2.areaId!=item.areaId).length>0){
          this.$toast('请选择相同区域座位，不同区域请分开下单');
          return
        }
        if (item.type == 2) {
          this.setList.forEach(item2 => {
            item2.columns.forEach((item3,index3) => {
              let col  = Number(item.colNum)>item3.colNum?Number(item.colNum) - 1:Number(item.colNum) + 1
              if (item2.rowsId == items.rowsId && item3.type == 3 && item3.colNum == col&&index3==index+1) {
                  item3.state = 5;
                  this.selectedList.push(item3)
              }
            })
          })
        } else if (item.type == 3) {
          this.setList.forEach(item2 => {
            item2.columns.forEach((item3,index3) => {
              let col  = Number(item.colNum)>item3.colNum?Number(item.colNum) - 1:Number(item.colNum) + 1

              if (item2.rowsId == items.rowsId && item3.type == 2 && item3.colNum == col&&index3==index-1) {
                // console.log(item3.colNum , col)
                item3.state = 5;
                this.selectedList.push(item3)
              }
            })
          })
        }
        item.state = 5;
        this.selectedList.push(item)
        this.areaPriceList.forEach(item2 => {
          this.selectedList.forEach(item3 => {
            if (item2.areaId == item3.areaId) {
              item3.price = item2.originPrice
            }
          })
        })
        //   this.selectedList.push(item)
      } else if (item.state == 5) {
        if (item.type == 2) {
          this.setList.forEach(item2 => {
            item2.columns.forEach((item3,index3) => {
              let col  = Number(item.colNum)>item3.colNum?Number(item.colNum) - 1:Number(item.colNum) + 1
              if (item2.rowsId == items.rowsId && item3.type == 3 && item3.colNum == col&&index3==index+1) {
                item3.state = -1;
                this.selectedList = this.selectedList.filter(item5 => item5.originSeatID != item3.originSeatID)
              }
            })
          })
        } else if (item.type == 3) {
          this.setList.forEach(item2 => {
            item2.columns.forEach((item3,index3) => {
              let col  = Number(item.colNum)>item3.colNum?Number(item.colNum) - 1:Number(item.colNum) + 1
              if (item2.rowsId == items.rowsId && item3.type == 2 && item3.colNum == col&&index3==index-1) {
                item3.state = -1;
                this.selectedList = this.selectedList.filter(item5 => item5.originSeatID != item3.originSeatID)
              }
            })
          })
        }
        item.state = -1
        this.selectedList.splice(index, 1)
        this.selectedList = this.selectedList.filter(item2 => item2.originSeatID != item.originSeatID)
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
    this.sessionId = this.$route.query.sessionId
    this.cinemaId = this.$route.query.cinemaId
    this.movieId = this.$route.query.movieId
    this.sid = this.$route.query.sid
    this.getMaps()
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
  //padding-top: 7px;
}

.soldText {
  //margin-top: 7px;
}

.tiplt {
  display: flex;
  align-items: center;
  //justify-content: center;
  width: 76%;
  margin: auto;
  padding-top: 20px;
  min-width: 226px;
  gap: 12px;
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
.setList{
  display: flex;
  gap: 2px;
  margin-top: 2px;
}
.seatClass2 {
  //position: absolute;
min-width: 1rem;
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
  top: 12px;
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
  display: flex;
  justify-content: center;
}
</style>
