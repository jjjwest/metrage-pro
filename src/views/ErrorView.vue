<template>
  <div style="padding: 20px; background: white;">
    <h1 style="color: black; font-size: 24px;">Error Test Page</h1>
    <p style="color: black; margin-top: 10px;">{{ message }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const message = ref('Loading...')

onMounted(() => {
  message.value = 'Page loaded successfully'
  console.log('ErrorView mounted')
})
</script>