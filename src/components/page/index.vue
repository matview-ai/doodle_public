<!--
 * @Author: your name
 * @Date: 2020-06-28 16:15:28
 * @LastEditTime: 2020-07-02 16:43:32
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /大屏/src/components/page/index.vue
--> 
<template>
  <component
    ref="componentRef"
    @finish="finish"
    @redirectTo="redirectTo"
    @navigateTo="navigateTo"
    v-bind:is="page.component"
  ></component>
</template>
<script lang="ts">
import Vue from "vue";
import * as $ from "jquery";
import Page from "./index";
import Component from "vue-class-component";
import utils from "../../utils/utils";
import Loading from "@/components/loading/index";
type point = number[];
const AppProps = Vue.extend({
  props: {
    page: Object
  }
});
@Component({
  mixins: [Page],
  // 查看 Vue.js 文档, 来了解所有的选项:
  // https://vuejs.org/v2/api/#Options-Data

  computed: {}
})
export default class App extends AppProps {
  isAsync = false;
  created() {}
  navigateTo(name: string, ...args: any) {
    this.$emit("navigateTo", name, ...args);
  }

  finish() {
    this.$emit("finish", this.page.name);
  }
  redirectTo(name: string, ...args: any) {
    this.$emit("redirectTo", name, ...args);
  }
  mounted() {
    if (this.$children.length) {
      this.$emit("pageLoadDone", this.page);
    } else {
      Loading.show();
      this.isAsync = true;
    }
  }
  updated() {
    if (this.isAsync) {
      this.$emit("pageLoadDone", this.page);
      Loading.hide();
      this.isAsync = false;
    }
  }
}
</script>

