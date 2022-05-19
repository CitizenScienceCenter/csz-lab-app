<template>
  <b-row>
    <!-- Right section image -->
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
        <div class="text-center interactive-section pt-5" v-if="loading">
          <b-spinner
            variant="primary"
            style="width: 3rem; height: 3rem;"
            label="Large Spinner"
          ></b-spinner>
        </div>
        <div v-else>
          <!-- Twitter text-->
          <p class="post-text" v-html="tweetText" />
          <!-- author @handler -@ Mar 11  -->
          <!-- TODO: This information is not included into dataset -->
          <!-- <span class="post-author"> {{ taskInfo.author }} &nbsp; </span>
        <span class="post-handle">
          {{ tweetHandle }} - @{{ post_time(taskInfo.created_at) }}
        </span> -->
          <p class="link mt-3">
            <!-- See original post -->
            <a target="blank" :href="`https://${tweetUrl}`">
              <i class="fab fa-twitter"></i>
              {{ $t("geolocation.seeOriginal") }}
            </a>
          </p>
          <!-- Search Google for image -->
          <p class="link">
            <a class="link" target="blank" :href="searchImg">
              <i class="fas fa-image"></i>
              {{ $t("geolocation.googleReverse") }}
            </a>
          </p>
          <!-- Translate on Google -->
          <p class="link">
            <a class="link" target="blank" :href="translate">
              <i class="fas fa-language"></i>
              {{ $t("geolocation.googleTranslate") }}
            </a>
          </p>
        </div>
        <!-- Component removed, more information required -->
        <!-- <comments linkClass="link" wrapperClass="link"></comments> -->
      </section>
    </b-col>
    <!-- Left section - steps -->
    <b-col cols="11" md="8" xl="7" class="mt-4 mt-md-0">
      <section>
        <div class="text-center interactive-section pt-5" v-if="loading">
          <b-spinner
            variant="primary"
            style="width: 3rem; height: 3rem;"
            label="Large Spinner"
          ></b-spinner>
          <h5>{{ $t("geolocation.loading_task") }}</h5>
        </div>
        <!-- **** STEP 1 ***** -->
        <div class="interactive-section" v-if="step < 2 && !loading">
          <div>
            <!-- Question  -->
            <!-- FIXME: If More than one option available show a generic question -->
            <label class="title">
              {{ step }} - {{ $t(getQuestion(step, "question")) }}
            </label>
            <!-- Check the image's comments to validate it -->
            <h2 style="margin-top: 12px; font-size: 16px; position: relative">
              {{ $t("geolocation.checkOriginalImage") }}
              <a class="is-clickable" v-b-modal.modal_tips1>
                <i class="fas fa-question-circle"></i>
                {{ $t("geolocation.tips") }}
              </a>
              <!-- Tips for this step -->
              <b-modal
                id="modal_tips1"
                hide-footer
                ok-only
                scrollable
                :title="$t('geolocation.tipsHeadline')"
              >
                <p>{{ $t("geolocation.readTheFullPost") }}</p>
                <p>{{ $t("geolocation.useGoogleImages") }}</p>
                <p>{{ $t("geolocation.useGoogleTranslate") }}</p>
              </b-modal>
            </h2>

            <common-editor-elements
              v-if="locationOptions.length"
              :answers="answers"
              :question="getQuestion(step)"
              :context="context"
            />
            <gmap-autocomplete
              :value="locationPre"
              @place_changed="otherPlace"
            ></gmap-autocomplete>
          </div>
        </div>

        <!-- ****Step 2***** -->
        <div class="interactive-section" v-show="step === 2 && !loading">
          <!-- Title -->
          <label class="title">
            {{ step }} - {{ $t(getQuestion(step, "question")) }}
          </label>
          <!-- Subtitle -->
          <h2 style="margin-top: 12px; font-size: 16px; position: relative">
            {{ $t("geolocation.useSearchbox") }}
            <a class="is-clickable" v-b-modal.modal_tips2>
              <i class="fas fa-question-circle"></i>
              {{ $t("geolocation.tips") }}
            </a>
            <!-- Tips in pop up window -->
            <b-modal
              id="modal_tips2"
              hide-footer
              ok-only
              scrollable
              :title="$t('geolocation.tipsHeadline')"
              style="width: 500px"
            >
              <p>
                {{ $t("geolocation.streetview1Desktop") }}
                <i class="fas fa-street-view"></i>
                {{ $t("geolocation.streetview2Desktop") }}
              </p>
              <p>{{ $t("geolocation.streetview3Desktop") }}</p>
              <p>
                {{ $t("geolocation.streetview4Desktop") }}
                <i class="fas fa-expand"></i>
              </p>
              <p>{{ $t("geolocation.streetview5Desktop") }}</p>
              <p>{{ $t("geolocation.streetview6Desktop") }}</p>
              <p>{{ $t("geolocation.streetview7Desktop") }}</p>
              <ul
                style="list-style-type: disc;margin-left:30px;margin-top:20px;"
              >
                <li>{{ $t("geolocation.streetHigh") }}</li>
                <li>{{ $t("geolocation.streetMedium") }}</li>
                <li>{{ $t("geolocation.streetLow") }}</li>
              </ul>
            </b-modal>
          </h2>

          <!-- Search input for google -->
          <div class="control w-100 pb-3">
            <gmap-autocomplete @place_changed="setPlace"></gmap-autocomplete>
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
              />
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
              />
            </gmap-map>
          </b-container>
        </div>

        <!-- ***Step 3*** -->
        <div class="interactive-section" v-if="step === 3 && !loading">
          <div class="steps" style="max-width: 500px">
            <label class="title">
              {{ step }} - {{ $t(getQuestion(step, "question")) }}
            </label>
            <common-editor-elements
              :answers="answers"
              :question="getQuestion(step)"
              :context="context"
            />
          </div>
        </div>

        <!-- ***Step 4*** -->
        <div class="interactive-section" v-if="step === 4 && !loading">
          <div
            class="steps"
            style="display: flex; flex-direction: column; align-items: center"
          >
            <img src="@/assets/img/completed.svg" />
            <h2
              class="title"
              style="font-size: 24px; margin-top: 15px; margin-bottom: 15px"
            >
              {{ $t("geolocation.finalMsg") }}
            </h2>
          </div>
        </div>

        <!-- Skip button and navigation -->
        <div class="bottom">
          <b-row align-h="center" class="py-2">
            <!-- Navigation buttons -->
            <b-col cols="12" class="text-center">
              {{ $t("geolocation.steps", { start: step, end: 4 }) }}
            </b-col>
            <b-button-group class="pt-2">
              <!-- back button -->
              <b-button
                variant="primary"
                size="sm"
                :disabled="step === 1"
                @click="decStep"
              >
                <b-icon icon="arrow-left"></b-icon>
              </b-button>
              <!-- Submit button -->
              <b-btn
                @click="submit"
                variant="success"
                :disabled="!approxLocation"
                v-if="step === 4"
              >
                {{ $t("submit-btn") }}
              </b-btn>

              <!-- Skip button -->
              <b-btn @click="skip" variant="secondary"
                >{{ $t("skip-btn") }}
              </b-btn>
              <!-- next button -->
              <b-button
                variant="primary"
                :disabled="
                  step === 4 || !approxLocation || (!accuracy && step === 3)
                "
                @click="incStep"
              >
                <b-icon icon="arrow-right"></b-icon>
              </b-button>
            </b-button-group>
          </b-row>
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
// Set the column names important for geolocation in dataset
const GEO_COLUMNS = [
  { geoString: "locations", geoLat: "loc_lat", geoLng: "loc_lon" },
  { geoString: "facility", geoLat: "fac_lat", geoLng: "fac_lon" },
  { geoString: "gpe", geoLat: "gpe_lat", geoLng: "gpe_lon" }
];
const OTHER_LOCATION = {
  value: "other",
  text: "Another location",
  coordinates: [0, 0]
};

export default {
  name: "GeoTwitter",
  components: {
    MediaPresenter,
    CommonEditorElements
  },
  data: () => {
    return {
      step: 1,
      selectedLocation: {},
      locationPre: null,
      searchLatLng: null,
      streetViewEnabled: false,
      markerLatLng: null,
      zoom: ZOOMMIN,
      locationOptions: [],
      loading: false,
      // the variables used in template here in the component
      questions: [
        {
          id: 1,
          question: "geolocation.imgLocation",
          answers: [],
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
      // Set the location selected in first step or the default location
      if (this.taskInfo) {
        const coordinates = this.selectedLocation.coordinates || [0, 0];
        return this.getLatLng(coordinates);
      }
    },
    // tweetHandle() {
    //   if (this.taskInfo.hasOwnProperty("author_screen_name")) {
    //     return this.taskInfo.author_screen_name;
    //   } else if (this.taskInfo.hasOwnProperty("url")) {
    //     let regex = /^(http)?s?(:\/\/)?(www\.)?twitter\.com\/(#!\/)?([^\/]+)(\/\w+)*$/g;
    //     let match = regex.exec(this.taskInfo.url);
    //     if (match !== null && typeof match[5] != "undefined") {
    //       return "@" + match[5];
    //     }
    //   }
    //   return "";
    // },
    tweetImage() {
      const url_img = this.taskInfo.media_url || null;
      if (url_img) return url_img.replace(/^http:\/\//i, "https://");
      return null;
    },

    tweetUrl() {
      const tweetId = this.taskInfo.tweet_id.split("id:")[1]
        ? this.taskInfo.tweet_id.split("id:")[1]
        : "undefined";
      return this.taskInfo.url || `twitter.com/web/status/${tweetId}`;
    },

    tweetText() {
      var urlRegex = /(https?:\/\/[^\s]+)/g;
      return this.taskInfo.full_text.replace(urlRegex, function(url) {
        return `<a href="${url}" target="_blank">${url}</a>`;
      });
    },

    searchImg() {
      return `https://www.google.com/searchbyimage?image_url=${this.tweetImage}`;
    },
    translate() {
      return `https://translate.google.com/#auto/${i18n.locale}/${this.taskInfo.full_text}`;
    },

    locationName() {
      return this.locationOptions.length ? this.locationOptions[0].value : null;
    }
  },

  methods: {
    // clean variables
    initialize() {
      this.step = 1;
      this.markerLatLng = null;
      this.searchLatLng = null;
      this.streetViewEnabled = false;
      this.selectedLocation = {};
      this.locationOptions = [];
      this.answers = this.questions.map(function(x) {
        const answer = { qid: x.id, question: x.question, value: null };
        if (x.type === "multiple_choice") {
          answer.value = [];
        }
        return answer;
      });
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
    async submit() {
      // assign the selected location in step 1 to answer one, when is "other"
      if (this.answers[0].value === OTHER_LOCATION.value) {
        this.answers[0].value = this.selectedLocation.value;
      }
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
      this.loading = true;
    },

    // Skip button
    async skip() {
      this.$emit("skip");
      this.loading = true;
    },

    //***  Google maps section */

    // get location options from the task based on lat lng
    async getAllApproxLocationOptions() {
      let locations = [];
      this.locationOptions = [];
      // searching for places
      if (this.taskInfo) {
        // iterate the columns with geolocation data
        for (const col of GEO_COLUMNS) {
          const currentLocation = this.taskInfo[col.geoString];
          const currentLat = this.taskInfo[col.geoLat];
          const currentLng = this.taskInfo[col.geoLng];
          if (
            currentLocation &&
            currentLocation !== "" &&
            currentLocation !== "N_A"
          ) {
            // push the location comming from dataset directly
            locations.push({
              name: currentLocation,
              coordinates: [currentLat, currentLng]
            });
          } else if (
            currentLat &&
            currentLng &&
            !isNaN(currentLat) &&
            !isNaN(currentLng)
          ) {
            // reverse the coordinates coming from dataset
            locations.push({
              name: `"${await this.getAddress(currentLat, currentLng)}"`,
              coordinates: [currentLat, currentLng]
            });
          }
        }
      }
      if (locations.length === 0) {
        this.loading = false;
        return;
      }
      for (const location of locations) {
        if (this.locationOptions.some(x => x.value === location.name)) {
          continue;
        }
        this.locationOptions.unshift({
          coordinates: location.coordinates,
          value: location.name,
          text: location.name
        });
      }
      if (!this.locationOptions.some(x => x.value === OTHER_LOCATION.value)) {
        this.locationOptions.push(OTHER_LOCATION);
      }
      this.loading = false;
    },

    // Get coordinates from Google search field for the first step
    otherPlace(place) {
      if (place != null) {
        this.selectedLocation = {
          coordinates: [
            place.geometry.location.lat(),
            place.geometry.location.lng()
          ],
          value: place.name,
          text: place.formatted_address
        };
        this.locationPre = place.formatted_address;
        // keep the answer[0] as other until user submit
        this.answers[0].value = OTHER_LOCATION.value;
      }
    },

    // get reverse geocoding from latlng center
    async getAddress(lat = 0, lng = 0) {
      let address = await this.getReverseGeo(lat, lng);
      if (address.hasOwnProperty("village")) {
        return address.village;
      } else if (address.hasOwnProperty("state")) {
        return address.state;
      } else {
        return "Pin is correct";
      }
    },

    // get reverse geocoding from latlng
    async getReverseGeo(lat, lng) {
      if (!isNaN(lat) && !isNaN(lng)) {
        let url_reverse = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;
        let data_aux = await fetch(url_reverse);
        const data = await data_aux.json();
        if (data.hasOwnProperty("address")) {
          return data.address;
        }
      }
    },

    // Get the clean lat lng in correct format
    getLatLng(locationEncoded) {
      let newLat = 0;
      let newLng = 0;
      if (locationEncoded.length) {
        try {
          // let location = JSON.parse(locationEncoded);
          let location = locationEncoded;
          newLat = location[0];
          newLng = location[1];
        } catch (err) {
          let location = JSON.parse(locationEncoded.replace(/\\/g, ""));
          newLat = location[0].replace(",", ".");
          newLng = location[1].replace(",", ".");
          console.warn(
            "ERROR: JSON parse of location failed for task",
            this.currentTask.id
          );
          console.warn(err.message);
        }
      }
      return { lat: parseFloat(newLat), lng: parseFloat(newLng) };
    },

    // Get coordinates from Google search field
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
    taskInfo: {
      handler() {
        this.loading = true;
        this.initialize();
        this.getAllApproxLocationOptions();
      },
      deep: true,
      immediate: true
    },
    locationOptions: {
      handler() {
        this.questions[0].answers = this.locationOptions;
      },
      deep: true
    },
    answers: {
      handler(newValue, oldValue) {
        if (
          this.answers[0].value &&
          this.answers[0].value != OTHER_LOCATION.value
        ) {
          this.selectedLocation = this.locationOptions.length
            ? this.locationOptions.find(x => x.value === this.answers[0].value)
            : {};
        }
      },
      deep: true
    },
    step(newVal) {
      if (newVal === 1) {
        this.locationPre =
          this.answers[0].value === OTHER_LOCATION.value
            ? this.selectedLocation.text
            : null;
      }
      // When step of maps is active
      if (newVal === 2) {
        // fit Google maps to bounds
        let bounds = new google.maps.LatLngBounds();
        if (this.markerLatLng != null) {
          bounds.extend(
            new google.maps.LatLng(this.markerLatLng.lat, this.markerLatLng.lng)
          );
        } else {
          bounds.extend(
            new google.maps.LatLng(this.latLng["lat"], this.latLng["lng"])
          );
        }

        this.zoom = ZOOMMIN;
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
.interactive-section {
  min-height: 25vh;
}
.maps-container {
  height: 100%;
  width: 100%;
}
.principal-container {
  height: 55vh;
  transition: height 0.5s linear;
  &.street-view {
    height: 35vh;
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
