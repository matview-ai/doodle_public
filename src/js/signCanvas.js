import { fitCurve } from "./curve.js";
import i18n from "../i18n/#{lang}/lang.json";
import utils from "@/utils/utils";
export function SignCanvas(canvas, width, heightRatio, eventEnabled) {



    this.color = utils.flower_color;//"red";
    this.isEraser = false;
    this.lineWidth = 1;
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    this.resize(width, heightRatio);

    this.canvasTimer = new CanvasTimer();

    var events = {
        mousedown: "mousedown",
        mousemove: "mousemove",
        mouseup: "mouseup",
    }
    if ("ontouchstart" in window) {
        events = {
            mousedown: "touchstart",
            mousemove: "touchmove",
            mouseup: "touchend",
        }
    }
    var self = this;
    var lines = [], fitCubicPoints = [];

    this.rewrite = function () {
        lines = [];
        fitCubicPoints = [];
        this.clear();
    };
    this.getSign = function () {
        return $.extend(true, {}, {
            fitCubicPoints: fitCubicPoints,
            lines: lines,
            rect: this.getRect(lines)
        })
    }

    if (eventEnabled) {

        this.canvas.addEventListener(events.mousedown, function (e) {
            e.preventDefault();
            if (!self.isEraser) {
                lines.push([self.getPos(e)])
            }
            self.canvasImageData = self.ctx.getImageData(0, 0, self.canvas.width, self.canvas.height);
            self.canvas.addEventListener(events.mousemove, mousemove);
            self.canvas.addEventListener(events.mouseup, mouseup);
        })
    }

    function mousemove(e) {
        e.preventDefault();
        var pos = self.getPos(e);

        if (!self.isEraser) {
            var line = lines[lines.length - 1];
            self.drawLine(line[line.length - 1], pos, self.lineWidth, self.color);
            line.push(pos)
        } else {
            self.clearPoint(pos)
        }
    }
    function mouseup(e) {


        if (!self.isEraser) {
            var line = lines[lines.length - 1];
            let curve = { color: self.color, lineWidth: self.lineWidth, curve: fitCurve(line, 2, null) };
            fitCubicPoints.push(curve)
            if (eventEnabled && !eventEnabled.mouseupUnDrawAgain) {
                self.drawFitCurve(fitCubicPoints)
            } else {

                self.drawFitCurveSingle(curve);
            }
        }
        self.canvas.removeEventListener(events.mouseup, mouseup);
        self.canvas.removeEventListener(events.mousemove, mousemove);
    }
    //console.log(self.getSize(lines))
}
SignCanvas.prototype.clearPoint = function (pos) {

    let ctx = this.ctx;
    ctx.save();
    ctx.beginPath();
    ctx.arc(pos[0], pos[1], this.lineWidth / 2, 0, Math.PI * 2);
    ctx.clip();
    ctx.clearRect(pos[0] - this.lineWidth / 2, pos[1] - this.lineWidth / 2, this.lineWidth, this.lineWidth);
    ctx.restore();
}
SignCanvas.prototype.clear = function () {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
}
SignCanvas.prototype.rewrite = function () {
    this.clear();
    this.lines = [];
    this.fitCubicPoints = [];
}

SignCanvas.prototype.getPos = function (e) {

    var offset = $(this.canvas).offset();

    var pos = {
        x: e.pageX,
        y: e.pageY
    }
    if (e.touches && e.touches.length) {
        pos = {
            x: e.touches[0].pageX,
            y: e.touches[0].pageY
        }
    }
    pos.x -= offset.left;
    pos.y -= offset.top;

    return [pos.x, pos.y];
}
SignCanvas.prototype.supplyDraw = function (lines, rect, callback) {

    callback = callback || function () { };
    var existRect = this.getCanvasRect();

    var h = existRect.top, w = (existRect.left + existRect.right) / 2;


    var wRatio = rect.width / this.canvas.width;
    var ratio = this.canvas.width / 413;


    var left = 215, top = 275;

    var xx = w - (left - rect.left) * ratio;
    var yy = h - (top - rect.top) * ratio;

    for (var x in lines) {
        var line = lines[x].curve;
        for (var m in line) {
            var ps = line[m];
            for (var n in ps) {
                ps[n][0] -= rect.left;
                ps[n][1] -= rect.top;
                ps[n][0] *= ratio;
                ps[n][1] *= ratio;
                ps[n][0] += xx;
                ps[n][1] += yy;
            }
        }
    }


    this.drawFitCurveAnimation(lines, 0, 0, function () {
        callback();
    });

}
SignCanvas.prototype.setLineWidth = function (width) {

    this.lineWidth = width * 2;
}
SignCanvas.prototype.setColor = function (color) {
    this.color = color;
}
SignCanvas.prototype.scale2Center = function (callback) {
    this.canvasTimer.clearEvent();
    var rect = this.getCanvasRect();
    if (rect.width <= 0) {
        return false
    }
    var img = document.createElement('canvas');
    var img_ctx = img.getContext('2d');
    img.width = this.canvas.width;
    img.height = this.canvas.height;
    img_ctx.drawImage(this.canvas, 0, 0, img.width, img.height);
    var self = this;

    var scale = this.canvas.height * 0.35 / Math.max(rect.width, rect.height);

    var x = (this.canvas.width / 2 - (rect.left + rect.right) / 2 * scale) / scale;
    var y = (this.canvas.height * 0.6 - rect.top * scale) / scale;

    var dissScale = scale - 1;
    this.canvasTimer.addEvent("2", {
        event: function (start, end, range) {
            self.clear();
            self.ctx.save();
            //self.ctx.translate(self.canvas.width/2,self.canvas.height/2);

            var diff = dissScale * range + 1;


            self.ctx.scale(diff, diff);
            //self.ctx.translate(-self.canvas.width/2,-self.canvas.height/2);

            self.ctx.translate(x * range, y * range);

            self.ctx.drawImage(img, 0, 0, self.canvas.width, self.canvas.height);
            self.ctx.restore();
        },
        done: function () {

            callback();
        },
        start: 0,
        end: 1
    })
    this.canvasTimer.start();
    return true;
}

SignCanvas.prototype.resize = function (width, heightRatio) {
    var maxWidth = Math.min(document.firstElementChild.clientHeight, document.firstElementChild.clientWidth, width) - 42;

    heightRatio = heightRatio || 1;
    this.canvas.width = maxWidth;
    this.canvas.height = maxWidth * heightRatio;
    this.canvas.style.width = maxWidth + "px";
    this.canvas.style.height = maxWidth * heightRatio + "px";
}
SignCanvas.prototype.getCanvasRect = function () {
    var left = 999999, top = 999999, bottom = 0, right = 0;
    var imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    //console.log(imageData)
    for (var y = 0; y < imageData.height; y++) {
        var step = y * imageData.width;
        for (var x = 0; x < imageData.width; x++) {
            var i = (step + x) * 4;
            if (imageData.data[i + 3] > 50) {
                if (x > right) {
                    right = x;
                }
                if (x < left) {
                    left = x;
                }
                if (y > bottom) {
                    bottom = y;
                }
                if (y < top) {
                    top = y;
                }
            }
        }
    }
    return {
        left: left,
        right: right,
        bottom: bottom,
        top: top,
        width: right - left,
        height: bottom - top
    }
}
SignCanvas.prototype.drawFitCurveAnimation = function (fitCubicPoints, m, i, callback) {
    var delay = 15;
    var self = this;
    var ctx = this.ctx;

    if (m < fitCubicPoints.length) {
        var curve = fitCubicPoints[m].curve;
        let color = fitCubicPoints[m].color;
        let lineWidth = fitCubicPoints[m].lineWidth;

        ctx.fillStyle = utils.flower_color;//'red';

        ctx.lineWidth = lineWidth;

        ctx.strokeStyle = utils.flower_color;//'red';
        ctx.beginPath();

        if (i < curve.length) {
            var p = curve[i];



            ctx.beginPath();

            ctx.arc(p[0][0], p[0][1], lineWidth / 2, 0, Math.PI * 2);

            ctx.fill();


            ctx.beginPath();

            ctx.arc(p[3][0], p[3][1], lineWidth / 2, 0, Math.PI * 2);

            ctx.fill();


            ctx.beginPath();
            ctx.moveTo(p[0][0], p[0][1]);
            ctx.bezierCurveTo(p[1][0], p[1][1], p[2][0], p[2][1], p[3][0], p[3][1]);

            ctx.stroke();

            i++;
            setTimeout(function () {
                self.drawFitCurveAnimation(fitCubicPoints, m, i, callback);
            }, delay)

        } else {
            m++;
            i = 0;
            setTimeout(function () {
                self.drawFitCurveAnimation(fitCubicPoints, m, i, callback);
            }, delay)
        }
    } else {
        callback();
    }

}
SignCanvas.prototype.getSvg = function () {
    var data = this.getSign();
    var ratio = 100 / Math.min(data.rect.width, data.rect.height);
    var fitCubicPoints = [];
    var lines = data.lines;
    for (var i in lines) {
        for (var m in lines[i]) {
            lines[i][m][0] -= data.rect.left;
            lines[i][m][1] -= data.rect.top;
            lines[i][m][0] *= ratio;
            lines[i][m][1] *= ratio;
        }

        fitCubicPoints.push(fitCurve(lines[i], 2, null));
    }
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" version="1.1">';
    svg += '<path d="';

    for (var i in fitCubicPoints) {
        for (var m in fitCubicPoints[i]) {
            var cur = fitCubicPoints[i][m];
            svg += "M" + cur[0][0] + "," + cur[0][1];
            svg += " ";
            svg += "C" + cur[1][0] + "," + cur[1][1];
            svg += " ";
            svg += "" + cur[2][0] + "," + cur[2][1];
            svg += " ";
            svg += "" + cur[3][0] + "," + cur[3][1];
            svg += " ";
        }
    }
    svg += '" stroke="black" fill="none" stroke-width="1"/></svg>';
    return svg;
}
SignCanvas.prototype.drawLine = function (p1, p2, lineWidth, color) {
    this.ctx.fillStyle = color;
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = lineWidth;
    this.ctx.beginPath();
    this.ctx.arc(p1[0], p1[1], lineWidth / 2, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.beginPath();
    this.ctx.moveTo(p1[0], p1[1]);
    this.ctx.lineTo(p2[0], p2[1]);
    this.ctx.stroke();
}
SignCanvas.prototype.setEraser = function (isEraser) {
    this.setLineWidth(10);
    this.isEraser = isEraser;
}
SignCanvas.prototype.getRect = function (lines) {
    var left = 99999999, right = 0, top = 999999999, bottom = 0;

    for (var m in lines) {
        var line = lines[m];
        for (var n in line) {
            var p = line[n];
            if (p[0] > right) {
                right = p[0];
            }
            if (p[0] < left) {
                left = p[0]
            }
            if (p[1] > bottom) {
                bottom = p[1];
            }
            if (p[1] < top) {
                top = p[1]
            }

        }
    }
    return {
        left: left,
        top: top,
        right: right,
        bottom: bottom,
        width: right - left,
        height: bottom - top
    }
}
SignCanvas.prototype.drawFitCurve = function (fitCubicPoints) {

    var ctx = this.ctx;
    this.clear();

    for (var m in fitCubicPoints) {


        this.drawFitCurveSingle(fitCubicPoints[m]);


    }

}
SignCanvas.prototype.drawFitCurveSingle = function (lineObject) {

    var ctx = this.ctx;

    var curve = lineObject.curve;

    let color = lineObject.color;
    let lineWidth = lineObject.lineWidth;
    ctx.fillStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = color;
    for (var i in curve) {
        var p = curve[i];
        ctx.beginPath();
        ctx.arc(p[0][0], p[0][1], lineWidth / 2, 0, Math.PI * 2)
        ctx.fill();
        ctx.beginPath();
        ctx.arc(p[3][0], p[3][1], lineWidth / 2, 0, Math.PI * 2)
        ctx.fill();

    }
    ctx.beginPath();
    for (var i in curve) {
        var p = curve[i];


        if (i == 0) {
            ctx.moveTo(p[0][0], p[0][1]);
        }
        ctx.bezierCurveTo(p[1][0], p[1][1], p[2][0], p[2][1], p[3][0], p[3][1]);

    }
    //if (lineWidth == 20 && color=='blue') {
    if (lineWidth == 20 && color == utils.vase_color) {
        ctx.lineCap = "round";
        ctx.miterLimit = 1;

        ctx.closePath();

        ctx.fill();
    }
    ctx.stroke();


}


function CanvasTimer() {
    this.timer = null;
    this.timeDate = null;
    this.defaultOption = {
        enabled: true,
        count: 1,
        loop: 0,
        done: function () { },
        event: function () { },
        start: 0,
        timeFunction: "ease",
        keepEnd: true,
        runDuration: 0,
        duration: 1000,
        end: 1
    }
    this.addEvent = function (name, event) {
        var defaultOption = $.extend(true, {}, this.defaultOption);
        event = $.extend(true, defaultOption, event);

        this.events[name] = event;
    }
    this.stop = function () {
        clearTimeout(this.timer);
    }
    this.start = function () {
        this.timeDate = new Date().getTime() - 15;
        this.loop();
    }
    this.enabled = function (name) {
        this.getEvent(name)["enabled"] = true;
    }
    this.getEvent = function (name) {
        return this.events[name];
    }
    this.clearEvent = function () {
        this.events = {};
    }
    this.tween = {
        linear: function (t, b, c, d) { return c * t / d + b; },
        ease: function (t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t + b;
            return -c / 2 * ((--t) * (t - 2) - 1) + b;
        }
    }
    this.loop = function () {
        this.stop();
        var self = this;
        var date = new Date().getTime();
        for (var i in self.events) {
            var event = self.events[i];

            if (event.enabled) {
                if (event.now === undefined) {
                    event.now = event.start;
                }

                var aDuration = date - this.timeDate;
                var diff = event.end - event.start;
                var oldDuration = event.runDuration;

                event.now = this.tween[event.timeFunction](Math.min(oldDuration, event.duration), event.start, diff, event.duration);

                //为了done在全部完成后的下一帧触发
                event.runDuration = Math.min(event.runDuration + aDuration, event.duration);

                if (oldDuration > event.duration) {
                    if (typeof (event.count) == "number") {
                        event.count--;
                    }
                    if (event.count == "loop" || event.count > 0) {
                        event.runDuration = 0;
                    } else {
                        event.enabled = false;
                        event.done();

                    }
                } else {

                    event.event(event.start, event.end, event.now);
                    event.loop++;

                    if (oldDuration == event.duration || diff == 0) {
                        event.runDuration = event.duration + 1;

                    }
                }

            }
        }
        this.timeDate = date;
        this.timer = setTimeout(function () {
            self.loop();
        }, 15)
    }
}

export function ResultCanvas(canvas, width, height) {
    this.options = { callback: function () { } }
    var maxWidth = width;
    var maxHeight = maxWidth + 175;
    this.canvas = canvas;
    this.canvas.width = maxWidth * 2;
    this.canvas.height = maxHeight * 2;
    this.canvas.style.width = maxWidth + "px";
    this.canvas.style.height = maxHeight + "px";
    this.canvasTimer = new CanvasTimer();
    this.ctx = this.canvas.getContext('2d');


}

ResultCanvas.prototype = {
    measureText: function (ctx, model) {
        var font_size = model.fontSize;
        var line_height = 1.5;
        var font = "";
        font += model.italic ? " italic " : "";
        font += model.bold ? " bold " : "";
        font += model.fontSize + "px ";
        font += " SimHei";
        ctx.font = font;
        var str = model.text;
        var start = 0, l = 1;
        var lines = [];

        while (start < str.length && str) {
            var _str = str.substr(start, l);
            const metrics = ctx.measureText(_str)

            if (model.width && metrics.width > model.width) {
                //超出指定长度
                var currentBit = str.substr(start + l - 1, 1);

                if (/[^\u4e00-\u9fa5a-zA-Z\d]+/.test(currentBit)) {
                    //如果是标点;
                    l -= 2;
                } else {
                    l--;
                }
                lines.push(str.substr(start, l));
                start += l;
                l = 1;

            } else if (start + l >= str.length) {
                //最后一行
                lines.push(str.substr(start, l));
                start += l;
                if (!model.width) {
                    model.width = metrics.width
                }
            } else {
                l++;
            }
        }
        model.lineHeight = line_height;
        model.height = lines.length * font_size * line_height;
        model.texts = lines;
        return model;
    },
    clearRect: function () {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    drawText: function (ctx, measureTextModel) {
        this.measureText(ctx, measureTextModel);
        var textAlign = measureTextModel.textAlign;
        if (!textAlign) { textAlign = "left"; }
        ctx.fillStyle = measureTextModel.color || "#fff";
        var font = "";
        font += measureTextModel.bold ? " bold " : "";
        font += measureTextModel.italic ? " italic " : "";
        font += measureTextModel.fontSize + "px ";
        font += " SimHei";

        ctx.font = font;
        ctx.textBaseline = "top";
        ctx.textAlign = textAlign;
        for (var i in measureTextModel.texts) {
            var text = measureTextModel.texts[i];
            var haftHeight = ((measureTextModel.lineHeight - 1.1) / 2 * measureTextModel.fontSize);
            var top_1 = measureTextModel.top + parseInt(i) * measureTextModel.fontSize * measureTextModel.lineHeight + haftHeight;

            ctx.fillText(text, measureTextModel.left, top_1);
        }
        return measureTextModel
    },
    do: function (signInfo, oilImage, oriImage, frameImage) {
        this.clearRect();

        this.oriImage = oriImage;

        var oilImageRect = {
            x1: 50,
            y1: 50,

        }
        oilImageRect.x2 = this.canvas.width - oilImageRect.x1
        oilImageRect.y2 = oilImageRect.y1 + (oilImageRect.x2 - oilImageRect.x1) / oilImage.naturalWidth * oilImage.naturalHeight

        var frameRect = {
            x1: 0,
            y1: 0
        }
        frameRect.x2 = this.canvas.width - frameRect.x1;
        frameRect.y2 = frameRect.y1 + (frameRect.x2 - frameRect.x1) / frameImage.naturalWidth * frameImage.naturalHeight

        var self = this;

        this.canvasTimer.clearEvent();
        // this.canvasTimer.addEvent("1",{

        //     duration:2000,
        //     event:function(start,end,range){
        //         self.drawResultImage(oilImage, oilImageRect,range)
        //     },
        //     done:function () {
        //         self.canvasTimer.enabled('2');
        //     },
        //     start:0,
        //     end:1
        // })
        this.canvasTimer.addEvent("2", {

            event: function (start, end, range) {
                self.drawResultImageFinish(oilImage, oilImageRect, range);
                self.drawResultImageFrame(frameImage, frameRect, range);
            },
            done: function () {
                var minSize = Math.min(signInfo.rect.width, signInfo.rect.height);
                var whRatio = signInfo.rect.width / signInfo.rect.height;
                if (whRatio > 10) {
                    minSize = Math.max(signInfo.rect.width, signInfo.rect.height);
                }
                var matchSize = 28 * (self.canvas.width / 512);
                var ratio = matchSize / minSize;
                var singRect = {
                    width: signInfo.rect.width * ratio,
                    height: signInfo.rect.height * ratio
                }


                for (var x in signInfo.lines) {
                    var line = signInfo.lines[x];
                    for (var m in line) {
                        var p = line[m];
                        p[0] -= signInfo.rect.left;
                        p[1] -= signInfo.rect.top;
                        p[0] *= ratio;
                        p[1] *= ratio;
                    }
                }

                var fitCubicPoints = [];

                for (var x in signInfo.lines) {
                    let curve = fitCurve(signInfo.lines[x], 2, null);
                    fitCubicPoints.push(curve)
                }
                self.ctx.save();


                self.ctx.translate(oilImageRect.x2 - 50 * (self.canvas.width / 512) - singRect.width, oilImageRect.y2 - 50 * (self.canvas.width / 512) - singRect.height)
                setTimeout(function () {

                    self.drawFitCurve(fitCubicPoints, 0, 0, function () {
                        self.ctx.restore();

                        self.canvasTimer.enabled('3');
                    })
                })

            },
            start: 0,
            end: 1
        })

        this.canvasTimer.addEvent("3", {
            enabled: false,
            event: function (a, b, c) {

                self.drawText1(c);
            },
            done: function () {
                self.options.callback();
                self.canvasTimer.stop();
            }
        })
        this.canvasTimer.start();



        // var summaryTextModel=self.measureText(this.ctx,self.supplyData.summary,summary_rect);

        // var signNameTextModel=self.measureText(this.ctx,self.supplyData.signName,signName_rect);
        // self.drawText(this.ctx,summaryTextModel);
    },
    /**
     * qq小程序的结果页，去掉动画效果，直接生成结果图片
     */
    do_qq: function (signInfo, oilImage, oriImage, frameImage) {
        this.clearRect();

        this.oriImage = oriImage;

        var oilImageRect = {
            x1: 50,
            y1: 50,

        }
        oilImageRect.x2 = this.canvas.width - oilImageRect.x1
        oilImageRect.y2 = oilImageRect.y1 + (oilImageRect.x2 - oilImageRect.x1) / oilImage.naturalWidth * oilImage.naturalHeight

        var frameRect = {
            x1: 0,
            y1: 0
        }
        frameRect.x2 = this.canvas.width - frameRect.x1;
        frameRect.y2 = frameRect.y1 + (frameRect.x2 - frameRect.x1) / frameImage.naturalWidth * frameImage.naturalHeight

        var self = this;

        //this.canvasTimer.clearEvent();
        // this.canvasTimer.addEvent("1",{

        //     duration:2000,
        //     event:function(start,end,range){
        //         self.drawResultImage(oilImage, oilImageRect,range)
        //     },
        //     done:function () {
        //         self.canvasTimer.enabled('2');
        //     },
        //     start:0,
        //     end:1
        // })

        self.drawResultImageFinish(oilImage, oilImageRect, 1);
        self.drawResultImageFrame(frameImage, frameRect, 1);
        var minSize = Math.min(signInfo.rect.width, signInfo.rect.height);
        var whRatio = signInfo.rect.width / signInfo.rect.height;
        if (whRatio > 10) {
            minSize = Math.max(signInfo.rect.width, signInfo.rect.height);
        }
        var matchSize = 28 * (self.canvas.width / 512);
        var ratio = matchSize / minSize;
        var singRect = {
            width: signInfo.rect.width * ratio,
            height: signInfo.rect.height * ratio
        }


        for (var x in signInfo.lines) {
            var line = signInfo.lines[x];
            for (var m in line) {
                var p = line[m];
                p[0] -= signInfo.rect.left;
                p[1] -= signInfo.rect.top;
                p[0] *= ratio;
                p[1] *= ratio;
            }
        }

        var fitCubicPoints = [];

        for (var x in signInfo.lines) {
            let curve = fitCurve(signInfo.lines[x], 2, null);
            fitCubicPoints.push(curve)
        }

        self.ctx.save();

        /* */
        self.ctx.translate(oilImageRect.x2 - 50 * (self.canvas.width / 512) - singRect.width, oilImageRect.y2 - 50 * (self.canvas.width / 512) - singRect.height)


        self.drawFitCurve_qq(fitCubicPoints, 0, 0, function () {


        })
        self.ctx.restore();
        self.drawText1(1);

        return self.canvas.toDataURL()


        // var summaryTextModel=self.measureText(this.ctx,self.supplyData.summary,summary_rect);

        // var signNameTextModel=self.measureText(this.ctx,self.supplyData.signName,signName_rect);
        // self.drawText(this.ctx,summaryTextModel);
    },
    drawResultImage: function (oilImage, oilImageRect, ratio) {

        if (ratio <= 0) {
            return;
        }
        this.ctx.save();
        this.ctx.drawImage(oilImage, oilImageRect.x1, oilImageRect.y1, oilImageRect.x2 - oilImageRect.x1, oilImageRect.y2 - oilImageRect.y1)
        this.ctx.globalCompositeOperation = "destination-in";
        var img = this.oriImage;
        this.ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight * ratio, oilImageRect.x1, oilImageRect.y1, oilImageRect.x2 - oilImageRect.x1, (oilImageRect.y2 - oilImageRect.y1) * ratio);
        this.ctx.restore();
    },
    drawResultImageFinish: function (oilImage, oilImageRect, ratio) {



        /*  this.ctx.save();
         this.ctx.drawImage(oilImage, oilImageRect.x1, oilImageRect.y1, oilImageRect.x2 - oilImageRect.x1, oilImageRect.y2 - oilImageRect.y1)
         this.ctx.globalCompositeOperation = "destination-in";
         var img = document.getElementById("imgOrg");
         this.ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight , oilImageRect.x1, oilImageRect.y1, oilImageRect.x2 - oilImageRect.x1, (oilImageRect.y2 - oilImageRect.y1) );
         this.ctx.restore();
*/

        if (ratio == 1) {
            this.ctx.beginPath();
            this.ctx.rect(0, 0, this.canvas.width, this.canvas.height);

            this.ctx.fillStyle = "#fff";
            this.ctx.fill();

        }

        this.ctx.save();
        this.ctx.globalAlpha = ratio;
        this.ctx.drawImage(oilImage, oilImageRect.x1, oilImageRect.y1, oilImageRect.x2 - oilImageRect.x1, oilImageRect.y2 - oilImageRect.y1)




        this.ctx.restore();

    },
    drawResultImageFrame: function (frameImage, frameRect, ratio) {
        this.ctx.save();

        this.ctx.drawImage(frameImage, frameRect.x1, frameRect.y1, frameRect.x2 - frameRect.x1, frameRect.y2 - frameRect.y1)
        this.ctx.restore();
    },
    setCallback: function (callback) {
        this.options.callback = callback;
    },
    drawText1: function (ratio) {
        this.ctx.save();
        this.ctx.globalAlpha = ratio;
        this.ctx.beginPath();
        this.ctx.rect(0, this.canvas.width * 0.93, this.canvas.width, this.canvas.height - this.canvas.width * 0.93);
        this.ctx.fillStyle = "#fff";
        this.ctx.fill();

        var rect = this.drawText(this.ctx, {
            text: i18n.flower,
            left: this.canvas.width / 2,
            top: this.canvas.width * 0.93,
            width: 0,
            fontSize: 48,
            color: "#caa661",
            bold: true,
            textAlign: "center"
        });


        rect = this.drawText(this.ctx, {
            text: i18n.productDesc,
            left: this.canvas.width / 2,
            top: rect.top + rect.height - 5,
            width: 0,
            fontSize: 24,
            color: "#000000",
            bold: false,
            textAlign: "center"
        });
        rect = this.drawText(this.ctx, {
            text: "wonderina.com/doodle",
            left: this.canvas.width / 2,
            top: rect.top + rect.height,
            width: 0,
            fontSize: 24,
            color: "#818181",
            bold: false,
            textAlign: "center"
        });

        rect = this.drawText(this.ctx, {
            text: i18n.another_desc,
            left: this.canvas.width / 2,
            top: rect.top + rect.height + 20,
            width: 0,
            fontSize: 24,
            color: "#818181",
            bold: false,
            italic: true,
            textAlign: "center"
        });

        rect = this.drawText(this.ctx, {
            text: i18n.another_name,
            left: this.canvas.width / 2,
            top: rect.top + rect.height,
            width: 0,
            fontSize: 24,
            color: "#818181",
            bold: false,
            italic: true,
            textAlign: "center"
        });
        this.drawImageOri(this.oriImage, rect);
        this.ctx.restore();
    },
    drawImageOri: function (img, rect) {

        var imgRect = {
            x1: this.canvas.width / 2 - 50,
            y1: rect.top + rect.height + 10,

        }
        imgRect.x2 = this.canvas.width / 2 + 50;
        imgRect.y2 = imgRect.y1 + 100;

        this.ctx.drawImage(img, imgRect.x1, imgRect.y1, imgRect.x2 - imgRect.x1, imgRect.y2 - imgRect.y1)
        this.ctx.strokeStyle = "#e8e8e8"
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.rect(imgRect.x1, imgRect.y1, imgRect.x2 - imgRect.x1, imgRect.y2 - imgRect.y1);
        this.ctx.stroke();

    },
    getImage: function (qrcode, logo) {
        //return this.canvas.toDataURL('image/jpeg');
        var canvas = document.createElement('canvas');
        canvas.width = this.canvas.width;
        canvas.height = this.canvas.height + 170;
        var ctx = canvas.getContext('2d');
        ctx.rect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#fff";
        ctx.fill();
        /*  var width=100;
         var height=100/(this.logo.naturalWidth/this.logo.naturalHeight);
         ctx.drawImage(this.canvas, 0, 120, this.canvas.width, this.canvas.height);
         ctx.drawImage(this.qrcode, canvas.width - 50-height+20, 35+10, height-20, height-20);
         ctx.drawImage(this.logo, 50, 35, width, height); */

        var width = 70;
        var height = width / (logo.naturalWidth / logo.naturalHeight);
        ctx.drawImage(this.canvas, 0, 0, this.canvas.width, this.canvas.height);

        ctx.drawImage(qrcode, canvas.width / 2 + 25, this.canvas.height + 60, height, height);
        ctx.drawImage(logo, canvas.width / 2 - 25 - width, this.canvas.height + 60, width, height);


        let rect = this.drawText(ctx, {
            text: "create your wonderful artworks",
            left: canvas.width / 2,
            top: this.canvas.height,
            width: 0,
            fontSize: 20,
            color: "#e4e4e4",
            bold: false,
            italic: false,
            textAlign: "center"
        });

        ctx.strokeStyle = rect.color;
        ctx.beginPath();
        ctx.moveTo(50, this.canvas.height + rect.height / 2);
        ctx.lineTo(this.canvas.width / 2 - rect.width / 2 - 25, this.canvas.height + rect.height / 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(this.canvas.width / 2 + rect.width / 2 + 25, this.canvas.height + rect.height / 2);
        ctx.lineTo(this.canvas.width - 50, this.canvas.height + rect.height / 2);
        ctx.stroke();


        return canvas.toDataURL('image/jpeg');
    },
    drawFitCurve_qq: function (fitCubicPoints, m, i, callback) {
        var delay = 50;
        var self = this;
        var ctx = this.ctx;

        if (m < fitCubicPoints.length) {
            var curve = fitCubicPoints[m];
            var color = "#fff";
            ctx.fillStyle = color;
            ctx.lineWidth = 2;
            ctx.strokeStyle = color;


            if (i < curve.length) {
                var p = curve[i];
                ctx.beginPath();


                ctx.moveTo(p[0][0], p[0][1]);
                ctx.bezierCurveTo(p[1][0], p[1][1], p[2][0], p[2][1], p[3][0], p[3][1]);
                ctx.stroke();
                i++;
                //setTimeout(function () {
                self.drawFitCurve_qq(fitCubicPoints, m, i, callback);
                //}, delay)
            } else {
                m++;
                i = 0;
                //setTimeout(function () {
                self.drawFitCurve_qq(fitCubicPoints, m, i, callback);
                //}, delay)
            }
        } else {
            callback();
        }

    },
    drawFitCurve: function (fitCubicPoints, m, i, callback) {
        var delay = 50;
        var self = this;
        var ctx = this.ctx;

        if (m < fitCubicPoints.length) {
            var curve = fitCubicPoints[m];
            var color = "#fff";
            ctx.fillStyle = color;
            ctx.lineWidth = 2;
            ctx.strokeStyle = color;


            if (i < curve.length) {
                var p = curve[i];
                ctx.beginPath();


                ctx.moveTo(p[0][0], p[0][1]);
                ctx.bezierCurveTo(p[1][0], p[1][1], p[2][0], p[2][1], p[3][0], p[3][1]);
                ctx.stroke();
                i++;
                setTimeout(function () {
                    self.drawFitCurve(fitCubicPoints, m, i, callback);
                }, delay)
            } else {
                m++;
                i = 0;
                setTimeout(function () {
                    self.drawFitCurve(fitCubicPoints, m, i, callback);
                }, delay)
            }
        } else {
            callback();
        }

    }
}

