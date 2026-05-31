<template>
  <header class="header">
    <div class="container header__inner">
      <div class="logo">
        <router-link to="/">
          <img src="/logo.png" alt="BeautyFinder" class="logo-img" />
        </router-link>
      </div>

      <nav class="nav">
        <router-link to="/" exact-active-class="active">главная</router-link>
        <router-link to="/my-masters" active-class="active">мои мастера</router-link>
        <router-link to="/categories" active-class="active">категории</router-link>
      </nav>

      <div class="user-actions">
        <button class="theme-toggle" @click="themeStore.toggleTheme">🌓</button>
        <router-link v-if="!userStore.isAuthenticated" to="/login" class="user-icon">
          <img src="/user2.png" alt="user icon" class="user-icon-img" />
        </router-link>
        <router-link v-else to="/profile" class="user-avatar">
          <img :src="userStore.user?.avatar || '/default-avatar.jpg'" alt="avatar" />
        </router-link>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useUserStore } from '../stores/userStore'
import { useThemeStore } from '../stores/themeStore'

const userStore = useUserStore()
const themeStore = useThemeStore()
</script>

<style scoped>
.header {
  background: var(--primary-light);
  padding: 16px 0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}
.header__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
}
.logo {
  flex-shrink: 0;   
  line-height: 1;
}
.logo-img {
  height: 50px;  
  width: auto;
  display: block;
}
.user-icon-img {
  width: 32px;
  height: 32px;
  object-fit: cover;
  border-radius: 50%;
}
.nav {
  flex: 1;           
  display: flex;
  justify-content: center;
  gap: 32px;
}
.nav a {
  text-decoration: none;
  color: var(--primary-main);
  font-size: 1.25rem;
  font-weight: 400;
  transition: color 0.2s;
}
.nav a:hover {
  color: var(--gray-light);
}
.nav a.active {
  font-weight: 400;
  color: var(--primary-main);
}
.user-actions {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 16px;
}
.theme-toggle {
  background: none;
  border: none;
  font-size: 1.3rem;
  cursor: pointer;
}
.user-icon {
  font-size: 1.6rem;
  text-decoration: none;
  color: var(--primary-main);
}
.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  display: block;
}
.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
@media (max-width: 768px) {
  .header__inner {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
  .logo, .nav, .user-actions {
    flex: none;
    width: 100%;
    justify-content: center;
  }
  .nav {
    gap: 20px;
  }
  .nav a {
    font-size: 1rem;
  }
}
</style>