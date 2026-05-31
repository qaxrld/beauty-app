<template>
  <div class="home">
    <div class="container">
      <div class="search-row">
        <input type="text" v-model="searchQuery" placeholder="Поиск мастера или услуги..." class="search-input" />
      </div>

      <div class="city-row">
        <div class="city-selector">
          <label>Выберите город</label>
          <select v-model="selectedCity">
            <option>Москва</option>
            <option>Санкт-Петербург</option>
            <option>Казань</option>
          </select>
        </div>
      </div>

      <div class="cards-wrapper">
        <h1 class="page-title">Мастера рядом с вами</h1>

        <div v-if="mastersStore.loading" class="state-message">Загрузка мастеров...</div>
        <div v-else-if="mastersStore.error" class="state-message error">Ошибка: {{ mastersStore.error }}</div>
        <div v-else class="masters-grid">
          <div v-for="master in filteredMasters" :key="master.id" class="master-card" @click="goToMaster(master.id)">
            <div class="work-image-wrapper">
              <img :src="master.workImage" :alt="master.service" class="work-image" />
            </div>
            <div class="master-header">
              <img :src="master.avatar || '/default-avatar.jpg'" alt="avatar" class="avatar" />
              <div class="name-and-rating">
                <h3>{{ master.name }}</h3>
                <div class="rating">{{ master.rating }}⭐️ ({{ master.reviews }})</div>
              </div>
            </div>
            <p class="service">{{ master.service }}</p>
            <div class="price">{{ master.price }}</div>
            <p class="bio">{{ master.bio }}</p>
            <router-link :to="`/booking/${master.id}`" class="btn" @click.stop>Записаться</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useMastersStore } from '../stores/mastersStore'

const mastersStore = useMastersStore()
const router = useRouter()
const selectedCity = ref('Москва')
const searchQuery = ref('')

const allMasters = computed(() => mastersStore.getAllMasters)


const filteredMasters = computed(() => {
  if (!searchQuery.value.trim()) return allMasters.value
  const query = searchQuery.value.toLowerCase()
  return allMasters.value.filter(master =>
    master.name.toLowerCase().includes(query) ||
    (master.service && master.service.toLowerCase().includes(query))
  )
})


const goToMaster = (id) => {
  router.push(`/master/${id}`)
}
</script>

<style scoped>
.home {
  padding: 40px 0;
  min-height: calc(100vh - 140px);
}
.search-row, .city-row {
  padding: 0 6%;
}
.search-row {
  margin-bottom: 24px;
}
.search-input {
  width: 100%;
  padding: 14px 20px;
  font-size: 1rem;
  border: none;
  border-radius: 15px;
  background: #D9D9D9;
  outline: none;
  font-family: inherit;
}
.city-row {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}
.city-selector {
  display: flex;
  align-items: center;
  gap: 12px;
}
.city-selector label {
  font-weight: 500;
  font-size: 1rem;
  color: var(--card-text);
}
.city-selector select {
  padding: 8px 16px;
  font-size: 1rem;
  border: none;
  background: none;
  cursor: pointer;
  color: var(--card-text);
  font-family: inherit;
}
.cards-wrapper {
  padding: 0 12%;
}
.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--card-text);
  margin-bottom: 32px;
  text-align: center;
}
.masters-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 48px;
}
.master-card {
  background: var(--primary-light);
  border-radius: 15px;
  padding: 16px;
  transition: transform 0.2s;
  box-shadow: 0 12px 32px rgba(0,0,0,0.08);
  display: flex;
  flex-direction: column;
  height: 100%;
  cursor: pointer;
}
.master-card:hover {
  transform: translateY(-6px);
}
.work-image-wrapper {
  width: 100%;
  border-radius: 15px;
  overflow: hidden;
  margin-bottom: 16px;
}
.work-image {
  width: 100%;
  display: block;
  object-fit: cover;
  aspect-ratio: 16 / 9;
}
.master-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}
.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}
.name-and-rating {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  flex-wrap: wrap;
}
.name-and-rating h3 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--card-text);
}
.rating {
  font-weight: bold;
  font-size: 0.9rem;
}
.service {
  font-weight: 500;
  margin-bottom: 8px;
  color: var(--card-text);
}
.price {
  font-weight: bold;
  margin-bottom: 12px;
  font-size: 1.1rem;
}
.bio {
  margin: 0 0 20px 0;
  color: var(--card-text);
  line-height: 1.4;
  font-size: 0.95rem;
  flex-grow: 1;
}
.btn {
  display: inline-block;
  background: var(--primary-main);
  color: var(--primary-light);
  border: none;
  padding: 10px 20px;
  border-radius: 48px;
  cursor: pointer;
  font-weight: bold;
  font-size: 1rem;
  transition: background 0.2s;
  align-self: flex-start;
  text-decoration: none;
}
.btn:hover {
  color: var(--primary-main);
  background: var(--primary-light);
  text-decoration: none;
}
.state-message {
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
}
.error {
  color: red;
}
@media (max-width: 768px) {
  .masters-grid {
    grid-template-columns: 1fr;
    gap: 32px;
  }
  .cards-wrapper {
    padding: 0 5%;
  }
}

@media (max-width: 375px) {
  .city-selector {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }
  .city-selector label {
    font-size: 0.85rem;
  }
  .city-selector select {
    font-size: 0.8rem;
    padding: 5px 10px;
    width: 100%;
  }
  .search-input {
    font-size: 0.85rem;
    padding: 10px 14px;
  }
  .page-title {
    font-size: 1.4rem;
  }
  .cards-wrapper {
    padding: 0 3%;
  }
  .master-card {
    padding: 12px;
  }
  .avatar {
    width: 40px;
    height: 40px;
  }
  .name-and-rating h3 {
    font-size: 1.1rem;
  }
  .btn {
    padding: 6px 12px;
    font-size: 0.8rem;
  }

}
</style>