<template>
  <div class="relative" v-bind="$attrs">
    <input
      v-model="modelValue"
      class="w-full rounded-md border py-2.5 pe-10 ps-4 text-sm outline-none"
      placeholder="請輸入您要查詢的站名"
      type="text"
    />

    <span class="absolute inset-y-0 end-0 grid w-10 place-content-center">
      <button type="button" class="text-gray-600 hover:text-gray-700">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="h-4 w-4"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
      </button>
    </span>
  </div>
</template>

<script setup>
import useModelWrapper from '../hooks/useModelWrappped';

const props = defineProps({
  value: {
    type: String,
    default: '',
  },
});
const emit = defineEmits(['update:value']);

const modelValue = useModelWrapper(props, emit, 'value');
</script>

<style scoped></style>
