<template>
    <!-- User progress -->
    <!-- <p class="mt-2">You are working now on task: <b-badge variant="warning">{{ task.id }}</b-badge></p>-->
          <p class="mt-2">
            {{$t('template-editor-text-2')}}:
            <b-badge variant="primary">{{ userProgressAdapted }}</b-badge>
            {{$t('template-editor-text-2a')}}
            <b-badge variant="primary">{{ taskSlice }}</b-badge>
            {{$t('template-editor-text-3')}}
          </p>
  
          <b-progress :value="userProgressAdapted / taskSlice * 30" :max="30"></b-progress>
    <b-modal 
          v-model="modalProgressShow" @hidden="modalShow = false">
          <b-card no-body class="border-0 text-center">
            <b-card-text>
              <p>{{ text.tl_header }}</p>
              <p>{{ text.tl_text_a }} <strong>{{ pybossa.userProgress.done }}</strong> {{ text.tl_text_b }}</p>
              <p>{{ text.tl_question }}</p>
            </b-card-text>
          </b-card>
          <template #modal-footer>
              <b-button variant="light" @click="quitPresenter()">
                {{ text.tl_no }}
              </b-button>
              <b-button variant="success" @click="modalShow = false">
                {{ text.tl_yes }}
              </b-button>
        </template>
        </b-modal>


  </template>
  
  <script>
  export default {
    name: "UserProgress",
    props: {
      taskSlice: { type: Number, default: 100 },
      pybossa: {  required: true },
    },
    data() {
      return {
        modalShow: false,
        translations: {
          "de": {
            tl_header: "Vielen Dank für Ihre Teilnahme!",
            tl_text_a: "Sie haben",
            tl_text_b: "Aufgaben erledigt.",
            tl_question: "Möchten Sie mehr Aufgaben?",
            tl_no: "Nein, Danke.",
            tl_yes: "Ja!"
          }
        }
      };
    },
    methods: {
        quitPresenter: function(){
            this.$router.push({name: 'project', params: { id: this.pybossa.id} });
        },
      },
    computed: {
      userProgressLimited: function(){return this.pybossa.userProgress.done % this.taskSlice;},
      userProgressAdapted: function(){
            if (this.userProgressLimited == 0 && this.modalShow){
              return this.taskSlice
            } else {
              return this.userProgressLimited;
            }
          },
          modalProgressShow: function(){return this.modalShow && this.userProgressLimited == 0},
      }
  };
  </script>
  
  