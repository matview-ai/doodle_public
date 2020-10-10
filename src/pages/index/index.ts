/*
 * @Author: your name
 * @Date: 2020-06-24 09:59:40
 * @LastEditTime: 2020-07-02 16:06:34
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /大屏/src/pages/index.ts
 */

import "@/less/style.less";
import Vue from "vue";
import App from './templates/index.vue';
const root = document.createElement('div');
document.body.appendChild(root)

new Vue({
    render: (h) => h(App),
}).$mount(root)