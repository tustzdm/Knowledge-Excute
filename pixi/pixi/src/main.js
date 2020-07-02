import Vue from 'vue'
import App from './App.vue'
import * as PIXI from "pixi.js"

Vue.config.productionTip = false

Vue.prototype.PIXI = PIXI;

new Vue({
  render: h => h(App),
}).$mount('#app')
