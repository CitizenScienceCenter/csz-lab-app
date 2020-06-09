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
          <span>{{ giveDateTime(reply.created) }}</span>
          <span v-if="reply.role">, {{ reply.role }}</span>
          <b-button v-if="reply.owner_id == infos.id" variant="warning" @click.prevent="deleteComment(reply.id)" style="float:right;display:none;">
            {{$t('forum-delete-comment')}}
          </b-button>
        </div>
        <span class="name">{{ reply.username }}</span>
      </div>
    </div>
    <div class="comment__content">
      <p>{{ reply.content.text }}</p>
    </div>
  </div>
</template>

<script>

  import {mapState} from 'vuex'

  export default {
    name: "Reply",
    data() {
      return {
        replyTexts: [],
        defaultImage: require('@/assets/graphic-community.png')
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
      giveDateTime(timestamp) {
        var date = new Date(timestamp);
        var date_time = date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear() + ', ' + date.getHours() + ':' + (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
        //console.log( date_time );
        return date_time;
      },
      deleteComment(id){

      }
    }

  }

</script>
