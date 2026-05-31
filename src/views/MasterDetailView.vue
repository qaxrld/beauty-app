<template>
    <div class="master-detail" v-if="master">
      <div class="container">
        <div class="master-grid">
          <div class="master-left">
            <img :src="master.avatar || '/default-avatar.jpg'" alt="avatar" class="avatar" />
            <div class="master-name">
              <h2>{{ master.name }}</h2>
            </div>
            <div class="master-contacts">
              <div class="contact-item">
                📞 <a :href="'tel:' + (master.phone || '+79991234567')">{{ master.phone || '+7 (999) 123-45-67' }}</a>
              </div>
              <div class="contact-item">✉️ {{ master.email || `${master.name.toLowerCase()}@example.com` }}</div>
              <div class="contact-item">📍 Адрес: {{ master.address || 'Не указан' }}</div>
            </div>
          </div>
  
          <div class="master-right">
            <div class="services-section">
              <h3>Услуги</h3>
              <div class="services-list">
                <div v-for="service in masterServices" :key="service.title" class="service-card">
                  <div class="service-details">
                    <div class="service-title">{{ service.title }}</div>
                    <div class="service-duration">{{ service.duration }}</div>
                  </div>
                  <div class="service-price">{{ formatPrice(service) }}</div>
                  <router-link :to="`/booking/${master.id}`" class="book-btn">Записаться</router-link>
                </div>
              </div>
            </div>
  
            <div class="reviews-section">
              <h3>Отзывы</h3>
              <div v-if="reviewsArray.length" class="reviews-list">
                <div v-for="review in visibleReviews" :key="review.id" class="review-card">
                  <div class="review-header">
                    <span class="user-name">{{ review.userName }}</span>
                    <span class="rating">⭐ {{ review.rating }}</span>
                    <span class="date">{{ review.date }}</span>
                  </div>
                  <p class="review-text">{{ review.text }}</p>
                </div>
              </div>
              <div v-else class="empty">Пока нет отзывов.</div>
              <div v-if="reviewsArray.length > 6" class="show-more">
                <button @click="showAllReviews = !showAllReviews" class="toggle-btn">
                  {{ showAllReviews ? 'Скрыть' : 'Показать все' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="container">Мастер не найден</div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  import { useRoute } from 'vue-router'
  import { useMastersStore } from '../stores/mastersStore'
  
  const route = useRoute()
  const mastersStore = useMastersStore()
  
  const masterId = parseInt(route.params.id)
  const master = computed(() => mastersStore.getMasterById(masterId))
  
  const masterServices = computed(() => {
    if (!master.value) return []
    if (master.value.services && master.value.services.length) return master.value.services
    return [{
      title: master.value.service || 'Услуга',
      price: master.value.price || 0,
      duration: '1 час'
    }]
  })
  
  function formatPrice(service) {
    if (service.priceType === 'fixed') return `${service.fixedPrice} ₽`
    if (service.priceType === 'range') return `${service.priceFrom} – ${service.priceTo} ₽`
    return `${service.price} ₽`
  }
  
  // Отзывы
  const reviewsArray = computed(() => {
    const rev = master.value?.reviews
    return Array.isArray(rev) ? rev : []
  })
  const showAllReviews = ref(false)
  const visibleReviews = computed(() => {
    if (showAllReviews.value) return reviewsArray.value
    return reviewsArray.value.slice(0, 6)
  })
</script>
  
  <style scoped>
  .master-detail {
    padding: 2rem 0;
    min-height: calc(100vh - 140px);
  }
  .master-grid {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 4rem;
    align-items: start;
  }
  .master-left {
    text-align: center;
    min-width: 200px;
  }
  .avatar {
    width: 13rem;
    height: 13rem;
    border-radius: 50%;
    object-fit: cover;
    margin-bottom: 0.5rem;
  }
  .master-name h2 {
    margin: 0;
    font-size: 1.4rem;
    font-weight: bold;
    color: var(--card-text);
  }
  .master-contacts {
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    font-size: 0.9rem;
    color: var(--gray-dark);
  }
  .contact-item a {
  color: inherit;
  text-decoration: none;
}
.contact-item a:hover {
  text-decoration: underline;
}
  .master-right {
    width: 100%;
  }
  h3 {
    font-size: 1.6rem;
    margin-bottom: 1rem;
    font-weight: 400;
  }
  .services-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 2rem;
  }
  .service-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: var(--primary-light);
    border-radius: 15px;
    padding: 1rem;
    flex-wrap: wrap;
  }
  .service-details {
    flex: 2;
  }
  .service-title {
    font-weight: bold;
    font-size: 1.1rem;
  }
  .service-duration {
    font-size: 0.9rem;
    color: var(--gray-dark);
  }
  .service-price {
    font-weight: bold;
    font-size: 1.2rem;
    margin-right: 1rem;
  }
  .book-btn {
    background: var(--primary-main);
    color: var(--primary-light);
    padding: 6px 16px;
    border-radius: 40px;
    text-decoration: none;
    font-weight: bold;
  }
  .reviews-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 1rem;
  }
  .review-card {
    background: var(--primary-light);
    border-radius: 15px;
    padding: 1rem;
  }
  .review-header {
    display: flex;
    gap: 1rem;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
  }
  .user-name {
    font-weight: bold;
  }
  .rating {
    color: #f5a623;
  }
  .date {
    color: var(--gray-dark);
  }
  .review-text {
    margin: 0;
  }
  .empty {
    text-align: center;
    padding: 1rem;
    color: var(--gray-dark);
  }
  .show-more {
    text-align: center;
    margin-top: 0.5rem;
  }
  .toggle-btn {
    background: none;
    border: none;
    color: var(--primary-main);
    cursor: pointer;
    font-weight: bold;
  }
  @media (max-width: 768px) {
    .master-grid {
      grid-template-columns: 1fr;
      gap: 2rem;
    }
    .service-card {
      flex-direction: column;
      text-align: center;
      gap: 0.5rem;
    }
    .book-btn {
      width: 100%;
      text-align: center;
    }
  }
  </style>