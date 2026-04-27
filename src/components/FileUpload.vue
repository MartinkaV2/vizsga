<template>
  <div class="card p-4">
    <h3>Vizsga feltöltő oldal</h3>
    <h6>Készítette: Medvecz Martin</h6>

    <input type="file" @change="handleFile" class="form-control mb-3" />

    <button @click="save" class="btn btn-primary" :disabled="!jsonData">
      Mentés
    </button>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { saveQuiz } from "../services/storage";

const jsonData = ref(null);

function handleFile(e) {
  const file = e.target.files[0];
  const reader = new FileReader();

  reader.onload = () => {
    jsonData.value = JSON.parse(reader.result);
  };

  reader.readAsText(file);
}

async function save() {
  await saveQuiz(
    "Teszt " + new Date().toLocaleString(),
    jsonData.value
  );
  alert("Mentve!");
}
</script>