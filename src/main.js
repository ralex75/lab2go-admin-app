/*import './assets/main.css'*/
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'


/* import specific icons */
import { faEye,faInfoCircle,faPlus,faTrash } from '@fortawesome/free-solid-svg-icons'

/* add icons to the library */
library.add(faEye,faInfoCircle,faPlus,faTrash)

const app = createApp(App)

app.component('font-awesome-icon', FontAwesomeIcon)
app.use(router)

app.mount('#app')
