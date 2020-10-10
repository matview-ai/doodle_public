import Vue from "vue"
import frameImage from "./images/frame.png";
import logoImg from "./images/logo.png";
import qrcodeImg from "./images/qrcode.png";
import wx_qrcodeImg from "./images/wx_qrcode.png";
import qq_qrcodeImg from "./images/qq_qrcode.png";
import bd_qrcodeImg from "./images/bd_qrcode.png";
import utils from "@/utils/utils"
import { ResultCanvas } from "@/js/signCanvas";

export default Vue.extend({
    data: () => ({
        signObject: {},
        resultCanvas: <ResultCanvas>{},
        imgBase64: '',
        oriBase64: '',
        upload_id: '',
        imgSrc: "",
        order_id: "",
        showButtons: false,
        showBuyText: false
    }),
    methods: {
        loadImage(images: string[]): Promise<HTMLImageElement[]> {
            let promises = [];
            for (let image of images) {
                promises.push(
                    new Promise((resolve, reject) => {
                        let img = new Image();
                        img.onload = function () {
                            resolve(img);
                        };
                        img.src = image;
                    })
                );
            }
            return Promise.all(promises) as Promise<HTMLImageElement[]>;
        },
        getResultImage(signObject: object, imgBase64: string, oriBase64: string, upload_id: string, canvas: HTMLCanvasElement = (document.getElementById("resultCanvas") as HTMLCanvasElement)) {
            this.signObject = signObject;
            this.imgBase64 = imgBase64;
            this.oriBase64 = oriBase64;
            this.upload_id = upload_id;
            if (utils.getQueryString("from") != "bd") {
                this.showBuyText = true;
            }
            $(".pageTitle").hide();
            let sourceFrom = utils.getQueryString("from");
            let thisQrCodeImg = qrcodeImg;
            switch (sourceFrom) {
                case "wx":
                    thisQrCodeImg = wx_qrcodeImg;
                    break;
                case "qq":
                    thisQrCodeImg = qq_qrcodeImg;
                    break;
                case "bd":
                    thisQrCodeImg = bd_qrcodeImg;
                    break;
            }

            this.resultCanvas = new ResultCanvas(canvas
                ,
                360
            );
            this.order_id = localStorage.order_id;
            var temp_order_id = this.order_id;
            let promise = new Promise((resolve, reject) => {
                this.loadImage([
                    imgBase64,
                    oriBase64,
                    frameImage,
                    logoImg,
                    thisQrCodeImg
                ]).then(images => {
                    var from = utils.getQueryString("from");

                    if (from != "qq") {
                        console.log("no qq");
                        this.resultCanvas!.setCallback(() => {
                            this.imgSrc = this.resultCanvas!.getImage(images[3], images[4]);
                            this.showButtons = true;
                        });
                        this.resultCanvas!.do(signObject, images[0], images[1], images[2]);
                    } else {
                        //qq小程序，跳转回小程序
                        console.log("qqabcd");
                        let result_data = this.resultCanvas!.do_qq(
                            signObject,
                            images[0],
                            images[1],
                            images[2]
                        );
                        let share_img = this.resultCanvas!.getImage(images[3], images[4]);
                        resolve({ result_img: result_data, share_img: share_img })
                        var toUrl = APIURL;

                    }
                })
            });
            return promise as Promise<{ result_img: string, share_img: string } | null>;

        }
    },

})