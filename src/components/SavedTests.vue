<template>
  <div>
    <h3>Korábbi tesztek</h3>

    <ul class="list-group">
      <li 
        v-for="quiz in quizzes" 
        :key="quiz.id"
        class="list-group-item d-flex justify-content-between"
      >
        {{ quiz.name }}
        <button @click="$emit('load', quiz.data)" class="btn btn-sm btn-success">
          Betöltés
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { getQuizzes } from "../services/storage";
import { ref, onMounted } from "vue";

const quizzes = ref([]);

onMounted(() => {
  quizzes.value = getQuizzes();
});
</script>