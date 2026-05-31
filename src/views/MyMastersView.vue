<template>
  <div class="my-masters-page">
    <div class="container">
      <h2>Мои мастера</h2>
      <div v-if="myMasters.length" class="masters-list">
        <div v-for="master in myMasters" :key="master.id" class="master-card">
          <div class="card-avatar">
            <img :src="master.avatar || '/default-avatar.jpg'" alt="avatar" />
          </div>
          <div class="card-info">
            <div class="master-name">{{ master.name }}</div>
            <div class="last-service">Последняя услуга: {{ master.service }}</div>
            <div class="last-date">Дата: {{ master.lastDate }}</div>
          </div>
          <router-link :to="`/booking/${master.id}`" class="book-again-btn">Записаться снова</router-link>
        </div>
      </div>
      <div v-else class="empty">
        Вы ещё не записывались к мастерам
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useUserStore } from '../stores/userStore'

const userStore = useUserStore()
const myMasters = computed(() => userStore.getUniqueMastersFromAppointments)
</script>

<style scoped>
.my-masters-page {
  padding: 2rem 0;
  min-height: calc(100vh - 140px);
}
.my-masters-page h2 {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
}
.masters-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.master-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: var(--primary-light);
  border-radius: 15px;
  padding: 1rem;
  flex-wrap: wrap;
}
.card-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
}
.card-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.card-info {
  flex: 1;
}
.master-name {
  font-weight: bold;
  font-size: 1.2rem;
}
.last-service, .last-date {
  font-size: 0.9rem;
  color: var(--gray-dark);
}
.book-again-btn {
  background: var(--primary-main);
  color: var(--primary-light);
  border: none;
  padding: 6px 16px;
  border-radius: 15px;
  cursor: pointer;
  text-decoration: none;
  font-weight: bold;
}
.book-again-btn:hover {
  background: var(--primary-light);
  color: var(--primary-main);
}
.empty {
  text-align: center;
  padding: 2rem;
  color: var(--gray-dark);
}
@media (max-width: 768px) {
  .master-card {
    flex-direction: column;
    text-align: center;
  }
  .book-again-btn {
    width: 100%;
  }
}
</style>