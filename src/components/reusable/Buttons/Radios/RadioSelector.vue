<script setup>
import { useId } from 'vue';

const props = defineProps({
    radios: { type: Array, required: true }
})

const groupName = useId();
const selected = defineModel({ type: [String, Number, null], default: null });

</script>

<template>
    <div class="radio-inputs bg-darkred-dark_gray">
        <label class="radio" v-for="radio in props.radios" :key="radio.id">
            <input type="radio" :name="groupName" class="peer" :value="radio.id" v-model="selected">
            <span class="name text-darkred-light peer-checked:bg-orange-orange peer-checked:font-semibold">{{
                radio.label }}</span>
        </label>
    </div>
</template>

<style scoped>
.radio-inputs {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    border-radius: 0.5rem;
    box-sizing: border-box;
    box-shadow: 0 0 0px 1px rgba(0, 0, 0, 0.06);
    padding: 0.25rem;
    width: 300px;
    font-size: 14px;
}

.radio-inputs .radio {
    flex: 1 1 auto;
    text-align: center;
}

.radio-inputs .radio input {
    display: none;
}

.radio-inputs .radio .name {
    display: flex;
    cursor: pointer;
    align-items: center;
    justify-content: center;
    border-radius: 0.5rem;
    border: none;
    padding: .5rem 0;
    transition: all .15s ease-in-out;
}
</style>