<script setup>
import { computed, onMounted, onUnmounted, ref, watch, nextTick } from 'vue'

const props = defineProps({
  title: { type: String, required: true },
  value: { type: Number, required: true },
  min: { type: Number, required: true },
  max: { type: Number, required: true },
  colors: {
    type: Array, default: [
      "#3E5F44",
      "#FABC3F",
      "#8E1616"
    ]
  },
  step: { type: Number, default: 1 },
  pad: { type: Number, default: 2 }, // e.g. 2 -> "07"
  callback: { type: Function, required: true }
})

function handleWheel(e) {
  e.preventDefault()

  scroller.value.scrollLeft += e.deltaY
}



const items = computed(() => {
  const out = []
  for (let v = props.min; v <= props.max; v += props.step) out.push(v)
  return out
})

const scroller = ref(null)
const itemRefs = ref([])

function throwError(err) {
  console.log(err);
}

function getItemEl(idx) {
  return itemRefs.value[idx] || null
}

function format(v) {
  return props.pad ? String(v).padStart(props.pad, '0') : String(v)
}

function select(v) {
  props.value.value += v
}

function getItemUnderIndicator() {
  const wrap = scroller.value
  if (!wrap) return throwError('No wrap')

  const centerX = wrap.scrollLeft + wrap.clientWidth / 2

  let closestIdx = -1
  let closestDist = Infinity

  for (let i = 0; i < itemRefs.value.length; i++) {
    const el = getItemEl(i)
    if (!el) continue

    const elCenter = el.offsetLeft + el.offsetWidth / 2
    const dist = Math.abs(centerX - elCenter)

    if (dist < closestDist) {
      closestDist = dist
      closestIdx = i
    }
  }

  if (closestIdx !== -1) {
    const delta = items.value[closestIdx]
    props.callback(delta, props.title)
    return delta
  }

  throwError('No item found')
  return null
}

async function scrollToValue() {
  await nextTick()

  const idx = items.value.indexOf(0)

  const el = itemRefs.value[idx]
  const wrap = scroller.value

  if (!el || !wrap) return

  const offset = el.offsetLeft + el.offsetWidth / 2 - wrap.clientWidth / 2
  console.log(offset);
  wrap.scrollTo({ left: offset, behavior: 'smooth' })
}

onMounted(() => {
  if (scroller.value) {
    scroller.value.addEventListener('wheel', handleWheel, { passive: false })
  }
  nextTick(scrollToValue)
})

onUnmounted(() => {
  if (scroller.value) {
    scroller.value.removeEventListener('wheel', handleWheel)
  }
})

watch(() => props.value.value, scrollToValue)
</script>

<template>

  <div class="w-full max-w-md mx-auto font-gothic" :id="props.title">

    <div ref="scroller" class="relative flex gap-4 overflow-x-auto auto-hide-scroll px-6 py-3
             snap-x snap-mandatory scroll-p-1 select-none">

      <div class="shrink-0" :style="{ width: '50%' }"></div>

      <div v-for="(v, i) in items" :key="v" :ref="el => itemRefs[i] = el" class="snap-center shrink-0 w-14 h-14 grid place-items-center rounded-xl border transition-all duration-200 cursor-pointer bg-white text-gray-800 
        border-gray-300 dark:bg-zinc-900 dark:text-zinc-100 dark:border-zinc-700 dark:md:hover:border-zinc-500">

        <span class="text-xl font-semibold tabular-nums">{{ format(v) }}</span>

      </div>

      <div class="shrink-0" :style="{ width: '50%' }"></div>

    </div>

    <div class="relative h-0">
      <div class="absolute left-1/2 -translate-x-1/2 -top-8 h-8 w-0.5 bg-darkred-bright/90 rounded"></div>
    </div>
  </div>

  <div class="w-full flex items-center justify-center font-gothic">
    <button @click="getItemUnderIndicator" class="mx-auto p-2 w-32 h-16 border-2 rounded-xl text-darkred-light text-3xl font-medium
           bg-[length:200%_200%] animate-gradient-pulse" :style="{
            '--from': colors[2],
            '--via': colors[1],
            '--to': colors[0],
            backgroundImage: `linear-gradient(to right, var(--from), var(--via), var(--to))`
          }">
      OK
    </button>
  </div>

</template>

<style>
@keyframes gradient-pulse {
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}

.animate-gradient-pulse {
  animation: gradient-pulse 4s ease infinite;
}
</style>
