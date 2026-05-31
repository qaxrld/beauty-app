<template>
  <div class="categories-page">
    <div class="container">
    

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
        <div class="categories-list">
          <div class="category-item" v-for="cat in categoriesWithIcons" :key="cat.name" @click="goToCategory(cat.name)">
            <div class="category-icon">
              <span class="icon">{{ cat.icon }}</span>
            </div>
            <span class="category-name">{{ cat.name }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const selectedCity = ref('Москва')
const searchQuery = ref('')

const categoriesWithIcons = [
  { name: 'Ногти', icon: '💅' },
  { name: 'Ресницы', icon: '👁️' },
  { name: 'Брови', icon: '✏️' },
  { name: 'Волосы', icon: '💇‍♀️' },
  { name: 'Макияж', icon: '💄' },
  { name: 'Пирсинг', icon: '🔮' }
]

const goToCategory = (categoryName) => {
  router.push(`/category/${categoryName}`)
}
</script>

<style scoped>
.categories-page {
  padding: 32px 0;
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
  transition: border 0.2s;
  font-family: inherit;
}
.search-input:focus {
  border-color: var(--primary-main);
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
.categories-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);  
  gap: 24px;
}
.category-item {
  background: var(--primary-light);
  border-radius: 24px;
  padding: 24px 16px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  transition: transform 0.2s;
  cursor: pointer;
}
.category-item:hover {
  transform: translateY(-4px);
  background: var(--primary-light);
}
.category-icon .icon {
  font-size: 48px;
  display: block;
  margin-bottom: 12px;
}
.category-name {
  font-size: 1.1rem;
  font-weight: 500;
}
@media (max-width: 768px) {
  .search-row, .city-row {
    padding: 0 5%;
  }
  .cards-wrapper {
    padding: 0 5%;
  }
  .categories-list {
    grid-template-columns: repeat(2, 1fr);  
    gap: 16px;
  }
}
</style>