<template>
    <div v-if="Object.keys(errors).length > 0" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-3" role="alert">
      <strong class="font-bold">Ошибка!</strong>
      <ul class="mt-1 list-disc list-inside">
        <li v-for="(error, index) in errors" :key="index">{{ error }}</li>
      </ul>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ValidationErrors',
    props: {
      errors: {
        type: Object,
        required: true,
      },
    },
  };
  </script>
  