<script setup>
import {ref, onMounted} from 'vue';
import {useRouter} from 'vue-router';
import apiService from '@/servise';

const productData = ref({
  name: '',
  description: '',
  category: ''
});
const photo = ref(null);
const isLoading = ref(false);
const categoryData = ref({
  name: '',
  description: ''
});
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

const createCategory = async () => {
  try {
    if (categoryData.value.name && categoryData.value.description) {
      await apiService.createCategory(categoryData.value);
      await fetchCategories(); // Refresh the category list
      categoryData.value.name = '';
      categoryData.value.description = '';
    } else {
      alert('Please fill in all category fields.');
    }
  } catch (error) {
    console.error('Error creating category:', error);
    if (error.response) {
      alert('Failed to create category: ' + JSON.stringify(error.response.data));
    } else {
      alert('Failed to create category. Please try again later.');
    }
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
  <div>
    <div class="bg-white py-6 shadow-md">
      <span class="py-12 px-48 font-bold text-2xl">Create Product</span>
    </div>
    <section id="create-product" class="flex justify-center min-h-52 py-36">
      <form @submit.prevent="createProduct" method="post"
            class="bg-white shadow-md border-black rounded-lg overflow-hidden items-center w-1/4 p-8">
        <label for="name" class="block text-base mb-2">Name</label>
        <input
            type="text"
            id="name"
            v-model="productData.name"
            class="border w-full text-base px-3 py-2 rounded shadow focus:outline-none focus:ring-0 focus:border-blue-300"
            placeholder="Name"
        />

        <label for="description" class="block text-base mb-2 mt-8">Description</label>
        <textarea
            id="description"
            v-model="productData.description"
            class="border w-full text-base px-3 py-2 rounded shadow focus:outline-none focus:ring-0 focus:border-blue-300"
            placeholder="Description"
        ></textarea>

        <label for="category" class="block text-base mb-2 mt-8">Category</label>
        <select
            id="category"
            v-model="productData.category"
            class="border w-full text-base px-3 py-2 rounded shadow focus:outline-none focus:ring-0 focus:border-blue-300"
        >
          <option value="" disabled>Select a category</option>
          <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}</option>
        </select>

        <label for="photo" class="block text-base mb-2 mt-8">Photo</label>
        <input
            type="file"
            id="photo"
            @change="handleFileChange"
            class="border w-full text-base px-3 py-2 rounded shadow focus:outline-none focus:ring-0 focus:border-blue-300"
        />

        <div class="mt-16 flex justify-end items-center">
          <button
              type="submit"
              :disabled="isLoading"
              class="bg-gray-900 border-yellow-50 border-x-2 border-y-2 rounded-full text-white font-bold px-3 py-2 shadow-inner hover:border-sky-400 hover:shadow-md transition-all ease-in-out duration-300"
          >
            Create
          </button>
        </div>
      </form>
    </section>

    <div class="bg-white py-6 shadow-md mt-12">
      <span class="py-12 px-48 font-bold text-2xl">Create Category</span>
    </div>
    <section id="create-category" class="flex justify-center min-h-52 py-36">
      <form @submit.prevent="createCategory" method="post"
            class="bg-white shadow-md border-black rounded-lg overflow-hidden items-center w-1/4 p-8">
        <label for="category-name" class="block text-base mb-2">Category Name</label>
        <input
            type="text"
            id="category-name"
            v-model="categoryData.name"
            class="border w-full text-base px-3 py-2 rounded shadow focus:outline-none focus:ring-0 focus:border-blue-300"
            placeholder="Category Name"
        />

        <label for="category-description" class="block text-base mb-2 mt-8">Category Description</label>
        <textarea
            id="category-description"
            v-model="categoryData.description"
            class="border w-full text-base px-3 py-2 rounded shadow focus:outline-none focus:ring-0 focus:border-blue-300"
            placeholder="Category Description"
        ></textarea>

        <div class="mt-16 flex justify-end items-center">
          <button
              type="submit"
              class="bg-gray-900 border-yellow-50 border-x-2 border-y-2 rounded-full text-white font-bold px-3 py-2 shadow-inner hover:border-sky-400 hover:shadow-md transition-all ease-in-out duration-300"
          >
            Create Category
          </button>
        </div>
      </form>
    </section>
  </div>
</template>

<style scoped>
.container {
  max-width: 1200px;
}
</style>
