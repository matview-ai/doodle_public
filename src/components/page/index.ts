/*
 * @Author: your name
 * @Date: 2020-06-28 16:15:28
 * @LastEditTime: 2020-07-03 10:28:34
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /大屏/src/components/page/index.ts
 */ 
import Vue from "vue";
declare module 'vue/types/vue' {
      
    // 3. 声明为 Vue 补充的东西
        interface Vue {
            $broast(name:string,...args:any):void
            $loading(icon:string,name?:string):void
        }
    }
export default Vue.extend({
    methods:{
        $broast(name:string,...args:any){
            this._broast([this],name,...args);
        },
        _broast(children:Vue[],name:string,...args:any){
            for(const child of children){
               
                child.$emit(name,...args)
                this._broast(child.$children,name,...args)
            }
        }
    },
    
})