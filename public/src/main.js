import './firebase';
import Vue from 'vue';
import VueFire from 'vuefire';

import firebase from 'firebase';
import VueJsonToCsv from 'vue-json-to-csv';
import BootstrapVue from 'bootstrap-vue';
import JsonExcel from 'vue-json-excel';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
// eslint-disable-next-line import/no-extraneous-dependencies
import { library } from '@fortawesome/fontawesome-svg-core';
// eslint-disable-next-line import/no-extraneous-dependencies
import { faCheck } from '@fortawesome/free-solid-svg-icons';
// eslint-disable-next-line import/no-extraneous-dependencies
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import router from './router';
import App from './App.vue';

Vue.config.productionTip = false;

library.add(faCheck);

Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.component('downloadExcel', JsonExcel);

Vue.use(BootstrapVue);
Vue.use(VueJsonToCsv);
Vue.use(VueFire);

firebase.auth().onAuthStateChanged(() => {
  new Vue({
    router,
    render: (h) => h(App),
  }).$mount('#app');
});
