<template>
  <b-form >
    <b-form-group
            label="Analytics"
            label-for="privacy"
            :description="$t('basic-profile-editor-privacy-description')">
      <b-form-checkbox v-model="gdprAccepted" id="privacy" switch>
        Analytics {{ gdprAccepted ? 'enabled' : 'disabled' }}
      </b-form-checkbox>
    </b-form-group>
  </b-form>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { setOptions, bootstrap } from 'vue-gtag'

export default {
    name: 'Gtag',
    mounted(){
        if (localStorage.getItem('gdpr'))
            this.gdprAccepted = JSON.parse(localStorage.getItem('gdpr'))
        },
    data: () => {
        return {
            gdprAccepted:false
        }
    },
    watch: {
       gdprAccepted:{
           handler: function (val, oldVal) {
                localStorage.setItem('gdpr', val);
                this.gdprAccepted = val
                this.gtagPlugin()
           }
          
       } 
    },
    computed: {
    ...mapState('settings', [
      'gdpr'
    ])
    },
   methods: {
    ...mapActions('settings', [
      'setGtag'
    ]),
    gtagPlugin () {
      //this.setGtag(this.gdprAccepted)
      if(this.gdprAccepted){
        window['ga-disable-UA-162894944-1'] = false;
      }else{
        window['ga-disable-UA-162894944-1'] = true;
      }
    }
  }
}
</script>

<style scoped>

</style>
