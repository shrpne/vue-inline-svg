import Vue from 'vue';

// or as a component
import InlineSvg from '../';
import {InlineSvgComponent, InlineSvgPlugin} from '../';
// import InlineSvg = require('../')
Vue.component('inline-svg', InlineSvg);
Vue.component('inline-svg2', InlineSvgComponent);
Vue.use(InlineSvgPlugin);
