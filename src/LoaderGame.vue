<!-- src/components/Loader.vue -->
<template>
  <div class="loader">
    <div class="spinner"></div>
    <div class="progress-bar">
      <div class="progress" :style="{ width: progress + '%' }"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoaderFFF',
  props: {
    progress: {
      type: Number,
      required: true,
    },
  },
};
</script>

<style scoped>
.loader {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: rgba(255, 255, 255, 0.8);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: #6200EE;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.progress-bar {
  width: 50%; /* Shorter progress bar */
  height: 8px; /* Slightly shorter height */
  background-color: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
  margin-top: 20px;
}

.progress {
  height: 100%;
  background-color: #6200EE;
  transition: width 0.5s ease-in-out;
  border-radius: 4px 0 0 4px;
  animation: fill 2s infinite;
}

@keyframes fill {
  0% {
    width: 0%;
  }
  100% {
    width: 100%;
  }
}
</style>
