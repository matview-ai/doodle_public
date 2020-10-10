export class SignCanvas {
    constructor(el: HTMLCanvasElement, w: number, ratio: number, eventEnabled?: any)
    canvas: HTMLCanvasElement
    setLineWidth(lineWidth: number): void
    setEraser(isEraser: boolean): void
    setColor(color: string): void
    rewrite(): void
    scale2Center(callback: () => void): boolean
    supplyDraw(point: any, rect: any, callback: () => void): void
    getSvg(): string
    getSign(): any
}
export class ResultCanvas {
    constructor(el: HTMLCanvasElement, w: number)
    setCallback(callback: () => void): void
    do_qq(signObject: any, oilImage: HTMLImageElement, oriImage: HTMLImageElement, frameImage: HTMLImageElement): string
    do(signObject: any, oilImage: HTMLImageElement, oriImage: HTMLImageElement, frameImage: HTMLImageElement): void
    getImage(qrcode: HTMLImageElement, logo: HTMLImageElement): string
}