<template>
  <div ref="mapRef" v-bind="$attrs" />
</template>

<script setup>
import 'leaflet/dist/leaflet.css';
import { ref, onMounted, nextTick, watch } from 'vue';
import L from 'leaflet';
import geoJsonData from '../resource/mapData.json';

const props = defineProps({
  list: {
    type: Array,
    default: () => [],
  },
});
const emit = defineEmits(['update-distance']);

let map = null;
let geojson = null;

const mapRef = ref(null);

const onEachFeature = (feature, layer) => {
  let popupContent = `
  <p class='text-red-500'>
    ${Number(feature.properties.SHAPE_Area).toFixed(0)}
  </p>
  `;

  layer.bindTooltip(popupContent, {
    sticky: true,
    direction: 'top',
    pane: 'tooltipPane',
  });

  layer.on('mouseover', (e) => {
    // highlightFeature
    const layer = e.target;

    layer.setStyle({
      weight: 1,
      fillOpacity: 0.35,
    });

    layer.bringToFront();
  });
  layer.on('mouseout', (e) => {
    // resetHighlight
    geojson.resetStyle(e.target);
  });
  layer.on('click', (e) => {
    // zoomToFeature
    map.fitBounds(e.target.getBounds());
  });
};

// 設定每個區塊的樣式
const style = (feature) => {
  return {
    fillColor: '#0000ff',
    weight: 1,
    opacity: 0.5,
    color: '#0000ff',
  };
};

// TODO: 這裡要改成從 API 拿資料
// const fetchGetGeolocation = async () => {
//   try {
//     const res = await api.getGeolocation({
//       directory: 'tucheng.json'
//     });
//     list.value = res.data.result;
//   } catch (error) {
//     console.log(error);
//   }
// };

watch(
  () => props.list,
  (list) => {
    // TODO: 需要先清除掉原本的 marker (可能利用 group 來做)
    // 否則會重複出現而且會重疊
    list.forEach((item) => {
      const { latitude, longitude, stop_name } = item;
      L.marker([latitude, longitude]).bindTooltip(stop_name).addTo(map);
    });
  },
);

onMounted(() => {
  map = L.map(mapRef.value, {
    center: [24.9705832962993, 121.44031842989698],
    zoom: 16,
    zoomControl: false,
  });
  L.control.zoom({ position: 'bottomright' }).addTo(map);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  geojson = L.geoJson(geoJsonData.result, {
    // 定義每個區塊的樣式
    style: style,
    onEachFeature: onEachFeature,
  }).addTo(map);

  // 綁定點擊地圖的事件;
  async function onMapClick(e) {
    const { lat, lng } = e.latlng;
    await emit('update-distance', lat, lng);
    // let popup = L.popup();
    // popup
    //   .setLatLng(e.latlng)
    //   .setContent('You clicked the map at ' + e.latlng.toString())
    //   .openOn(map);
  }

  map.on('click', onMapClick);

  // nextTick(() => {
  //   // TODO: 根據定位再去設定中心點，如果沒有定位就使用預設的
  //   navigator.geolocation.getCurrentPosition((position) => {
  //     console.log(position);
  //     const { latitude, longitude } = position.coords;
  //     // defaultConfig.value.center = [latitude, longitude];
  //     map.setView([latitude, longitude], 16);
  //     L.marker([latitude, longitude]).bindTooltip(`You`).addTo(map);
  //   });
  // });
});
</script>
