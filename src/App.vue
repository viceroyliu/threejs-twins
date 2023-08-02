<template>
  <div id="three"></div>
</template>

<script setup>
import threeModel from "./threeModel.js";
import {onMounted} from "vue";

onMounted(() => {
  let three = document.querySelector('#three');
  // 添加至dom
  three.append(threeModel.domElement);
  // 设置尺寸
  threeModel.setSize(three.clientWidth, three.clientHeight);
})
</script>

<style scoped>
#three {
  width: 100vw;
  height: 100vh;
}
</style>
