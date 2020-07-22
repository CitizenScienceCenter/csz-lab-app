<template>
  <div>
    <div class="comment__header">
      <div class="comment__avatar">
        <b-img v-if="reply.avatar_url" height="48" width="48" rounded="circle"
               :src="reply.avatar_url"></b-img>
        <b-img v-else height="48" width="48" rounded="circle" :src="defaultImage"></b-img>
      </div>
      <div class="comment__username small text-muted">
        <div>
          <span>{{ helpers.giveDateTime(reply.created) }}</span>
          <span v-if="reply.role">, {{ reply.role }}</span>
        </div>
        <span class="name">{{ reply.username }}</span>
      </div>
    </div>
    <div class="comment__content">
      
      <p v-if='!edit_comment'>{{ reply.content.text }}</p>

      <div v-else> 
        <b-form-group id="reply-group-1" >
          <b-form-textarea
           size="sm"
            rows="1"
            max-rows="5"
            :value="activeComment" 
            v-model="replyTexts[0]"
          />
        </b-form-group>

        <b-button 
          size="sm" type="submit" variant="secondary"
          class="float-right"
          @click="editComment(reply.parent,reply.id)">
            {{$t('post')}}
        </b-button>

        <b-button 
          size="sm" type="submit" variant="danger"
          class="float-right"
          @click="cancelEdit()">
            {{$t('cancel-c')}}
        </b-button>
        
     </div>
      
    </div>

    <div v-if='!edit_comment' class="comment__content" >
      <a href='#' v-if="reply.owner_id == infos.id" class="small" 
       @click.prevent="editBtn(reply.content.text)" style="color:#16496b;font-weight: lighter;"> 
       {{$t('forum-edit-comment')}} 
      </a>
      <a href='#' v-if="reply.owner_id == infos.id || infos.admin" class="small" 
        @click.prevent="deleteComment(reply.parent,reply.id)" style="color:#c5202e;font-weight: lighter;"> 
          {{$t('forum-delete-comment')}}
      </a>
    </div>
  </div>
</template>

<script>
  import {mapState, mapActions} from 'vuex'

  export default {
    name: "Reply",
    data() {
      return {
        replyTexts: [],
        edit_comment : false,
        tempComment : null,
        activeComment: this.reply.content.text,
        defaultImage: require('@/assets/graphic-community.png'),
        helpers: require('@/helper.js')
      }
    },
    props: {
      reply: {
        type: Object,
        default: []
      }
    },
    computed: {
      ...mapState('user', [
        'infos'
      ])
    },
    methods: {
      deleteComment(thread_id,comment_id){
        this.$store.dispatch('project/deleteComment', {
          'thread_id':thread_id,
          'comment_id':comment_id
          })
      },
      editComment(thread_id,comment_id){

        let comment = {
          id:comment_id,
          user_id: this.infos.id,
          parent: thread_id,
          text: null,
          content: {
            text: this.replyTexts[0]
          }
        };

        console.log(comment)

        this.$store.dispatch('project/updateProjectComment', {'short_name': 'NA', 'comment': comment}).then(res => {
          if (res.status == 'success') {
            this.replyTexts[index] = ''
            this.edit_comment = false
            this.$store.dispatch('project/getProjectComments', {
              'id':thread_id,
              'limit':1000,
              'offset':0
            });
          }
        });

      },
      editBtn(commentContent){
        this.edit_comment = true
        this.tempComment = commentContent
      },
      cancelEdit(){
        this.reply.content.text = this.tempComment
        //alert(this.$refs.rep_content.value)
        this.edit_comment = false
        //this.activeComment = this.tempComment
      }
    }

  }

</script>
