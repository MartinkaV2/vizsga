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
    <div v-if="finished">

      <!-- Összesített eredmény -->
      <div class="text-center mb-4">
        <h3>Eredmény</h3>
        <h1>{{ score }} / {{ maxPoints }}</h1>
        <p>{{ percent }}%</p>
        <div class="d-flex justify-content-center gap-3 mt-2 mb-3">
          <span class="badge bg-success fs-6">✓ Helyes: {{ correctCount }}</span>
          <span class="badge bg-danger fs-6">✗ Helytelen: {{ wrongCount }}</span>
          <span class="badge bg-secondary fs-6">— Kihagyott: {{ skippedCount }}</span>
        </div>
      </div>

      <hr>

      <!-- Áttekintés -->
      <h5 class="mb-3">📋 Kérdések áttekintése</h5>

      <div
        v-for="(q, idx) in questions"
        :key="q.id"
        class="card mb-3"
        :class="getQuestionCardClass(q)"
      >
        <div class="card-header d-flex justify-content-between align-items-center">
          <span>
            <strong>{{ idx + 1 }}. kérdés</strong> — {{ q.text }}
          </span>
          <span>
            <span v-if="isCorrect(q)" class="badge bg-success">✓ Helyes</span>
            <span v-else-if="isSkipped(q)" class="badge bg-secondary">— Kihagyott</span>
            <span v-else class="badge bg-danger">✗ Helytelen</span>
          </span>
        </div>

        <div class="card-body">
          <div
            v-for="opt in q.options"
            :key="opt.id"
            class="border p-2 mb-2 rounded d-flex align-items-center gap-2"
            :class="getOptionClass(q, opt)"
          >
            <strong>{{ opt.id.toUpperCase() }})</strong> {{ opt.text }}
            <span v-if="opt.id === q.correct" class="ms-auto">✓ Helyes válasz</span>
            <span v-else-if="opt.id === selected[q.id] && opt.id !== q.correct" class="ms-auto">✗ Ezt választottad</span>
          </div>
        </div>
      </div>

      <div class="text-center mt-4 mb-4">
        <button @click="restart" class="btn btn-primary me-2">
          Újra
        </button>

        <button @click="$emit('back')" class="btn btn-secondary">
          ← Vissza a főoldalra
        </button>
      </div>

    </div>

  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  data: Object
})

const quizData = ref(props.data)

watch(
  () => props.data,
  (newVal) => {
    quizData.value = newVal
    resetState()
  }
)

function resetState() {
  started.value = false
  finished.value = false
  currentIndex.value = 0
  selected.value = {}
}


const started = ref(false)
const finished = ref(false)

const currentIndex = ref(0)
const selected = ref({})

// kérdések flatten
const questions = computed(() => {
  if (!quizData.value || !quizData.value.sections) return []
  return quizData.value.sections.flatMap(s => s.questions || [])
})

// max pont
const maxPoints = computed(() => {
  return questions.value.reduce((sum, q) => sum + q.points, 0)
})

const currentQuestion = computed(() => {
  return questions.value[currentIndex.value] || {}
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

const correctCount = computed(() => {
  return questions.value.filter(q => isCorrect(q)).length
})

const wrongCount = computed(() => {
  return questions.value.filter(q => !isCorrect(q) && !isSkipped(q)).length
})

const skippedCount = computed(() => {
  return questions.value.filter(q => isSkipped(q)).length
})

// ---- helpers ----

function isCorrect(q) {
  return selected.value[q.id] === q.correct
}

function isSkipped(q) {
  return !selected.value[q.id]
}

function getQuestionCardClass(q) {
  if (isCorrect(q)) return 'border-success'
  if (isSkipped(q)) return 'border-secondary'
  return 'border-danger'
}

function getOptionClass(q, opt) {
  const userAnswer = selected.value[q.id]

  if (opt.id === q.correct) {
    // mindig zöld a helyes válasz
    return 'bg-success text-white border-success'
  }
  if (opt.id === userAnswer && opt.id !== q.correct) {
    // piros a rossz választott válasz
    return 'bg-danger text-white border-danger'
  }
  return ''
}

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