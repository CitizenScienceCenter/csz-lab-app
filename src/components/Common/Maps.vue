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
      @click="clickOnMap"
    >
      <v-geosearch :options="geosearchOptions" ref="geosearch"></v-geosearch>
      <v-tile-layer :url="url" :attribution="attribution"></v-tile-layer>
      <v-control-zoom position="bottomright"></v-control-zoom>

      <v-feature-group>
        <v-polygon :lat-lngs="area.latlngs" :color="area.color">
          <v-popup>
            <div v-if="toolbar.editionMode && toolbar.tools.polygon">
              <b-button
                variant="outline-danger"
                size="sm"
                @click="removeArea(area)"
              >
                <i class="fas fa-trash"></i>
              </b-button>
            </div>
            <p v-else>{{ area.latlngs }}</p>
          </v-popup>
        </v-polygon>
      </v-feature-group>

      <v-marker-cluster>
        <v-marker
          v-for="(location, index) in locations"
          :key="`marker${index}`"
          :lat-lng="location"
        >
          <v-popup>
            <b-button
              variant="outline-danger"
              size="sm"
              @click="removeMarker(location, index)"
              v-if="toolbar.editionMode && toolbar.tools.marker"
            >
              <i class="fas fa-trash"></i>
            </b-button>
            <p v-else>{{ getLocation(location) }}</p>
          </v-popup>
        </v-marker>
      </v-marker-cluster>

      <v-control :position="'bottomleft'" class="custom-buttons">
        <button
          class="custom-button mb-1"
          @click="toggleEditionMode('marker')"
          :class="{ active: toolbar.tools.marker }"
          :disabled="!isEditable"
        >
          <i class="fas fa-map-marker-alt fa-2x"></i>
        </button>
        <button
          class="custom-button mb-2"
          @click="toggleEditionMode('polygon')"
          :class="{ active: toolbar.tools.polygon }"
          :disabled="!isEditable"
        >
          <i class="fas fa-draw-polygon fa-2x"></i>
        </button>
      </v-control>
    </v-map>
  </div>
</template>

<script>
import {
  LMap,
  LTileLayer,
  LMarker,
  LControlZoom,
  LControl,
  LPopup,
  LPolygon,
  LFeatureGroup
} from "vue2-leaflet";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import VGeosearch from "vue2-leaflet-geosearch";
import { Icon } from "leaflet";
import Vue2LeafletMarkerCluster from "vue2-leaflet-markercluster";

const DummyLocations = [
  { info: "Marker info", lat: 2.4471708623464177, lng: -76.60543462886939 },
  { info: "Marker info", lat: 2.4071708623464177, lng: -76.60543462886939 },
  { info: "Marker info", lat: 2.4471708623464177, lng: -75.60543462886939 },
  { info: "Marker info", lat: 45.3937203599115, lng: 8.544738061411797 },
  { info: "Marker info", lat: 47.3744092665564, lng: -95.550949011575966 },
  { info: "Marker info", lat: 40.857687895771015, lng: -90.143336159214287 },
  { info: "Marker info", lat: 47.3937203599115, lng: 8.544738061411797 },
  { info: "Marker info", lat: 47.3744092665564, lng: -98.550949011575966 }
];

export default {
  props: {
    isEditable: { type: Boolean, default: true }
  },
  components: {
    "v-map": LMap,
    "v-tile-layer": LTileLayer,
    "v-marker": LMarker,
    "v-marker-cluster": Vue2LeafletMarkerCluster,
    "v-control-zoom": LControlZoom,
    "v-control": LControl,
    "v-popup": LPopup,
    "v-polygon": LPolygon,
    "v-feature-group": LFeatureGroup,
    VGeosearch
  },
  data() {
    return {
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="http://osm.org/copyright" target="_blank">OpenStreetMap</a> | <a href="https://locationiq.com/" target="_blank">LocationIQ</a> contributors',
      zoom: 3,
      center: [47.38454197098293, 8.542212126985232],
      bounds: null,
      locations: [],
      geosearchOptions: {
        provider: new OpenStreetMapProvider(),
        autoClose: true,
        keepResult: false
      },
      area: {
        latlngs: [],
        color: "green"
      },
      toolbar: {
        editionMode: false,
        tools: { search: false, marker: false, polygon: false }
      }
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
    removeMarker(location, index) {
      // Remove marker when edition mode is on
      if (this.toolbar.editionMode) {
        this.locations.splice(index, 1);
        return;
      }
    },
    removeArea(area) {
      this.area = { latlngs: [], color: "green" };
      const areaPopup = document.getElementsByClassName("leaflet-popup")[0];
      areaPopup.parentNode.removeChild(areaPopup);
    },
    clickOnMap(event) {
      // Add marker when edition mode is on
      if (this.toolbar.editionMode) {
        // Get the search geolocation event through div class
        this.toolbar.search = document
          .getElementsByClassName("geosearch")[0]
          .classList.contains("active");
        if (
          (event.containerPoint.x >= 10 && event.containerPoint.x <= 40) ||
          (event.containerPoint.y >= 10 && event.containerPoint.y <= 40)
        ) {
          this.toolbar.search = true;
          return;
        }
        if (!this.toolbar.search) {
          if (this.toolbar.tools.marker) {
            this.locations.push(event.latlng);
            return;
          }
          if (this.toolbar.tools.polygon) {
            this.area.latlngs.push([event.latlng.lat, event.latlng.lng]);
            return;
          }
        }
      }
    },
    setData() {
      this.locations = DummyLocations;
      // TODO: replace DummyLocations for real external data
      const [minLat, maxLat, minLng, maxLng] = [
        Math.min.apply(Math, DummyLocations.map(x => x.lat)),
        Math.max.apply(Math, DummyLocations.map(x => x.lat)),
        Math.min.apply(Math, DummyLocations.map(x => x.lng)),
        Math.max.apply(Math, DummyLocations.map(x => x.lng))
      ];
      this.center = [(maxLat + minLat) / 2, (maxLng + minLng) / 2];
    },

    toggleEditionMode(tool) {
      for (var t in this.toolbar.tools) {
        if (t == tool) {
          this.toolbar.tools[t] = !this.toolbar.tools[t];
        } else {
          this.toolbar.tools[t] = false;
        }
      }
      this.toolbar.editionMode = Object.values(this.toolbar.tools).some(
        x => x == true
      );
    },

    getLocation(location) {
      return `${location.lat}, ${location.lng}`;
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
@import "@/scss/variables.scss";
.maps {
  height: 90vh;
  width: 95vw;
  position: relative;
  margin: auto;
  padding-bottom: 100px;
  &.edition {
    cursor: pointer;
  }
}
.custom-buttons {
  bottom: 3%;
  left: 3%;

  .custom-button {
    display: block;
    border-radius: 10%;
    background: rgba(255, 255, 255, 0.6);
    height: 3em;
    width: 3em;
    box-shadow: 2px 1px 5px $black;
    &.active {
      color: $primary;
    }
  }
  .custom-button:hover {
    background: rgba(255, 255, 255, 0.9);
  }
}
</style>
