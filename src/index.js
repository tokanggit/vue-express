import Vue from 'vue';
import App from './containers/App.vue';
import store from './store';

new Vue({
  store,
  el: '#root',
  render: h => h(App),
});