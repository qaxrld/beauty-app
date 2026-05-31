import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CategoriesView from '../views/CategoriesView.vue'
import MyMastersView from '../views/MyMastersView.vue'
import CategoryMastersView from '../views/CategoryMastersView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import ProfileView from '../views/ProfileView.vue'
import BookingView from '../views/BookingView.vue'
import MasterDetailView from '../views/MasterDetailView.vue'


const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/categories', name: 'categories', component: CategoriesView },
  { path: '/my-masters', name: 'my-masters', component: MyMastersView },
  { path: '/category/:name', name: 'category-masters', component: CategoryMastersView, props: true },
  { path: '/login', name: 'login', component: LoginView },
  { path: '/register', name: 'register', component: RegisterView },
  { path: '/profile', name: 'profile', component: ProfileView, meta: { requiresAuth: true } },
  { path: '/booking/:masterId', name: 'booking', component: BookingView, props: true, meta: { requiresAuth: true } },
  { path: '/master/:id', name: 'master-detail', component: () => import('../views/MasterDetailView.vue'), props: true },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else {
    next()
  }
})

export default router