<script setup>
import { ref } from 'vue';
import RepositoryFactory from '@http/RepositoryFactory';
import { asyncHandler } from '@utils/asyncHandler';
import { notify } from '@utils/notification';
import { ArrowUpTrayIcon, XMarkIcon } from '@heroicons/vue/24/solid';

const image = defineModel('image', { type: String, required: true })

const props = defineProps({
    label: {
        type: String,
        default: 'Image'
    }
})

const fileInput = ref(null)
const isDragging = ref(false)

async function loadImage(file) {
    const formData = new FormData();
    formData.append('file', file)

    const [res, err] = await asyncHandler(
        RepositoryFactory.createFile('storage', formData)
    )
    if (err) {
        notify({ message: err.message, type: 'error' })
        return
    }

    image.value = res.data
}

function onFileInputChange() {
    const file = fileInput.value.files[0]
    if (file) loadImage(file)
    fileInput.value.value = null
}

function onDrop(event) {
    isDragging.value = false
    const file = event.dataTransfer.files[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
        notify({ message: 'Будь ласка, перетягніть файл зображення', type: 'error' })
        return
    }
    loadImage(file)
}

async function deleteImage(event) {
    event.stopPropagation()

    const fileName = props.image.split('images/')[1]

    const [res, err] = await asyncHandler(
        RepositoryFactory.deleteFile('storage', fileName)
    )
    if (err) {
        notify({ message: err.message, type: 'error' })
        return
    }
    notify({ message: res.data.message, type: 'success' })

    image.value = null
}
</script>

<template>
    <div class="flex items-center gap-3">

        <div @click="fileInput.click()" @dragenter.prevent="isDragging = true" @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false" @drop.prevent="onDrop" :class="[
                'relative w-14 h-14 shrink-0 rounded-lg border-2 overflow-hidden cursor-pointer group transition-colors',
                isDragging ? 'border-state-success-accent' : 'border-brand-accent'
            ]">

            <img v-if="image" :src="image" :alt="label" class="w-full h-full object-cover" />

            <div v-else class="w-full h-full flex items-center justify-center bg-brand-surface">
                <ArrowUpTrayIcon class="w-5 h-5 text-brand-faint" />
            </div>

            <button v-if="image" type="button" @click="deleteImage" :aria-label="`Видалити ${label}`" class="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-brand-accent text-brand-text
                       flex items-center justify-center md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                <XMarkIcon class="w-3 h-3" />
            </button>

        </div>

        <span class="text-sm text-brand-faint font-gothic">{{ label }}</span>

        <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="onFileInputChange" />

    </div>
</template>
