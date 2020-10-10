/*
 * @Author: your name
 * @Date: 2020-07-01 14:02:02
 * @LastEditTime: 2020-07-01 15:48:49
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: /大屏/src/utils/utils.ts
 */

import Vue from "vue";
import * as $ from "jQuery";

interface dataType {

    language: string,
    mode: string,
    vase_color: string,
    flower_color: string,
    from_source: string | null
}
export default new Vue({

    data: {
        loadingIntance: null,
        language: "",
        mode: "coop",
        vase_color: "#213f95",
        flower_color: "#ff9a7b",
        from_source: "web"
    } as dataType,
    methods: {



        logAction: function (msg: string, mode?: string | null, upload_id?: string) {
            let uuid = localStorage.uuid;
            if (!uuid) {
                uuid = this.generateUUID();
                localStorage.uuid = uuid;
            }
            if (mode) {
                this.mode = mode;
            }
            if (this.getQueryString('from') != 'none') {
                //console.log("from",this.getQueryString('from'));
                this.from_source = this.getQueryString('from');
            }
            if (!this.language) {
                if (this.getQueryString('language') == 'none') {
                    this.language = 'none';
                } else if (location.href.indexOf('\/jp\/') > 0) {
                    this.language = 'jp';
                } else if (location.href.indexOf('\/en\/') > 0) {
                    this.language = 'en';
                } else {
                    this.language = 'zh-cn';
                }
            }
            $.ajax({
                url: APIURL,
                data: {
                    user_id: uuid,
                    op: "add",
                    language: this.language,
                    mode: this.mode,
                    msg_1: msg,
                    msg_2: this.from_source,
                    msg_3: upload_id
                }
            })
                .done(function (html) {

                });
        },
        generateUUID: function (): string {
            var d = Date.now();
            if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
                d += performance.now(); //use high-precision timer if available
            }
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = (d + Math.random() * 16) % 16 | 0;
                d = Math.floor(d / 16);
                return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
            });
        },
        getQueryString: function (name: string, url: string = window.location.href) {
            /*
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)","i");
            var r = window.location.search.substr(1).match(reg);
            if (r!=null) return decodeURI(r[2]); return null;
            */
            var re = new RegExp("(^|[&|#|\?])" + name + "=([^&|#]*)(&|#|$)", "i");
            var m = url.match(re);
            return m ? decodeURI(m[2]) : null
        }
    }
})