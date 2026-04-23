<template>
  <div class="card p-3">
    <h3>Quiz betöltve</h3>
    <pre>{{ data }}</pre>
  </div>
</template>

<script setup>
defineProps({
  data: Object
});
</script>