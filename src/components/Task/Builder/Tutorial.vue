<template>
  <div>
    <b-card title="Card with overlay" :aria-hidden="show ? 'true' : null">
      <b-card-text
        >Laborum consequat non elit enim exercitation cillum.</b-card-text
      >
      <b-card-text>Click the button to toggle the overlay:</b-card-text>
      <b-button :disabled="show" variant="primary" @click="show = true">
        Show overlay
      </b-button>
    </b-card>

    <b-overlay :show="show" rounded="sm" no-wrap opacity="0.75">
      <template #overlay>
        <b-card
          title="Card Title"
          tag="article"
          style="max-width: 80wh;"
          class="mb-2"
        >
          <b-icon
            icon="x-circle"
            style="position:absolute; top:5%; right:5%"
            @click="show = !show"
          ></b-icon>
          <v-card-body class="d-flex flex-column">
            <video
              src="https://codingyaar.com/wp-content/uploads/video-in-bootstrap-card.mp4"
              style="max-width: 100%"
              class="mb-2"
              controls
              autoplay
              muted
              loop
            ></video>

            <b-card-text>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book. It has
              survived not only five centuries, but also the leap into
              electronic typesetting, remaining essentially unchanged. It was
              popularised in the 1960s with the release of Letraset sheets
              containing Lorem Ipsum passages, and more recently with desktop
              publishing software like Aldus PageMaker including versions of
              Lorem Ipsum.
            </b-card-text>
            <div class="text-center">
              <b-button href="#" variant="primary" class="mb-2"
                >Continue</b-button
              >
            </div>
          </v-card-body>
          <b-card-footer
            class="d-flex justify-content-center"
            footer-border-variant="light"
            style="background-color:white"
          >
            <b-icon
              icon="exclamation-circle-fill"
              class="mr-2"
              @click="alert('1')"
              variant="danger"
            ></b-icon>
            <b-icon icon="exclamation-circle-fill" class="mr-2"></b-icon>
            <b-icon icon="exclamation-circle-fill" class="mr-2"></b-icon>
            <b-icon icon="exclamation-circle-fill" class="mr-2"></b-icon>
            <b-icon icon="exclamation-circle-fill" class="mr-2"></b-icon>
          </b-card-footer>
        </b-card>
      </template>
    </b-overlay>
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: false
    };
  }
};
</script>
