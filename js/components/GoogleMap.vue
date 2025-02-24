<template>
  <div id="map" style="width: 100%; height: 400px;"></div>
</template>

<script>
import { Loader } from '@googlemaps/js-api-loader';

export default {
  name: 'GoogleMap',
  mounted() {
    const loader = new Loader({
      apiKey: 'AIzaSyARcS9I6G6UzDQVcccw9iYTcffSLSwytiE',
      version: 'weekly'
    });
    loader.load().then(() => {
      const map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8
      });
      map.addListener('click', (event) => {
        this.$emit('map-click', { lat: event.latLng.lat(), lng: event.latLng.lng() });
      });
    });
  }
};
</script>

<style scoped>
#map { border-radius: 8px; }
</style>
