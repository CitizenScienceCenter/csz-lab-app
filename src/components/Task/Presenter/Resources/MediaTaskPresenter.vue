<template>
  <div>
    <!-- Video multimedia -->
    <b-skeleton-wrapper
      :loading="loading"
      v-if="type == 'video' || type == 'vembed'"
    >
      <template #loading>
        <b-skeleton-img animation="throb"></b-skeleton-img>
      </template>
      <b-embed
        v-if="type == 'video'"
        type="video"
        aspect="16by9"
        :src="link"
        allowfullscreen
        controls
      >
      </b-embed>
      <b-embed
        v-if="type == 'vembed'"
        aspect="16by9"
        :src="link"
        allowfullscreen
      >
      </b-embed>
    </b-skeleton-wrapper>

    <!-- Audio multimedia -->
    <b-skeleton-wrapper :loading="loading" v-if="type === 'audio'">
      <template #loading>
        <b-skeleton type="input" animation="throb"></b-skeleton>
      </template>
      <div class="animation">
        <span
          v-for="index in 15"
          :key="index"
          :class="['a' + index, { pause: !audio_animation }]"
          class="mr-2"
        ></span>
      </div>
      <audio
        controls
        :src="link"
        style="width: 85%;"
        @play="audio_animation = true"
        @pause="audio_animation = false"
        @ended="audio_animation = false"
      ></audio>
    </b-skeleton-wrapper>
  </div>
</template>

<script>
export default {
  name: "MediaTaskPResenter",
  data() {
    return {
      audio_animation: false,
    };
  },
  props: {
    link: String,
    loading: Boolean,
    type: {
      type: String,
      default: "video",
    },
  },
  methods: {
    animateAudio(value) {
      this.audio_animation = value;
    },
  },
  watch: {
    link() {
      // new audio link restart the audio animation
      this.audio_animation = false;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/scss/variables.scss";
.animation {
  width: 250px;
  height: 50px;
  margin: 50px auto;
}
span {
  display: inline-block;
  background-color: $primary;
  border-radius: 25%;
  width: 7px;
  height: 25px;
  animation: wave 1.5s linear infinite;
  transition: 0.5s;
  &.pause {
    height: 5px;
    animation: wave 0s linear infinite;
  }
}
.a1 {
  animation-delay: 0s;
}
.a2 {
  animation-delay: 0.1s;
}
.a3 {
  animation-delay: 0.2s;
}
.a4 {
  animation-delay: 0.3s;
}
.a5 {
  animation-delay: 0.4s;
}
.a6 {
  animation-delay: 0.5s;
}
.a7 {
  animation-delay: 0.6s;
}
.a8 {
  animation-delay: 0.7s;
}
.a9 {
  animation-delay: 0.8s;
}
.a10 {
  animation-delay: 0.9s;
}
.a11 {
  animation-delay: 1s;
}
.a12 {
  animation-delay: 1.1s;
}
.a13 {
  animation-delay: 1.2s;
}
.a14 {
  animation-delay: 1.3s;
}
.a15 {
  animation-delay: 1.4s;
}
@keyframes wave {
  0%,
  50% {
    transform: scaleY(1);
  }
  25% {
    transform: scaleY(4);
    background-color: $secondary;
  }
}
@media only screen and (min-width: $viewport-tablet-portrait) {
  .animation {
    width: 350px;
  }
}
@media only screen and (min-width: $viewport-xlarge) {
  .animation {
    width: 450px;
  }
}
</style>
