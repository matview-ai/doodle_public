<style>
</style>
<template>
  <div class="canvas-wrap">
    <canvas class="canvas" @mousedown="onMousedown($event)" @touchstart="onMousedown($event)"></canvas>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import * as $ from "jquery";
import Component from "vue-class-component";

const AppProps = Vue.extend({});
@Component({
  // 查看 Vue.js 文档, 来了解所有的选项:
  // https://vuejs.org/v2/api/#Options-Data
  props: {
    img: {
      type: [HTMLCanvasElement, HTMLImageElement]
    },
    location: {
      type: Object
    }
  },
  computed: {},

  watch: {
    img(a, b) {
      let self: any = this;
      self.reset();
      self.initCanvasPosition(this.$props.location);
      self.drawImage();
    },
    location: function(a, b) {}
  },
  mounted() {
    //
    //this.onTouchStart();
  }
})
export default class App extends AppProps {
  // 初始数据可以直接声明为实例的 property
  canvas = document.createElement("canvas");
  ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;

  width: number = 0;
  height: number = 0;
  faceRatio = 0.4;
  scale = {
    enable: false,
    initRatio: 1,
    ratio: 1,
    dict: 0,
    _ratio: 1,
    offset: {
      x: 0,
      y: 0
    }
  };
  translate = {
    enable: false,
    x: 0,
    y: 0,
    left: 0,
    top: 0,
    _top: 0,
    _left: 0
  };
  eventNames = {
    mouseup: "mouseup",
    mousemove: "mousemove",
    mousedown: "mousedown"
  };
  onTouchStart(): void {}
  onClick(): void {}
  reset() {
   
    this.width = this.height =
      Math.min(400, (Math.min(window.innerHeight, window.innerWidth) / 4) * 3) *
      (1 + (this.$props.location.num - 1) / 2);

    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.drawImage();
  }
  clearRect() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  init() {
    this.reset();
    if ("ontouchstart" in window) {
      this.eventNames = {
        mouseup: "touchend",
        mousemove: "touchmove",
        mousedown: "touchstart"
      };
    }
  }

  onMousedown(e: any) {
    e.stopPropagation();
    e.preventDefault();

    if (!e.touches || e.touches.length == 1) {
      this.translate._left = this.translate.left;
      this.translate._top = this.translate.top;
      let x = this.getMousePos(e, "pageX"),
        y = this.getMousePos(e, "pageY");
      this.translate.enable = true;
      this.translate.x = x;
      this.translate.y = y;
    } else if (e.touches && e.touches.length == 2) {
      let p1 = e.touches[0];
      let p2 = e.touches[1];
      let dict = Math.sqrt(
        Math.pow(p1["pageX"] - p2["pageX"], 2) +
          Math.pow(p1["pageY"] - p2["pageY"], 2)
      );
      this.scale.dict = dict;
      this.scale._ratio = this.scale.ratio;
      this.translate._left = this.translate.left;
      this.translate._top = this.translate.top;

      if (!this.scale.enable) {
        var imWidth = this.$props.img.width * this.scale.ratio,
          imHeight = this.$props.img.height * this.scale.ratio;
        var offset = {
          x: (p1["pageX"] - this.translate._left) / imWidth,
          y: (p1["pageY"] - this.translate._top) / imHeight
        };
        offset.x = Math.min(offset.x, 1);
        offset.x = Math.max(offset.x, 0);
        offset.y = Math.min(offset.y, 1);
        offset.y = Math.max(offset.y, 0);
        this.scale.offset = offset;
      }
      this.scale.enable = true;
      this.translate.enable = false;
    }

    document.addEventListener(this.eventNames.mousemove, this.onMousemove, {
      passive: false
    });
    document.addEventListener(this.eventNames.mouseup, this.onMouseup);
  }
  checkPointInRect(pos: number[], vs: number[][]): boolean {
    var x = pos[0],
      y = pos[1];
    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
      var xi = vs[i][0],
        yi = vs[i][1];
      var xj = vs[j][0],
        yj = vs[j][1];

      var intersect =
        yi > y != yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
      if (intersect) inside = !inside;
      if (x == xi && y == yi) {
        inside = true;
        break;
      }
    }
    return inside;
  }
  onMousemove(e: any) {
    e.stopPropagation();
    e.preventDefault();
    let x = this.getMousePos(e, "pageX"),
      y = this.getMousePos(e, "pageY");
    if (this.translate.enable) {
      this.translate.left = this.translate._left + (x - this.translate.x);
      this.translate.top = this.translate._top + (y - this.translate.y);

      this.drawImage();
    } else if (e.touches && e.touches.length == 2 && this.scale.enable) {
      let p1 = e.touches[0];
      let p2 = e.touches[1];

      let dict = Math.sqrt(
        Math.pow(p1["pageX"] - p2["pageX"], 2) +
          Math.pow(p1["pageY"] - p2["pageY"], 2)
      );

      this.scale.ratio = this.scale._ratio + (dict - this.scale.dict) * 0.002;

      if (this.scale.ratio < this.scale.initRatio * 0.5) {
        this.scale.ratio = this.scale.initRatio * 0.5;
      }
      if (this.scale.ratio > this.scale.initRatio * 15) {
        this.scale.ratio = this.scale.initRatio * 15;
      }

      var imWidth = this.$props.img.width * this.scale.ratio,
        imHeight = this.$props.img.height * this.scale.ratio;
      var changeRatio = this.scale.ratio - this.scale._ratio;

      this.translate.left =
        this.translate._left -
        this.$props.img.width * changeRatio * this.scale.offset.x;
      this.translate.top =
        this.translate._top -
        this.$props.img.height * changeRatio * this.scale.offset.y;
      this.drawImage();
    }
  }
  fixedTranslate() {
    var imWidth = this.$props.img.width * this.scale.ratio,
      imHeight = this.$props.img.height * this.scale.ratio;
    this.translate.left = Math.min(this.translate.left, this.width / 2);

    this.translate.left = Math.max(
      this.translate.left,
      this.width / 2 - imWidth
    );

    this.translate.top = Math.min(this.translate.top, this.height / 2);

    this.translate.top = Math.max(
      this.translate.top,
      this.height / 2 - imHeight
    );
  }
  onMouseup(e: any) {
    this.scale.enable = false;
    this.translate.enable = false;
    document.removeEventListener(this.eventNames.mousemove, this.onMousemove);
    document.removeEventListener(this.eventNames.mouseup, this.onMouseup);
  }
  getMousePos(e: any, name: string) {
    if (e && e.touches && e.touches.length) {
      return e.touches[0][name];
    }
    return e[name];
  }

  generateSvg(): string {
    let svg = "";

    return `<?xml version="1.0" encoding="UTF-8"?>
          <svg width="${this.width}px" height="${this.height}px" viewBox="0 0 ${this.width} ${this.height}" 
          version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
          ${svg}</svg>`;
  }

  initCanvasPosition(initpos?: any) {
     
    this.scale.ratio = this.scale.initRatio = 1;
    this.translate.left = this.translate._left =
      (this.width - this.$props.img.width * this.scale.ratio) / 2;
    this.translate.top = this.translate._top =
      (this.height - this.$props.img.height * this.scale.ratio) / 2;

    if (initpos) {
      var initscale =
        (initpos.scale * this.width) / Math.max(initpos.width, initpos.height);
      this.scale._ratio = this.scale.ratio;
      this.scale.ratio = initscale;
      var changeRatio = this.scale.ratio - this.scale._ratio;

      this.translate.left =
        this.translate._left - this.$props.img.width * changeRatio * 0.5;

      this.translate.left +=
        (this.$props.img.width / 2 - (initpos.left + initpos.width / 2)) *
        this.scale.ratio;

      this.translate.top =
        this.translate._top - this.$props.img.height * changeRatio * 0.5;

      //除6，是因为想要将额头以上露出来
      this.translate.top +=
        (this.$props.img.height / 2 - (initpos.top + initpos.height / 4)) *
        this.scale.ratio;


    }
  }
  drawImage(
    ctx: CanvasRenderingContext2D = this.ctx,
    img: any = this.$props.img
  ) {
    this.fixedTranslate();
    this.clearRect();
    let left = this.translate.left;
    let top = this.translate.top;

    ctx.save();

    ctx.translate(left, top);

    ctx.scale(this.scale.ratio, this.scale.ratio);

    ctx.drawImage(img, 0, 0, img.width, img.height);

    ctx.restore();
  }
  created() {
    this.$on("appear", (e: any) => {
      this.reset();
    });
  
    this.$on("reset", () => {
      this.reset();
    });
    this.$on(
      "getCropImage",
      (foreground: string, callback: (res: any) => void) => {
        if (foreground) {
          let canvas = document.createElement("canvas");
          let ctx: any = canvas.getContext("2d");
          canvas.width = this.canvas.width;
          canvas.height = this.canvas.height;
          let img = new Image();
          img.onload = () => {
            this.drawImage(ctx, img);
            let result = {
              imageData: ctx.getImageData(0, 0, canvas.width, canvas.height),
              offset: {
                x: this.translate.left,
                y: this.translate.top
              },
              scale: this.scale.ratio
            };

            callback(result);
          };
          img.src = "data:image/jpeg;base64," + foreground;
        } else {
          let result = {
            imageData: this.ctx.getImageData(
              0,
              0,
              this.canvas.width,
              this.canvas.height
            ),
            offset: {
              x: this.translate.left,
              y: this.translate.top
            },
            scale: this.scale.ratio
          };
          callback(result);
        }
      }
    );
  }
  mounted() {
    this.canvas = $(this.$el)
      .find(".canvas")
      .get(0) as HTMLCanvasElement;
    this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    if (this.canvas != null) {
      this.init();
    }

    // this.onTouchStart();
  }
}
</script>

