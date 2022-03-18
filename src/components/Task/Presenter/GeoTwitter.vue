<template>
  <b-row>
    <!-- Left section image -->
    <b-col cols="10" md="4" xl="5" class="mt-4 mt-md-0">
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
          {{ tweetHandle }} - @{{ post_time(taskInfo.date_created) }}
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
        <div class="centered" v-show="step < 2">
          <div>
            <!-- Question  -->
            <h1
              class="title"
              style="font-size: 24px; margin: 0; max-width: 425px"
              v-if="approxLocationOptions.length"
            >
              {{ step }} - {{ $t("geolocation.isItLocatedIn") }}
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
              <div class="tips" :class="{ hidden: !showTips }">
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
            <!-- <label>
              {{ question.question }}
              <span
                v-if="question.required"
                class="text-primary font-weight-bold h5"
              >
                *
              </span>
            </label>
            <common-editor-elements
              :answers="answers"
              :question="question"
              :context="context"
            /> -->
            <options
              ref="optionsApprox"
              key="approxLocation"
              :options="approxLocationOptions"
              :storeValue.sync="approxLocation"
              :active="true"
            ></options>
          </div>
        </div>

        <!-- ****Step 2***** -->
        <div class="centered" v-show="step === 2">
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
        </div>
        <!-- Search input for google -->
        <!-- TODO: install google-geocoder -->
        <div class="control">
          <gmap-autocomplete
            class="input"
            @place_changed="setPlace"
          ></gmap-autocomplete>
        </div>

        <!-- TODO: install vue2-google-maps -->
        <!-- <Split class="fill-height-or-more" direction="vertical"> -->
        <b-container fluid>
          <b-row align-v="stretch" cols="1">
            <!-- TODO: set the heights of this full height when second map is hidden, 70/30 when bot visible -->
            <b-col :size="80">
              <!-- Google maps -->
              <gmap-map
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
              </gmap-map>
            </b-col>
            <!-- TODO: set the heights of this full height when second map is hidden, 70/30 when bot visible -->
            <b-col :size="20">
              <!-- Google street view when is enabled -->
              <!-- small map below without streetview capabilities -->
              <gmap-map
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
              </gmap-map>
            </b-col>
          </b-row>
        </b-container>
      </section>
    </b-col>
  </b-row>
</template>

<script>
import { i18n } from "../i18n";

const ZOOMMIN = 3;
const ZOOMMAX = 14;
export default {
  name: "GeoTwitter",
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
      approxLocationOptions: []
    };
  },
  props: {
    taskInfo: {
      type: Object,
      required: true
    },
    pybossa: {
      type: Object,
      required: true
    }
  },
  computed: {
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
    post_time(val) {
      return moment(val).format("MMM D");
    },
    searchImg() {
      return `https://www.google.com/searchbyimage?image_url=${this.tweetImage}`;
    },
    translate() {
      return `https://translate.google.com/#auto/${i18n.locale}/${this.taskInfo.text}`;
    }
  }
};
</script>

<style></style>
