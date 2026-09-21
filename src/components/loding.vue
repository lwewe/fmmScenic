<template>
  <div class="loading">
    <div>
      <van-loading :color="colorType==1?'#fff':'#8A8A8A'" size="16px"/>
    </div>
    <div class="loadingText" :style="{color:colorType==1?'#fff':'#8A8A8A'}">{{loadingText==0?'调取支付中...': '加载中...' }}</div>
  </div>
</template>

<script>
export default {
  name: 'Loading', // 定义的组件名称 使用时写法：loading
  props:['loadingText','colorType']
}
</script>

<style scoped lang="less">
.loading {
  padding-top: 5px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}

.loadingText {
  font-size: 10px;
  color: #8A8A8A;
}
</style>