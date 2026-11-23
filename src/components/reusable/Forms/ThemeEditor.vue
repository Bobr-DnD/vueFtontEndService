<script setup>
import { ref, computed, watch } from 'vue';
import ImageEditorCompact from '@/components/reusable/ImageEditorCompact.vue';
import { THEME_PRESETS } from '@utils/themePresets';

const props = defineProps({
    theme: {
        type: Object,
        required: true
    }
})

const emit = defineEmits(['update:theme'])

const themeLocal = ref()

watch(
    () => props.theme,
    (val) => {
        themeLocal.value = {
            presetId: val.presetId ?? null,
            colors: { ...val.colors },
            faviconUrl: val.faviconUrl ?? ''
        }
    },
    { immediate: true, deep: true }
)

const activePresetId = computed(() => themeLocal.value?.presetId ?? null)

function update() {
    emit('update:theme', themeLocal.value)
}

function selectPreset(preset) {
    themeLocal.value.presetId = preset.id
    themeLocal.value.colors = { ...preset.colors }
    update()
}
</script>

<template>
    <div class="grid grid-cols-1 gap-4 font-gothic content-start">

        <h1 class="text-2xl">Брендування:</h1>

        <div class="grid grid-cols-2 gap-4">
            <button v-for="preset in THEME_PRESETS" :key="preset.id" type="button" @click="selectPreset(preset)"
                :class="[
                    'flex flex-col gap-3 p-3 rounded-xl border-2 transition-colors',
                    activePresetId === preset.id ? 'border-state-success-accent' : 'border-brand-muted md:hover:border-brand-subtle'
                ]">

                <div class="flex h-10 rounded-lg overflow-hidden border border-brand-base">
                    <span v-for="key in ['page', 'base', 'surface', 'accent', 'accentHover', 'accentSecondary', 'text']" :key="key"
                        class="flex-1 h-full" :style="{ backgroundColor: preset.colors[key] }" />
                </div>

                <span class="text-sm">{{ preset.name }}</span>

            </button>
        </div>

        <ImageEditorCompact v-model:image="themeLocal.faviconUrl" @update:image="update" label="Favicon" />

    </div>
</template>
