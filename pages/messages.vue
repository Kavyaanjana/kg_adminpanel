<template>
  <div class="message-page">
    <!-- Top Section -->
    <div class="top-section">
      <h3>Messages</h3>
    </div>

    <div class="cards">
      <div class="card">
        <div class="card-icon-bg">
          <Icon name="mingcute:mail-line" class="card-icon" />
        </div>
        <div class="card-info">
          <h2>Today Messages</h2>
          <p class="value">15</p>
        </div>
      </div>
      <div class="card">
        <div class="card-icon-bg">
          <Icon name="mingcute:time-line" class="card-icon" />
        </div>
        <div class="card-info">
          <h2>Previous Messages</h2>
          <p class="value">102</p>
        </div>
      </div>
      <div class="card">
        <div class="card-icon-bg">
          <Icon name="mingcute:inbox-line" class="card-icon" />
        </div>
        <div class="card-info">
          <h2>Total Messages</h2>
          <p class="value">{{ messages.length }}</p>
        </div>
      </div>
    </div>

    <!-- Table Controls -->
    <div class="table-wrapper">
      <div class="table-header">
        <div class="search-group">
          <Icon name="bitcoin-icons:search-filled" class="search-icon" />
          <input v-model="searchQuery" type="text" placeholder="Search..." class="search-input" />
        </div>
        <div class="filter-actions">
          <select class="filter-dropdown">
            <option>Today</option>
            <option>Yesterday</option>
            <option>This Week</option>
          </select>
          <button class="delete-selected" :disabled="!selected.length" @click="deleteSelected">
            <Icon name="trash" /> Delete Selected
          </button>
        </div>
      </div>

      <!-- Table -->
      <table>
        <thead>
          <tr>
            <th><input v-model="selectAll" type="checkbox" @change="toggleAll" /></th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(msg, index) in paginatedMessages" :key="msg._id">
            <td><input v-model="selected" type="checkbox" :value="msg" /></td>
            <td>{{ msg.name }}</td>
            <td>{{ msg.email }}</td>
            <td>{{ msg.phone_number }}</td>
            <td class="action-buttons">
              <button class="view-btn" @click="openModal(msg)">
                <Icon name="eye" /> View
              </button>
              <button class="delete-btn" @click="deleteSingle(index)">
                <Icon name="trash" /> Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div class="pagination">
        <button :disabled="currentPage === 1" @click="prevPage">Previous</button>
        <span>Page {{ currentPage }} of {{ totalPages }}</span>
        <button :disabled="currentPage === totalPages" @click="nextPage">Next</button>
      </div>
    </div>

    <!-- View Modal -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <h3>User Details</h3>
        <p><strong>Name:</strong> {{ selectedUser.name }}</p>
        <p><strong>Email:</strong> {{ selectedUser.email }}</p>
        <p><strong>Phone:</strong> {{ selectedUser.phone_number }}</p>
        <button class="close-btn" @click="closeModal">Close</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = 10
const selected = ref([])
const selectAll = ref(false)
const showModal = ref(false)
const selectedUser = ref({})

const messages = ref([
  { name: 'Rahul Sharma', email: 'rahul.sharma@gmail.com', phone_number: '9876543210' },
  { name: 'Priya Verma', email: 'priya.verma@yahoo.com', phone_number: '9123456789' },
  { name: 'Amit Kumar', email: 'amit.kumar@rediffmail.com', phone_number: '9988776655' },
  { name: 'Sneha Patil', email: 'sneha.patil@hotmail.com', phone_number: '9090909090' },
  { name: 'Arjun Reddy', email: 'arjun.reddy@gmail.com', phone_number: '9765432109' },
  { name: 'Deepika Joshi', email: 'deepika.joshi@yahoo.in', phone_number: '9871234560' },
  { name: 'Karan Malhotra', email: 'karan.malhotra@outlook.com', phone_number: '9911002200' },
  { name: 'Meena Iyer', email: 'meena.iyer@gmail.com', phone_number: '9822001100' },
  { name: 'Ravi Deshmukh', email: 'ravi.deshmukh@gmail.com', phone_number: '9845007788' },
  { name: 'Anjali Nair', email: 'anjali.nair@yahoo.com', phone_number: '9998887776' },
  { name: 'Siddharth Jain', email: 'sid.jain@live.in', phone_number: '9870011223' },
])


const filteredMessages = computed(() =>
  messages.value.filter((msg) =>
    Object.values(msg).some((val) =>
      val.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  )
)

const totalPages = computed(() =>
  Math.ceil(filteredMessages.value.length / itemsPerPage)
)

const paginatedMessages = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredMessages.value.slice(start, end)
})

function prevPage() {
  if (currentPage.value > 1) currentPage.value--
}
function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++
}
function toggleAll() {
  if (selectAll.value) {
    selected.value = [...paginatedMessages.value]
  } else {
    selected.value = []
  }
}

watch(paginatedMessages, () => {
  selectAll.value = paginatedMessages.value.every(item => selected.value.includes(item))
})
watch(selected, () => {
  selectAll.value = paginatedMessages.value.every(item => selected.value.includes(item))
})

function openModal(user) {
  selectedUser.value = user
  showModal.value = true
}
function closeModal() {
  showModal.value = false
}
function deleteSingle(index) {
  const itemToDelete = paginatedMessages.value[index]
  messages.value = messages.value.filter((msg) => msg !== itemToDelete)
}
function deleteSelected() {
  const toDelete = selected.value
  messages.value = messages.value.filter((msg) => !toDelete.includes(msg))
  selected.value = []
}
</script>

<style>
.message-page {
  font-family: Arial, sans-serif;
}

.top-section {
  background-color: #6c63ff;
  padding: 1rem; /* reduced height */
  color: white;
  height: 80px;
}

.cards {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  margin-top: 0.5rem;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  margin-top: -60px; /* pulls cards upward */
  position: relative;
  z-index: 10; 
}

.card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: white;
  color: #333;
  padding: 0.75rem;
  border-radius: 10px;
  width: 100%;
  max-width: 220px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  min-height: 60px; /* reduced card height */
}

.card-icon-bg {
  background-color: #eef2ff;
  padding: 10px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-icon {
  font-size: 28px;
  color: #6c63ff;
}

.card-info h2 {
  font-size: 14px;
  margin: 0;
}

.card-info .value {
  font-size: 20px;
  font-weight: bold;
}
.table-wrapper {
  padding: 1.5rem;
  margin-top: 15px;
  background-color: white;
  border-radius: 10px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);

}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.search-group {
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 6px;
  overflow: hidden;
  background: white;
  width: 240px;
}

.search-icon {
  padding: 8px;
  color: #9c9c9c;
  height:12px;
}

.search-input {
  border: none;
  padding: 8px 12px;
  width: 100%;
  outline: none;
}

.filter-dropdown {
  padding: 6px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
}

table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

thead {
  background-color: #f3f4f6;
}

th, td {
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  text-align: left;
  font-size: 14px;
}

.action-buttons {
  display: flex;
  gap: 6px;
}

.view-btn, .delete-btn {
  padding: 4px 10px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
}

.view-btn {
  background-color: #3b82f6;
  color: white;
}

.delete-btn {
  background-color: #ef4444;
  color: white;
}

.pagination {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.pagination button {
  padding: 6px 12px;
  background-color: #e5e7eb;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.pagination span {
  font-weight: bold;
}

.filter-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

.delete-selected {
  background-color: #ef4444;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}
.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  width: 300px;
  box-shadow: 0 0 12px rgba(0,0,0,0.3);
}
.modal-content h3 {
  margin-bottom: 1rem;
}
.close-btn {
  margin-top: 1rem;
  background: #3b82f6;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
}

@media (max-width: 768px) {
  .cards {
    flex-direction: column;
    align-items: center;
  }

  .table-header {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }

  .search-group {
    width: 100%;
  }
}
</style>
