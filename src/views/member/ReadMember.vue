<template>
  <div class="musicmember">
    <ReturnBack :rcolor="'#fff'" :bcolor="'#00000087'"></ReturnBack>
    <NProgress v-if="loadingflag"/>
    <van-tabs v-model="active">
      <van-tab title="阅读教育">
        <List :Kaquanlist="list" v-if="isshow"></List>
      </van-tab>
      <van-tab title="网络工具">
        <List :Kaquanlist="list" v-if="isshow"></List>
      </van-tab>
    </van-tabs>
    
    
  </div>
</template>

<script>
import List from "@/components/List.vue";
import { getReadMember } from "@/api/member";
export default {
  components: {List},
  data() {
    return {
      flag:1,
      active:0,
      list:[],
      isshow:false,
      pagesize:500,
      loadingflag:false
    };
  },
  watch:{
    active(){
      if(this.active==0){
        this.isshow=!this.isshow
        this.flag=1
        this.getReadMemberList()
      }else{
        this.isshow=!this.isshow
        this.flag=2
        this.getReadMemberList()
      }
    }
  },
  mounted() {
    this.getReadMemberList()
  },
  created(){
    //加载
    this.loadingflag=true
    var _this=this
      setTimeout(function(){
        _this.loadingflag=false
    },1200)
    window.addEventListener('scroll', this.handleScroll);
  },
  destroyed(){
    window.removeEventListener('scroll', this.handleScroll);
  },

  methods: {
    getReadMemberList(){
      getReadMember({
        flag:this.flag,
        pageno:Number(1),
        pagesize:Number(this.pagesize)
      }).then(res=>{
        this.list=res.data
        this.isshow=!this.isshow
      })
    },
    onClickTab(){
      
    }
    
  },
};
</script>
<style scoped>
.musicmember{
  width: 100%;
  
  position: absolute;
}
.musicmember{
  background: #f0f0f0;
  padding-bottom: 3%;
}
.musicmember .wrap{
  padding-top: 5px;
}
>>> .van-tabs--line{
  padding-top: 0;
}
>>> .van-tabs__wrap{
  position: relative;
}
/* .list2{
  margin-top: 0;
  margin-left: 15px;
  margin-right: 15px;
} */
</style>