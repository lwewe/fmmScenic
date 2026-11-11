<template>
  <div>
    <div class="cardbox">
      
      <div class="fulicard">
        <div class="pic" style="display: flex;height:100%;align-items: center;">
          <img src="../assets/card.png" alt="" style="width: 9vw;height: auto;">
          <p style="margin-left: 3vw;">
            <span style="font-size: 0.9em;">福利卡支付</span><br>
            <span style="font-size: 0.7em;color: #999;" v-if="cardList.length==0">无可用福利卡</span>
          </p>
        </div>
        <div v-if="cardList.length==0">
          <!-- v-if="cardList.length==0" -->
          <button style="" @click="toBind">去绑定</button>
        </div>
      </div>
      <van-cell-group inset>
        <van-checkbox-group v-model="result">
          <van-cell title="" clickable @click="chooseCard(item,index)" v-for="(item,index) in cardList"
                    :key="item.id">
            <p>
              <span v-if="item.pid==1">超级卡</span>
              <span v-if="item.pid==2">蛋糕卡</span>
              <span v-if="item.pid==15">超级A卡</span>
              <span v-if="item.pid==16">蛋糕A卡</span>
              <span v-if="item.pid==3">电影卡</span>
              <span v-if="item.pid==4">图书卡</span>
              <span v-if="item.pid==5">超级券</span>
              <span v-if="item.pid==6">蛋糕券</span>
              <span v-if="item.pid==7">电影券</span>
              <span v-if="item.pid==8">图书券</span>
              <span v-if="item.pid==9">悦享卡</span>
              <span v-if="item.pid==14">工会消费券</span>
              <!-- <span v-if="item.pid==9">悦享卡</span> -->
            </p>
            <p>{{ item.price }}点</p>
            <p>{{ item.num }} / {{ timestampToTime(item.end_time) }}到期</p>
            <template #right-icon>
              <van-checkbox checked-color="#ee0a24" :name="item.id"/>
            </template>
          </van-cell>
        </van-checkbox-group>
        <van-radio-group v-model="checked" v-if="cardList.length>0">
          <van-cell title="" clickable @click="wxPay" style="border-top: 1px solid #F5F6F8;">
            <div style="display: flex;align-items: center;">
              <img src="../assets/pay.png" alt="" style="width: 9vw;height: auto;">
              <span style="font-size: 0.9em;margin-left: 3vw;">微信支付</span>
            </div>
            <template #right-icon>
              <van-radio checked-color="#ee0a24" name="1"/>
            </template>
          </van-cell>
        </van-radio-group>
      </van-cell-group>
    </div>

  </div>
</template>
<script>
export default {
  name: "Payment",
  props: ['cardList','result1'],
  data() {
    return {
      // 支付方式选中
      checked: "",
      token: "",
      result: [],
      wxprice: 0,
      dkprice: 0,
      show: false,
      pass: "",
      showKeyboard: true,
      ka_ids: []
    }
  },
  methods: {
    toBind(){
      this.$router.push("/securitycards")
      //window.location.href = this.$store.state.base + "/securitycards?change=2&token="+localStorage.getItem("token")+"&cityName="+sessionStorage.getItem("cityName")
    },
    chooseCard(item, index) {
      let ind = this.result.includes(item.id);
      if (!ind) {
        this.result.push(item.id)
      } else {
        this.result = this.result.filter(item2=>item2!=item.id)
      }
      this.checked = ""
      this.$emit("getResult", this.result, this.checked)
    },
    wxPay() {
      this.result = []
      this.$emit("getResult", this.result, this.checked)
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
      return y + '-' + MM + '-' + d
    },
  },
  created() {
    setTimeout(() => {
      this.result = this.result1
    }, 500)
  }
}
</script>

<style scoped>
.cardbox {
  /* height: 15vh; */
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  padding: 8px 15px;
  margin-top: 10px;
}


.cardbox .fulicard {
  width: 100%;
  height: 7.5vh;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cardbox .fulicard button {
  height: 28px;
  width: 20vw;
  line-height: 26px;
  border-radius: 50px;
  border: 1px solid red;
  font-size: 0.8em;
  color: red;
  font-weight: 600;
  background-color: #fff;
}

.cardbox .wxpay {
  margin-left: 4vw;
  margin-right: 4vw;
  height: 7.2vh;
  /* background-color: yellow; */
  border-top: 1px solid #FBFBFB;
}

/* 福利卡 */
.van-cell {
  background-color: #fff0;
  line-height: 20px;
  padding: 10px 0px;
}

.van-cell__title {
  flex: 0;
}

.van-cell__value p {
  line-height: 18px;
  margin: 2px;
}

.van-radio {
  display: flex;
  justify-content: center;
  align-items: center;
}

.van-checkbox {
  display: flex;
  align-items: center;
}

.van-cell:not(:last-child)::after {
  left: 4%;
  width: 92%;
}
/deep/.van-hairline--top-bottom::after {
  border: none;
}
</style>