<script setup>
import { ref } from 'vue';
import RepositoryFactory from '@http/RepositoryFactory';
import { asyncHandler } from '/utils/asyncHandler';
import { notify } from '/utils/notification';
import { ArrowUpTrayIcon } from '@heroicons/vue/24/solid';
import DeleteButton from './Buttons/DeleteButton.vue';

const image = defineModel('image', { type: String, required: true })

const props = defineProps({
    label: {
        type: String,
        default: 'Image'
    }
})

const fileInput = ref(null)

async function loadImage() {

    const formData = new FormData();
    formData.append('file', fileInput.value.files[0])

    const [res, err] = await asyncHandler(
        RepositoryFactory.createFile('storage', formData)
    )
    if (err) {
        notify({ message: err.message, type: 'error' })
        return
    }

    image.value = res.data
}

async function deleteImage() {
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
    <div class="flex flex-col justify-center items-center space-y-2">

        <img @click="fileInput.click()"
            class="w-1/2 min-h-auto max-h-[512px] object-cover object-top rounded-xl border-4 border-darkred-red shadow-md hover:cursor-pointer"
            :src="image ? image : `https://placehold.co/400x200?text=${props.label}`" :alt="props.label" />

        <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="loadImage" />

        <div class="w-1/2 flex gap-2 h-14">
            <button @click="fileInput.click()" class="w-full flex items-center justify-center gap-2 px-5 py-3 font-gothic text-lg font-semibold
         text-darkred-light bg-darkred-dark_gray border-2 border-darkred-dark rounded-xl">
                <ArrowUpTrayIcon class="w-6 h-6" />
                Завантажити зображення
            </button>

            <DeleteButton v-if="image" class="h-14 w-14 bg-darkred-red text-darkred-light" @click="deleteImage" />
        </div>

    </div>
</template>