<!--
 * @Author: your name
 * @Date: 2020-06-28 16:15:28
 * @LastEditTime: 2020-07-02 16:08:12
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /大屏/src/templetes/index/index.vue
--> 
<template>
  <window :pages="pages"></window>
</template>

<script lang="ts">
import Vue from "vue";
import * as $ from "jquery";
import window from "@/components/window/index.vue";
import Component from "vue-class-component";
import index_0 from "./index_0.vue";
import index_1 from "./index_1.vue";
const AppProps = Vue.extend({
  props: {}
});

const pages = [{ name: "index_0", component: index_0 }];
@Component({
  components: {
    window
  },

  computed: {}
})
export default class App extends AppProps {
  pages = pages;
}
</script>

