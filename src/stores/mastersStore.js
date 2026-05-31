import { defineStore } from 'pinia'

export const useMastersStore = defineStore('masters', {
  state: () => ({
    allMasters: [],
    loading: false,
    error: null
  }),
  getters: {
    getAllMasters: (state) => state.allMasters,
    getMastersByCategory: (state) => (category) => {
      if (!category) return []
      const lowerCategory = category.toLowerCase()
      return state.allMasters.filter(m => {
        const cat = m.category || ''
        return cat.toLowerCase().split(',').some(c => c.trim() === lowerCategory)
      })
    },
    getMasterById: (state) => (id) => {
      return state.allMasters.find(m => String(m.id) === String(id))
    }
  },
  actions: {
    async fetchMasters() {
      this.loading = true
      this.error = null
      try {
        const response = await fetch('/masters.json')
        if (!response.ok) throw new Error('Ошибка загрузки мастеров')
        const systemMasters = await response.json()
        const userMasters = JSON.parse(localStorage.getItem('userMasters')) || []
        this.allMasters = [...systemMasters, ...userMasters]
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    formatPriceFromService(service) {
      if (!service) return 'Цена не указана'
      if (service.priceType === 'fixed') {
        return `от ${service.fixedPrice} ₽`
      } else if (service.priceType === 'range') {
        return `от ${service.priceFrom} до ${service.priceTo} ₽`
      }
      return 'Цена не указана'
    },

    addUserMaster(masterData) {
      const firstService = masterData.services?.[0]
      const displayPrice = this.formatPriceFromService(firstService)
      const displayService = firstService?.title || 'Услуга'
      const workImage = masterData.services?.[0]?.photos?.[0] || '/default-work.jpg'

      const newMaster = {
        id: masterData.id,
        name: masterData.name,
        avatar: masterData.avatar || '/default-avatar.jpg',
        category: masterData.categories.join(', '),
        bio: masterData.description,
        address: masterData.address,
        services: masterData.services || [],
        reviews: [],
        type: 'user',
        service: displayService,
        price: displayPrice,
        rating: 0,
        reviewsCount: 0,
        workImage: workImage
      }
      this.allMasters.push(newMaster)
      const userMasters = JSON.parse(localStorage.getItem('userMasters')) || []
      userMasters.push(newMaster)
      localStorage.setItem('userMasters', JSON.stringify(userMasters))
    },

    updateUserServices(userId, services) {
        const index = this.allMasters.findIndex(m => String(m.id) === String(userId) && m.type === 'user')
        if (index !== -1) {
          const firstService = services?.[0]
          const displayPrice = this.formatPriceFromService(firstService)
          const displayService = firstService?.title || 'Услуга'
          const workImage = firstService?.photos?.[0] || '/default-work.jpg'
          
          this.allMasters[index].services = services
          this.allMasters[index].service = displayService
          this.allMasters[index].price = displayPrice
          this.allMasters[index].workImage = workImage
      
          const userMasters = JSON.parse(localStorage.getItem('userMasters')) || []
          const userIndex = userMasters.findIndex(m => String(m.id) === String(userId))
          if (userIndex !== -1) {
            userMasters[userIndex].services = services
            userMasters[userIndex].service = displayService
            userMasters[userIndex].price = displayPrice
            userMasters[userIndex].workImage = workImage
            localStorage.setItem('userMasters', JSON.stringify(userMasters))
          }
        }
      },

    updateUserAvatar(userId, avatarUrl) {
      const master = this.allMasters.find(m => String(m.id) === String(userId) && m.type === 'user')
      if (master) {
        master.avatar = avatarUrl
        const userMasters = JSON.parse(localStorage.getItem('userMasters')) || []
        const idx = userMasters.findIndex(m => String(m.id) === String(userId))
        if (idx !== -1) userMasters[idx].avatar = avatarUrl
        localStorage.setItem('userMasters', JSON.stringify(userMasters))
      }
    }
  }
})