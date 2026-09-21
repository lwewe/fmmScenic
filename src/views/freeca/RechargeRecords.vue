<template>
  <div class="location">
    <h4 style="text-align: center;" v-if="flag">暂无充值记录...</h4>
    <ReturnBack :rcolor="'#fff'" :bcolor="'#00000087'"></ReturnBack>
    <RecordList v-if="recordList.length!=0" :recordList="recordList"></RecordList>
  </div>
</template>

<script>
import RecordList from "@/components/RecordList.vue";
import {getRechargeList} from "@/api/locality/card";

export default {
  name: "RechargeRecords",
  components:{
    RecordList,
  },
  data(){
    return{
      recordList:[],
      khid:"",
      pageno:1,
      flag:false
    }
  },
  methods:{
    getConsume(){
      let token = localStorage.getItem("token")
      getRechargeList({
        token,
        khid:this.khid,
        pageno:this.pageno,
        pagesize:10000
      }).then(res=>{
        // console.log(res)
        if(res.code == 200){
          this.recordList = res.data.list
        }
        if(!res.data.list){
          this.flag=true
        }
      })
    },
    handleScroll(e) {
      let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      let scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
      let clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
      if (scrollTop + clientHeight >= scrollHeight-100) {
      }
    }

  },
  created() {
    this.khid = this.$route.query.cardId
    this.getConsume()
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll,false);
  },

}
</script>

<style scoped>
.location{
  min-height: 100vh;
  background-color: #F0F0F0;
  padding: 10px 15px;
box-sizing: border-box;
}
</style>