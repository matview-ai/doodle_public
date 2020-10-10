/*
 * @Author: your name
 * @Date: 2020-06-24 09:59:40
 * @LastEditTime: 2020-07-02 16:06:34
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /大屏/src/pages/index.ts
 */

import Vue from "vue";

import App from '@/components/crop/index.vue';
import bg2 from './images/bg2.jpg';


const root = document.createElement('div');
document.body.appendChild(root)
let img: any = new Image();
img.src = bg2;

img.onload = function () {
  img.width = 400;
  img.height = 400 / (img.naturalWidth / img.naturalHeight);
  new Vue({

    render: (h) => h(App, {
      props: {
        "img": img
      }
    }),

  }).$mount(root)
}
