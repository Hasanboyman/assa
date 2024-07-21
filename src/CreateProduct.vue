<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import apiService from '@/servise';

const productData = ref({
  name: '',
  description: '',
  category: ''
});
const photo = ref(null);
const isLoading = ref(false);
const categories = ref([]);

const router = useRouter();

const handleFileChange = (event) => {
  photo.value = event.target.files[0];
};

const fetchCategories = async () => {
  try {
    const response = await apiService.getAllCategories();
    categories.value = response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
};

const createProduct = async () => {
  try {
    if (productData.value.name && productData.value.description && productData.value.category && photo.value) {
      const formData = new FormData();
      formData.append('name', productData.value.name);
      formData.append('description', productData.value.description);
      formData.append('category', productData.value.category);
      formData.append('photo', photo.value);

      isLoading.value = true;

      await apiService.createProduct(formData);
      await router.push('/products');
    } else {
      alert('Please fill in all fields and upload a photo.');
    }
  } catch (error) {
    console.error('Error creating product:', error);
    if (error.response) {
      alert('Failed to create product: ' + JSON.stringify(error.response.data));
    } else {
      alert('Failed to create product. Please try again later.');
    }
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchCategories);
</script>

<template>
  <div class="min-h-screen bg-gray-100 flex flex-col items-center">
    <div class="bg-white py-6 shadow-md w-full text-center mb-8">
      <span class="font-bold text-3xl animate-fade-in">Create Product</span>
    </div>
    <section id="create-product" class="flex justify-center w-full px-4 sm:px-0">
      <form @submit.prevent="createProduct" method="post"
            class="bg-white shadow-xl rounded-xl overflow-hidden items-center w-full max-w-md p-8 animate-slide-in-up">
        <label for="name" class="block text-lg font-semibold mb-2">Name</label>
        <input
            type="text"
            id="name"
            v-model="productData.name"
            class="border w-full text-lg px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 transition duration-150 transform hover:scale-105"
            placeholder="Product Name"
        />

        <label for="description" class="block text-lg font-semibold mb-2 mt-4">Description</label>
        <textarea
            id="description"
            v-model="productData.description"
            class="border w-full text-lg px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 transition duration-150 transform hover:scale-105"
            placeholder="Product Description"
        ></textarea>

        <label for="category" class="block text-lg font-semibold mb-2 mt-4">Category</label>
        <select
            id="category"
            v-model="productData.category"
            class="border w-full text-lg px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 transition duration-150 transform hover:scale-105"
        >
          <option value="" disabled>Select a category</option>
          <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}</option>
        </select>

        <label for="photo" class="block text-lg font-semibold mb-2 mt-4">Photo</label>
        <input
            type="file"
            id="photo"
            @change="handleFileChange"
            class="border w-full text-lg px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 transition duration-150 transform hover:scale-105"
        />

        <div class="mt-8 flex justify-end items-center">
          <button
              type="submit"
              :disabled="isLoading"
              class="bg-indigo-600 text-white font-bold px-6 py-2 rounded-full shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition duration-150 ease-in-out transform hover:scale-105"
          >
            Create
          </button>
        </div>
      </form>
    </section>
  </div>
</template>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slide-in-up {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.animate-fade-in {
  animation: fade-in 1s ease-out forwards;
}

.animate-slide-in-up {
  animation: slide-in-up 0.6s ease-out forwards;
}

input[type="text"],
textarea,
select,
input[type="file"] {
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
}

input[type="text"]:hover,
textarea:hover,
select:hover,
input[type="file"]:hover {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
</style>
