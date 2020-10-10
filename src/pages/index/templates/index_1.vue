<style>
.cls-modal {
  background: rgba(0, 0, 0, 0.75) !important;
}
</style>
<template>
  <div
    class="cls-page nobackground cls-modal cls-flex cls-flex align-center justify-center"
    @click="$emit('hide',$event)"
  >
    <div class="cls-flex align-center" style="height: 100%;">
      <div class="colBox pageTitle" style="font-size: 20px;">{{text.signNameTips}}</div>
      <div class="colBox" style="margin-top:20px;">
        <div class="colBox">
          <canvas id="signCanvas" class="cls-sign-canvas"></canvas>
          <div class="text-right">
            <a href="javascript:" @click="reset" class="btn-text">{{text.rewrite}}</a>
          </div>
        </div>
      </div>

      <div class="colBox">
        <input
          class="blueButton solid min-width-10em"
          type="button"
          :value="text.done"
          @click="done"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import i18n from "@/i18n/#{lang}/lang.json";
import * as $ from "jquery";
import utils from "@/utils/utils";
import { SignCanvas } from "@/js/signCanvas";
import Component, { mixins } from "vue-class-component";
import { watch } from "fs";
const AppProps = Vue.extend({
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
  computed: {}
})
export default class App extends AppProps {
  signCanvas: SignCanvas | null = null;
  mounted() {
    this.signCanvas = new SignCanvas(
      document.getElementById("signCanvas") as HTMLCanvasElement,
      512,
      0.5,
      true
    );
    this.signCanvas.setColor("black");
  }
  reset() {
    this.signCanvas!.rewrite();
    utils.logAction("rewrite_sign");
  }
  done() {
    this.$emit("done", this.signCanvas!.getSign(), this.signCanvas!.getSvg());
  }
}
</script>

