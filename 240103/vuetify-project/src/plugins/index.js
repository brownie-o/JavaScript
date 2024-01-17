/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import vuetify from './vuetify'
import pinia from '../store'
import router from '../router'
import VuetifyUseDialog from 'vuetify-use-dialog'
import VueFileAgentNext from '@boindil/vue-file-agent-next'
import '@boindil/vue-file-agent-next/dist/vue-file-agent-next.css'

// 順序: 要先vuetify再vuetifyUseDialog 要先pinia再router
export function registerPlugins (app) {
  app
    .use(vuetify)
    .use(VuetifyUseDialog)
    .use(pinia)
    .use(router)
    .use(VueFileAgentNext)
}
