<template>
  <b-row>
    <!-- Left section image -->
    <b-col cols="10" md="4" xl="5" class="mt-4 mt-md-0" order="2">
      <section>
        <!-- Twitter image -->
        <figure class="text-center" style="position: sticky; top: 15%">
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
              {{ approxLocationOptions[0].storeValue }}?
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
            <!-- Options : yes, no -->
            <!-- TODO: Check how to implement common editor elements component -->

            <common-editor-elements
              :answers="answers"
              :question="getQuestion(step)"
              :context="context"
            />
          </div>
        </div>

        <!-- ****Step 2***** -->
        <div class="centered" v-if="step === 2">
          <!-- Title -->
          <h1 class="title">
            {{ $t("geolocation.locateExactPositionDesktop") }}
          </h1>
          <!-- Subtitle -->
          <h3 class="subtitle" style="position: relative">
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
            <div
              class="tips"
              :class="{ hidden: !showTips }"
              style="width: 500px"
            >
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
          </h3>
          <!-- Search input for google -->
          <!-- TODO: install google-geocoder -->
          <!-- <div class="control w-100">
            <gmap-autocomplete
              class="input"
              @place_changed="setPlace"
            ></gmap-autocomplete>
          </div> -->

          <!-- TODO: install vue2-google-maps -->
          <!-- <Split class="fill-height-or-more" direction="vertical"> -->
          <b-container fluid>
            <b-row align-v="stretch" cols="1">
              <!-- TODO: set the heights of this full height when second map is hidden, 70/30 when bot visible -->
              <b-col :size="70">
                <!-- Google maps -->
                <!-- <gmap-map
                  ref="gmap1"
                  :zoom="zoom"
                  :center="latLng"
                  style="width: 100%; height: 100%"
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
                </gmap-map> -->
              </b-col>
              <!-- TODO: set the heights of this full height when second map is hidden, 70/30 when bot visible -->
              <b-col :size="30">
                <!-- Google street view when is enabled -->
                <!-- Small map below without streetview capabilities -->
                <!-- <gmap-map
                  v-show="streetViewEnabled"
                  ref="gmap2"
                  :zoom="zoom"
                  :center="latLng"
                  style="width: 100%; height: 100%"
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
                </gmap-map> -->
              </b-col>
            </b-row>
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
            <!-- NOTE: Submit button - will be replaced by ours -->
            <button
              class="button is-secondary"
              :disabled="approxLocation === '' || accuracy === ''"
              @click.prevent="saveMarker"
            >
              {{ $t("geolocation.submitAndNext") }}
            </button>
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
              :disabled="approxLocation === '' || accuracy === ''"
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
                :disabled="step === 4 || approxLocation === ''"
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
      accuracy: "",
      approxLocation: "",
      approxLocationOptions: [],
      // the variables used in template here in the component
      questions: [
        {
          id: 1,
          question: "geolocation.isItLocatedIn",
          answers: [
            { text: "geolocation.yes", value: "yes" },
            { text: "geolocation.no", value: "no" },
            { text: "I can't say", value: "na" }
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
    }
  },

  methods: {
    // clean variables
    initialize() {
      const aux = this;
      this.markerLatLng = null;
      this.searchLatLng = null;
      this.step = 1;
      this.approxLocation = "";
      this.approxLocationOptions = [];
      this.accuracy = "";

      this.questionList = this.questions.filter(q =>
        aux.pybossa.isConditionEmpty(q)
      );
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
        newLat = this.currentTask.info.latitude;
        newLng = this.currentTask.info.longitude;
      }
      return { lat: newLat, lng: newLng };
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
      console.log("Submit button clicked");
      this.$emit("submit", this.answers);
    },

    // Skip button
    async skip() {
      this.initialize();
      await this.loaded();
      this.$emit("skip");
    }
  }
};
</script>

<style></style>
