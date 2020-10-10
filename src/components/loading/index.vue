<style>
.cls-loading {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 999999;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
}
.cls-loading .loading {
  background: rgba(0, 0, 0, 0.5);
  padding: 30px;
  border-radius: 15px;
  color: #fff;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  max-width: 80%;
  box-sizing: border-box;
}
.cls-loading .loading .icon {
  width: 30px;
  height: 30px;
  background: url("./images/loading.gif");
  background-size: 100% auto;
}
.cls-loading .loading .icon.warning {
  background: url("./images/icon50_caveat.png");
  background-size: contain;
}
.cls-loading .loading p {
  margin-top: 15px;
  font-size: 14px;
  margin-bottom: -15px;
}
</style>
<template>
  <transition :name="'fade'" :appear="true">
    <div class="cls-loading">
      <div class="loading">
        <span class="icon" :class="icon"></span>
        <p v-if="text" v-text="text"></p>
      </div>
    </div>
  </transition>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

type point = number[];
const AppProps = Vue.extend({
  data() {
    return {
      icon: "",
      text: ""
    };
  }
});
@Component({
  // 查看 Vue.js 文档, 来了解所有的选项:
  // https://vuejs.org/v2/api/#Options-Data

  computed: {},

  mounted() {
    //
    //this.onTouchStart();
  }
})
export default class App extends AppProps {
  created() {}

  mounted() {}
}
</script>

