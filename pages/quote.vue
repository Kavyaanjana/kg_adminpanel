<template>
  <div>
    <div
      style="display: flex; justify-content: space-between; align-items: center"
    >
      <h1>Quote List</h1>
      <span
        class="text-gray-600 hover:text-black cursor-pointer"
        @click="resetToDefaultQuotes"
      >
        <Icon name="ic:baseline-refresh" size="24" />
      </span>
    </div>

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
      />

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
import { ref, computed, watch, onMounted } from "vue";

const defaultQuotes = [
  {
    name: "Kavya Anjana",
    email: "kavya@gmail.com",
    phone: "9876543210",
    company: "Events",
    eventType: "Wedding",
    guests: 200,
    date: "2025-12-15",
    time: "6:00 PM",
    venue: "Novotel Hyderabad Convention Center",
    service: "Buffet Service",
    dietary: "Veg & Non-Veg",
    budget: 1200000,
    status: "upcoming",
  },
  {
    name: "Rahul Sharma",
    email: "rahul@gmail.com",
    phone: "9876543211",
    company: "Eventastic",
    eventType: "Corporate",
    guests: 150,
    date: "2025-11-20",
    time: "5:00 PM",
    venue: "HICC Novotel",
    service: "Buffet Service",
    dietary: "Veg & Non-Veg",
    budget: 420000,
    status: "completed",
  },
  {
    name: "Sneha Reddy",
    email: "sneha@gmail.com",
    phone: "9876543222",
    company: "Dream Weddings",
    eventType: "Birthday",
    guests: 100,
    date: "2025-10-10",
    time: "4:00 PM",
    venue: "Taj Krishna",
    service: "Plated Service",
    dietary: "Non-Vegetarian",
    budget: 250000,
    status: "upcoming",
  },
  {
    name: "Vikram Desai",
    email: "vikram@gmail.com",
    phone: "9876543233",
    company: "Event Kings",
    eventType: "Engagement",
    guests: 250,
    date: "2025-09-01",
    time: "7:00 PM",
    venue: "The Park Hyderabad",
    service: "Buffet Service",
    dietary: "Veg & Non-Veg",
    budget: 1000000,
    status: "completed",
  },
  {
    name: "Pooja Iyer",
    email: "pooja@gmail.com",
    phone: "9876543244",
    company: "Royal Events",
    eventType: "Wedding",
    guests: 180,
    date: "2025-12-01",
    time: "5:30 PM",
    venue: "Golkonda Resorts",
    service: "Plated Service",
    dietary: "Veg",
    budget: 600000,
    status: "upcoming",
  },
  {
    name: "Manish Rao",
    email: "manish@gmail.com",
    phone: "9876543255",
    company: "Celebrations Inc.",
    eventType: "Corporate",
    guests: 300,
    date: "2025-11-10",
    time: "6:00 PM",
    venue: "Trident Hyderabad",
    service: "Plated Service",
    dietary: "Veg & Non-Veg",
    budget: 1200000,
    status: "upcoming",
  },
  {
    name: "Nisha Verma",
    email: "nisha@gmail.com",
    phone: "9876543266",
    company: "Elite Planners",
    eventType: "Corporate",
    guests: 90,
    date: "2025-08-18",
    time: "7:00 PM",
    venue: "ITC Kakatiya",
    service: "Buffet Service",
    dietary: "Vegetarian",
    budget: 350000,
    status: "completed",
  },
  {
    name: "Amit Kapoor",
    email: "amitk@gmail.com",
    phone: "9876543277",
    company: "Galaxy Events",
    eventType: "Birthday",
    guests: 80,
    date: "2025-09-05",
    time: "11:00 AM",
    venue: "Hotel Daspalla",
    service: "Plated Service",
    dietary: "Veg",
    budget: 200000,
    status: "upcoming",
  },
  {
    name: "Shruti Rao",
    email: "shruti@gmail.com",
    phone: "9876543288",
    company: "Shubh Events",
    eventType: "Wedding",
    guests: 60,
    date: "2025-10-01",
    time: "1:00 PM",
    venue: "Private Residence",
    service: "Buffet Service",
    dietary: "Veg",
    budget: 150000,
    status: "completed",
  },
  {
    name: "Ravi Teja",
    email: "raviteja@gmail.com",
    phone: "9876543299",
    company: "Premium Planners",
    eventType: "Reception",
    guests: 220,
    date: "2025-11-25",
    time: "7:30 PM",
    venue: "Hyderabad Marriott Hotel",
    service: "Plated Service",
    dietary: "Veg & Non-Veg",
    budget: 850000,
    status: "upcoming",
  },
  {
    name: "Anjali Mehta",
    email: "anjali@gmail.com",
    phone: "9876543300",
    company: "Wedded Bliss",
    eventType: "Wedding",
    guests: 300,
    date: "2025-12-18",
    time: "6:30 PM",
    venue: "Ramoji Film City",
    service: "Buffet Service",
    dietary: "Veg & Non-Veg",
    budget: 1800000,
    status: "upcoming",
  },
  {
    name: "Arun Patel",
    email: "arun.patel@gmail.com",
    phone: "9876543301",
    company: "Biz Summit Co.",
    eventType: "Corporate",
    guests: 400,
    date: "2025-10-22",
    time: "10:00 AM",
    venue: "Hyderabad International Convention Centre",
    service: "Plated Service",
    dietary: "Veg",
    budget: 1500000,
    status: "upcoming",
  },
  {
    name: "Neha Gupta",
    email: "neha.gupta@gmail.com",
    phone: "9876543302",
    company: "Birthday Bash",
    eventType: "Birthday",
    guests: 50,
    date: "2025-08-12",
    time: "4:00 PM",
    venue: "Jubilee Hills Club",
    service: "Buffet Service",
    dietary: "Veg & Non-Veg",
    budget: 100000,
    status: "completed",
  },
  {
    name: "Karan Malhotra",
    email: "karan.m@gmail.com",
    phone: "9876543303",
    company: "Elite Weddings",
    eventType: "Wedding",
    guests: 500,
    date: "2025-12-05",
    time: "7:00 PM",
    venue: "Taj Falaknuma Palace",
    service: "Plated Service",
    dietary: "Veg & Non-Veg",
    budget: 2500000,
    status: "upcoming",
  },
  {
    name: "Divya Singh",
    email: "divya.singh@gmail.com",
    phone: "9876543304",
    company: "Startup Meet",
    eventType: "Corporate",
    guests: 100,
    date: "2025-09-09",
    time: "2:00 PM",
    venue: "WeWork Banjara Hills",
    service: "Buffet Service",
    dietary: "Veg",
    budget: 300000,
    status: "completed",
  },
  {
    name: "Siddharth Rao",
    email: "siddharth@gmail.com",
    phone: "9876543305",
    company: "Birthday World",
    eventType: "Birthday",
    guests: 70,
    date: "2025-08-25",
    time: "6:00 PM",
    venue: "KidZania Hyderabad",
    service: "Buffet Service",
    dietary: "Veg",
    budget: 120000,
    status: "upcoming",
  },
  {
    name: "Meera Joshi",
    email: "meera.j@gmail.com",
    phone: "9876543306",
    company: "Shaadi Co.",
    eventType: "Wedding",
    guests: 220,
    date: "2025-11-11",
    time: "5:00 PM",
    venue: "Hyderabad Gymkhana Club",
    service: "Plated Service",
    dietary: "Veg & Non-Veg",
    budget: 950000,
    status: "completed",
  },
  {
    name: "Rakesh Jain",
    email: "rakesh.jain@gmail.com",
    phone: "9876543307",
    company: "Tech Corp India",
    eventType: "Corporate",
    guests: 250,
    date: "2025-10-05",
    time: "11:00 AM",
    venue: "Hotel Avasa",
    service: "Buffet Service",
    dietary: "Veg & Non-Veg",
    budget: 850000,
    status: "upcoming",
  },
  {
    name: "Aarav Nair",
    email: "aarav.n@gmail.com",
    phone: "9876543308",
    company: "Birthday Vibes",
    eventType: "Birthday",
    guests: 40,
    date: "2025-08-05",
    time: "5:30 PM",
    venue: "Salarpuria Sattva Clubhouse",
    service: "Buffet Service",
    dietary: "Veg",
    budget: 80000,
    status: "completed",
  },
  {
    name: "Ishita Kapoor",
    email: "ishita.kapoor@gmail.com",
    phone: "9876543309",
    company: "Regal Weddings",
    eventType: "Wedding",
    guests: 350,
    date: "2025-12-28",
    time: "6:00 PM",
    venue: "Leonia Resorts",
    service: "Plated Service",
    dietary: "Veg & Non-Veg",
    budget: 1400000,
    status: "upcoming",
  },
];

// Main reactive quotes array
const quotes = ref([]);

// Load from localStorage if available, else from defaultQuotes
onMounted(() => {
  const stored = localStorage.getItem("quotesData");
  if (stored) {
    quotes.value = JSON.parse(stored);
  } else {
    quotes.value = [...defaultQuotes];
    localStorage.setItem("quotesData", JSON.stringify(defaultQuotes));
  }
});

// Save changes to localStorage
watch(
  quotes,
  (newQuotes) => {
    localStorage.setItem("quotesData", JSON.stringify(newQuotes));
  },
  { deep: true }
);

// Optional Reset Button (for dev/admin use)
function resetToDefaultQuotes() {
  quotes.value = [...defaultQuotes];
  localStorage.setItem("quotesData", JSON.stringify(defaultQuotes));
  page.value = 1;
}

// Filtering and Pagination
const searchQuery = ref("");
const selectedEventType = ref("");
const selectedStatus = ref("");
const sortOption = ref("");
const page = ref(1);
const perPage = 10;

const resetFilters = () => {
  searchQuery.value = "";
  selectedEventType.value = "";
  selectedStatus.value = "";
  sortOption.value = "";
  page.value = 1;
};

const eventTypes = computed(() => [
  ...new Set(quotes.value.map((q) => q.eventType)),
]);

const filteredQuotes = computed(() => {
  let result = quotes.value;

  if (searchQuery.value) {
    result = result.filter((q) =>
      q.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }

  if (selectedEventType.value) {
    result = result.filter((q) => q.eventType === selectedEventType.value);
  }

  if (selectedStatus.value) {
    result = result.filter((q) => q.status === selectedStatus.value);
  }

  if (sortOption.value === "date") {
    result = result.slice().sort((a, b) => new Date(a.date) - new Date(b.date));
  } else if (sortOption.value === "budget") {
    result = result.slice().sort((a, b) => b.budget - a.budget);
  }

  return result;
});

const paginatedQuotes = computed(() => {
  const start = (page.value - 1) * perPage;
  return filteredQuotes.value.slice(start, start + perPage);
});

const totalPages = computed(() =>
  Math.ceil(filteredQuotes.value.length / perPage)
);

const upcomingCount = computed(
  () => filteredQuotes.value.filter((q) => q.status === "upcoming").length
);

const completedCount = computed(
  () => filteredQuotes.value.filter((q) => q.status === "completed").length
);

const totalCount = computed(() => filteredQuotes.value.length);

// Button to mark as completed
function markAsCompleted(quote) {
  quote.status = "completed";
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
  background-color: #e70c1e;
  color: white;
  border-radius: 10px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease;
}

.reset-button:hover {
  background-color: #d30a0a;
}

.quote-table {
  width: 100%;
  border-collapse: collapse;
  margin: 24px 0;
  background-color: white;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.13);
  border-radius: 10px;
  overflow: hidden;
  flex-grow:1;
}

.quote-table th,
.quote-table td {
  padding: 14px 16px;
  text-align: left;
  border: 1px solid #d7d7d8; /* adds borders to all sides */
  font-size: 14px;
  color: #334155;
}

.quote-table th {
  background-color: #e9ebec;
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
  background-color: #10b981;
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
