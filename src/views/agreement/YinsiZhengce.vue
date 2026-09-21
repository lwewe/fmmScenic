<template>
  <div class="privacy">
    <ReturnBack :rcolor="'#fff'" :bcolor="'#00000087'"></ReturnBack>
    <div v-html="content"></div>
  </div>
</template>

<script>
import {single} from "@/api/locality/login"
export default {
  data(){
    return{
      content:""
    }
  },
  methods:{
    getInfo(){
      single({
      id:1
      }).then(res=>{
        if(res.code==200){
          this.content=res.data.content
        }
      })
    }
  },
  created(){
    this.getInfo()
  }
};
</script>

<style scoped>
*{
    margin: 0;
    padding: 0;
}
.privacy{
    margin-left: 5vw;
    margin-right: 5vw;
    margin-top: 3vh;
    color: #999;
}
</style>
