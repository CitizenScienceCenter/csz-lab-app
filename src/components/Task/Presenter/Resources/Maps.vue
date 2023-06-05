<template>
  <div class="maps" :class="{ 'no-movement': static_map }">
    <v-map
      ref="maps"
      :zoom="parseInt(zoom)"
      :center="center"
      @update:zoom="zoomUpdated"
      @update:center="centerUpdated"
      @update:bounds="boundsUpdated"
      :options="{ zoomControl: false, scrollWheelZoom: scrollToZoom }"
      @click="clickOnMap"
    >
      <v-geosearch
        :options="geosearchOptions"
        ref="geosearch"
        v-if="!(hideIcons || hideGeoSearch)"
      ></v-geosearch>
      <v-tile-layer :url="source" :attribution="attribution"></v-tile-layer>
      <v-tile-layer
        url="https://stamen-tiles-{s}.a.ssl.fastly.net/toner-labels/{z}/{x}/{y}{r}.png"
        v-if="mapSettings.mapType === 'Aerial'"
      ></v-tile-layer>
      <v-control-zoom position="bottomright" v-if="!hideIcons"></v-control-zoom>

      <v-feature-group>
        <v-polygon :lat-lngs="area.latlngs" :color="area.color">
          <v-popup>
            <div v-if="toolbar.editionMode && toolbar.tools.polygon">
              <b-button
                variant="outline-danger"
                size="sm"
                @click="removeArea()"
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
            <p v-else>{{ location.info || location.address }}</p>
          </v-popup>
        </v-marker>
      </v-marker-cluster>

      <v-control
        :position="'bottomleft'"
        class="custom-buttons"
        v-if="!(hideIcons || hideInteraction)"
      >
        <button
          class="custom-button mb-1"
          @click="toggleEditionMode('marker')"
          :class="{ active: toolbar.tools.marker }"
          :disabled="!can_mark"
        >
          <i class="fas fa-map-marker-alt fa-2x"></i>
        </button>
        <button
          class="custom-button mb-5 mb-sm-4 mb-md-3"
          @click="toggleEditionMode('polygon')"
          :class="{ active: toolbar.tools.polygon }"
          :disabled="!can_draw"
        >
          <i class="fas fa-draw-polygon fa-2x"></i>
        </button>
      </v-control>

      <v-control v-if="!hideIcons">
        <b-form-select
          v-model="mapSettings.mapType"
          :options="mapTypes"
          size="sm"
          @change="setMapStyle"
        ></b-form-select>
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
import { mapMutations, mapActions } from "vuex";

export default {
  props: {
    can_mark: { type: Boolean, default: false },
    can_draw: { type: Boolean, default: false },
    hideIcons: { type: Boolean, default: false },
    hideGeoSearch: { type: Boolean, default: false },
    hideInteraction: { type: Boolean, default: false },
    scrollToZoom: { type: Boolean, default: true },
    mapSettings: {
      type: Object,
      default: () => ({
        zoom: 3,
        center: [0, 0],
        maxMarkers: 0,
        mapType: "Road",
        static_map: false
      })
    },
    area: {
      type: Object,
      default: () => ({
        latlngs: [],
        color: "blue"
      })
    },
    locations: {
      type: Array,
      default: () => [
        // { info: "Information", lat: 2.44717086234641, lng: -76.605434628869 }, Data model
      ]
    },
    taskLoaded: Boolean
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
      source: "",
      attribution: "",
      zoom: null,
      center: [],
      bounds: null,
      mapTypes: ["Road", "Aerial"],
      static_map: false,
      geosearchOptions: {
        provider: new OpenStreetMapProvider(),
        autoClose: true,
        keepResult: false
      },
      toolbar: {
        editionMode: false,
        search: false,
        tools: { marker: false, polygon: false }
      },
      INITIAL_SETTINGS: {}
    };
  },
  methods: {
    ...mapMutations("notification", ["showInfo"]),
    ...mapActions("osm", ["getAddress"]),
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
    removeArea() {
      this.area.latlngs = [];
      const areaPopup = document.getElementsByClassName("leaflet-popup")[0];
      areaPopup.parentNode.removeChild(areaPopup);
    },
    async clickOnMap(event) {
      // Add marker when edition mode is on
      if (this.toolbar.editionMode) {
        // Get the Search geolocation event through div class
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
            if (
              this.mapSettings.maxMarkers > 0 &&
              this.locations.length == this.mapSettings.maxMarkers
            ) {
              this.showInfo({
                title: "Number of markers",
                content: `Only ${this.mapSettings.maxMarkers} markers max.`
              });
              return;
            }

            this.locations.push({
              ...event.latlng
            });
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
      const aux = this;
      if (this.mapSettings) {
        this.zoom = this.mapSettings.zoom;
        this.center = this.mapSettings.center;
        this.static_map = this.mapSettings.static_map;
      }
      if (this.locations.length > 0) {
        const [minLat, maxLat, minLng, maxLng] = [
          Math.min.apply(
            Math,
            this.locations.map(x => x.lat)
          ),
          Math.max.apply(
            Math,
            this.locations.map(x => x.lat)
          ),
          Math.min.apply(
            Math,
            this.locations.map(x => x.lng)
          ),
          Math.max.apply(
            Math,
            this.locations.map(x => x.lng)
          )
        ];
        this.center = [(maxLat + minLat) / 2, (maxLng + minLng) / 2];
        this.locations.forEach(
          async x => (x["address"] = await aux.getPointInfo(x))
        );
      }
    },

    setMapStyle() {
      if (this.mapSettings.mapType.toLowerCase() === "road") {
        this.source = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
        this.attribution =
          'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
      }
      if (this.mapSettings.mapType.toLowerCase() === "aerial") {
        this.source =
          "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
        this.attribution =
          'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';
      }
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

    async getPointInfo(position) {
      const details = await this.getAddress(position);
      return details.display_name || `${position.lat} - ${position.lng}`;
    }
  },
  computed: {
    computedModel: function() {
      return Object.assign({}, this.mapSettings);
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
    this.setMapStyle();
    this.INITIAL_SETTINGS = JSON.parse(JSON.stringify(this.mapSettings));
  },
  watch: {
    locations() {
      this.locations.forEach(async loc => {
        if (!loc.address) {
          loc["address"] = await this.getPointInfo(loc);
        }
      });
    },
    taskLoaded() {
      // for Task presenter initialization asumes the initial map conditions
      this.zoom = this.INITIAL_SETTINGS.zoom;
      this.center = this.INITIAL_SETTINGS.center;
    },
    computedModel: {
      handler(n, o) {
        if (n.mapType != o.mapType) return;
        this.zoom = this.mapSettings.zoom;
        this.center = this.mapSettings.center;
      },
      deep: true
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/scss/variables.scss";
.maps {
  height: 90vh;
  width: 100%;
  position: relative;
  margin: auto;
  &.no-movement {
    pointer-events: none;
    cursor: none;
    z-index: 0;
  }
}
.custom-buttons {
  bottom: 10%;
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
  .custom-button:disabled {
    background: rgba(255, 255, 255, 0.6);
  }
}
</style>
