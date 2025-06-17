<template>
  <div>
    <h1>Quote List</h1>

    <!-- Counts -->
    <div class="status-counts">
      <span class="count-chip total">Total: {{ totalCount }}</span>
      <span class="count-chip upcoming">Upcoming: {{ upcomingCount }}</span>
      <span class="count-chip completed">Completed: {{ completedCount }}</span>
    </div>

    <!-- Controls -->
    <div class="controls">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search by name..."
        class="search-input"
      >

      <select v-model="selectedEventType" class="select-filter">
        <option value="">All Event Types</option>
        <option v-for="type in eventTypes" :key="type" :value="type">
          {{ type }}
        </option>
      </select>

      <select v-model="selectedStatus" class="select-filter">
        <option value="">All Status</option>
        <option value="upcoming">Upcoming</option>
        <option value="completed">Completed</option>
      </select>

      <select v-model="sortOption" class="select-filter">
        <option value="">Sort By</option>
        <option value="date">Event Date</option>
        <option value="budget">Budget (High to Low)</option>
      </select>

      <button class="reset-button" @click="resetFilters">Reset Filters</button>
    </div>

    <!-- Table View -->
    <table class="quote-table">
      <thead>
        <tr>
          <th>Name</th>
          <!-- <th>Email</th> -->
          <th>Phone No</th>
          <th>Event Type</th>
          <th>Date</th>
          <th>Status</th>
          <th>Venue</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(quote, index) in paginatedQuotes" :key="index">
          <td>{{ quote.name }}</td>
          <!-- <td>{{ quote.email }}</td> -->
          <td>{{ quote.phone }}</td>
          <td>{{ quote.eventType }}</td>
          <td>{{ quote.date }} at {{ quote.time }}</td>
          <td>
            <button
              v-if="quote.status === 'upcoming'"
              class="complete-button"
              @click="markAsCompleted(quote)"
            >
              Upcoming
            </button>
            <span v-else class="status-text">Completed</span>
          </td>
          <td>{{ quote.venue }}</td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination -->
    <div class="pagination">
      <button :disabled="page === 1" @click="page--">Prev</button>
      <span>Page {{ page }} of {{ totalPages }}</span>
      <button :disabled="page === totalPages" @click="page++">Next</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'

// Default data
const defaultQuotes = [
  {
    name: 'Kavya Anjana',
    email: 'kavya@gmail.com',
    phone: '9876543210',
    company: 'Events',
    eventType: 'Wedding',
    guests: 200,
    date: '2025-12-15',
    time: '6:00 PM',
    venue: 'Novotel Hyderabad Convention Center',
    service: 'Buffet Service',
    dietary: 'Veg & Non-Veg',
    budget: 1200000,
    status: 'upcoming'
  },
  {
    name: 'Rahul Sharma',
    email: 'rahul@gmail.com',
    phone: '9876543211',
    company: 'Eventastic',
    eventType: 'Corporate',
    guests: 150,
    date: '2025-11-20',
    time: '5:00 PM',
    venue: 'HICC Novotel',
    service: 'Buffet Service',
    dietary: 'Veg & Non-Veg',
    budget: 420000,
    status: 'completed'
  },
  {
    name: 'Sneha Reddy',
    email: 'sneha@gmail.com',
    phone: '9876543222',
    company: 'Dream Weddings',
    eventType: 'Birthday',
    guests: 100,
    date: '2025-10-10',
    time: '4:00 PM',
    venue: 'Taj Krishna',
    service: 'Plated Service',
    dietary: 'Non-Vegetarian',
    budget: 250000,
    status: 'upcoming'
  },
  {
    name: 'Vikram Desai',
    email: 'vikram@gmail.com',
    phone: '9876543233',
    company: 'Event Kings',
    eventType: 'Engagement',
    guests: 250,
    date: '2025-09-01',
    time: '7:00 PM',
    venue: 'The Park Hyderabad',
    service: 'Buffet Service',
    dietary: 'Veg & Non-Veg',
    budget: 1000000,
    status: 'completed'
  },
  {
    name: 'Pooja Iyer',
    email: 'pooja@gmail.com',
    phone: '9876543244',
    company: 'Royal Events',
    eventType: 'Wedding',
    guests: 180,
    date: '2025-12-01',
    time: '5:30 PM',
    venue: 'Golkonda Resorts',
    service: 'Plated Service',
    dietary: 'Veg',
    budget: 600000,
    status: 'upcoming'
  },
  {
    name: 'Manish Rao',
    email: 'manish@gmail.com',
    phone: '9876543255',
    company: 'Celebrations Inc.',
    eventType: 'Corporate',
    guests: 300,
    date: '2025-11-10',
    time: '6:00 PM',
    venue: 'Trident Hyderabad',
    service: 'Plated Service',
    dietary: 'Veg & Non-Veg',
    budget: 1200000,
    status: 'upcoming'
  }
]

// Reactive quotes array (loaded from localStorage or default)
const quotes = ref([])

onMounted(() => {
  const stored = localStorage.getItem('quotesData')
  quotes.value = stored ? JSON.parse(stored) : defaultQuotes
})

// Persist to localStorage
watch(
  quotes,
  (newQuotes) => {
    localStorage.setItem('quotesData', JSON.stringify(newQuotes))
  },
  { deep: true }
)

// Filters and pagination
const searchQuery = ref('')
const selectedEventType = ref('')
const selectedStatus = ref('')
const sortOption = ref('')
const page = ref(1)
const perPage = 4

const resetFilters = () => {
  searchQuery.value = ''
  selectedEventType.value = ''
  selectedStatus.value = ''
  sortOption.value = ''
  page.value = 1
}

const eventTypes = computed(() =>
  [...new Set(quotes.value.map(q => q.eventType))]
)

const filteredQuotes = computed(() => {
  let result = quotes.value

  if (searchQuery.value) {
    result = result.filter(q =>
      q.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  if (selectedEventType.value) {
    result = result.filter(q => q.eventType === selectedEventType.value)
  }

  if (selectedStatus.value) {
    result = result.filter(q => q.status === selectedStatus.value)
  }

  if (sortOption.value === 'date') {
    result = result.slice().sort((a, b) => new Date(a.date) - new Date(b.date))
  } else if (sortOption.value === 'budget') {
    result = result.slice().sort((a, b) => b.budget - a.budget)
  }

  return result
})

const paginatedQuotes = computed(() => {
  const start = (page.value - 1) * perPage
  return filteredQuotes.value.slice(start, start + perPage)
})

const totalPages = computed(() =>
  Math.ceil(filteredQuotes.value.length / perPage)
)

const upcomingCount = computed(() =>
  filteredQuotes.value.filter(q => q.status === 'upcoming').length
)

const completedCount = computed(() =>
  filteredQuotes.value.filter(q => q.status === 'completed').length
)

const totalCount = computed(() => filteredQuotes.value.length)

function markAsCompleted(quote) {
  quote.status = 'completed'
}
</script>

<style scoped>
h1 {
  font-size: 28px;
  margin-bottom: 24px;
  color: #1e293b;
  font-weight: 700;
  /* text-align: center; */
}

.status-counts {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
  /* justify-content: center; */
  flex-wrap: wrap;
}

.count-chip {
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  color: white;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
}

.count-chip.total {
  background-color: #216bf3;
  font-size: 14px;
  font-weight: 600;
}

.count-chip.upcoming {
  background-color: #f75696;
  font-size: 14px;
  font-weight: 600;
}

.count-chip.completed {
  background-color: #10b981;
  font-size: 14px;
  font-weight: 600;
}

.controls {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 24px;
  /* justify-content: center; */
}

.search-input,
.select-filter {
  padding: 10px 14px;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  font-size: 14px;
  flex-grow: 1;
  background-color: #f9fafb;
  transition: border-color 0.3s ease;
  min-width: 200px;
}

.search-input:focus,
.select-filter:focus {
  border-color: #3b82f6;
  outline: none;
}

.reset-button {
  padding: 10px 16px;
  border: none;
  background-color: #ef4444;
  color: white;
  border-radius: 10px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease;
}

.reset-button:hover {
  background-color: #dc2626;
}

.quote-table {
  width: 100%;
  border-collapse: collapse;
  margin: 24px 0;
  background-color: white;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.13);
  border-radius: 10px;
  overflow: hidden;
}

.quote-table th,
.quote-table td {
  padding: 14px 16px;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
  font-size: 14px;
  color: #334155;
}

.quote-table th {
  background-color: #f1f5f9;
  font-weight: 600;
  color: #1e293b;
  text-transform: uppercase;
  font-size: 13px;
}

.quote-table tbody tr:hover {
  background-color: #f9fafb;
}

.complete-button {
  padding: 6px 12px;
  background-color: #f75696;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
}
.complete-button:hover {
  background-color: #059669;
}

.status-text {
    padding: 6px 12px;
  background-color:  #10b981;
 color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
  gap: 12px;
}

.pagination button {
  background: #0f66f1;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease;
}

.pagination button:hover {
  background: #0f66f1;
}

.pagination button:disabled {
  background: #d1d5db;
  cursor: not-allowed;
}

.pagination span {
  font-size: 14px;
  color: #334155;
}

</style>
