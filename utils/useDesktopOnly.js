import { ref, onMounted, onUnmounted } from 'vue'

const DEFAULT_MIN_WIDTH = 1024

export function useDesktopOnly(minWidth = DEFAULT_MIN_WIDTH) {
    const isDesktop = ref(window.innerWidth >= minWidth)

    function update() {
        isDesktop.value = window.innerWidth >= minWidth
    }

    onMounted(() => window.addEventListener('resize', update))
    onUnmounted(() => window.removeEventListener('resize', update))

    return { isDesktop }
}
