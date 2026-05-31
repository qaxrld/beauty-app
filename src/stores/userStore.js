import { defineStore } from 'pinia'
import { useMastersStore } from './mastersStore'

export const useUserStore = defineStore('user', {
  state: () => {
    const savedUser = JSON.parse(localStorage.getItem('user')) || null
    const token = localStorage.getItem('token') || null
    const userId = savedUser?.id || localStorage.getItem('userId')
    let appointments = { active: [], archived: [] }
    let isMaster = false
    let masterServices = []

    if (userId) {
      const userData = JSON.parse(localStorage.getItem(`user_${userId}`)) || {}
      appointments = userData.appointments || { active: [], archived: [] }
      isMaster = userData.isMaster || false
      masterServices = userData.masterServices || []
    }

    return {
      user: savedUser,
      token,
      appointments,
      isMaster,
      masterServices,
      users: JSON.parse(localStorage.getItem('app_users')) || [
        { id: 1, name: 'Анна', phone: '+79991234567', password: '1234', avatar: '' },
        { id: 2, name: 'Елена', phone: '+79997654321', password: 'abcd', avatar: '' }
      ]
    }
  },
  getters: {
    isAuthenticated: (state) => !!state.token,
    activeAppointments: (state) => state.appointments.active,
    archivedAppointments: (state) => state.appointments.archived,
    getUniqueMastersFromAppointments: (state) => {
        const allAppointments = [...state.appointments.active, ...state.appointments.archived]
        const mastersMap = new Map()
        allAppointments.forEach(app => {
          if (app.masterName && !mastersMap.has(app.masterName)) {
            mastersMap.set(app.masterName, {
              id: app.masterId || Date.now(),
              name: app.masterName,
              service: app.service,
              lastDate: app.date,
              avatar: app.masterAvatar ||  '/default-avatar.jpg'   
            })
          }
        })
        return Array.from(mastersMap.values())
      }
  },
  actions: {
    saveUserData() {
      if (this.user) {
        const userData = {
          appointments: this.appointments,
          isMaster: this.isMaster,
          masterServices: this.masterServices
        }
        localStorage.setItem(`user_${this.user.id}`, JSON.stringify(userData))
        localStorage.setItem('user', JSON.stringify(this.user))
      }
    },
    async login(phone, password) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const found = this.users.find(u => u.phone === phone && u.password === password)
          if (found) {
            this.user = { ...found }
            this.token = 'fake-jwt-token'
            localStorage.setItem('user', JSON.stringify(this.user))
            localStorage.setItem('token', this.token)
            localStorage.setItem('userId', found.id)
            const userData = JSON.parse(localStorage.getItem(`user_${found.id}`)) || {}
            this.appointments = userData.appointments || { active: [], archived: [] }
            this.isMaster = userData.isMaster || false
            this.masterServices = userData.masterServices || []
            resolve(true)
          } else {
            resolve(false)
          }
        }, 500)
      })
    },
    async register(name, phone, password) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const exists = this.users.some(u => u.phone === phone)
          if (exists) {
            resolve(false)
          } else {
            const newUser = {
              id: Date.now(),
              name,
              phone,
              password,
              avatar: ''
            }
            this.users.push(newUser)
            localStorage.setItem('app_users', JSON.stringify(this.users))
            this.user = { ...newUser }
            this.token = 'fake-jwt-token'
            localStorage.setItem('user', JSON.stringify(this.user))
            localStorage.setItem('token', this.token)
            localStorage.setItem('userId', newUser.id)
            this.appointments = { active: [], archived: [] }
            this.isMaster = false
            this.masterServices = []
            this.saveUserData()
            resolve(true)
          }
        }, 500)
      })
    },
    async becomeMaster(masterData) {
        return new Promise((resolve) => {
          setTimeout(() => {
            this.isMaster = true
            localStorage.setItem('isMaster', 'true')
            if (this.user) {
              this.user.isMaster = true
              localStorage.setItem('user', JSON.stringify(this.user))
            }
            this.saveUserData()
            const mastersStore = useMastersStore()
            mastersStore.addUserMaster({
              id: this.user.id,
              name: this.user.name,
              avatar: this.user.avatar,
              categories: masterData.categories,
              address: masterData.address,
              description: masterData.description,
              services: this.masterServices   // уже без photos
            })
            resolve(true)
          }, 500)
        })
      },
    updateAvatar(avatarUrl) {
      if (this.user) {
        this.user.avatar = avatarUrl
        localStorage.setItem('user', JSON.stringify(this.user))
        this.saveUserData()
        if (this.isMaster) {
          const mastersStore = useMastersStore()
          mastersStore.updateUserAvatar(this.user.id, avatarUrl)
        }
      }
    },
    addService(service) {
        this.masterServices.push(service)
        this.saveUserData()
        const mastersStore = useMastersStore()
        mastersStore.updateUserServices(this.user.id, this.masterServices)
      },
    removeService(index) {
        this.masterServices.splice(index, 1)
        this.saveUserData()
        const mastersStore = useMastersStore()
        mastersStore.updateUserServices(this.user.id, this.masterServices)
      },
      
    logout() {
      this.user = null
      this.token = null
      this.appointments = { active: [], archived: [] }
      this.isMaster = false
      this.masterServices = []
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('userId')
    },
    cancelAppointment(appointmentId) {
      const index = this.appointments.active.findIndex(a => a.id === appointmentId)
      if (index !== -1) {
        const canceled = this.appointments.active.splice(index, 1)[0]
        this.appointments.archived.push({ ...canceled, status: 'Отменено' })
        this.saveUserData()
      }
    },
    addAppointment(appointment) {
      const newApp = { ...appointment, id: Date.now() }
      this.appointments.active.push(newApp)
      this.saveUserData()
    }
  }
})