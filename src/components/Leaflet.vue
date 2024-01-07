<template>
  <div ref="mapRef" class="h-[60dvh]" />
</template>

<script setup>
import 'leaflet/dist/leaflet.css';
import { ref, onMounted, nextTick } from 'vue';
import L from 'leaflet';
import geoJsonData from '@/resource/mapData.json';

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

  // 綁定點擊地圖的事件
  // function onMapClick(e) {
  //   let popup = L.popup();
  //   popup
  //     .setLatLng(e.latlng)
  //     .setContent("You clicked the map at " + e.latlng.toString())
  //     .openOn(map);
  // }

  // map.on("click", onMapClick);

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
