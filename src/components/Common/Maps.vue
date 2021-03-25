<template>
  <div class="maps">
    <v-map
      style="height: 80%; width: 100%"
      ref="maps"
      :zoom="zoom"
      :center="center"
      @update:zoom="zoomUpdated"
      @update:center="centerUpdated"
      @update:bounds="boundsUpdated"
      :options="{ zoomControl: false }"
      @click="addMarker"
    >
      <v-geosearch :options="geosearchOptions" ref="geosearch"></v-geosearch>
      <v-tile-layer :url="url" :attribution="attribution"></v-tile-layer>
      <v-control-zoom position="bottomright"></v-control-zoom>

      <!-- <v-control-zoom position="bottomright"></v-control-zoom> -->
      <v-marker-cluster>
        <v-marker
          v-for="(location, index) in locations"
          :key="index"
          :lat-lng="location"
          @click="removeMarker(index)"
        ></v-marker>
      </v-marker-cluster>
    </v-map>
  </div>
</template>

<script>
import { LMap, LTileLayer, LMarker, LControlZoom } from "vue2-leaflet";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import VGeosearch from "vue2-leaflet-geosearch";
import { Icon } from "leaflet";

import Vue2LeafletMarkerCluster from "vue2-leaflet-markercluster";

const DummyLocations = [
  { lat: 2.4471708623464177, lng: -76.60543462886939 },
  { lat: 2.4071708623464177, lng: -76.60543462886939 },
  { lat: 2.4471708623464177, lng: -75.60543462886939 },
  { lat: 45.3937203599115, lng: 8.544738061411797 },
  { lat: 47.3744092665564, lng: -95.550949011575966 },
  { lat: 40.857687895771015, lng: -90.143336159214287 },
  { lat: 47.3937203599115, lng: 8.544738061411797 },
  { lat: 47.3744092665564, lng: -98.550949011575966 }
];

export default {
  components: {
    "v-map": LMap,
    "v-tile-layer": LTileLayer,
    "v-marker": LMarker,
    "v-marker-cluster": Vue2LeafletMarkerCluster,
    "v-control-zoom": LControlZoom,
    VGeosearch
  },
  data() {
    return {
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      zoom: 3,
      center: [47.41322, -1.219482],
      bounds: null,
      locations: [],
      geosearchOptions: {
        provider: new OpenStreetMapProvider(),
        autoClose: true,
        keepResult: false
      },
      isEdition: false
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
    removeMarker(index) {
      console.log("jajajaja");
      this.locations.splice(index, 1);
    },
    addMarker(event) {
      this.isEdition = !document
        .getElementsByClassName("geosearch")[0]
        .classList.contains("active");
      if (
        (event.containerPoint.x >= 10 && event.containerPoint.x <= 40) ||
        (event.containerPoint.y >= 10 && event.containerPoint.y <= 40)
      ) {
        this.isEdition = false;
        return;
      }
      if (this.isEdition) {
        this.locations.push(event.latlng);
      }
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
  height: 80vh;
  width: 100vw;
  position: relative;
  margin: auto;
  padding-bottom: 100px;
}
</style>
