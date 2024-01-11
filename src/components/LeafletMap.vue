<template>
  <div ref="mapRef" v-bind="$attrs" />
</template>

<script setup>
import 'leaflet/dist/leaflet.css';
import { ref, onMounted, nextTick, watch } from 'vue';
import L from 'leaflet';

import MapApi from '../api/Map';
import { useUserStore } from '../stores/userStore';

let map = null;
let geojson = null;
let clickPointMarker = null;
let listMarkerGroup = null;

const props = defineProps({
  list: {
    type: Array,
    default: () => [],
  },
});
const emit = defineEmits(['update-distance']);

const userStore = useUserStore();

const mapRef = ref(null);
const geoJsonData = ref([]);

const onMapClick = async (e) => {
  // 需先清空原本的 marker
  if (clickPointMarker) {
    map.removeLayer(clickPointMarker);
  }

  const { lat, lng } = e.latlng;
  clickPointMarker = L.marker([lat, lng], { iconUrl: '/marker-icon.png' })
    .bindTooltip('Click Here')
    .addTo(map);
  await emit('update-distance', lat, lng);
};

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

const setGeoJson = (data) => {
  geojson = L.geoJson(data, {
    style: style,
    onEachFeature: onEachFeature,
  }).addTo(map);
};

const fetchGetGeolocation = async () => {
  try {
    const res = await MapApi.getGeolocation({
      directory: 'tucheng.json',
    });
    geoJsonData.value = res.data.result;
  } catch (error) {
    console.log(error);
  }
};

watch(
  () => props.list,
  (list) => {
    // 需先清空原本的 marker
    if (listMarkerGroup) {
      map.removeLayer(listMarkerGroup);
    }
    // 重新繪製 marker
    let markerList = [];
    list.forEach((item) => {
      const { latitude, longitude, stop_name } = item;
      markerList.push(
        L.marker([latitude, longitude], { iconUrl: '/marker-icon.png' })
          .bindTooltip(stop_name)
          .addTo(map),
      );
    });
    listMarkerGroup = L.layerGroup(markerList).addTo(map);
  },
);

onMounted(async () => {
  map = L.map(mapRef.value, {
    center: [24.9705832962993, 121.44031842989698],
    zoom: 16,
    zoomControl: false,
    layers: [
      L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }),
    ],
  });
  L.control.zoom({ position: 'bottomright' }).addTo(map);

  await fetchGetGeolocation();
  await setGeoJson(geoJsonData.value);

  map.on('click', onMapClick);

  nextTick(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      const { picture: gPicture } = userStore.google.userInfo;
      const { picture: fPicture } = userStore.facebook.userInfo;
      const aboutYouText = `
      <section class="flex gap-2">
        <div>
          <p>Google</p>
          <div class="w-10 h-10 mx-auto">
            <img src=${gPicture} class="w-full rounded-full"/>
          </div>
        </div>
        <div>
          <p>Facebook</p>
          <div class="w-10 h-10 mx-auto">
            <img src=${fPicture} class="w-full rounded-full"/>
          </div>
        </div>
      </secti>
      `;

      L.marker([latitude, longitude], { iconUrl: '/marker-icon.png' })
        .bindTooltip(aboutYouText)
        .addTo(map);
    });
  });
});
</script>
