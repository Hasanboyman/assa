<script setup>
import { ref, computed, onMounted } from 'vue';
import apiService from '@/servise';
import { useAbility } from '@casl/vue';


const products = ref([]);
const categories = ref([]);
const showModal = ref(false);
const openModal = ref(false);
const editMenuOpen = ref(false);
const selectedCategory = ref({id: null, name: ''});
const selectedProduct = ref({id: null, name: '', quantity: 0, price: 0, description: '', category: '', photo: null});
const error = ref(null);
const currentPage = ref(1);
const rowsPerPage = 3;
const showAlert = ref(false);
const alertMessage = ref('');
const ablity = useAbility();

const fetchCategories = async () => {
  try {
    const response = await apiService.getAllCategories();
    categories.value = response.data;
  } catch (err) {
    console.error('Failed to get categories:', err);
  }
};

const fetchProducts = async () => {
  try {
    const response = await apiService.getAllProducts();
    products.value = response.data.map(product => {
      const category = categories.value.find(cat => cat.id === product.category);
      return {
        ...product,
        categoryName: category ? category.name : 'Unknown'
      };
    });
  } catch (err) {
    console.error('Failed to get products:', err);
  }
};

const updateCategory = async () => {
  try {
    await apiService.updateCategory(selectedCategory.value.id, selectedCategory.value);
    await fetchCategories();
    await fetchProducts();
    showModal.value = false;
    showSuccessAlert('Category updated successfully!');
  } catch (err) {
    error.value = 'Failed to update category';
    console.error('Failed to update category:', err);
  }
};

const updateProduct = async () => {
  try {
    const formData = new FormData();
    formData.append('name', selectedProduct.value.name);
    formData.append('quantity', selectedProduct.value.quantity);
    formData.append('price', selectedProduct.value.price);
    formData.append('description', selectedProduct.value.description);
    formData.append('category', selectedProduct.value.category);
    if (selectedProduct.value.photo instanceof File) {
      formData.append('photo', selectedProduct.value.photo);
    } else {
      alert('Selected photo is not a file:', selectedProduct.value.photo);
    }

    await apiService.updateProduct(selectedProduct.value.id, formData);
    await fetchProducts();
    openModal.value = false;
    showSuccessAlert('Product updated successfully!');
  } catch (err) {
    error.value = 'Failed to update product';
    alert('Failed to update product:', err.response ? err.response.data : err);
  }
};

const deleteProduct = async (productId) => {
  try {
    await apiService.deleteProduct(productId);
    await fetchProducts();
    showSuccessAlert('Product deleted successfully!');
  } catch (err) {
    error.value = 'Failed to delete product';
    console.error('Failed to delete product:', err);
  }
};

const showSuccessAlert = (message) => {
  alertMessage.value = message;
  showAlert.value = true;
  setTimeout(() => {
    showAlert.value = false;
  }, 2300);
};

const totalPages = computed(() => Math.ceil(products.value.length / rowsPerPage));

const paginatedProducts = computed(() => {
  const startIndex = (currentPage.value - 1) * rowsPerPage;
  return products.value.slice(startIndex, startIndex + rowsPerPage);
});

const goToPage = (page) => {
  currentPage.value = page;
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const editCategory = () => {
  selectedCategory.value = {id: selectedProduct.value.category, name: selectedProduct.value.categoryName};
  editMenuOpen.value = false;
  showModal.value = true;
};

const editProduct = () => {
  editMenuOpen.value = false;
  openModal.value = true;
};

const openEditMenu = (product) => {
  selectedProduct.value = Object.assign({}, product);
  editMenuOpen.value = true;
};

const handleFileUpload = async (event) => {
  const file = await event.target.files[0];
  if (file) {
    selectedProduct.value.photo = file;
  } else {
    console.error('No file selected');
  }
};

onMounted(async () => {
  await fetchCategories();
  await fetchProducts();
});
</script>

<template>
  <div class="container mx-auto pt-6">
    <div class="items-center flex justify-between">
      <RouterLink to="/createproduct" v-if="ablity.can('use','Create Product')"
                  class="bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300 hover:bg-red-700 mb-6">
        Create Product
      </RouterLink>
      <div class="flex flex-end items-center">
        <RouterLink to="/createCategory" v-if="ablity.can('use','Create Category')"
                    class="bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300 hover:bg-blue-700 mb-6">
          Create Category
        </RouterLink>
      </div>
    </div>

    <div class="relative overflow-x-auto shadow-md sm:rounded-lg cursor-default">
      <div class="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">Product List</h2>
        <div class="space-x-2 mt-4">
          <div class="flex text-gray-600">
            <button @click="prevPage" :disabled="currentPage === 1" class="px-3 py-2 bg-white rounded-md hover:bg-gray-200">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>
            <button v-for="page in totalPages" :key="page" @click="goToPage(page)"
                    :class="{ 'bg-gray-300': currentPage === page }"
                    class="px-3 py-2 bg-white rounded-md hover:bg-gray-200">
              {{ page }}
            </button>
            <button @click="nextPage" :disabled="currentPage === totalPages"
                    class="px-3 py-2 bg-white rounded-md hover:bg-gray-200">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
      <table class="w-full text-lg text-center text-gray-500 dark:text-gray-400">
        <thead class="text-md text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" class="px-8 py-3 cursor-default">Id</th>
          <th scope="col" class="px-12 py-3 cursor-default">Image</th>
          <th scope="col" class="px-6 py-3 cursor-default">Product</th>
          <th scope="col" class="px-6 py-3 cursor-default">Category</th>
          <th scope="col" class="px-6 py-3 cursor-default">Quantity</th>
          <th scope="col" class="px-6 py-3 cursor-default">Price</th>
          <th scope="col" class="px-6 py-3 cursor-default" v-if="ablity.can('view','Actions')">Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="product in paginatedProducts" :key="product.id"
            class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
          <td class="px-6 py-4 font-semibold text-gray-900 dark:text-white">{{ product.id }}</td>
          <td class="p-4">
            <img :src="product.photo" width="20px" height="20px" class="w-28" alt="Product Image"
                 style="border-radius:50%; margin: auto">
          </td>
          <td class="px-6 py-4 font-semibold text-gray-900 dark:text-white">{{ product.name }}</td>
          <td class="px-6 py-4 font-semibold text-gray-900 dark:text-white">{{ product.categoryName }}</td>
          <td class="px-6 py-4">
              <span
                  class="inline-block bg-gray-50 border border-gray-300 text-gray-900 w-12 text-center py-2 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                {{ product.quantity }}<sup left</sup>
              </span>
          </td>
          <td class="px-6 py-4 font-semibold text-gray-900 dark:text-white">${{ product.price }}</td>
          <td class="px-6 py-4" v-if="ablity.can('view','Actions')">
            <button @click="openEditMenu(product)" class="text-green-600 font-medium hover:text-green-400" v-if="ablity.can('use','Edit')">Edit</button>
            |
            <button @click="deleteProduct(product.id)"
                    class="text-red-600 font-medium hover:underline dark:text-red-500"  v-if="ablity.can('use','Remove')">Remove
            </button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>


    <button v-if="editMenuOpen" @click="editMenuOpen = false"
         class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out cursor-default">
      <div
          class="bg-white p-6 rounded-lg shadow-xl w-1/3 transform transition-transform duration-300 ease-in-out scale-105">
        <h2 class="text-xl font-bold mb-4 text-primary1">Edit Menu</h2>
        <div class="flex justify-around">
          <button @click="editCategory"
                  class="bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300 hover:bg-blue-700">
            Edit Category
          </button>
          <button @click="editProduct"
                  class="bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300 hover:bg-green-700">
            Edit Product
          </button>
        </div>
      </div>
    </button>

    <div v-if="showModal"
         class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out">
      <div
          class="bg-white p-6 rounded-lg shadow-xl w-1/3 transform transition-transform duration-300 ease-in-out scale-105">
        <h2 class="text-xl font-bold mb-4 text-primary1">Edit Category</h2>
        <form @submit.prevent="updateCategory" method="post">
          <label for="name" class="block text-base mb-2 text-black">Name</label>
          <input v-model="selectedCategory.name" type="text" id="name"
                 class="border w-full text-base px-3 py-2 rounded shadow focus:outline-none focus:ring-0 focus:border-primary1"
                 placeholder="Name">
          <div class="mt-16 flex justify-end items-center">
            <button type="button" @click="showModal = false"
                    class="bg-gray-500 border border-gray-400 rounded-full text-white font-bold px-4 py-2 mr-4 transition-all ease-in-out duration-300 hover:bg-gray-600 hover:shadow-lg">
              Cancel
            </button>
            <button type="submit"
                    class="bg-black border-gray-500 border-x-2 border-y-2 rounded-full text-white font-bold px-4 py-2 shadow-inner hover:border-gray-600 hover:shadow-md transition-all ease-in-out duration-300">
              Update
            </button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="openModal"
         class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out">
      <div
          class="bg-white p-6 rounded-lg shadow-xl w-1/3 transform transition-transform duration-300 ease-in-out scale-105">
        <h2 class="text-xl font-bold mb-4 text-primary1">Edit Product</h2>
        <form @submit.prevent="updateProduct" method="post" enctype="multipart/form-data">
          <label for="name" class="block text-base mb-2 text-black">Name</label>
          <input v-model="selectedProduct.name" type="text" id="name"
                 class="border w-full text-base px-3 py-2 rounded shadow focus:outline-none focus:ring-0 focus:border-primary1"
                 placeholder="Name">
          <label for="description" class="block text-base mb-2 text-black">Description</label>
          <textarea v-model="selectedProduct.description" id="description"
                    class="border w-full text-base px-3 py-2 rounded shadow focus:outline-none focus:ring-0 focus:border-primary1"
                    placeholder="Description"></textarea>
          <label for="category" class="block text-base mb-2 text-black">Category</label>
          <select v-model="selectedProduct.category" id="category"
                  class="border w-full text-base px-3 py-2 rounded shadow focus:outline-none focus:ring-0 focus:border-primary1">
            <option v-for="category in categories" :value="category.id" :key="category.id">{{ category.name }}</option>
          </select>
          <label for="quantity" class="block text-base mb-2 text-black">Quantity</label>
          <input v-model="selectedProduct.quantity" type="number" id="quantity"
                 class="border w-full text-base px-3 py-2 rounded shadow focus:outline-none focus:ring-0 focus:border-primary1"
                 placeholder="Quantity">
          <label for="price" class="block text-base mb-2 text-black">Price</label>
          <input v-model="selectedProduct.price" type="number" step="0.01" id="price"
                 class="border w-full text-base px-3 py-2 rounded shadow focus:outline-none focus:ring-0 focus:border-primary1"
                 placeholder="Price">
          <label for="photo" class="block text-base mb-2 text-black">Photo</label>
          <input type="file" id="photo" @change="handleFileUpload" ref="file"
                 class="border w-full text-base px-3 py-2 rounded shadow focus:outline-none focus:ring-0 focus:border-primary1">
          <div class="mt-16 flex justify-end items-center">
            <button type="button" @click="openModal = false"
                    class="bg-gray-500 border border-gray-400 rounded-full text-white font-bold px-4 py-2 mr-4 transition-all ease-in-out duration-300 hover:bg-gray-600 hover:shadow-lg">
              Cancel
            </button>
            <button type="submit"
                    class="bg-black border-gray-500 border-x-2 border-y-2 rounded-full text-white font-bold px-4 py-2 shadow-inner hover:border-gray-600 hover:shadow-md transition-all ease-in-out duration-300">
              Update
            </button>
          </div>
        </form>
      </div>
    </div>

    <transition name="fade">
      <div v-if="showAlert"
           class="fixed top-0 left-1/2 transform -translate-x-1/2 mt-4 bg-green-500 text-white px-4 py-2 rounded shadow alert-box flex items-center">
        <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"
             xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        {{ alertMessage }} 🎉🎉
        <div class="progress-bar"></div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.container {
  max-width: 1200px;
}

@keyframes slide-in {
  from {
    transform: translateY(-100%);
  }
  to {
    transform: translateY(0);
  }
}

@keyframes slide-out {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-100%);
  }
}

@keyframes progress {
  from {
    width: 100%;
  }
  to {
    width: 0;
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 1s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
