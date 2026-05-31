<template>
    <div class="profile-page">
      <div class="container">
        <div class="profile-grid">
          <div class="profile-left">
            <img :src="userStore.user?.avatar || '/default-avatar.jpg'" alt="avatar" class="avatar" />
            <div class="profile-name">
              <h2>{{ userStore.user?.name || 'Пользователь' }}</h2>
            </div>
            <button class="change-photo-btn" @click="triggerFileUpload">Сменить фото</button>
            <input type="file" ref="avatarInput" accept="image/*" style="display: none" @change="handleAvatarUpload" />
            <button class="logout-button" @click="logout">Выйти</button>
          </div>
  
          <div class="profile-right">
            <div class="tabs-box" ref="tabsContainer">
              <template v-for="(tab, idx) in tabs" :key="tab.key">
                <button
                  :ref="el => setTabRef(el, idx)"
                  class="tab-btn"
                  :class="{ active: activeTab === tab.key }"
                  @click="setActiveTab(tab.key)"
                >
                  {{ tab.label }}
                </button>
                <span v-if="idx < tabs.length - 1" class="separator">|</span>
              </template>
              <span class="tab-slider" :style="sliderStyle"></span>
            </div>
  
            <div class="tab-content">
              <div v-if="activeTab === 'appointments'">
                <div class="appointments-section">
                  <h3>Мои записи</h3>
                  <div v-if="activeAppointments.length" class="appointments-list">
                    <div v-for="app in activeAppointments" :key="app.id" class="appointment-card">
                        <div class="card-avatar">
                        <img :src="app.masterAvatar || '/default-avatar.jpg'" alt="master" />
                        </div>
                        <div class="card-details">
                            <div class="service">{{ app.service }}</div>
                            <div class="master">{{ app.masterName }}</div>
                            <div class="info-row">
                                <span class="date">{{ app.date }}</span>
                                <span class="time">{{ app.time }}</span>
                            </div>
                            <div class="info-row">
                                <span class="price">{{ app.price || 'Цена не указана' }}</span>
                                <span class="duration">{{ app.duration }}</span>
                            </div>
                            </div>
                        <div class="card-actions">
                        <div class="status confirmed">{{ app.status }}</div>
                        <button class="cancel-btn" @click="cancelAppointment(app.id)">Отменить</button>
                        </div>
                    </div>
                  </div>
                  <div v-else class="empty">Нет активных записей</div>
                </div>
  
                <div class="archive-section">
                  <h3>Архив</h3>
                  <div v-if="archivedAppointments.length" class="archive-list">
                    <div v-for="app in archivedAppointments" :key="app.id" class="archive-card">
                        <div class="card-avatar">
                        <img :src="app.masterAvatar || '/default-avatar.jpg'" alt="master" />
                        </div>
                        <div class="card-details">
                            <div class="service">{{ app.service }}</div>
                            <div class="master">{{ app.masterName }}</div>
                            <div class="info-row">
                                <span class="date">{{ app.date }}</span>
                                <span class="time">{{ app.time }}</span>
                            </div>
                            <div class="info-row">
                                <span class="price">{{ app.price || 'Цена не указана' }}</span>
                                <span class="duration">{{ app.duration }}</span>
                            </div>
                            </div>
                        <div class="card-actions">
                        <div class="status completed">{{ app.status }}</div>
                        </div>
                    </div>
                  </div>
                  <div v-else class="empty">Архив пуст</div>
                </div>
              </div>
  
              <div v-if="activeTab === 'masters'">
                <h3>Мои мастера</h3>
                <p class="subtitle">Выбери мастера для записи</p>
                <div v-if="myMasters.length" class="masters-list">
                    <div v-for="master in myMasters" :key="master.id" class="master-card-item">
                    <div class="master-avatar">
                        <img :src="master.avatar || '/default-avatar.jpg'" alt="avatar" />
                    </div>
                    <div class="master-info">
                        <div class="master-name">{{ master.name }}</div>
                    </div>
                    <router-link :to="`/booking/${master.id}`" class="book-again-btn">Записаться</router-link>
                    </div>
                </div>
                <div v-else class="empty">Вы ещё не записывались к мастерам</div>
              </div>
  
              <div v-if="activeTab === 'become' && !userStore.isMaster">
                <div class="become-master-form">
                  <h3>Стать мастером</h3>
                  <div class="form-group">
                    <label>Кем ты работаешь?</label>
                    <div class="categories-choice">
                      <div v-for="cat in availableCategories" :key="cat.name"
                           :class="['category-option', { selected: masterRequest.categories.includes(cat.name) }]"
                           @click="toggleCategory(cat.name)">
                        <span class="cat-icon">{{ cat.icon }}</span>
                        <span class="cat-name">{{ cat.name }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="form-group">
                    <label>Адрес</label>
                    <input type="text" v-model="masterRequest.address" placeholder="Ваш адрес" />
                  </div>
                  <div class="form-group">
                    <label>Описание</label>
                    <textarea v-model="masterRequest.description" rows="4" placeholder="Расскажите о себе"></textarea>
                  </div>
                  <button class="submit-btn" @click="submitMasterRequest">Стать мастером</button>
                </div>
              </div>
  
              <div v-if="activeTab === 'services' && userStore.isMaster">
                <h3>Услуги</h3>
                <div class="service-form">
                  <div class="form-group">
                    <label>Название услуги</label>
                    <input type="text" v-model="newService.title" placeholder="Например: Наращивание ресниц" />
                    <span class="error-message" v-if="errors.title">{{ errors.title }}</span>
                  </div>
                  <div class="form-group">
                    <label>Описание</label>
                    <textarea v-model="newService.description" rows="3" placeholder="Краткое описание услуги"></textarea>
                    <span class="error-message" v-if="errors.description">{{ errors.description }}</span>
                  </div>
                  <div class="form-group">
                    <div class="photo-label">
                        <label>Фото услуги (обязательно)</label>
                    </div>
                    <div class="photos-upload">
                        <div class="photo-preview" v-if="newService.photos[0]">
                        <img :src="newService.photos[0]" alt="preview" />
                        <button type="button" class="remove-photo" @click="removePhoto(0)">×</button>
                        </div>
                        <label v-else class="add-photo-btn">
                        <input type="file" accept="image/*" @change="addPhoto" style="display: none;" />
                        <span>+ Загрузить фото</span>
                        </label>
                    </div>
                    <span class="error-message" v-if="errors.photo">Добавьте фото услуги</span>
                  </div>
                  <div class="form-group">
                    <label>Цена</label>
                    <div class="price-type-buttons">
                      <button type="button" :class="['price-type-btn', { active: newService.priceType === 'fixed' }]" @click="newService.priceType = 'fixed'">Фикс</button>
                      <button type="button" :class="['price-type-btn', { active: newService.priceType === 'range' }]" @click="newService.priceType = 'range'">Диапазон</button>
                    </div>
                    <div v-if="newService.priceType === 'fixed'" class="price-fixed">
                      <input type="number" v-model.number="newService.fixedPrice" placeholder="Стоимость" />
                      <span class="currency">₽</span>
                      <span class="error-message" v-if="errors.fixedPrice">{{ errors.fixedPrice }}</span>
                    </div>
                    <div v-else-if="newService.priceType === 'range'" class="price-range">
                      <input type="number" v-model.number="newService.priceFrom" placeholder="От" />
                      <span>—</span>
                      <input type="number" v-model.number="newService.priceTo" placeholder="До" />
                      <span class="currency">₽</span>
                      <span class="error-message" v-if="errors.priceRange">{{ errors.priceRange }}</span>
                    </div>
                  </div>
                  <div class="form-group">
                    <label>Время выполнения</label>
                    <div class="duration-buttons">
                      <button v-for="dur in durationOptions" :key="dur"
                        :class="['duration-btn', { active: newService.duration === dur }]"
                        @click="newService.duration = dur">
                        {{ dur }}
                      </button>
                    </div>
                  </div>
                  <button class="save-service-btn" @click="saveService">Сохранить услугу</button>
                </div>
  
                <div v-if="userStore.masterServices.length" class="services-list">
                  <h4>Мои услуги</h4>
                  <div v-for="(service, idx) in userStore.masterServices" :key="idx" class="service-item">
                    <div class="service-item-header">
                      <strong>{{ service.title }}</strong>
                      <button class="delete-service" @click="deleteService(idx)">🗑</button>
                    </div>
                    <p>{{ service.description }}</p>
                    <div class="service-meta">
                      <span v-if="service.priceType === 'fixed'">{{ service.fixedPrice }} ₽</span>
                      <span v-else>{{ service.priceFrom }} – {{ service.priceTo }} ₽</span>
                      <span>• {{ service.duration }}</span>
                    </div>
                    <div class="service-photos" v-if="service.photos && service.photos.length">
                      <img v-for="(photo, pidx) in service.photos" :key="pidx" :src="photo" class="service-photo-thumb" />
                    </div>
                  </div>
                </div>
              </div>
  
              <div v-if="activeTab === 'windows' && userStore.isMaster">
                <h3>Окна</h3>
                <p>Здесь будут окна записи</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, nextTick, onMounted } from 'vue'
  import { useUserStore } from '../stores/userStore'
  import { useRouter } from 'vue-router'
  
  const userStore = useUserStore()
  const router = useRouter()
  
  const tabs = computed(() => {
    const items = [
      { key: 'appointments', label: 'Мои записи' },
      { key: 'masters', label: 'Мои мастера' }
    ]
    if (!userStore.isMaster) {
      items.push({ key: 'become', label: 'Стать мастером' })
    }
    if (userStore.isMaster) {
      items.push(
        { key: 'services', label: 'Услуги' },
        { key: 'windows', label: 'Окна' }
      )
    }
    return items
  })
  
  const activeTab = ref('appointments')
  
  const tabRefs = ref([])
  const tabsContainer = ref(null)
  const sliderStyle = ref({ width: '0px', transform: 'translateX(0px)' })
  
  function setTabRef(el, idx) {
    if (el) tabRefs.value[idx] = el
  }
  
  async function setActiveTab(key) {
    activeTab.value = key
    await nextTick()
    updateSlider()
  }
  
  function updateSlider() {
    const idx = tabs.value.findIndex(t => t.key === activeTab.value)
    const activeBtn = tabRefs.value[idx]
    if (activeBtn && tabsContainer.value) {
      const containerRect = tabsContainer.value.getBoundingClientRect()
      const btnRect = activeBtn.getBoundingClientRect()
      const left = btnRect.left - containerRect.left
      sliderStyle.value = {
        width: `${btnRect.width}px`,
        transform: `translateX(${left}px)`,
        transition: 'transform 0.3s ease, width 0.3s ease'
      }
    }
  }
  
  onMounted(() => {
    updateSlider()
  })
  
  const activeAppointments = computed(() => userStore.activeAppointments)
  const archivedAppointments = computed(() => userStore.archivedAppointments)
  const myMasters = computed(() => userStore.getUniqueMastersFromAppointments)
  
  const cancelAppointment = (id) => {
    userStore.cancelAppointment(id)
  }
  const openArchiveDetail = (id) => {
    router.push(`/appointment/${id}`)
  }

  
  const availableCategories = [
    { name: 'Ногти', icon: '💅' },
    { name: 'Ресницы', icon: '👁️' },
    { name: 'Брови', icon: '✏️' },
    { name: 'Волосы', icon: '💇‍♀️' },
    { name: 'Макияж', icon: '💄' },
    { name: 'Пирсинг', icon: '🔮' }
  ]
  
  const masterRequest = ref({
    name: userStore.user?.name || '',
    phone: userStore.user?.phone || '',
    categories: [],
    address: '',
    description: ''
  })
  
  const toggleCategory = (catName) => {
    const idx = masterRequest.value.categories.indexOf(catName)
    if (idx === -1) {
      masterRequest.value.categories.push(catName)
    } else {
      masterRequest.value.categories.splice(idx, 1)
    }
  }
  
  const submitMasterRequest = async () => {
    if (!masterRequest.value.categories.length) {
      alert('Выберите хотя бы одну категорию')
      return
    }
    if (!masterRequest.value.address.trim()) {
      alert('Введите адрес')
      return
    }
    if (!masterRequest.value.description.trim()) {
      alert('Введите описание')
      return
    }
    const success = await userStore.becomeMaster(masterRequest.value)
    if (success) {
      masterRequest.value = {
        name: userStore.user?.name || '',
        phone: userStore.user?.phone || '',
        categories: [],
        address: '',
        description: ''
      }
      activeTab.value = 'services'
      await nextTick()
      updateSlider()
    }
  }
  
  const avatarInput = ref(null)
  
  const triggerFileUpload = () => {
    avatarInput.value.click()
  }
  
  const handleAvatarUpload = (event) => {
    const file = event.target.files[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      alert('Выберите изображение')
      return
    }
    const reader = new FileReader()
    reader.onload = (e) => {
      userStore.updateAvatar(e.target.result)
    }
    reader.readAsDataURL(file)
  }
  
  // Выход
  const logout = () => {
    userStore.logout()
    router.push('/')
  }
  
  const durationOptions = ['30 мин', '45 мин', '1 час', '1.5 часа', '2 часа', '2.5 часа']
  
  const newService = ref({
    title: '',
    description: '',
    photos: [],
    priceType: 'fixed',
    fixedPrice: null,
    priceFrom: null,
    priceTo: null,
    duration: '30 мин'
  })
  
  const errors = ref({
    title: '',
    description: '',
    fixedPrice: '',
    priceRange: ''
  })
  
  const clearErrors = () => {
    errors.value = { title: '', description: '', fixedPrice: '', priceRange: '' }
  }
  
  const compressImage = (file, maxWidth = 300, maxHeight = 300, quality = 0.5) => {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width
            width = maxWidth
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height
            height = maxHeight
          }
        }
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)
        const dataUrl = canvas.toDataURL('image/jpeg', quality)
        resolve(dataUrl)
      }
      img.src = e.target.result
    }
    reader.readAsDataURL(file)
  })
}

  const addPhoto = async (event) => {
    const file = event.target.files[0]
  if (!file) return
  try {
    const compressed = await compressImage(file)
    newService.value.photos = [compressed]  
  } catch (err) {
    alert('Ошибка обработки фото')
  }
}

const removePhoto = (idx) => {
  newService.value.photos = [] 
}
  
  const saveService = () => {
    clearErrors()
    let isValid = true
  
    if (!newService.value.title.trim()) {
      errors.value.title = 'Введите название услуги'
      isValid = false
    }
  
    if (!newService.value.description.trim()) {
      errors.value.description = 'Введите описание услуги'
      isValid = false
    }
    if (newService.value.photos.length === 0) {
        errors.value.photo = 'Добавьте фото услуги'
        isValid = false
        }
  
    if (newService.value.priceType === 'fixed') {
      if (!newService.value.fixedPrice || newService.value.fixedPrice <= 0) {
        errors.value.fixedPrice = 'Введите корректную стоимость'
        isValid = false
      }
    } else if (newService.value.priceType === 'range') {
      if (!newService.value.priceFrom || newService.value.priceFrom <= 0) {
        errors.value.priceRange = 'Укажите начальную цену'
        isValid = false
      } else if (!newService.value.priceTo || newService.value.priceTo <= 0) {
        errors.value.priceRange = 'Укажите конечную цену'
        isValid = false
      } else if (newService.value.priceFrom >= newService.value.priceTo) {
        errors.value.priceRange = 'Цена "От" должна быть меньше цены "До"'
        isValid = false
      }
    }
  
    if (!isValid) return
  
    userStore.addService({ ...newService.value }) 

  
    newService.value = {
      title: '',
      description: '',
      photos: [],
      priceType: 'fixed',
      fixedPrice: null,
      priceFrom: null,
      priceTo: null,
      duration: '30 мин'
    }
    clearErrors()
  }
  
  const deleteService = (idx) => {
      userStore.removeService(idx)
    }
  
  </script>
  
  <style scoped>
  .profile-page {
    padding: 2rem 0;
    min-height: calc(100vh - 140px);
  }
  .profile-grid {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 4rem;
    align-items: start;
  }
  h3 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    font-weight: 400;
  }
  .profile-left {
    text-align: center;
    min-width: 150px;
  }
  .avatar {
    width: 13rem;
    height: 13rem;
    border-radius: 50%;
    object-fit: cover;
    margin-bottom: 0.5rem;
  }

  .avatar-container {
  position: relative;
  cursor: pointer;
}
.change-photo-btn {
  background: var(--primary-light);
  border: 1px solid var(--primary-main);
  border-radius: 15px;
  padding: 0.8rem 1.5rem;
  margin-top: 0.5rem;
  font-size: 0.9rem;
  cursor: pointer;
  color: var(--primary-main);
  transition: all 0.2s;
  width: 100%;
}
.change-photo-btn:hover {
  background: var(--primary-main);
  color: var(--primary-light);
}

  .profile-name h2 {
    margin: 0;
    font-size: 1.4rem;
    font-weight: bold;
    color: var(--card-text);
  }
  .logout-button {
    background: var(--primary-main);
    border: none;
    border-radius: 15px;
    padding: 0.8rem 1.5rem;
    margin-top: 1rem;
    font-size: 0.9rem;
    cursor: pointer;
    color: var(--primary-light);
    transition: all 0.2s;
    width: 100%;

  }
  .logout-button:hover {
    background: var(--gray-dark);
  }
  .profile-right {
    width: 100%;
  }
  .tabs-box {
    position: relative;
    background: var(--primary-light);
    border-radius: 15px;
    padding: 0.7rem 1rem;
    display: flex;
    align-items: center;
    gap: 0;
    width: fit-content;
    margin-bottom: 2rem;
  }
  .tab-btn {
    background: none;
    border: none;
    padding: 0.5rem 1rem;
    font-size: 1.1rem;
    cursor: pointer;
    color: var(--card-text);
    font-weight: normal;
    z-index: 1;
    transition: color 0.2s;
  }
  .separator {
    color: var(--primary-main);
    font-size: 1.1rem;
    user-select: none;
  }
  .tab-slider {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 3px;
    background-color: var(--primary-main);
    border-radius: 2px;
    transition: transform 0.3s ease, width 0.3s ease;
  }
  .tab-content {
    margin-top: 0;
  }
  .appointment-card, .archive-card {
    display: flex;
    align-items: center;
    gap: 1rem;
    background: var(--primary-light);
    border-radius: 15px;
    padding: 2rem;
    margin-bottom: 2rem;
    max-width: 700px;
  }
  .archive-card {
    cursor: pointer;
    transition: transform 0.2s;
    margin: 1rem;
  }
  .archive-card:hover {
    transform: translateX(4px);
  }
  .card-avatar {
    flex-shrink: 0;
    width: 70px;
    height: 70px;
    border-radius: 50%;
    overflow: hidden;
  }
  .card-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .card-details {
    flex: 1;
  }
  .card-actions {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 1rem;
  }
  .service {
    font-weight: bold;
    font-size: 1.1rem;
    margin-bottom: 0.25rem;
  }
  .master-row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 0.5rem;
    flex-wrap: wrap;
  }
  .master {
    text-wrap: wrap;
    font-weight: bold;
    font-size: 1rem;
  }
  .status {
    padding: 2px 10px;
    font-size: 1rem;
    font-weight: bold;
  }
  .status.confirmed {
    color: #B6D5A9;
  }
  .status.completed {
    color: #B792B3;
  }
  
  .info-row {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    font-size: 0.85rem;
    color: var(--gray-dark);
  }
  .cancel-btn {
    background: none;
    border: 1px solid #dc3545;
    color: #dc3545;
    padding: 4px 12px;
    border-radius: 20px;
    cursor: pointer;
    transition: 0.2s;
  }
  .cancel-btn:hover {
    background: #dc3545;
    color: white;
  }
  .masters-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-width: 700px;
  }
  .master-card-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    background: var(--primary-light);
    border-radius: 15px;
    padding: 1rem;
  }
  .master-avatar {
    flex-shrink: 0;
    width: 70px;
    height: 70px;
    border-radius: 50%;
    overflow: hidden;
  }
  .master-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .master-info {
    flex: 1;
  }
  .master-name {
    font-weight: bold;
    font-size: 1.3rem;
    color: var(--card-text);
  }
  .book-again-btn {
  background: var(--primary-main);
  color: var(--primary-light);
  border: none;
  padding: 6px 16px;
  border-radius: 15px;
  cursor: pointer;
  font-weight: bold;
  text-decoration: none;
  display: inline-block;
}
.book-again-btn:hover {
  background: var(--primary-light);
  color: var(--primary-main);
}
  .subtitle {
    font-size: 1rem;
    color: var(--primary-main);
    margin-bottom: 1.5rem;
  }
  .empty {
    color: var(--primary-main);
    padding: 1rem;
    text-align: center;
  }
  .form-group {
    margin-bottom: 1.5rem;
  }
  .form-group label {
    display: block;
    font-weight: 400;
    font-size: 1.5rem;
    margin-bottom: 0.8rem;
    color: var(--card-text);
  }
  .categories-choice {
    display: grid;
    grid-template-columns: repeat(3, auto);
    justify-content: left;
    gap: 24px;
    margin-bottom: 1rem;
  }
  .category-option {
    display: flex;
    align-items: center;
    gap: 8px;
    background: var(--primary-light);
    padding: 8px 20px;
    border-radius: 15px;
    cursor: pointer;
    transition: 0.2s;
    border: 1px solid transparent;
    white-space: wrap;
  }
  .category-option.selected {
    background: var(--primary-light);
    border-color: var(--primary-main);
    color: var(--primary-main);
  }
  .cat-icon {
    font-size: 1.2rem;
  }
  .cat-name {
    font-size: 0.9rem;
  }

  input, textarea {
    width: 80%;
    padding: 10px 16px;
    border: 1px solid #ddd;
    border-radius: 15px;
    font-family: inherit;
    font-size: 1rem;
    background: #f9f9f9;
  }
  textarea {
    resize: vertical;
  }
  .submit-btn {
    background: var(--primary-main);
    color: var(--primary-light);
    border: none;
    padding: 12px 24px;
    border-radius: 40px;
    font-size: 1rem;
    cursor: pointer;
    width: 20%;
    transition: background 0.2s;
  }
  .submit-btn:hover {
    color: var(--primary-main);
    background: var(--primary-light);
  }
  
  .error-message {
  display: block;
  color: #dc3545;
  font-size: 0.75rem;
  margin-top: 4px;
}


  .service-form {
    border-radius: 15px;
    padding: 1.5rem;
    margin-bottom: 2rem;
  }
  .photo-label {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
  }


  .photos-upload {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    align-items: center;
  }
  .photo-preview {
    position: relative;
    width: 80px;
    height: 80px;
    border-radius: 10px;
    overflow: hidden;
  }
  .photo-preview img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .remove-photo {
    position: absolute;
    top: 0;
    right: 0;
    background: rgba(0,0,0,0.5);
    color: white;
    border: none;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    cursor: pointer;
    font-size: 14px;
    line-height: 1;
  }
  .add-photo-btn {
  background: var(--primary-main);
  color: var(--primary-light) !important;
  padding: 0.5rem 1rem;
  border-radius: 15px;
  cursor: pointer;
  display: inline-block;
  font-weight: normal;
  border: none;
}
  .price-type-buttons {
    display: flex;
    gap: 1rem;
    margin-bottom: 0.5rem;
  }
  .price-type-btn {
    font-size: 1.2rem;
    background: var(--primary-light);
    border: 1px solid var(--primary-main);
    border-radius: 15px;
    padding: 10px 26px;
    cursor: pointer;
    transition: 0.2s;
  }
  .price-type-btn.active {
    background: var(--primary-main);
    color: var(--primary-light);
  }
  .price-fixed, .price-range {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
  }
  .price-fixed input, .price-range input {
    width: auto;
    min-width: 120px;
    border-radius: 15px;
  }
  .currency {
    font-weight: 400;
  }
  .duration-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }
  .duration-btn {
    font-size: 1.2rem;
    background: var(--primary-light);
    border: 1px solid var(--primary-main);
    border-radius: 15px;
    padding: 10px 26px;
    cursor: pointer;
    transition: 0.2s;
  }
  .duration-btn.active {
    background: var(--primary-main);
    border-color: var(--primary-main);
    color: var(--primary-light);
    border-radius: 15px;
  }
  .save-service-btn {
    background: var(--primary-main);
    color: var(--primary-light);
    border: none;
    padding: 10px 24px;
    border-radius: 15px;
    cursor: pointer;
    font-size: 1.4rem;
  }
  .services-list {
    margin-top: 1.5rem;
  }
  .service-item {
    background: var(--primary-light);
    border-radius: 15px;
    padding: 1rem;
    margin-bottom: 1rem;
  }
  
h4{
    font-size: 1.5rem;
    font-weight: 400;
    margin-bottom: 0.8rem;
}

  .service-item-header {
    font-size: 1.3rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }
  .delete-service {
    background: none;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
  }
  .service-meta {
    display: flex;
    gap: 1rem;
    font-size: 0.9rem;
    color: var(--gray-dark);
    margin-top: 0.5rem;
  }
  .service-photos {
    display: flex;
    gap: 0.5rem;
    margin-top: 0.5rem;
    flex-wrap: wrap;
  }
  .service-photo-thumb {
    width: 50px;
    height: 50px;
    border-radius: 8px;
    object-fit: cover;
  }
  @media (max-width: 768px) {
  .profile-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  .profile-left {
    text-align: center;
  }
  .tabs-box {
    width: 100%;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.5rem;
  }
  .tab-btn {
    font-size: 0.9rem;
    padding: 0.3rem 0.6rem;
  }
  .appointment-card, .archive-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  .card-avatar {
    width: 50px;
    height: 50px;
  }
  .card-actions {
    align-items: flex-start;
    width: 100%;
  }
  .info-row {
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  .cancel-btn {
    align-self: flex-start;
  }
   .become-master-form {
    padding: 1rem;
  }
  .categories-choice {
    grid-template-columns: repeat(2, auto);
    gap: 16px;
    justify-content: center;
  }
  .category-option {
    padding: 6px 12px;
    font-size: 0.85rem;
  }
  .form-group input, .form-group textarea {
    width: 100%;
    font-size: 0.95rem;
    padding: 8px 12px;
  }
  .submit-btn {
    width: 100%;
    padding: 10px;
    font-size: 0.95rem;
  }
}

@media (max-width: 375px) {
  .tab-btn {
    font-size: 0.8rem;
    padding: 0.2rem 0.4rem;
  }
  .service, .master {
    font-size: 0.9rem;
  }
  .info-row {
    font-size: 0.75rem;
  }
  .service-form input,
  .service-form textarea {
    font-size: 0.8rem;
    padding: 6px 10px;
  }
  .service-form label {
    font-size: 0.85rem;
  }
  .price-type-btn, .duration-btn {
    font-size: 0.75rem;
    padding: 5px 10px;
  }
  .add-photo-btn {
    font-size: 0.75rem;
    padding: 4px 8px;
  }
  .save-service-btn {
    font-size: 0.85rem;
    padding: 8px 12px;
  }
  .price-fixed input, .price-range input {
    font-size: 0.8rem;
    padding: 6px 8px;
    width: 80px;
  }
   .become-master-form {
    padding: 0.5rem;
  }
  .categories-choice {
    grid-template-columns: repeat(2, 1fr); 
    gap: 10px;
  }
  .category-option {
    padding: 6px 8px;
    font-size: 0.75rem;
    justify-content: center;
  }
  .cat-icon {
    font-size: 1rem;
  }
  .cat-name {
    font-size: 0.7rem;
  }
  .form-group label {
    font-size: 0.85rem;
  }
  .form-group input, .form-group textarea {
    font-size: 0.85rem;
    padding: 6px 10px;
  }
  .submit-btn {
    padding: 8px;
    font-size: 0.85rem;
  }
}
  </style>