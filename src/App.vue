<template>
  <div class="container py-4">

    <!-- HA NINCS BETÖLTVE TESZT -->
    <div v-if="!currentQuiz">
      <FileUpload />
      <hr />
      <SavedTests @load="startQuiz" />
    </div>

    <!-- HA VAN TESZT -->
    <Quiz v-else :data="currentQuiz" @back="currentQuiz = null" />

  </div>
</template>

<script setup>
import { ref } from 'vue'
import FileUpload from './components/FileUpload.vue'
import SavedTests from './components/SavedTests.vue'
import Quiz from './components/Quiz.vue'

const currentQuiz = ref(null)

function startQuiz(data) {
  currentQuiz.value = data
}
</script>