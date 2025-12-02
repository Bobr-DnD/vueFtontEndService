<script setup>
import { ref } from 'vue';
import RepositoryFactory from '@http/RepositoryFactory';
import { asyncHandler } from '/utils/asyncHandler';
import { notify } from '/utils/notification';
import { ArrowUpTrayIcon } from '@heroicons/vue/24/solid';
import DeleteButton from './Buttons/DeleteButton.vue';

const props = defineProps({
    image: {
        type: String,
        default: ''
    },
    label: {
        type: String,
        default: 'Image'
    },
    callback: {
        type: Function,
        required: true
    }
})

const fileInput = ref(null)

async function loadImage() {
    console.log(fileInput.value.files[0]);
    
    const formData = new FormData();
    formData.append('file', fileInput.value.files[0])

    const [res, err] = await asyncHandler(
        RepositoryFactory.createFile('storage', formData)
    )
    if (err) {
        notify({ message: err.message, type: 'error' })
        return
    }

    props.callback(res.data)
}

async function deleteImage() {
    //TODO does it make sense to delete image before saving
    // const fileName = props.image.split('images/')[1]
    // console.log({fileName});
    
    
    // const [res, err] = await asyncHandler(
    //     RepositoryFactory.deleteFile('storage', fileName)
    // )
    // if (err) {
    //     notify({ message: err.message, type: 'error' })
    //     return
    // }
    // notify({ message: res.data.message, type: 'success' })

    props.callback(null)
}

</script>

<template>
    <div class="flex flex-col justify-center items-center space-y-2">

        <img @click="fileInput.click()"
            class="w-1/2 min-h-auto max-h-[512px] object-cover object-top rounded-xl border-4 border-darkred-red shadow-md hover:cursor-pointer"
            :src="props.image ? props.image : `https://placehold.co/400x200?text=${props.label}`" :alt="props.label" />

        <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="loadImage" />


        <div class="w-1/2 flex gap-2 h-14">
            <button @click="fileInput.click()" class="w-full flex items-center justify-center gap-2 px-5 py-3 font-gothic text-lg font-semibold
         text-darkred-light bg-darkred-dark_gray border-2 border-darkred-dark rounded-xl">
                <ArrowUpTrayIcon class="w-6 h-6" />
                Завантажити зображення
            </button>

            <DeleteButton v-if="props.image" class="h-14 w-14 bg-darkred-red text-darkred-light" @click="deleteImage"/>
        </div>

    </div>
</template>