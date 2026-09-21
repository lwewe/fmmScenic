<template>
<div class="location">
  <h4 style="text-align: center;" v-if="flag">暂无消费记录...</h4>
  <ReturnBack :rcolor="'#fff'" :bcolor="'#00000087'"></ReturnBack>
  <RecordList v-if="recordList.length!=0" :recordList="recordList"></RecordList>
</div>
</template>

<script>
import RecordList from "@/components/RecordList.vue";
import {getConsumeList} from "@/api/locality/card";

export default {
  name: "ConsumptionRecords",
  components:{
    RecordList
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
      getConsumeList({
        token,
        khid:this.khid,
        pageno:this.pageno,
        pagesize:10000
      }).then(res=>{
        // console.log(res)
        if(res.code == 200){
          this.recordList=res.data.list
        }
        if(!res.data.list){
          this.flag=true
        }
      })
    },

  },
  created() {
    this.khid = this.$route.query.cardId
    this.getConsume()
  }
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