<template>
    <div class="auth-page">
      <div class="auth-form">
        <h1>Регистрация</h1>
        <form @submit.prevent="handleSubmit">
          <div class="field">
            <label>Логин</label>
            <input type="text" v-model="name" placeholder="Имя пользователя" required />
          </div>
          <div class="field">
            <label>Телефон</label>
            <input type="tel" v-model="phone" placeholder="+7 (999) 123-45-67" required />
          </div>
          <div class="field">
            <label>Пароль</label>
            <input type="password" v-model="password" placeholder="Минимум 4 символа" required />
          </div>
          <button type="submit" :disabled="loading">Зарегистрироваться</button>
        </form>
        <p class="switch-auth">
          Уже есть аккаунт? <router-link to="/login">Войти</router-link>
        </p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useUserStore } from '../stores/userStore'
  import { useRouter } from 'vue-router'
  
  const userStore = useUserStore()
  const router = useRouter()
  const name = ref('')
  const phone = ref('')
  const password = ref('')
  const loading = ref(false)
  
  const handleSubmit = async () => {
    loading.value = true
    const success = await userStore.register(name.value, phone.value, password.value)
    loading.value = false
    if (success) router.push('/profile')
  }
  </script>
  
  <style scoped>
  .auth-page {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: calc(100vh - 140px);
    padding: 2rem 1rem;
  }
  .auth-form {
    width: 100%;
    max-width: 500px;
  }
  .auth-form h1 {
    font-size: 4rem;
    margin-bottom: 1.5rem;
    text-align: center;
    color: var(--card-text);
  }
  .field {
    margin-bottom: 1.2rem;
  }
  .field label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    font-size: 1.2rem;
    color: var(--card-text);
  }
  .field input {
    width: 100%;
    padding: 14px 18px;
    font-size: 1.1rem;
    border: none;
    border-radius: 15px;
    background: #D9D9D9;
    outline: none;
    font-family: inherit;
  }
  .field input:focus {
    outline: 2px solid var(--primary-main);
  }
  button[type="submit"] {
    width: 100%;
    background: var(--primary-main);
    color: var(--primary-light);
    border: none;
    padding: 14px;
    border-radius: 15px;
    font-size: 1.1rem;
    font-weight: bold;
    cursor: pointer;
    margin-top: 0.5rem;
  }
  button[type="submit"]:disabled {
    opacity: 0.6;
  }
  .switch-auth {
    text-align: center;
    margin-top: 1.5rem;
    font-size: 1.1rem;
  }
  .switch-auth a {
    color: var(--primary-main);
    text-decoration: none;
  }
@media (max-width: 768px) {
  .auth-page {
    padding: 1rem;
  }
  .auth-form {
    max-width: 100%;
    padding: 0 16px;
  }
  .auth-form h1 {
    font-size: 1.8rem;
  }
  .field input {
    padding: 12px 16px;
    font-size: 1rem;
  }
  button[type="submit"] {
    padding: 12px;
    font-size: 1rem;
  }
}

/* Мобильные (375px) */
@media (max-width: 375px) {
  .auth-page {
    padding: 0.5rem;
    min-height: calc(100vh - 120px);
  }
  .auth-form {
    padding: 0 12px;
  }
  .auth-form h1 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
  .field {
    margin-bottom: 0.8rem;
  }
  .field label {
    font-size: 0.85rem;
  }
  .field input {
    padding: 10px 14px;
    font-size: 0.9rem;
    border-radius: 20px;
  }
  button[type="submit"] {
    padding: 10px;
    font-size: 0.9rem;
  }
  .switch-auth {
    font-size: 0.8rem;
    margin-top: 1rem;
  }
  }
  </style>