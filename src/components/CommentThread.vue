<template>
  <div class="comment comment-existing withTitles mb-5">
    <div class="comment__header">
      <div class="comment__avatar">
        <b-img v-if="comment[index][0].avatar_url" height="48" width="48" rounded="circle"
               :src="comment[index][0].avatar_url"></b-img>
        <b-img v-else height="48" width="48" rounded="circle" :src="defaultImage"></b-img>
      </div>
      <div class="comment__username small text-muted">
        <div>
          <span>{{ giveDateTime(comment[index][0].created) }}</span>
          <span v-if="comment[index][0].role">, {{ comment[index][0].role }}</span>
        </div>
        <span class="name">{{ comment[index][0].username }}</span>
      </div>
    </div>

    <div class="comment__content">
      <p class="comment__content_mainthread">{{ comment[index][0].content.title }}</p>
      <div class="comment__see-discussion" v-b-toggle="'discussion' + index">
        <i class="fas fa-caret-right arrow_box"></i><span class="small">See discussion</span>
      </div>
      <div class="comment_discussion">
        <b-collapse @shown="show(comment[index][0].id)"
        @hide="hide(index)" :id="'discussion' +index">
          <div v-if='!logged'>
            <b-row class="justify-content-center">
              <b-col md="6" md-offset="3">
                <p class="justify-content-center" style='margin-bottom:20px;'>{{ $t('login-text') }}</p>
              </b-col>
            </b-row>
          </div>
          <div v-else>
          <div class="comment__add mb-2">Add comment</div>
          <b-row align-h="center" class="mb-2">
            <b-col md="11">
              <b-form-group id="reply-group-1">
                <b-form-textarea
                  size="sm"
                  rows="1"
                  max-rows="5"
                  v-model="replyTexts[index]" 
                  placeholder="Add your comment here ... "/>
              </b-form-group>
              <b-button 
                :disabled="(replyTexts[index]) ? false : true"
                size="sm" type="submit" variant="secondary"
                class="float-right"
                @click="newComment(comment[index][0].id, index)"
              >Reply</b-button>
            </b-col>
          </b-row>
          </div>

          <div class="replies" v-if="comment[index][1].length > 0">
            <b-row align-h="center" class="mb-4" 
                v-for="(reply,replyIndex) in comment[index][1]" v-bind:key="replyIndex"
                v-if="replyIndex < repliesShown">
              <b-col md="11">
                <CommentReply :reply="reply"></CommentReply>
              </b-col>
            </b-row>
            <div v-if="totalRepliesInThread > repliesShown " style="text-align:center;">
              <b-button class="show-more" variant="primary" @click.prevent="expand(index,comment[index][1])">
                view more replies
              </b-button>
            </div>
          </div>
        </b-collapse>
      </div>
    </div>
  </div>
</template>

<script>

  import {mapState} from 'vuex'

  import CommentReply from "./CommentReply";

  export default {
    name: "Thread",
    components: {
      CommentReply
    },
    data() {
      return {
        replyTexts: [],
        defaultImage: require('@/assets/graphic-community.png'),
        repliesShown : 4,
        repliesOffset: 0,
        replies : [],
        totalRepliesInThread : 0
      }
    },
    props: {
      comment: {
        type: Array,
        default: []
      },
      index: {
        type: Number,
        default: null
      }
    },
    computed: {
      ...mapState('user', [
        'logged', 'infos'
      ]),
      ...mapState('project', {
        comments: state => state.projectComments
      }),
    },
    methods: {
      show(index){
        this.$store.dispatch('project/getProjectComments', {
              'id':index,
              'limit':this.repliesShown+999,
              'offset':this.repliesOffset
            }).then(res => {
              //this.replies = res.data
              this.replies = res.data
              this.totalRepliesInThread = res.count
              this.buildCommentTree(this.comment,res.data)
             
            });
      },
      hide(index){
        this.replies = []
        this.comment[index][1] = []
        this.buildCommentTree(this.comment,[])
      },
      buildCommentTree(comments,replies) {
        console.log('Building comment tree')
       
        for (let i = 0; i < replies.length; i++) {
          if (replies[i].parent) {

            for (let j = 0; j < comments.length; j++) {
              if (replies[i].parent === comments[j][0].id) {
                
                let temp = this.comment[j][1]
                if(temp.length > 0 && replies[i].id == temp[0].id){
                  
                  continue
                }
                this.comment[j][1].push(replies[i]);
              }
            }

          }
        }
      },
      giveDateTime(timestamp) {
        var date = new Date(timestamp);
        var date_time = date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear() + ', ' + date.getHours() + ':' + (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
        //console.log( date_time );
        return date_time;
      },
      getCollapseId(index) {
        return "google-doc-collapse-" + index
      },
      expand(index,comment) {
        this.repliesShown +=4
      },
      newComment: function (parentId, index) {
       
        let comment = {
          user_id: this.infos.id,
          parent: parentId,
          text: null,
          content: {
            text: this.replyTexts[index]
          }
        };

        this.$store.dispatch('project/setProjectComment', {'short_name': 'NA', 'comment': comment}).then(res => {
          if (res.status == 'success') {
            this.replyTexts[index] = ''
            this.$store.dispatch('project/getProjectComments', {
              'id':parentId,
              'limit':this.repliesShown,
              'offset':this.repliesOffset
            }).then(res => {
              //this.replies = res.data
              this.replies = []
              this.replies = res.data
              this.totalRepliesInThread = res.count
              this.comment[index].push(comment)
              this.comment[index][1]=res.data
              console.log(this.comment[index][1])
              //this.buildCommentTree(this.comment,res.data)   
                 
            });
          }
        });

      }
    }

  }

</script>
