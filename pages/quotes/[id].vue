<template>
  <div
    class="min-h-screen bg-gray-50 flex justify-center items-center px-4 py-10"
  >
    <div class="quote-card w-full max-w-3xl">
      <div class="quote-header">
        <h2>{{ quote.name }}</h2>
        <span class="badge">{{ quote.eventType }}</span>
      </div>

      <div class="quote-body">
        <p><strong>Email:</strong> {{ quote.email }}</p>
        <p><strong>Phone:</strong> {{ quote.phone }}</p>
        <p><strong>Company:</strong> {{ quote.company }}</p>
        <p><strong>Guests:</strong> {{ quote.guests }}</p>
        <p><strong>Event Date:</strong> {{ quote.date }} at {{ quote.time }}</p>
        <p><strong>Venue:</strong> {{ quote.venue }}</p>
        <p><strong>Service:</strong> {{ quote.service }}</p>
        <p><strong>Dietary:</strong> {{ quote.dietary }}</p>
        <p>
          <strong>Budget:</strong> ₹{{ Number(quote.budget).toLocaleString() }}
        </p>
        <p><strong>Special Requests:</strong> {{ quote.specialRequests }}</p>
        <p><strong>Heard From:</strong> {{ quote.heardFrom }}</p>

        <div class="status-section">
          <span
            v-if="quote.status === 'upcoming'"
            class="status-badge upcoming"
          >
            Upcoming
          </span>
          <span
            v-else-if="quote.status === 'completed'"
            class="status-badge completed"
          >
            Completed
          </span>
          <span
            v-else-if="quote.status === 'cancelled'"
            class="status-badge cancelled"
          >
            Cancelled
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { ref, onMounted } from "vue";

const route = useRoute();
const quote = ref({});

onMounted(() => {
  const storedQuotes = JSON.parse(localStorage.getItem("quotesData") || "[]");
  const index = parseInt(route.params.id);
  if (!isNaN(index) && storedQuotes[index]) {
    quote.value = storedQuotes[index];
  }
});
</script>

<style scoped>
.quote-card {
  background: #ffffff;
  border: 1px solid #a187fe;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.19);
  padding: 32px;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  margin-top: 30px;
}

.quote-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.quote-header h2 {
  font-size: 24px;
  color: #0f172a;
  font-weight: 700;
  margin: 0;
}

.badge {
  background: #f97316;
  color: white;
  font-size: 13px;
  padding: 6px 14px;
  border-radius: 20px;
  font-weight: 600;
  text-transform: uppercase;
}

.quote-body p {
  margin: 14px 0;
  font-size: 15px;
  color: #475569;
}

.status-section {
  margin-top: 24px;
}

.status-text {
  font-size: 16px;
  font-weight: 600;
}
.status-badge {
  padding: 6px 12px;
  border-radius: 8px;
  font-weight: bold;
  display: inline-block;
  color: #fff;
}

.status-badge.upcoming {
  background-color: #f75696;
  /* cursor: pointer; */
}
.status-badge.upcoming:hover {
  background-color: #d51763;
  /* cursor: pointer; */
}

.status-badge.completed {
  background-color: #10b981;
}
.status-badge.cancelled {
  background-color: rgb(236, 4, 4);
}

</style>
