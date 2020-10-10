<style>
    .cls-modal{
        z-index:100;
        background:rgba(0,0,0,0.5);
        
    }
    .btn-back{
        width: 10vw;
        height: 10vw;
        background: rgba(255,255,255,0.5);
        flex: 0 1 auto;
        padding: 5vw;
        border-radius: 50%
    }
    .btn-back img{
        width:100%;
    }
</style>
<template>
    <div class="cls-page cls-modal cls-flex cls-flex align-center justify-center" @click="$emit('hide',$event)">
        <div class="btn-back" @click="$emit('close',$event)"><img ></div>
    </div>
</template>
<script lang="ts">
    import Vue from 'vue'
    import * as $ from 'jquery'
    import Component from "vue-class-component"

    const AppProps = Vue.extend({
        props: {
            name:String,
        }
    })
    @Component({
         // 查看 Vue.js 文档, 来了解所有的选项:
        // https://vuejs.org/v2/api/#Options-Data
        
        computed:({
            
        }),
        
        mounted () { 
          //
          //this.onTouchStart(); 
          
        }
    })
    export default class App extends AppProps{
        created(){
         
        }

        mounted () {
            
        }
        
    }
</script>

