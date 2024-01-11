<template>
  <div v-if="isLogin">
    <Login />
  </div>

  <div v-else class="grid grid-rows-[50dvh_50dvh] bg-gray-100">
    <LeafletMap :list="list" @update-distance="fetchPostCalcDistance" />

    <section class="w-[clamp(300px,80%,1000px)] justify-self-center overflow-y-scroll py-4">
      <div
        v-if="!list.length"
        class="flex h-full items-center justify-center text-2xl text-gray-700"
      >
        請點擊地圖上任一點，以計算距離
      </div>

      <div v-else class="flex flex-col gap-4">
        <SearchBar v-model:value.trim="searchValue" class="w-1/2" />

        <div
          v-for="item in fileterList"
          :key="item.id"
          class="flex cursor-pointer items-center justify-between bg-white p-4 font-medium text-blue-400"
        >
          <h4 class="flex-grow text-xl text-black">{{ item.stop_name }}</h4>
          <span class="mr-1 text-2xl font-light">{{ item.distance }}</span>
          <span>km</span>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';

import MapApi from './api/Map';
import { useUserStore } from './stores/userStore';

import LeafletMap from './components/LeafletMap.vue';
import SearchBar from './components/SearchBar.vue';
import Login from './components/auth/Login.vue';

const userStore = useUserStore();
const isLogin = computed(() => userStore.isLogin);

const searchValue = ref('');

const list = ref([]);
const fileterList = computed(() => {
  return list.value.filter((item) => item.stop_name.includes(searchValue.value));
});

const fetchPostCalcDistance = async (lat, lng) => {
  try {
    const data = {
      lat,
      lng,
    };
    const res = await MapApi.postCalcDistance(data);
    const result = res.data.result;

    list.value = result;

    // 根據 stop_name 做去重的動作
    // list.value = [...new Map(result.map((item) => [item['stop_name'], item])).values()];
  } catch (error) {
    console.log(error);
  }
};
</script>

<style scoped></style>
