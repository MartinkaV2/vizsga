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

  <!-- FOOTER -->
  <footer class="app-footer">
    <div class="app-footer__inner">
      <span class="app-footer__sep">·</span>
      <span class="app-footer__copy">© {{ year }} Minden jog fenntartva. Készítette: Medvecz Martin</span>
    </div>
  </footer>
</template>

<script setup>
import { ref } from 'vue'
import FileUpload from './components/FileUpload.vue'
import SavedTests from './components/SavedTests.vue'
import Quiz from './components/Quiz.vue'

const currentQuiz = ref(null)
const year = new Date().getFullYear()

function startQuiz(data) {
  currentQuiz.value = data
}
</script>

<style scoped>
.app-footer {
  margin-top: auto;
  border-top: 1px solid var(--border, #e5e4e7);
  background: #ffffff;
  padding: 18px 24px;
  text-align: center;
  font-size: 0.85rem;
  color: var(--text, #6b6375);
}

.app-footer__inner {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.app-footer__logo {
  font-weight: 600;
  color: var(--text-h, #08060d);
  letter-spacing: 0.5px;
}

.app-footer__sep {
  opacity: 0.4;
}

</style>