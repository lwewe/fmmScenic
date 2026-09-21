<template>
<div>

</div>
</template>
<script>
import {getRechargeList} from "@/api/move";
export default {
  name: "MoveList",
  data(){
    return{
      page:"1",
      limit:"10",
      sign:"",
    }
  },
  methods:{
    getRecharge(){
      let data = {
        page:this.page,
        limit:this.limit,
        cid:"",
        kw:"",
      }
      this.sign = this.$utils.getASCII(data)
      getRechargeList({
        apikey:this.$store.state.apikey,
        ...data,
        sign:this.sign
      }).then(res=>{
      })
    }
  },
  created() {
    this.getRecharge()
  }
}
</script>
<style scoped>

</style>