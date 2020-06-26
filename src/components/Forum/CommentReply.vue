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
          <b-button v-if="reply.owner_id == infos.id" variant="warning" 
            @click.prevent="deleteComment(reply.id)" style="float:right;display:none;">
            {{$t('forum-delete-comment')}}
          </b-button>
        </div>
        <span class="name">{{ reply.username }}</span>
      </div>
    </div>
    <div class="comment__content">
      <p>{{ reply.content.text }}</p>
    </div>
    <div class="comment__header">
      <a v-if="reply.owner_id == infos.id || infos.admin" href="#" class="small comment__content comment__add mb-2" @click.prevent="deleteComment(reply.parent,reply.id)" >
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
          'thread':thread_id,
          'comment':comment_id
          })
      }
    }

  }

</script>
