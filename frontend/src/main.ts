import './assets/main.css'

import { DefaultApolloClient } from '@vue/apollo-composable'
import { createPinia } from 'pinia'
import { createApp, h, provide } from 'vue'
import App from './App.vue'
import { apolloClient } from './config/apollo-client'
import router from './router'

const app = createApp({
  setup() {
    provide(DefaultApolloClient, apolloClient)
  },
  render: () => h(App),
})

app.use(createPinia())
app.use(router)

app.mount('#app')
