import { createRouter, createWebHistory } from 'vue-router'
import ModalManager from '../businesslogic/util/ModalManager'
import store from '../store/index'
import { isPositiveIntegerNumber } from '../businesslogic/util/Validators'

const routes = [
  {
    path: '/',
    name: 'main',
    redirect: '/setlists',
    component: () => import(/* webpackChunkName: "MainMenuView" */ '../views/MainMenuView.vue'),
    children: [
      {
        path: '/songs',
        name: 'songs',
        component: () => import(/* webpackChunkName: "SongMenuView" */ '../views/SongMenuView.vue')
      },
      {
        path: '/setlists',
        name: 'setlists',
        component: () => import(/* webpackChunkName: "SetlistMenuView" */ '../views/SetlistMenuView.vue')
      },
      {
        path: '/settings',
        name: 'settings',
        component: () => import(/* webpackChunkName: "SettingsMenuView" */ '../views/SettingsMenuView.vue')
      }
    ]
  },
  {
    path: '/setlists/:setlistId',
    name: 'setlistdetails',
    props: true,
    component: () => import(/* webpackChunkName: "SetlistDetailView" */ '../views/SetlistDetailView.vue'),
    beforeEnter: (to, from, next) => {
      if (!isPositiveIntegerNumber(to.params.setlistId)) {
        next({ name: 'notfound' })
      }

      const exists = store.getters.doesSetlistIdExist(parseInt(to.params.setlistId))
      if (exists) {
        next()
      } else {
        next({ name: 'notfound' })
      }
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'notfound',
    component: () => import(/* webpackChunkName: "NotFoundView" */ '../views/NotFoundView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  // hide zombie modals
  ModalManager.hideAllActiveModals()
  next()
})

export default router
