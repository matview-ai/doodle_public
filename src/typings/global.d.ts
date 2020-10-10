//import { type } from "jquery";

interface GetImageData{
    ():ImageData;
}
declare module '*.png'
declare module '*.jpg'
declare module '*.json'
declare const APIURL:string;

declare namespace qq{
    interface miniProgram{
        postMessage(arg_1:any):void
        navigateTo(arg_1:any):void
        redirectTo(arg_1:any):void
    }
    export let miniProgram:miniProgram
}
 
