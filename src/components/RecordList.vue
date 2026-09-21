<template>
  <div class="RecordList">
    <div class="listItem" v-for="(item,index) in recordList" :key="index">
      <div>
<!--        "flag": "3",  //2-微信充值 3-后台充值-->
<!--        "flag": "1", //1-消费 4-后台扣除-->
        <div class="title">
          <span v-if="item.flag == 1">消费</span>
          <span v-if="item.flag == 4">后台扣除</span>
          <span v-if="item.flag == 2">微信充值</span>
          <span v-if="item.flag == 3">后台充值</span>
        </div>
        <div class="time">{{timestampToTime(item.add_time)}}</div>
      </div>
      <div :style="{color:item.flag==1||item.flag == 4?'#F37276':'#68B084'}">{{item.flag==1||item.flag == 4?"-":"+"}}￥{{item.price}}</div>
    </div>
  </div>
</template>
<script>
export default {
  name: "RecordList",
  props:{
    recordList:[Object,Array],
  },
  data(){
    return{
      pagesize:10
    }
  },
  methods:{
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
    handleScroll(e) {
        let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        let scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
        let clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
        if (scrollTop + clientHeight >= scrollHeight-100) {
          this.pagesize=this.pagesize+10  
        }
      }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll,false);
  },
}
</script>

<style scoped lang="less">
.RecordList {
  background-color: white;
  border-radius: 8px;
  padding: 5px 15px 0px;

  .listItem {
    border-bottom: 1px #F5F5F5 solid;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 0px;
    .title{
      font-weight: bold;
      font-size: 15px;
    }
    .time{
      font-size: 12px;
      color: #C7C7C7;
      padding-top: 5px;
    }
  }
}
</style>