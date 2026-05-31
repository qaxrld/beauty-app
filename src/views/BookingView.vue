<template>
    <div class="booking-page">
      <div class="container">
        <div class="booking-grid">
          <div class="master-info">
            <img :src="master.avatar || '/default-avatar.jpg'" alt="avatar" class="master-avatar" />
            <h2>{{ master.name }}</h2>
          </div>
  
          <div class="booking-right">
            <div class="services-and-calendar">
              <div class="left-section">
                <div class="services-section">
                  <h3>Выберите услугу для записи</h3>
                    <div class="services-list">
                    <div v-for="service in masterServices" :key="service.title"
                        class="service-card"
                        :class="{ active: selectedService === service }"
                        @click="selectService(service)">
                        <div class="service-details">
                        <div class="service-title">{{ service.title }}</div>
                        <div class="service-duration">{{ service.duration }}</div>
                        </div>
                        <div class="service-price">{{ formatPrice(service) }}</div>
                    </div>
                    </div>
                </div>
  
                <div class="time-slots-section">
                  <h3>Выберите время</h3>
                  <div class="time-slots">
                    <button v-for="slot in timeSlots" :key="slot" :class="['time-slot', { active: selectedTime === slot }]" @click="selectedTime = slot">
                      {{ slot }}
                    </button>
                  </div>
                </div>
  
                <button class="confirm-booking" :disabled="!selectedService || !selectedDate || !selectedTime" @click="confirmBooking">
                  Подтвердить запись
                </button>
              </div>
  
              <div class="calendar-wrapper">
                <div class="calendar-header">
                  <button @click="prevMonth" class="month-nav">&lt;</button>
                  <span>{{ currentMonthName }} {{ currentYear }}</span>
                  <button @click="nextMonth" class="month-nav">&gt;</button>
                </div>
                <div class="calendar-container">
                  <div class="calendar-weekdays">
                    <div v-for="day in weekdays" :key="day" class="weekday">{{ day }}</div>
                  </div>
                  <div class="calendar-days">
                    <div v-for="(day, idx) in calendarDays" :key="idx" class="calendar-day"
                         :class="{ 'empty': !day, 'selected': selectedDate === day?.date, 'available': day?.available }"
                         @click="day?.available && selectDate(day.date)">
                      <span v-if="day">{{ day.day }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useUserStore } from '../stores/userStore'
  import { useMastersStore } from '../stores/mastersStore'
  
  const route = useRoute()
  const router = useRouter()
  const userStore = useUserStore()
  const mastersStore = useMastersStore()
  
  const masterId = parseInt(route.params.masterId)
  const master = computed(() => mastersStore.allMasters.find(m => m.id === masterId) || {})
  
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
  
  const currentDate = ref(new Date())
  const selectedDate = ref(null)
  const selectedService = ref(null)
  const selectedTime = ref(null)
  const timeSlots = ['10:00', '12:00', '14:00', '16:30', '18:00', '21:00']
  const weekdays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
  const currentMonthName = computed(() => currentDate.value.toLocaleString('ru', { month: 'long' }))
  const currentYear = computed(() => currentDate.value.getFullYear())
  
  const calendarDays = computed(() => {
    const year = currentDate.value.getFullYear()
    const month = currentDate.value.getMonth()
    const firstDayOfMonth = new Date(year, month, 1)
    const startDay = firstDayOfMonth.getDay() === 0 ? 6 : firstDayOfMonth.getDay() - 1
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const days = []
    for (let i = 0; i < startDay; i++) days.push(null)
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d)
      const today = new Date()
      today.setHours(0,0,0,0)
      const available = date >= today
      days.push({ day: d, date: date.toISOString().slice(0,10), available })
    }
    return days
  })
  
  function prevMonth() { currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1) }
  function nextMonth() { currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1) }
  function selectDate(date) { if (date) selectedDate.value = date }
  function selectService(service) { selectedService.value = service }
  
  async function confirmBooking() {
  if (!selectedService.value || !selectedDate.value || !selectedTime.value) {
    alert('Выберите услугу, дату и время')
    return
  }

  const dateObj = new Date(selectedDate.value)
  const formattedDate = dateObj.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })

  let priceString = ''
  if (selectedService.value.priceType === 'fixed') {
    priceString = `${selectedService.value.fixedPrice} ₽`
  } else if (selectedService.value.priceType === 'range') {
    priceString = `${selectedService.value.priceFrom} – ${selectedService.value.priceTo} ₽`
  } else {
    priceString = `${selectedService.value.price} ₽`
  }

  const appointment = {
    service: selectedService.value.title,
    masterName: master.value.name,
    masterId: master.value.id,
    date: formattedDate,         
    time: selectedTime.value,
    price: priceString,          
    status: 'Подтверждено',
    duration: selectedService.value.duration,
    masterAvatar: master.value.avatar
  }

  userStore.addAppointment(appointment)
  router.push('/profile')
}
  </script>
  
  
  <style scoped>
  .booking-page {
    padding: 2rem 0;
    min-height: calc(100vh - 140px);
  }
  .booking-grid {
    display: grid;
    grid-template-columns: 300px 1fr;
    gap: 2rem;
  }
  .master-info {
    text-align: center;
  }
  .master-avatar {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    object-fit: cover;
    margin-bottom: 1rem;
  }
  .booking-right {
    width: 100%;
  }
  .services-and-calendar {
    display: grid;
    grid-template-columns: 1fr 400px;
    gap: 2rem;
    align-items: start;
  }
  .left-section {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  .services-section h3, .time-slots-section h3 {
    margin-bottom: 1rem;
  }
  .services-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .service-card {
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: var(--primary-light);
    border-radius: 15px;
    padding: 1rem;
  }
  .service-card.active {
  border: 2px solid var(--primary-main);
  background: var(--primary-light);
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
 
  .time-slots {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
  }
  .time-slot {
    color: var(--primary-light);
    background: var(--primary-main);
    border: 1px solid var(--primary-light);
    border-radius: 15px;
    padding: 6px 16px;
    cursor: pointer;
    transition: 0.2s;
  }
  .time-slot.active {
    background: var(--primary-light);
    border-color: var(--primary-main);
    color: var(--primary-dark);
  }
  .calendar-wrapper {
    display: flex;
    flex-direction: column;
  }
  .calendar-header {
    display: flex;
    justify-content: space-between;
    font-weight: bold;
    font-size: 1.4rem;
    align-items: center;
    margin-bottom: 0.5rem;
    padding: 0 1rem;
  }
  .month-nav {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
  }
  .calendar-container {
    background: var(--primary-light);
    border: 1px solid var(--primary-main);
    border-radius: 15px;
    padding: 1rem;
  }
  .calendar-weekdays {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    text-align: center;
    font-weight: 400;
    color: var(--primary-main);
    padding: 0.5rem 0;
    margin-bottom: 0.5rem;
  }
  .calendar-days {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 0.25rem;
  }
  .calendar-day {
    text-align: center;
    padding: 0.5rem;
    border-radius: 50%;
    cursor: pointer;
  }
  .calendar-day.empty {
    cursor: default;
  }
  .calendar-day.available:hover {
    background: var(--primary-main);
  }
  .calendar-day.selected {
  background: var(--primary-main);
  color: var(--primary-light);
  border-radius: 50px; /* овал, не круг */
  padding: 0.5rem 0.8rem;
}
  .confirm-booking {
    margin-top: 1rem;
    background: var(--primary-main);
    color: var(--primary-light);
    border: none;
    padding: 10px 20px;
    border-radius: 15px;
    cursor: pointer;
    font-size: 1rem;
    width: 100%;
  }
  .confirm-booking:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  @media (max-width: 1024px) {
    .services-and-calendar {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
  }
  @media (max-width: 768px) {
    .booking-grid {
      grid-template-columns: 1fr;
    }
  }
  </style>