<template>
  <vl-map
    :load-tiles-while-animating="true"
    :load-tiles-while-interacting="true"
    class="map"
  >
    <vl-view
      :zoom.sync="zoom"
      :center.sync="center"
      :rotation.sync="rotation"
      :min-zoom="minZoom"
    ></vl-view>

    <vl-feature>
      <vl-geom-multi-point :coordinates="locations"></vl-geom-multi-point>
      <vl-style-box>
        <vl-style-icon
          :src="icon"
          :anchor="[0.5, 1]"
          :scale="0.3"
        ></vl-style-icon>
      </vl-style-box>
    </vl-feature>

    <vl-layer-tile id="osm">
      <vl-source-osm></vl-source-osm>
    </vl-layer-tile>
  </vl-map>
</template>

<script>
const DummyLocations = [
  { lat: 7.143336159214287, lng: 46.857687895771015 },
  { lat: -76.60543462886939, lng: 2.4471708623464177 },
  { lat: 8.544738061411797, lng: 47.3937203599115 },
  { lat: -8.550949011575966, lng: 47.3744092665564 }
];
export default {
  data() {
    return {
      zoom: 3,
      minZoom: 3,
      center: [47.3744092665564, 8.550949011575966],
      rotation: 0,
      locations: [],
      icon: require("@/assets/location_pin.png")
    };
  },
  methods: {
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
    this.setData();
  }
};
</script>

<style scoped>
.map {
  height: 75vh;
  width: 75vh;
  position: relative;
  margin: auto;
}
</style>
