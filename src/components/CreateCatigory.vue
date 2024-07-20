<script setup>
import {ref} from 'vue';
import {useRouter} from 'vue-router';
import apiService from '@/servise';

const categoryData = ref({
  name: '',
  description: ''
});

const router = useRouter();
const showAlert = ref(false);

const createCategory = async () => {
  try {
    if (categoryData.value.name && categoryData.value.description) {
      console.log('Sending data:', categoryData.value); // Debugging
      await apiService.createCategory(categoryData.value);
      showAlert.value = true;
      setTimeout(() => {
        showAlert.value = false;
        router.push('/products');
      }, 2000);
    } else {
      alert('Please fill in all fields.');
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
</script>

<template>
  <div>
    <div class="bg-white py-6 shadow-md">
      <span class="py-12 px-48 font-bold text-2xl">Katigoriya yaratish</span>
    </div>
    <section id="log-in" class="flex justify-center min-h-52 py-36">
      <form @submit.prevent="createCategory" method="post"
            class="bg-white shadow-md border-black rounded-lg overflow-hidden items-center w-1/4 p-8">
        <label for="name" class="block text-base mb-2">Nomi</label>
        <input
            type="text"
            id="name"
            v-model="categoryData.name"
            class="border w-full text-base px-3 py-2 rounded shadow focus:outline-none focus:ring-0 focus:border-blue-300"
            placeholder="Nomi"
        >

        <label for="description" class="block text-base mb-2 mt-8">Ma'lumot</label>
        <textarea
            id="description"
            v-model="categoryData.description"
            class="border w-full text-base px-3 py-2 rounded shadow focus:outline-none focus:ring-0 focus:border-blue-300"
            placeholder="Ma'lumoti"
        ></textarea>

        <div class="mt-16 flex justify-end items-center">
          <button
              type="submit"
              class="bg-gray-900 border-yellow-50 border-x-2 border-y-2 rounded-full text-white font-bold px-3 py-2 shadow-inner hover:border-sky-400 hover:shadow-md transition-all ease-in-out duration-300"
          >
            Yaratish
          </button>
        </div>
      </form>
    </section>
    <transition name="fade">
      <div v-if="showAlert"
           class="fixed top-0 left-1/2 transform -translate-x-1/2 mt-4 bg-green-500 text-white px-4 py-2 rounded shadow alert-box flex items-center">
        <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"
             xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        🎉🎉 Katigoriya yaratildi!
        <div class="progress-bar"></div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.bg-white {
  background-color: #ffffff;
}

.py-6 {
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
}

.shadow-md {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.font-bold {
  font-weight: bold;
}

.text-2xl {
  font-size: 1.5rem;
}

.flex {
  display: flex;
}

.justify-center {
  justify-content: center;
}

.min-h-52 {
  min-height: 13rem;
}

.py-36 {
  padding-top: 9rem;
  padding-bottom: 9rem;
}

.shadow-md {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.border-black {
  border-color: #000000;
}

.rounded-lg {
  border-radius: 0.5rem;
}

.overflow-hidden {
  overflow: hidden;
}

.items-center {
  align-items: center;
}

.p-8 {
  padding: 2rem;
}

.block {
  display: block;
}

.text-base {
  font-size: 1rem;
}

.mb-2 {
  margin-bottom: 0.5rem;
}

.mt-8 {
  margin-top: 2rem;
}

.border {
  border-width: 1px;
}

.w-full {
  width: 100%;
}

.px-3 {
  padding-left: 0.75rem;
  padding-right: 0.75rem;
}

.py-2 {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

.rounded {
  border-radius: 0.375rem;
}

.shadow {
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.focus\:outline-none:focus {
  outline: 0;
}

.focus\:ring-0:focus {
  box-shadow: none;
}

.focus\:border-blue-300:focus {
  border-color: #93c5fd;
}

.mt-16 {
  margin-top: 4rem;
}

.bg-gray-900 {
  background-color: #1a202c;
}

.border-yellow-50 {
  border-color: #fefcbf;
}

.border-x-2 {
  border-left-width: 2px;
  border-right-width: 2px;
}

.border-y-2 {
  border-top-width: 2px;
  border-bottom-width: 2px;
}

.rounded-full {
  border-radius: 9999px;
}

.text-white {
  color: #ffffff;
}

.hover\:border-sky-400:hover {
  border-color: #38bdf8;
}

.transition-all {
  transition-property: all;
}

.ease-in-out {
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

.duration-300 {
  transition-duration: 300ms;
}

.fixed {
  position: fixed;
}

.top-0 {
  top: 0;
}


.transform {
  transform: translateX(-50%);
}

.mt-4 {
  margin-top: 1rem;
}

.bg-green-500 {
  background-color: #48bb78;
}

.px-4 {
  padding-left: 1rem;
  padding-right: 1rem;
}

.py-2 {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

.rounded {
  border-radius: 0.375rem;
}

.shadow {
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}


.alert-box {
  animation: slide-in 0s, slide-out 0s 2s;
}

.progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 4px;
  background: #ffffff;
  animation: progress 2s linear;
  width: 100%;
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
  transition: opacity 0.5s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
