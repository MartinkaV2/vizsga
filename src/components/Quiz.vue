<template>
  <div class="container mt-4">

    <!-- HEADER -->
    <div class="text-center mb-4">
      <h2>{{ quizData.title }}</h2>
      <p>{{ quizData.subtitle }}</p>
    </div>

    <!-- START SCREEN -->
    <div v-if="!started && !finished" class="text-center">
      <p><strong>Kérdések száma:</strong> {{ questions.length }}</p>
      <p><strong>Max pont:</strong> {{ maxPoints }}</p>

      <button @click="startQuiz" class="btn btn-primary">
        Teszt indítása
      </button>

      <br><br>

      <button @click="$emit('back')" class="btn btn-secondary">
        ← Vissza
      </button>
    </div>

    <!-- QUIZ -->
    <div v-if="started && !finished">

      <div class="card p-3 mb-3">
        <strong>{{ currentIndex + 1 }} / {{ questions.length }} kérdés</strong>
      </div>

      <div class="card p-4">
        <h5>{{ currentQuestion.text }}</h5>

        <div class="mt-3">
          <div
            v-for="opt in currentQuestion.options"
            :key="opt.id"
            class="border p-2 mb-2 rounded"
            :class="selected[currentQuestion.id] === opt.id ? 'bg-primary text-white' : ''"
            @click="select(opt.id)"
            style="cursor:pointer"
          >
            {{ opt.id.toUpperCase() }}) {{ opt.text }}
          </div>
        </div>
      </div>

      <div class="d-flex justify-content-between mt-3">
        <button @click="prev" class="btn btn-secondary" :disabled="currentIndex === 0">
          Előző
        </button>

        <button @click="next" class="btn btn-primary">
          {{ currentIndex === questions.length - 1 ? 'Befejezés' : 'Következő' }}
        </button>
      </div>
    </div>

    <!-- RESULT -->
    <div v-if="finished" class="text-center">

      <h3>Eredmény</h3>

      <h1>{{ score }} / {{ maxPoints }}</h1>

      <p>{{ percent }}%</p>

      <hr>

      <button @click="restart" class="btn btn-primary me-2">
        Újra
      </button>

      <button @click="$emit('back')" class="btn btn-secondary">
        ← Vissza a főoldalra
      </button>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  data: Object
})

const quizData = ref(props.data)

const started = ref(false)
const finished = ref(false)

const currentIndex = ref(0)
const selected = ref({})

// kérdések flatten
const questions = computed(() => {
  return quizData.value.sections.flatMap(s => s.questions)
})

// max pont
const maxPoints = computed(() => {
  return questions.value.reduce((sum, q) => sum + q.points, 0)
})

const currentQuestion = computed(() => {
  return questions.value[currentIndex.value]
})

// pontszám
const score = computed(() => {
  let s = 0

  questions.value.forEach(q => {
    if (selected.value[q.id] === q.correct) {
      s += q.points
    }
  })

  return s
})

const percent = computed(() => {
  return Math.round((score.value / maxPoints.value) * 100)
})

// ---- methods ----

function startQuiz() {
  started.value = true
}

function select(id) {
  selected.value[currentQuestion.value.id] = id
}

function next() {
  if (currentIndex.value < questions.value.length - 1) {
    currentIndex.value++
  } else {
    finished.value = true
    started.value = false
  }
}

function prev() {
  currentIndex.value--
}

function restart() {
  started.value = false
  finished.value = false
  currentIndex.value = 0
  selected.value = {}
}
</script>