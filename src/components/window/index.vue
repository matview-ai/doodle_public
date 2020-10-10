<style>
.cls-window {
  height: 100%;
  width: 100%;
  overflow: hidden;
}
</style>
<template>
  <div class="cls-window">
    <transition
      v-bind:key="index"
      v-for="(item,index) in allPages"
      :name="item.transtion"
      @before-enter="beforeEnter(item)"
      @after-enter="afterEnter(item)"
      @after-leave="afterLeave(index,item)"
    >
      <page
        @pageLoadDone="pageLoadDone"
        v-show="index==activeIndex"
        v-if="item.status>0"
        @redirectTo="redirectTo"
        @finish="finish"
        @navigateTo="navigateTo"
        :page="item"
      ></page>
    </transition>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import * as $ from "jquery";
import Component from "vue-class-component";
import page from "../page/index.vue";

type point = number[];
const AppProps = Vue.extend({
  props: {
    pages: Array
  }
});
@Component({
  // 查看 Vue.js 文档, 来了解所有的选项:
  // https://vuejs.org/v2/api/#Options-Data
  components: {
    page
  },
  computed: {},

  mounted() {
    //
    //this.onTouchStart();
  }
})
export default class App extends AppProps {
  allPages: any = [];
  activeIndex = 0;

  finish(name: string) {
    for (let i in this.allPages) {
      let item = this.allPages[i];
      if (item.name == name) {
        var lastIndex = this.activeIndex - 1;
        for (; lastIndex >= 0; lastIndex--) {
          if (this.allPages[lastIndex].status > 0) {
            break;
          }
        }
        if (lastIndex >= 0) {
          this.activeIndex = lastIndex;
          this.allPages[this.activeIndex].transtion = "rightIn";
          item.transtion = "rightOut";
          item.status = 2;
        }
        break;
      }
    }
  }
  beforeEnter(item: any) {
    let refs: any = this.$children;
    for (const child of refs) {
      if (child.page.name == item.name) {
        //child.$broast("init", ...(item.args || []));
        child.$broast("willAppear");
      }
    }
  }
  afterEnter(item: any) {
    let refs: any = this.$children;
    for (const child of refs) {
      if (child.page.name == item.name) {
        child.$broast("didAppear");
      }
    }
  }
  afterLeave(index: number, item: any) {
    for (let i in this.allPages) {
      if (this.allPages[i].status == 2) {
        this.allPages[i].status = 0;
      }
    }
  }
  redirectTo(
    page: string | number | { component: Vue.Component; name: string },
    ...args: any
  ) {
    let [prevPage, nextPage] = this.navigateTo(page, ...args);
    if (prevPage) {
      prevPage.status = 2;
    }
  }
  navigateTo(
    page: string | number | { component: Vue.Component; name: string },
    ...args: any
  ) {
    let pageName = "",
      pageIndex = -1;
    if (page instanceof Object) {
      pageName = page.name as string;
    }
    if (typeof page == "string") {
      pageName = page;
    }
    if (typeof page == "number") {
      pageIndex = page;
    }
    if (pageName != "") {
      for (let i = 0; i < this.allPages.length; i++) {
        let item = this.allPages[i];
        if (item.name == pageName) {
          pageIndex = i;
        }
      }

      if (pageIndex < 0 && page instanceof Object) {
        this.allPages.push(
          Object.assign({ status: 0, transtion: "left" }, page)
        );
        pageIndex = this.allPages.length - 1;
      }
    }
    let nextPage = this.allPages[pageIndex];
    let prevPage = this.allPages[this.activeIndex];
    if (nextPage) {
      prevPage.transtion = "leftOut";
      nextPage.transtion = "leftIn";
      nextPage.args = args;
      nextPage.status = 1;
    }
    return [prevPage, nextPage];
  }
  pageLoadDone(item: any) {
    console.log("pageload success");
    let refs: any = this.$children;
    for (const child of refs) {
      if (child.page.name == item.name) {
        child.$broast("init", ...(item.args || []));
      }
    }
    for (let i = 0; i < this.allPages.length; i++) {
      let page = this.allPages[i];
      if (page.name == item.name) {
        this.activeIndex = i;
      }
    }
  }
  getPageByName(name: string): Vue | null {
    let refs: any = this.$children;
    for (const child of refs) {
      if (child.page.name == name) {
        return child;
      }
    }
    return null;
  }
  created() {}
  mounted() {
    for (let i in this.pages) {
      const item: any = this.pages[i];
      this.allPages.push(Object.assign({ status: 0, transtion: "left" }, item));
    }
    this.allPages[this.activeIndex].status = 1;
    this.allPages[this.activeIndex].transtion = "fade";
  }
}
</script>

