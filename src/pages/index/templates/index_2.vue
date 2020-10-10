<!--
 * @Author: your name
 * @Date: 2020-06-28 16:15:28
 * @LastEditTime: 2020-07-02 16:40:26
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /大屏/src/templetes/index/index_2.vue
-->
<style></style>
<template>
  <div class="cls-page">
    <div class="pageTitle">{{ text.awesome }}!</div>

    <div class="cls-flex align-center">
      <canvas id="resultCanvas"></canvas>
    </div>
    <transition :name="`fade`">
      <div style="padding-bottom: 30px" v-show="showButtons">
        <div class="text-center">
          <input class="blueButton min-width-10em" type="button" :value="text.save" @click="save" />
        </div>
        <div class="text-center">
          <input
            class="blueButton solid min-width-10em"
            type="button"
            :value="text.tryAgain"
            @click="back"
          />
        </div>
        <div class="text-center" v-show="showBuyText">
          <div class="buy-this-painting">
            <div>
              <a @click="showBuyViewFun">{{ text.buy_this_painting }}</a>
            </div>
            <div>
              <img style="width: 30px" src="./images/icon_help.png" alt />
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition :name="`fade`">
      <div class="page cls-save-pic" v-show="showSaveView">
        <div class="cls-flex align-center" style="height: 100%">
          <img :src="imgSrc" alt style="max-height: 70%" />
          <p class="text-center tips">( {{ text.saveTips }} )</p>
          <div class="text-center" style="margin-top: 20px">
            <a @click="showSaveView = false">
              <img style="width: 30px" src="./images/icon_close.png" alt />
            </a>
          </div>
        </div>
      </div>
    </transition>
    <transition :name="`fade`">
      <div class="page cls-save-pic" v-show="showBuyView">
        <div class="cls-flex align-center" style="height: 100%">
          <p class="text-center tips buy_tips">
            {{ text.buy_this_painting_tips }}
            <br />
            <i>{{ order_id }}</i>
          </p>
          <div class="text-center" style="margin-top: 20px">
            <a @click="showBuyView = false">
              <img style="width: 30px" src="./images/icon_close.png" alt />
            </a>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import * as $ from "jquery";
import i18n from "@/i18n/#{lang}/lang.json";
import { ResultCanvas } from "@/js/signCanvas";
import Component, { mixins } from "vue-class-component";
import utils from "@/utils/utils";
import ResultImage from "./resultImage";

// import "./less/index_2.less";
const AppProps = ResultImage.extend({
  props: {}
});

@Component({
  components: {},
  data() {
    return {
      text: i18n
    };
    // text: 'demo'
  },

  watch: {
    showModal(to: any, from: any) {}
  },
  computed: {}
})
export default class App extends AppProps {
  showButtons = false;
  showSaveView = false;
  showBuyView = false;
  imgSrc = "";
  upload_id = "";
  order_id = "";
  showBuyText = false;
  req_from = utils.getQueryString("from");
  back() {
    this.$emit("finish");
    $(".pageTitle").show();

    utils.logAction("retry", null, this.upload_id);
  }
  created() {
    this.$on(
      "init",
      (
        signObject: any,
        imgBase64: string,
        oriBase64: string,
        upload_id: string
      ) => {
        this.getResultImage(signObject, imgBase64, oriBase64, upload_id);
      }
    );
  }
  save() {
    this.showSaveView = true;
    utils.logAction("save", null, this.upload_id);
  }

  showBuyViewFun() {
    this.showBuyView = true;
    utils.logAction("click_buy_view", null, this.upload_id);
  }
  mounted() {}
  // 组件方法也可以直接声明为实例的方法
}
</script>
