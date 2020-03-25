<template>
  <div>
  <b-container class="mt-4">
    <b-row>
    <b-col>
      <b-link v-if="template" :to="{ name: 'project.task.presenter.editor', params: { id: this.id, template: this.template } }">{{ $t("task-template-renderer-go-back-editor") }}</b-link>
      <b-link v-else :to="{ name: 'project', params: { id: this.id } }">{{ $t('task-template-renderer-go-back-project') }}</b-link>

      <div v-if="!taskPresenterLoaded" class="mt-4 text-center">
        <b-spinner 
          variant="primary" 
          style="width: 3rem; height: 3rem;" 
          :label="$t('task-template-renderer-loading')">
        </b-spinner>
      </div>

      <component class="mt-4" ref="presenter" v-if="taskPresenterExists" :is="presenterComponent" :pybossa="this"></component>
      <div class="mt-4" v-else-if="taskPresenterLoaded">
        <b-alert :show="true" variant="warning">{{ $t('task-template-renderer-no-task-presenter') }}</b-alert>
      </div>

    </b-col>
    </b-row>
  </b-container>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters, mapMutations } from 'vuex'

export default {
  name: 'TemplateRenderer',
  props: {
    // project id
    id: {
      required: true
    },
    // template code (optional)
    template: {
      type: String
    }
  },
  created () {
    // load the project first to have access to the presenter and to the related tasks
    this.getProject(this.id).then(() => {
      this.taskPresenterLoaded = true
      // if the project presenter exists or a template is given (with the task presenter editor), it will be displayed
      // otherwise an alert is displayed to indicate that the presenter is not already configured
      if (this.presenter || this.template) {
        this.taskPresenterExists = true
      }
    })
  },
  data: () => {
    return {
      taskPresenterExists: false,
      taskPresenterLoaded: false,
      taskLoaded: false
    }
  },
  computed: {
    ...mapState('project', {
      // the current project where is displayed the task presenter
      project: state => state.selectedProject,

      // user task progress
      userProgress: state => state.selectedProjectUserProgress
    }),

    ...mapState('task', {
      // the currently displayed task in the presenter
      task: state => state.currentTask,

      // the task presenter template loaded from the pybossa server
      presenter: state => state.taskPresenter
    }),

    // user data
    ...mapState('user', {
      isUserLogged: state => state.logged,
      userId: state => state.infos.id,
      userApiKey: state => state.infos.api_key
    }),

    ...mapGetters('project', {
      userProgressInPercent: 'getUserProgressInPercent'
    }),

    presenterComponent () {
      const sanitize = el => el.replace(/[\n\r\t]+/g, '')
      // display the optional template in priority if specified
      const sanitizedPresenter = this.template ? sanitize(this.template) : sanitize(this.presenter)
      // eslint-disable-next-line no-eval
      return { name: 'presenter', ...eval('() => { return' + sanitizedPresenter + '}')() }
    }
  },
  methods: {
    ...mapActions('task', [
      'getNewTask', 'saveTaskRun'
    ]),

    ...mapActions('project', [
      'getUserProgress', 'getProject'
    ]),

    ...mapActions('osm', [
      'qetLocalizationsWithQuery'
    ]),

    ...mapMutations('notification', [
      'showError'
    ]),

    /**
     * Called when the dynamic component start
     */
    run () {
      this.newTask()
    },

    /**
     * Load a new task for the presenter if authorized
     * Also load the global user progress
     */
    newTask () {
      this.taskLoaded = false
      this.getNewTask(this.project).then(allowed => {
        if (!allowed) {
          this.showError({
            title: 'You are not allowed to contribute',
            content: 'This project does not allow anonymous contributors'
          })
          this.$router.push({ name: 'project', params: { id: this.project.id } })
        } else {
          this.getUserProgress(this.project)
          this.taskLoaded = true
        }
      })
    },

    /**
     * Save the user task answer and get a new task after
     * @param answer
     */
    saveTask (answer) {
      this.taskLoaded = false
      const taskRun = {
        // required
        project_id: this.project.id,
        task_id: this.task.id,
        info: answer
        // optional
        // user_id: 1,
        // external_uid: '',
        // media_url: ''
      }
      if (this.isUserLogged) {
        taskRun.user_id = this.userId
      }
      this.saveTaskRun(JSON.stringify(taskRun)).then(() => {
        // load a new task when current task saved
        this.newTask()
      })
    }
  }
}
</script>

<style scoped>

</style>
