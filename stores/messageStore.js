// stores/messages.js
import { defineStore } from 'pinia'
import axios from '@/utils/axios'

export const useMessageStore = defineStore('messageStore', {
  state: () => ({
    messages: [],
    selectedMessage: null,
    loading: false,
    error: null
  }),

  actions: {
    async fetchMessages() {
      this.loading = true
      this.error = null
      try {
        const res = await axios.get('/messages/')
        this.messages = res.data
      } catch (err) {
        this.error = err?.response?.data || err.message
      } finally {
        this.loading = false
      }
    },

    async fetchMessageById(id) {
      this.loading = true
      this.error = null
      try {
        const res = await axios.get(`/messages/${id}`)
        this.selectedMessage = res.data
      } catch (err) {
        this.error = err?.response?.data || err.message
      } finally {
        this.loading = false
      }
    },

    async createMessage(data) {
      this.loading = true
      this.error = null
      try {
        const res = await axios.post('/messages/', data)
        this.messages.push(res.data)
        return res.data
      } catch (err) {
        this.error = err?.response?.data || err.message
        throw err
      } finally {
        this.loading = false
      }
    },

    async updateMessage(id, data) {
      this.loading = true
      this.error = null
      try {
        const res = await axios.put(`/messages/${id}`, data)
        const index = this.messages.findIndex(msg => msg._id === id)
        if (index !== -1) this.messages[index] = res.data
        return res.data
      } catch (err) {
        this.error = err?.response?.data || err.message
        throw err
      } finally {
        this.loading = false
      }
    },

    async deleteMessage(id) {
      this.loading = true
      this.error = null
      try {
        await axios.delete(`/messages/${id}`)
        this.messages = this.messages.filter(msg => msg._id !== id)
      } catch (err) {
        this.error = err?.response?.data || err.message
        throw err
      } finally {
        this.loading = false
      }
    }
  }
})
