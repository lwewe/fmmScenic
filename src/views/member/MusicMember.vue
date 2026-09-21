<template>
  <div class="musicmember">
    <ReturnBack :rcolor="'#fff'" :bcolor="'#00000087'"></ReturnBack>
    <NProgress v-if="loadingflag"/>
    <div class="wrap">
      <List :Kaquanlist="list" v-if="isshow"></List>
    </div>
  </div>
</template>

<script>
import List from "@/components/List.vue";
import { getMusicMember } from "@/api/member";
export default {
  components: {List},
  data() {
    return {
      list:[],
      isshow:false,
      pagesize:100,
      loadingflag:false
    };
  },

  mounted() {
    window.addEventListener('scroll', this.handleScroll);
    this.getMusicMemberList()
  },
  created(){
    //加载
    this.loadingflag=true
    var _this=this
    setTimeout(function(){
      _this.loadingflag=false
    },1000)
    window.addEventListener('scroll', this.handleScroll);
  },
  destroyed(){
    window.removeEventListener('scroll', this.handleScroll);
  },

  methods: {
    getMusicMemberList(){
      getMusicMember({
        pageno:"1",
        pagesize:this.pagesize+''
      }).then(res=>{
        this.list=res.data;
        this.isshow=!this.isshow
      })
    },
   
  },
};
</script>
<style scoped>
.musicmember{
  width: 100%;
  height: 97%;
  
}
.musicmember{
  background: #f0f0f0;
  padding-bottom: 3%;
}
.musicmember .wrap{
  padding-top: 5px;
}
/* .list2{
  margin-top: 0;
  margin-left: 15px;
  margin-right: 15px;
} */
</style>