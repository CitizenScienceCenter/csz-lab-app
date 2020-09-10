<template>

    <b-modal
            :visible="value"    
            ref="my-modal"     
            hide-footer
            :title="$t('private-project-title')"
            :ok-title="$t('submit-btn')"
            :cancel-title="$t('cancel-c')"
            @show="resetModal"
            @ok="submitPass">
            <b-form ref="form-registration" @submit.prevent="submitPass" class="mt-4">
                <b-form-group 
                :description="$t('private-project-content')">
                    <b-form-input
                        :id="'private-project' + project.id"
                        type="password"
                        v-model="privateProjectPassword"
                        required
                        :placeholder="$t('login-input-password-placeholder')"
                      ></b-form-input>
                </b-form-group>
                <b-button class="mt-3" type="submit" variant="primary"> {{$t('submit-btn')}} </b-button>
            </b-form>
    </b-modal> 
  
</template>

<script>
import { mapState,mapActions,mapMutations } from 'vuex'
export default {
  name: 'ProjectPasswordModal',
  data: () => {
    return {
      privateProjectPassword:''
    }
  },
  props: {
    project:Object,
    value: {
        required: true
    }
  },
  computed: {
    ...mapState('user', {
      profile: state => state.infos
    })
  },
  watch:{},
  methods:{
     ...mapActions('project', [
      'getAccessToProject'
    ]),
    ...mapMutations('notification', [
      'showError'
    ]),
    ...mapMutations('project', [
      'setProjectPassModal','setAccessForSelectedProject'
    ]),
    submitPass(){
      this.getAccessToProject({
        'password':this.privateProjectPassword,
        'short_name':this.project.short_name
        }).then((response) => {
        if (response.status == 'success'){
            this.setAccessForSelectedProject({'access':true,'project_id':this.project.id})
            this.setProjectPassModal(false)
            this.$refs['my-modal'].hide()
            this.$router.push({ name: 'project.task.presenter'})
        } else {
            this.showError({
              title: response.status,
              content: this.$t('access-denied')
            })
        }
      })
    },
    resetModal() {
      this.privateProjectPassword = ''
      this.setProjectPassModal(false)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../../scss/variables.scss';

  .project {

    position: relative;
    border-radius: $border-radius;
    box-shadow: 0 4px 8px -4px rgba($black,0.2);
    overflow: hidden;

  }

  @media only screen and (min-width: $viewport-mobile-large) {

    .project {
      .project-info {
        padding: $spacing-4 $spacing-3;
      }
      .info-text {
        max-width: 160px;
      }
    }
  }

  @media only screen and (min-width: $viewport-tablet-portrait) {

    .project {
      .info-text {
        max-width: none;
      }
    }

  }

  @media only screen and (min-width: $viewport-large) {

    .project {
      height: 100%;
      .project-info {
        p {
          margin-bottom: $spacing-7;
        }
        .btn {
          position: absolute;
          bottom: $spacing-4;
          left: $spacing-3;
        }
        .row {
          position: initial;
        }
      }
    }
  }

  @media only screen and (min-width: $viewport-xlarge) {

  }

</style>
