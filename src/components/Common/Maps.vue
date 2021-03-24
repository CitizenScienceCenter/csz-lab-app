<template>
  <div class="maps">
    <l-map
      style="height: 80%; width: 100%"
      :zoom="zoom"
      :center="center"
      @update:zoom="zoomUpdated"
      @update:center="centerUpdated"
      @update:bounds="boundsUpdated"
    >
      <l-tile-layer :url="url"></l-tile-layer>
      <v-marker-cluster>
        <v-marker
          v-for="(location, index) in locations"
          :key="index"
          :lat-lng="location"
        ></v-marker>
      </v-marker-cluster>
    </l-map>
  </div>
</template>

<script>
import { LMap, LTileLayer, LMarker } from "vue2-leaflet";
import { Icon } from "leaflet";

import Vue2LeafletMarkerCluster from "vue2-leaflet-markercluster";

const DummyLocations = [
  { lat: 2.4471708623464177, lng: -76.60543462886939 },
  { lat: 2.4471708623464177, lng: -76.60543462886939 },
  { lat: 2.4471708623464177, lng: -75.60543462886939 },
  { lat: 47.3937203599115, lng: 8.544738061411797 },
  { lat: 47.3744092665564, lng: -98.550949011575966 },
  { lat: 40.857687895771015, lng: -90.143336159214287 },  
  { lat: 47.3937203599115, lng: 8.544738061411797 },
  { lat: 47.3744092665564, lng: -98.550949011575966 }
];

export default {
  components: {
    LMap,
    LTileLayer,
    "v-marker": LMarker,
    "v-marker-cluster": Vue2LeafletMarkerCluster
  },
  data() {
    return {
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      zoom: 3,
      center: [47.41322, -1.219482],
      bounds: null,
      locations: []
    };
  },
  methods: {
    zoomUpdated(zoom) {
      this.zoom = zoom;
    },
    centerUpdated(center) {
      this.center = center;
    },
    boundsUpdated(bounds) {
      this.bounds = bounds;
    },
    setData() {
      this.locations = DummyLocations.map(x => [x.lat, x.lng]);
      const [minLat, maxLat, minLng, maxLng] = [
        Math.min.apply(Math, this.locations.map(x => x[0])),
        Math.max.apply(Math, this.locations.map(x => x[0])),
        Math.min.apply(Math, this.locations.map(x => x[1])),
        Math.max.apply(Math, this.locations.map(x => x[1]))
      ];
      this.center = [(maxLat + minLat) / 2, (maxLng + minLng) / 2];
    }
  },
  created() {
    delete Icon.Default.prototype._getIconUrl;
    Icon.Default.mergeOptions({
      iconRetinaUrl: require("@/assets/location_pin.png"),
      iconUrl: require("@/assets/location_pin.png"),
      shadowUrl: require("leaflet/dist/images/marker-shadow.png")
    });
    this.setData();
  }
};
</script>

<style lang="scss" scoped>
.maps {
  height: 75vh;
  width: 75vh;
  position: relative;
  margin: auto;
}
</style>
