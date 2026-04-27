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

      <div class="d-flex justify-content-center gap-3 flex-wrap">
        <button @click="startQuiz(false)" class="btn btn-primary">
          Teszt indítása
        </button>

        <button @click="showTimerModal = true" class="btn btn-warning text-dark">
          ⏱ Teszt indítása időre
        </button>
      </div>

      <br>

      <button @click="$emit('back')" class="btn btn-secondary">
        ← Vissza
      </button>
    </div>

    <!-- TIMER INPUT MODAL -->
    <div v-if="showTimerModal" class="modal-overlay">
      <div class="modal-box text-center p-4">
        <h5 class="mb-3">⏱ Időkorlát megadása</h5>
        <p class="text-muted mb-3">Hány perc álljon rendelkezésre a teszthez?</p>
        <input
          v-model.number="timerMinutesInput"
          type="number"
          min="1"
          max="120"
          class="form-control text-center mb-3"
          style="width:120px; margin:0 auto;"
          placeholder="perc"
        />
        <div class="d-flex justify-content-center gap-2">
          <button @click="showTimerModal = false" class="btn btn-secondary">Mégse</button>
          <button @click="startTimedQuiz" class="btn btn-warning text-dark" :disabled="!timerMinutesInput || timerMinutesInput < 1">
            Indítás
          </button>
        </div>
      </div>
    </div>

    <!-- QUIZ -->
    <div v-if="started && !finished">

      <div class="card p-3 mb-3 d-flex flex-row justify-content-between align-items-center">
        <strong>{{ currentIndex + 1 }} / {{ questions.length }} kérdés</strong>
        <div v-if="timerActive" class="timer-display" :class="timerSecondsLeft <= 60 ? 'timer-warning' : ''">
          ⏱ {{ formattedTime }}
        </div>
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
import { ref, computed, watch, onUnmounted } from 'vue'

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
  stopTimer()
  started.value = false
  finished.value = false
  currentIndex.value = 0
  selected.value = {}
}


const started = ref(false)
const finished = ref(false)

const currentIndex = ref(0)
const selected = ref({})

// Timer
const showTimerModal = ref(false)
const timerMinutesInput = ref(10)
const timerActive = ref(false)
const timerSecondsLeft = ref(0)
let timerInterval = null

const formattedTime = computed(() => {
  const m = Math.floor(timerSecondsLeft.value / 60)
  const s = timerSecondsLeft.value % 60
  return `${m}:${s.toString().padStart(2, '0')}`
})

function startTimedQuiz() {
  showTimerModal.value = false
  timerSecondsLeft.value = timerMinutesInput.value * 60
  timerActive.value = true
  startQuiz(true)
  timerInterval = setInterval(() => {
    timerSecondsLeft.value--
    if (timerSecondsLeft.value <= 0) {
      clearInterval(timerInterval)
      timerActive.value = false
      finished.value = true
      started.value = false
    }
  }, 1000)
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
  timerActive.value = false
}

onUnmounted(() => stopTimer())

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

function startQuiz(timed = false) {
  started.value = true
}

function select(id) {
  selected.value[currentQuestion.value.id] = id
}

function next() {
  if (currentIndex.value < questions.value.length - 1) {
    currentIndex.value++
  } else {
    stopTimer()
    finished.value = true
    started.value = false
  }
}

function prev() {
  currentIndex.value--
}

function restart() {
  stopTimer()
  started.value = false
  finished.value = false
  currentIndex.value = 0
  selected.value = {}
  timerMinutesInput.value = 10
}
</script>
<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal-box {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.2);
  min-width: 300px;
}

.timer-display {
  font-size: 1.1rem;
  font-weight: bold;
  color: #198754;
  background: #d1e7dd;
  padding: 4px 14px;
  border-radius: 20px;
  letter-spacing: 1px;
  transition: all 0.3s;
}

.timer-warning {
  color: #842029;
  background: #f8d7da;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}
</style>