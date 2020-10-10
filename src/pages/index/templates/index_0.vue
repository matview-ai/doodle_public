<!--
 * @Author: your name
 * @Date: 2020-06-28 16:15:28
 * @LastEditTime: 2020-07-02 16:09:23
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /大屏/src/templetes/index/index_0.vue
--> 
<style>
.cls-body {
  max-width: 512px;
  margin: 0 auto;
}
</style>
<template>
  <div class="cls-page" id="divCans">
    <div class="wrapper div-scroll" @click="menuShow=false">
      <div class="cls-body">
        <div class="relative mb-20px d-flex justify-content-between align-items-center">
          <div class="cls-logo">
            <img src="./images/logo.png" alt />
          </div>
          <div id="divTitle" class="pageTitle">
            <b>{{text.productName}}</b>
            <br />
            <p style="font-size: 14px;">{{text.slogan}}</p>

            <!-- <img class="decorate" src="images/image1.png" alt=""> -->
          </div>
          <div class="cls-menu text-right"></div>
        </div>
        <div class="cls-flex colBox cls-wrapper">
          <div class="rowBox justify-space-between cls-toolbar">
            <div class="rowBox">
              <div
                class="tools btn btnPencil"
                :class="{btnActive:lineWidth==2 && !eraserEnable}"
                @click="lineWidth=2;eraserEnable=false"
              ></div>
              <div
                class="tools btn btnBrush"
                :class="{btnActive:lineWidth==10 && !eraserEnable}"
                @click="lineWidth=10;eraserEnable=false"
              ></div>
              <div class="tools btn btnEraser" :class="{btnActive:eraserEnable}" @click="eraser"></div>
              <div class="tools btn btnClear" @click="reset"></div>
            </div>
            <div class="rowBox cls-elements">
              <div
                class="rowBox el btnVase"
                :class="{btnActive:lineColor==utils.vase_color,disabled:mode==1}"
                @click="lineColor=utils.vase_color"
              ></div>
              <div
                class="rowBox el btnFlower"
                :class="{btnActive:lineColor==utils.flower_color,disabled:mode==1}"
                @click="lineColor=utils.flower_color"
              ></div>
            </div>
          </div>
          <div class="rowBox flex-1 overflow-hidden">
            <canvas id="canvas"></canvas>
          </div>
        </div>
        <div class="d-flex flex-nowrap cls-styles-wrapper">
          <div
            class="col-fill"
            :class="{active:activeIndexLocation==0}"
            @click="activeIndexLocation=0"
          >
            <img src="./images/style_0_1.png" alt />
          </div>
          <div
            class="col-fill"
            :class="{active:activeIndexLocation==1}"
            @click="activeIndexLocation=1"
          >
            <img src="./images/style_1_1.png" alt />
          </div>
          <div
            class="col-fill"
            :class="{active:activeIndexLocation==2}"
            @click="activeIndexLocation=2"
          >
            <img src="./images/style_2_1.png" alt />
          </div>
          <div
            class="col-fill"
            :class="{active:activeIndexLocation==3}"
            @click="activeIndexLocation=3"
          >
            <img src="./images/style_3_1.png" alt />
          </div>
          <div class="col-fill">
            <img src="./images/style_4_0.png" alt />
          </div>
        </div>
        <div class="cls-footer-bar-wrap">
          <div class="cls-footer-bar">
            <div class="d-flex justify-content-between align-items-center cls-models-wrap">
              <div class="rowBox p-auto cls-mode-select">
                <div class="rowBox flex-1" :class="{active:mode==1}" @click="modeChange(1)">
                  <span class="icon"></span>
                  <span>{{text.mode1_name}}</span>
                </div>
                <div class="rowBox flex-1" :class="{active:mode==2}" @click="modeChange(2)">
                  <span class="icon"></span>
                  <span>{{text.mode2_name}}</span>
                </div>
                <!-- <div class="rowBox flex-1" :class="{active:mode==3}" @click="modeChange(3)">
                  <span class="icon"></span>
                  <span>{{text.mode3_name}}</span>
                </div>-->
              </div>
            </div>
            <div class="rowBox p-auto">
              <input
                class="blueButton solid min-width-10em mt-0"
                type="button"
                :disabled="disabledNext"
                :value="text.next_text"
                @click="next"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <transition name="`fade`">
      <SignView v-if="showSignView" v-on:done="done"></SignView>
    </transition>
    <transition name="`fade`">
      <div class="cls-tips" v-if="help_step">
        <transition name="`fade`">
          <div v-if="help_step==1">
            <div class="cls-step1-wrap">
              <img class="hand cls-animate-hand-tips" src="./images/tips_img_0003_1.png" alt />
              <div class="cls-step1-flower-wrap">
                <div class="cls-animate-vase-tips"></div>
                <p class="cls-animate-vase-tips-text">{{text.step_tips1_text}}</p>
              </div>
              <div class="rowBox mt-30px" style="display:none">
                <input
                  class="blueButton white min-width-10em"
                  type="button"
                  :value="text.get"
                  @click="step1Done"
                />
              </div>
            </div>
          </div>
        </transition>
        <transition name="`fade`">
          <div v-if="help_step==2">
            <div class="cls-step2-wrap">
              <img class="hand cls-animate-hand-tips" src="./images/tips_img_0003_1.png" alt />
              <div class="cls-step2-flower-wrap">
                <div class="cls-animate-flower-tips"></div>
                <div class="cls-animate-vase-tips"></div>
                <p class="cls-animate-vase-tips-text">{{text.step_tips2_text1}}</p>
              </div>
              <div class="rowBox mt-30px" style="display:none">
                <input
                  class="blueButton white min-width-10em"
                  type="button"
                  :value="text.get"
                  @click="step2Done"
                />
              </div>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import utils from "@/utils/utils";
import Vue from "vue";
import i18n from "@/i18n/#{lang}/lang.json";
import * as $ from "jquery";
import Component from "vue-class-component";
import { SignCanvas } from "@/js/signCanvas";
import SignView from "./index_1.vue";
import index_2 from "./index_2.vue";
import "./less/index_0.less";
import Loading from "@/components/loading/index";
import ResultImage from "./resultImage";

const AppProps = ResultImage.extend({
  props: {
    propMessage: String
  }
});
const colors = {
  hex: "#000"
};

//let index_2 = () => import(/* webpackChunkName: "asnyc" */ "./index_2.vue");

@Component({
  components: {
    SignView
  },
  data() {
    return {
      text: i18n
    };
    // text: 'demo'
  },
  computed: {}
})
export default class App extends AppProps {
  text: any;
  disabledNext = false;
  from: string | null = "";
  showLanguagesSelect = true;
  showSignView = false;
  drawCanvas: SignCanvas | null = null;
  lineWidth = 10;
  utils = utils;
  lineColor = utils.vase_color; //"blue";
  eraserEnable = false;
  showLanguagesBox = 0;
  menuShow = false;
  activeIndexLocation = 0;
  order_id = "";
  eraser() {
    this.eraserEnable = !this.eraserEnable;
  }
  reset() {
    this.drawCanvas!.rewrite();
  }
  async done(signObject: any, signSvg: string) {
    //this.$emit("navigateTo", "index_2", signObject);
    let oriBase64 = this.drawCanvas!.canvas.toDataURL("image/png");
    try {
      Loading.show(this.text.loading);
      let { imgBase64, upload_id } = await this.upload(oriBase64, signSvg);

      utils.logAction("done_sign");
      if (utils.getQueryString("from") == "qq") {
        let resultData = await this.getResultImage(
          signObject,
          imgBase64,
          oriBase64,
          upload_id,
          document.createElement("canvas")
        );

        if (resultData != null) {
          var qq_result_page = "/pages/result/result";
          (<any>resultData).order_id = this.order_id;

          qq.miniProgram.postMessage({ data: resultData });
          setTimeout(() => {
            Loading.hide();
            qq.miniProgram.redirectTo({
              url: qq_result_page
            });
          }, 100);
        } else {
          Loading.hide();
        }
      } else {
        Loading.hide();
        this.$emit(
          "navigateTo",
          { component: index_2, name: "index_2" },
          signObject,
          imgBase64,
          oriBase64,
          upload_id
        );
      }
    } catch (err) {
      Loading.hide(err, "warning", 0);
      this.$emit("appear");
    }
  }

  async next() {
    this.disabledNext = true;
    if (this.mode == 1) {
      Loading.show(this.text.loading);
      try {
        let res = await $.ajax({
          type: "get",
          url: APIURL,
          data: "data",
          dataType: "json"
        });
        if (res && res.status == 100201) {
          let points = JSON.parse(res.flower.points);
          Loading.hide();
          this.drawRobotFlower(points);
        } else {
          throw res.message;
        }
      } catch (err) {
        Loading.hide(err, "warning", 0);
        this.disabledNext = false;
      }
    } else {
      this.showSignView = true;
    }
    utils.logAction("next");
  }
  upload(
    picData: string,
    signPath: string
  ): Promise<{ imgBase64: string; upload_id: string }> {
    return new Promise(async (resolve, reject) => {
      try {
        let data = await $.ajax({
          url: APIURL, // 跳转到 action
          data: {
            picData: picData,
            style_type: this.activeIndexLocation,
            k: "XUY,3257cd",
            signPath: signPath
          },
          type: "post",
          cache: false,
          dataType: "json"
        });
        if (data.status == 1) {
          this.cur_run_time = 0;
          window.setTimeout(() => {
            this.get_result(data.id, 1, resolve, reject);
          }, 1000);
          localStorage.order_id = this.order_id = data.order_id;
          utils.logAction("uploaded", null, data.id);
        } else {
          reject(data.message);
        }
      } catch (err) {
        reject(err);
      }
    });
  }
  max_run_times = 100;
  cur_run_time = 0;
  get_result<
    T extends (res: { imgBase64: string; upload_id: string }) => void,
    K extends (err: string) => void
  >(id: string, stage: number, resolve: T, reject: K) {
    if (this.cur_run_time < this.max_run_times) {
      window.setTimeout(async () => {
        this.cur_run_time++;
        Loading.show(this.text.painting);
        let data = await $.ajax({
          url: APIURL, // 跳转到 action
          data: {
            id: id,
            stage: stage,
            k: "XUY,3257cd"
          },
          type: "post",
          cache: false,
          dataType: "json"
        });
        if (data.status == 0) {
          this.get_result(id, stage, resolve, reject);
        } else if (data.status == 1) {
          this.cur_run_time = 0;
          stage++;

          localStorage.upload_id = id;

          let imgBase64 = "data:image/jpeg;base64," + data.pic;

          resolve({ imgBase64, upload_id: id });
        } else {
          reject(data.message || this.text.networkFail);
        }
      }, 1000);
    } else {
      reject(this.text.networkFail);
    }
  }
  drawRobotFlower(points: any) {
    if (
      !this.drawCanvas!.scale2Center(() => {
        this.drawCanvas!.supplyDraw(points.fitCubicPoints, points.rect, () => {
          //signCanvas.rewrite();
          this.showSignView = true;
        });
      })
    ) {
      this.disabledNext = false;
    }
  }

  help_step = 0;
  created() {
    if (utils.getQueryString("from") != "none") {
      //console.log("from",this.getQueryString('from'));
      this.from = utils.getQueryString("from");
    }
    this.showLanguagesSelect = utils.getQueryString("language") != "none";
    this.$watch("help_step", a => {
      let offset: any = $(".cls-wrapper ").offset();
      var width = $(".cls-wrapper ").width();
      var css: any = {
        width: width,
        left: offset.left,
        top: offset.top
      };

      if (a == 1) {
        this.$nextTick(() => {
          $(".cls-step1-wrap").css(css as any);
          $(".cls-step1-flower-wrap").height(
            ($(".cls-wrapper ").height() as number) / 1.8
          );
          setTimeout(function() {
            $(".cls-step1-wrap .rowBox").fadeIn(300);
          }, 2000);
        });
      } else if (a == 2) {
        let self = this;
        this.$nextTick(() => {
          $(".cls-step2-wrap").css(css);
          $(".cls-step2-flower-wrap").height(
            ($(".cls-wrapper ").height() as number) - 50
          );
          css.top += 10;

          css.left = offset.left + width - 90;
          css.width = 40;

          setTimeout(function() {
            $(".cls-tips .hand").css({ right: 15 });
            $(".cls-tips .hand").addClass("animate-remove");
            setTimeout(function() {
              $(".cls-tips .hand").removeClass("animate-remove");
              setTimeout(function() {
                $(".cls-step2-wrap .cls-animate-vase-tips-text").text(
                  self.text.step_tips2_text2
                );
              }, 1000);
              setTimeout(function() {
                $(".cls-tips .rowBox").fadeIn(300);
              }, 2000);
            }, 15);
          }, 2500);
        });
      }
    });
    this.$on("willAppear", () => {
      this.showSignView = false;
      this.disabledNext = false;
      this.reset();
    });
    this.$on("didAppear", () => {});
    this.$watch("lineWidth", (a, b) => {
      this.drawCanvas!.setLineWidth(a);
    });
    this.$watch("lineColor", (a, b) => {
      if (this.mode == 1) {
        this.lineColor = utils.vase_color; //"blue";
      }
      this.drawCanvas!.setColor(a);
    });
    this.$watch("eraserEnable", (a, b) => {
      this.drawCanvas!.setEraser(a);
    });
  }
  mode = 1;
  modeChange(mode: number) {
    this.mode = mode;
    if (this.mode == 1) {
      this.lineColor = utils.vase_color; //"blue";
      this.reset();
    } else if (this.mode == 2) {
      if (localStorage.help_step_v1 != 2) {
        this.help_step = 2;
      }
    }
    this.disabledNext = false;
    utils.logAction("switch_mode", this.mode == 1 ? "coop" : "free");
  }
  step1Done() {
    this.help_step = 0;
    localStorage.help_step_v1 = 1;
  }
  step2Done() {
    this.help_step = 0;
    localStorage.help_step_v1 = 2;
  }
  mounted() {
    if (!localStorage.help_step_v1) {
      this.help_step = 1;
    }
    this.drawCanvas = new SignCanvas(
      document.getElementById("canvas") as HTMLCanvasElement,
      512,
      1,
      { mouseupUnDrawAgain: true }
    );
    this.drawCanvas!.setLineWidth(this.lineWidth);
    this.drawCanvas!.setColor(this.lineColor);
    this.$emit("appear");
    utils.logAction("start");
  }
}
</script>

