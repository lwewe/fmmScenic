<template>
<div class="ReturnBack" >
<!--  :style="'position:'+ pos"-->
  <div class="return" :style="'background-color:'+ bcolor" @click="returnBack">
    <van-icon :color="rcolor"   size="18px" name="arrow-left" />
  </div>
</div>
</template>
<script>
export default {
  name: "ReturnBack",
  props:{
    rcolor:[String,Number],
    bcolor:[String,Number],
  },
  methods:{
    returnBack(){
      this.$router.go(-1)
    }
  },
}
</script>

<style scoped>
.ReturnBack{
  position: fixed;
  top: 10px;
  left: 10px;
  z-index: 999;
}
.return{
  background-color: #00000087;
  border-radius: 50%;
  width: 15px;
  height: 15px;
  padding: 7px 10px 9px 6px;
}
</style>