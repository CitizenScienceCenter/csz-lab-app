<template>
  <b-row>
    <!-- Left section image -->
    <b-col cols="10" md="4" xl="5" class="mt-4 mt-md-0" order="2">
      <section>
        <!-- Twitter image -->
        <figure class="text-center" style="position: relative">
          <media-presenter
            :context="pybossa"
            :link="tweetImage"
            :loading="!pybossa.taskLoaded"
          />
        </figure>
        <br />
        <!-- Twitter text-->
        <p class="post-text">{{ taskInfo.text }}</p>
        <br />
        <!-- author @handler -@ Mar 11  -->
        <span class="post-author"> {{ taskInfo.author }} &nbsp; </span>
        <span class="post-handle">
          {{ tweetHandle }} - @{{ post_time(taskInfo.created_at) }}
        </span>
        <br />
        <p class="link" style="margin-top: 10px">
          <!-- See original post -->
          <a target="blank" :href="`https://${taskInfo.url}`">
            <b-icon icon="file-earmark" size="is-small"></b-icon>
            {{ $t("geolocation.seeOriginal") }}
          </a>
        </p>
        <!-- Search Google for image -->
        <p class="link">
          <a class="link" target="blank" :href="searchImg">
            <b-icon icon="camera" size="is-small"></b-icon>
            {{ $t("geolocation.googleReverse") }}
          </a>
        </p>
        <!-- Translate on Google -->
        <p class="link">
          <a class="link" target="blank" :href="translate">
            <b-icon icon="globe" size="is-small"></b-icon>
            {{ $t("geolocation.googleTranslate") }}
          </a>
        </p>
        <!-- Component removed, more information required -->
        <!-- <comments linkClass="link" wrapperClass="link"></comments> -->
      </section>
    </b-col>
    <!-- Right section - steps -->
    <b-col cols="11" md="8" xl="7" class="mt-4 mt-md-0">
      <section>
        <!-- **** STEP 1 ***** -->
        <div class="centered" v-if="step < 2">
          <div>
            <!-- Question  -->
            <h1
              class="title"
              style="font-size: 24px; margin: 0; max-width: 425px"
              v-if="approxLocationOptions.length"
            >
              {{ step }} - {{ getQuestion(step, "question") }}
              {{ approxLocationOptions[0].value }}?
            </h1>
            <!-- Check the image's comments to validate it -->
            <h2
              class="subtitle"
              style="margin-top: 12px; font-size: 16px; position: relative"
            >
              {{ $t("geolocation.checkOriginalImage") }}.
              <span
                class="is-clickable"
                style="color: #2f67df"
                @click="showTips = true"
              >
                <b-icon icon="question-circle"></b-icon>
                {{ $t("geolocation.tips") }}
              </span>
              <!-- Tips for this step -->
              <div class="tips" v-show="showTips">
                <h3>{{ $t("geolocation.tipsHeadline") }}</h3>
                <p>{{ $t("geolocation.readTheFullPost") }}</p>
                <p>{{ $t("geolocation.useGoogleImages") }}</p>
                <button
                  class="button is-secondary"
                  style="align-self: flex-end"
                  @click="showTips = false"
                >
                  {{ $t("geolocation.gotIt") }}
                </button>
              </div>
            </h2>

            <common-editor-elements
              :answers="answers"
              :question="getQuestion(step)"
              :context="context"
            />
          </div>
        </div>

        <!-- ****Step 2***** -->
        <div class="centered" v-show="step === 2">
          <!-- Title -->
          <label class="title">
            {{ $t("geolocation.locateExactPositionDesktop") }}
          </label>
          <!-- Subtitle -->
          <h6 class="subtitle" style="position: relative">
            {{ $t("geolocation.useSearchbox") }}
            <span
              class="is-clickable"
              style="color: #2f67df"
              @click="showTips = true"
            >
              <b-icon icon="question-circle"></b-icon>
              {{ $t("geolocation.tips") }}
            </span>
            <!-- Tips in pop up window -->
            <div class="tips" v-show="showTips" style="width: 500px">
              <h3>{{ $t("geolocation.tipsHeadline") }}</h3>
              <p>
                {{ $t("geolocation.streetview1Desktop") }}
                <b-icon icon="account"></b-icon>
                {{ $t("geolocation.streetview2Desktop") }}
              </p>
              <p>{{ $t("geolocation.streetview3Desktop") }}</p>
              <p>
                {{ $t("geolocation.streetview4Desktop") }}
                <b-icon icon="fullscreen"></b-icon>
              </p>
              <p>{{ $t("geolocation.streetview5Desktop") }}</p>
              <p>{{ $t("geolocation.streetview6Desktop") }}</p>
              <p>{{ $t("geolocation.streetview7Desktop") }}</p>
              <ul>
                <li>{{ $t("geolocation.streetHigh") }}</li>
                <li>{{ $t("geolocation.streetMedium") }}</li>
                <li>{{ $t("geolocation.streetLow") }}</li>
              </ul>
              <button
                class="button is-secondary"
                style="align-self: flex-end"
                @click="showTips = false"
              >
                {{ $t("geolocation.gotIt") }}
              </button>
            </div>
          </h6>

          <!-- Search input for google -->
          <div class="control w-100 pb-3">
            <gmap-autocomplete
              class="input"
              @place_changed="setPlace"
            ></gmap-autocomplete>
          </div>
          <!-- Google Maps component -->
          <b-container
            fluid
            class="pb-0 px-0 principal-container"
            :class="{ 'street-view': streetViewEnabled }"
          >
            <!-- Google maps -->
            <gmap-map
              ref="gmap1"
              :zoom="zoom"
              :center="latLng"
              class="maps-container"
              @zoom_changed="zoomChanged"
            >
              <gmap-marker
                ref="marker1"
                @dragend="getMarkerPosition($event.latLng)"
                :position="latLng"
                :clickable="step === 2"
                :draggable="step === 2"
              ></gmap-marker>
              <gmap-polyline
                v-if="path.length > 0"
                v-bind:path.sync="path"
                v-bind:options="{ strokeColor: '#900000' }"
              ></gmap-polyline>
              <gmap-polygon
                v-if="polygon.length > 0"
                :paths="polygon"
                v-bind:options="{
                  strokeColor: '#FF0000',
                  fillColor: '#900000'
                }"
              ></gmap-polygon>
            </gmap-map>
          </b-container>
          <!-- Google street view when is enabled -->
          <b-container
            fluid
            class="pb-0 px-0 secondary-container "
            :class="{ 'street-view': streetViewEnabled }"
          >
            <!-- Small map below without streetview capabilities -->
            <gmap-map
              v-show="streetViewEnabled"
              ref="gmap2"
              :zoom="zoom"
              :center="latLng"
              class="maps-container"
              @zoom_changed="zoomChanged"
              :options="{ streetViewControl: false }"
            >
              <gmap-marker
                ref="marker2"
                @dragend="getMarkerPosition($event.latLng)"
                :position="latLng"
                :clickable="step === 2"
                :draggable="step === 2"
              ></gmap-marker>
              <gmap-polyline
                v-if="path.length > 0"
                v-bind:path.sync="path"
                v-bind:options="{ strokeColor: '#900000' }"
              ></gmap-polyline>
              <gmap-polygon
                v-if="polygon.length > 0"
                :paths="polygon"
                v-bind:options="{
                  strokeColor: '#FF0000',
                  fillColor: '#900000'
                }"
              ></gmap-polygon>
            </gmap-map>
          </b-container>
        </div>

        <!-- ***Step 3*** -->
        <div class="centered" v-if="step === 3">
          <div class="steps" style="max-width: 500px">
            <h1
              class="title"
              style="font-size: 24px; margin: 0"
              v-if="approxLocationOptions.length"
            >
              {{ step }} - {{ getQuestion(step, "question") }}
            </h1>

            <!-- TODO: Check how to implement common editor elements component -->
            <common-editor-elements
              :answers="answers"
              :question="getQuestion(step)"
              :context="context"
            />
          </div>
        </div>

        <!-- ***Step 4*** -->
        <div class="centered" v-if="step === 4">
          <div
            class="steps"
            style="display: flex; flex-direction: column; align-items: center"
          >
            <!-- <img src="@/assets/img/completed.svg" style="padding-left: 20px" /> -->
            <h1
              class="title"
              style="font-size: 24px; margin-top: 15px; margin-bottom: 15px"
              v-if="approxLocationOptions.length"
            >
              {{ $t("geolocation.taskCompleted") }}
            </h1>
          </div>
        </div>

        <!-- Skip button and navigation -->
        <div class="bottom">
          <div class="level">
            <!-- Submit button -->
            <b-btn
              @click="submit"
              variant="success"
              class="mt-3"
              :disabled="!approxLocation || !accuracy"
              v-if="step === 4"
            >
              {{ $t("submit-btn") }}
            </b-btn>

            <!-- Skip button -->
            <b-btn @click="skip" variant="secondary" class="mt-3"
              >{{ $t("skip-btn") }}
            </b-btn>

            <!-- Navigation buttons -->
            <div class="level-item">
              <div>
                {{ $t("geolocation.steps", { start: step, end: 4 }) }}
              </div>
            </div>

            <div class="level-item">
              <button
                class="button is-secondary"
                :disabled="step === 1"
                style="margin-right: 5px"
                @click="decStep"
              >
                <b-icon icon="arrow-left"></b-icon>
              </button>
              <button
                class="button is-secondary"
                :disabled="step === 4 || !approxLocation"
                @click="incStep"
              >
                <b-icon icon="arrow-right"></b-icon>
              </button>
            </div>
          </div>
        </div>
      </section>
    </b-col>
  </b-row>
</template>

<script>
import { i18n } from "@/i18n";
import moment from "moment";
import MediaPresenter from "./MediaPresenter";
import CommonEditorElements from "@/components/Common/CommonEditorElements";

const ZOOMMIN = 3;
const ZOOMMAX = 14;
export default {
  name: "GeoTwitter",
  components: {
    MediaPresenter,
    CommonEditorElements
  },
  data: () => {
    return {
      showTips: false,
      step: 1,
      searchLatLng: null,
      streetViewEnabled: false,
      markerLatLng: null,
      zoom: ZOOMMIN,
      path: [],
      polygon: [],
      approxLocationOptions: [],
      // the variables used in template here in the component
      questions: [
        {
          id: 1,
          question: "geolocation.isItLocatedIn",
          answers: [
            // { text: "geolocation.yes", value: "yes" },
            // { text: "geolocation.no", value: "no" },
            // { text: "I can't say", value: "na" }
          ],
          type: "one_choice",
          required: true,
          isDependent: false,
          condition: {}
        },
        {
          id: 2,
          question: "geolocation.locateExactPositionDesktop",
          answers: [],
          type: null,
          required: true,
          isDependent: false,
          condition: {}
        },
        {
          id: 3,
          question: "geolocation.greatPleaseMeasure",
          answers: [
            { text: "geolocation.high", value: "high" },
            { text: "geolocation.medium", value: "medium" },
            { text: "geolocation.low", value: "low" }
          ],
          type: "one_choice",
          required: true,
          isDependent: false,
          condition: {}
        }
      ],
      questionList: [],
      answers: []
    };
  },
  props: {
    taskInfo: { type: Object, required: true },
    pybossa: { type: Object, required: true }
  },
  created() {
    this.initialize();
  },
  computed: {
    context() {
      return this;
    },
    accuracy() {
      return this.answers[2].value;
    },
    approxLocation() {
      return this.answers[0].value;
    },
    latLng() {
      // The result of searching with google input autocomplete
      if (this.searchLatLng != null) {
        return this.searchLatLng;
      }
      // Consider the center coming from task info
      if (this.taskInfo) {
        let locationEncoded = this.taskInfo.tags.filter(
          x => x.name === "CIME_geolocation_centre"
        );
        return this.getLatLng(locationEncoded);
      }
    },
    tweetHandle() {
      if (this.taskInfo.hasOwnProperty("author_screen_name")) {
        return this.taskInfo.author_screen_name;
      } else if (this.taskInfo.hasOwnProperty("url")) {
        let regex = /^(http)?s?(:\/\/)?(www\.)?twitter\.com\/(#!\/)?([^\/]+)(\/\w+)*$/g;
        let match = regex.exec(this.taskInfo.url);
        if (match !== null && typeof match[5] != "undefined") {
          return "@" + match[5];
        }
      }
      return "";
    },
    tweetImage() {
      const url = this.taskInfo.media[0] || null;
      if (url) return url.replace(/^http:\/\//i, "https://");
      return null;
    },

    searchImg() {
      return `https://www.google.com/searchbyimage?image_url=${this.tweetImage}`;
    },
    translate() {
      return `https://translate.google.com/#auto/${i18n.locale}/${this.taskInfo.text}`;
    }
  },

  methods: {
    // clean variables
    async initialize() {
      this.step = 1;
      this.markerLatLng = null;
      this.searchLatLng = null;
      this.approxLocationOptions = [];
      this.answers = this.questions.map(function(x) {
        const answer = { qid: x.id, question: x.question, value: null };
        if (x.type === "multiple_choice") {
          answer.value = [];
        }
        return answer;
      });
      await this.loaded();
    },

    getQuestion(id, param) {
      const q = this.questions.find(q => q.id === id);
      return q ? (param ? q[param] : q) : {};
    },
    // return formatted date
    post_time(val) {
      return moment(new Date(val)).format("MMM D");
    },

    // Navigation buttons
    incStep() {
      if (this.step < 5) {
        this.step++;
      }
    },
    decStep() {
      if (this.step > 1) {
        this.step--;
      }
    },

    // Submit button
    submit() {
      // Attach the marker location to the answers
      if (this.markerLatLng != null) {
        this.answers[1].value = this.markerLatLng;
      } else {
        this.answers[1].value = this.latLng;
      }
      this.$emit("submit", {
        answers: this.answers,
        questions: this.questions
      });
      this.initialize();
    },

    // Skip button
    skip() {
      this.$emit("skip");
      this.initialize();
    },

    //***  Google maps section */
    // main function to load the map
    async loaded() {
      // polygon
      if (
        typeof this.taskInfo !== "undefined" &&
        typeof this.taskInfo.tags !== "undefined" &&
        this.taskInfo.tags.length > 0
      ) {
        this.getBounds();

        const _self = this;
        if (_self.path.length + _self.polygon.length === 0) {
          _self.zoom = ZOOMMAX;
        }
      }
      await this.getAllApproxLocationOptions();
      //this.isLoading = false; // TODO: check if this is needed
    },

    // get location options from the task based on lat lng
    async getAllApproxLocationOptions() {
      let locations = [];

      // search for CIME_geolocation_string places
      if (
        typeof this.taskInfo !== "undefined" &&
        typeof this.taskInfo.tags !== "undefined"
      ) {
        const tag = this.taskInfo.tags.find(
          x => x.name === "CIME_geolocation_string"
        );
        // Get location from address
        if (!!tag) {
          if (tag.value === "") {
            locations.push(await this.fixNoCIME());
          } else {
            let locationEncoded =
              tag.value || `'["${await this.fixNoCIME()}"]'`;
            let locationParsed = await this.fixNoCIME();
            try {
              // locationParsed = JSON.parse(locationEncoded);
              locationParsed = locationEncoded;
            } catch (err) {
              locationParsed = JSON.parse(locationEncoded.replace(/\\/g, ""));
            }
            if (locationParsed !== "Pin is correct") {
              locations = locationParsed;
            }
          }
        }
      }

      // use info.place as fallback if no CIME_geolocation_string
      if (locations.length < 1) {
        if (this.taskInfo.place) {
          if (this.taskInfo.place === "") {
            locations.push(await this.fixNoCIME());
          } else {
            locations.push(this.taskInfo.place) || (await this.fixNoCIME());
          }
        } else {
          locations.push(await this.fixNoCIME());
        }
      }

      // create Approx Location Options
      let i, location;
      this.approxLocationOptions = [];
      for ([i, location] of locations.entries()) {
        this.approxLocationOptions.push({
          value: locations[i],
          text: locations[i]
        });
      }
      this.approxLocationOptions.push({
        value: "Another location",
        text: "Another location"
      });
      if (this.approxLocationOptions.length === 2) {
        this.approxLocationOptions[0].text = this.$t("geolocation.yes");
        this.approxLocationOptions[1].text = this.$t("geolocation.no");
      }
    },
    // get the value of a tag
    async getBounds() {
      const tag = this.taskInfo.tags.find(
        x => x.name === "CIME_geolocation_geojson"
      );
      // Get the map polygon based on this tag name
      if (!!tag) {
        this.path = [];
        this.polygon = [];
        let polygonEncoded = tag.value || '["unkown"]';
        let polygons = JSON.parse(polygonEncoded) || "unknown";
        // let firstPolygon = JSON.parse(polygons[0]) || "unknown";
        let firstPolygon = polygons || "unknown";
        if (firstPolygon !== "unknown") {
          if (firstPolygon.type === "Point") {
            this.path.push(firstPolygon.coordinates);
          } else if (firstPolygon.type === "LineString") {
            this.path = firstPolygon.coordinates.map(([lng, lat]) => ({
              lat,
              lng
            }));
          } else if (firstPolygon.type === "Polygon") {
            this.polygon = firstPolygon.coordinates.map(linearRing =>
              linearRing.map(([lng, lat]) => ({
                lat,
                lng
              }))
            );
          }
        }
      }
    },

    // get reverse geocoding from latlng center
    async fixNoCIME() {
      let address = await this.getReverseGeo(
        this.taskInfo.tags.filter(x => x.name === "CIME_geolocation_centre")
      );
      if (address.hasOwnProperty("village")) {
        return address.village;
      } else if (address.hasOwnProperty("state")) {
        return address.state;
      } else {
        return "Pin is correct";
      }
    },

    async getReverseGeo(coordinates) {
      if (coordinates.length) {
        let tmp = [];
        try {
          // tmp = JSON.parse(coordinates[0].value);
          tmp = coordinates[0].value;
        } catch (err) {
          tmp = JSON.parse(coordinates[0].value.replace(/\\/g, ""));
          tmp[0][0] = parseFloat(tmp[0][0].replace(",", "."));
          tmp[0][1] = parseFloat(tmp[0][1].replace(",", "."));
        }
        if (tmp.length) {
          let lat = tmp[0][0];
          let lng = tmp[0][1];
          let url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;
          let data_aux = await fetch(url);
          const data = await data_aux.json();
          if (data.hasOwnProperty("address")) {
            return data.address;
          }
        }
      }
    },

    // Get the clean lat lng in correct format
    getLatLng(locationEncoded) {
      let newLat;
      let newLng;
      if (locationEncoded.length === 1) {
        locationEncoded = locationEncoded[0].value;
        try {
          // let location = JSON.parse(locationEncoded);
          let location = locationEncoded;
          newLat = location[0][0];
          newLng = location[0][1];
        } catch (err) {
          newLat = 0;
          newLng = 0;
          let location = JSON.parse(locationEncoded.replace(/\\/g, ""));
          newLat = parseFloat(location[0][0].replace(",", "."));
          newLng = parseFloat(location[0][1].replace(",", "."));
          console.warn(
            "ERROR: JSON parse of location failed for task",
            this.currentTask.id
          );
          console.warn(err.message);
        }
      } else {
        newLat = this.taskInfo.latitude;
        newLng = this.taskInfo.longitude;
      }
      return { lat: newLat, lng: newLng };
    },

    // Get coordinates from google search
    setPlace(place) {
      if (place != null) {
        this.markerLatLng = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        };
        this.searchLatLng = place.geometry.location;
      }
    },

    // Get the marker position when is dragged by user
    getMarkerPosition(latlng) {
      this.markerLatLng = { lat: latlng.lat(), lng: latlng.lng() };
      this.$refs.marker1.$markerObject.setPosition(this.markerLatLng);
      this.$refs.marker2.$markerObject.setPosition(this.markerLatLng);
    },

    // Control zoom limits
    zoomChanged(level) {
      if (level < ZOOMMIN) {
        this.zoom = ZOOMMIN;
      }
      // info: use ZOOMMAX + 1 because we cannot set for unknown reasons same Zoom level twice (as on init) :/
      if (level > ZOOMMAX + 1) {
        this.zoom = ZOOMMAX + 1;
      }
    }
  },
  watch: {
    approxLocationOptions: {
      handler() {
        this.questions[0].answers = this.approxLocationOptions;
      },
      deep: true
    },
    step(newVal) {
      // When step of maps is active
      if (newVal === 2) {
        // fit google maps to bounds
        let bounds = new google.maps.LatLngBounds();
        for (let point of this.path) {
          bounds.extend(new google.maps.LatLng(point.lat, point.lng));
        }
        for (let polygon of this.polygon) {
          for (let point of polygon) {
            bounds.extend(new google.maps.LatLng(point.lat, point.lng));
          }
        }
        if (this.markerLatLng != null) {
          bounds.extend(
            new google.maps.LatLng(this.markerLatLng.lat, this.markerLatLng.lng)
          );
        } else {
          bounds.extend(
            new google.maps.LatLng(this.latLng["lat"], this.latLng["lng"])
          );
        }
        // Activate street view and marker position when street view is enabled
        if (typeof this.$refs.gmap1 !== "undefined") {
          const self = this;
          self.$refs.gmap1.$mapPromise.then(map => {
            let pn = map.getStreetView();
            map.fitBounds(bounds);

            pn.addListener("position_changed", function() {
              let streetvpos = pn.getPosition();
              self.getMarkerPosition(streetvpos);
            });

            pn.addListener("visible_changed", function() {
              self.streetViewEnabled = pn.getVisible();
            });
          });
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.maps-container {
  height: 100%;
  width: 100%;
}
.principal-container {
  height: 60vh;
  transition: height 0.5s linear;
  &.street-view {
    height: 40vh;
  }
}
.secondary-container {
  height: 0vh;
  transition: all 0.5s linear;
  &.street-view {
    height: 20vh;
  }
}
</style>
