<template>
  <div class="container py-4">

    <FileUpload />
    <hr />

    <SavedTests @load="setQuiz" />
    <hr />

    <Quiz v-if="currentQuiz" :data="currentQuiz" />

  </div>
</template>

<script setup>
import { ref } from "vue";
import FileUpload from "./components/FileUpload.vue";
import SavedTests from "./components/SavedTests.vue";
import Quiz from "./components/Quiz.vue";

const currentQuiz = ref(null);

function setQuiz(data) {
  currentQuiz.value = data;
}
</script>