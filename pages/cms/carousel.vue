<template>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <h2>Carousel Items</h2>
      <button class="create-btn" @click="showModal = true">Create</button>
    </div>

    <!-- Search -->
    <input
      type="text"
      placeholder="Search carousel items..."
      class="search-box"
    />

    <!-- Pagination -->
    <div class="pagination">
      <button class="nav-btn">Previous</button>
      <span class="page-text">Page of 0</span>
      <button class="nav-btn">Next</button>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <button class="close-btn" @click="showModal = false">&times;</button>
        <h3>Create Carousel Item</h3>

        <form @submit.prevent="handleCreate">
          <label>Title</label>
          <input v-model="form.title" type="text" required />

          <label>Description (Optional)</label>
          <textarea v-model="form.description"></textarea>

          <label>Link (Optional)</label>
          <input v-model="form.link" type="text" />

          <label>View Order</label>
          <input v-model="form.viewOrder" type="number" />

          <label>Image</label>
          <input type="file" @change="handleFileUpload" />

          <button type="submit" class="submit-btn">Create</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const showModal = ref(false);

const form = ref({
  title: '',
  description: '',
  link: '',
  viewOrder: 0,
  image: null
});

function handleFileUpload(event) {
  form.value.image = event.target.files[0];
}

function handleCreate() {
  const formData = new FormData();
  formData.append('title', form.value.title);
  formData.append('description', form.value.description);
  formData.append('link', form.value.link);
  formData.append('view_order', form.value.viewOrder);
  if (form.value.image) {
    formData.append('image', form.value.image);
  }

  // API call would go here
  alert('Form submitted');
  showModal.value = false;
}
</script>

<style scoped>
/* Container */


/* Header */
.header {
  background-color: #1e2a38;
  color: white;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 5px 5px 0 0;
}

.header h2 {
  margin: 0;
  font-size: 24px;
}

.create-btn {
  background-color: #28a745;
  color: white;
  padding: 10px 16px;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
}

.create-btn:hover {
  background-color: #218838;
}

/* Search */
.search-box {
  margin: 20px 0;
  padding: 10px;
  width: 100%;
  max-width: 500px;
  border: 1px solid #ccc;
  border-radius: 6px;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 40px;
}

.nav-btn {
  padding: 10px 20px;
  background-color: #e2e6ea;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.page-text {
  font-weight: bold;
}

/* Modal Overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

/* Modal Content */
.modal-content {
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  position: relative;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.modal-content h3 {
  margin-top: 0;
  font-size: 22px;
  margin-bottom: 20px;
}

/* Form Styles */
.modal-content form {
  display: flex;
  flex-direction: column;
}

.modal-content form label {
  margin-top: 10px;
  margin-bottom: 4px;
  font-weight: 600;
}

.modal-content form input[type="text"],
.modal-content form input[type="number"],
.modal-content form textarea,
.modal-content form input[type="file"] {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 6px;
  resize: vertical;
}

.modal-content form textarea {
  height: 80px;
}

/* Submit Button */
.submit-btn {
  margin-top: 20px;
  padding: 10px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
}

.submit-btn:hover {
  background-color: #0069d9;
}

/* Close Button */
.close-btn {
  position: absolute;
  top: 12px;
  right: 16px;
  background: none;
  border: none;
  font-size: 26px;
  color: #333;
  cursor: pointer;
}
</style>
