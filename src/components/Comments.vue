<template>
  <div >
    <b-container>
      <b-row class="mt-4 justify-content-center">
        <b-col md="6" md-offset="3">
          <h1>Forum</h1>
        </b-col>
      </b-row>

      <b-row v-if='infos.admin' class="mt-4">
        <b-col md="12" class="mt-md-0 mt-4">
        
          <b-form-group id="fieldset-description">
            <b-form-textarea
              size="sm"
              rows="1"
              max-rows="5"
              :placeholder="$t('newtopic-text-placeholder')"
              v-model="commentTitle">
            </b-form-textarea>
          </b-form-group>

          <b-button 
            :disabled="commentTitle === ''" style="float:right;"
            type="submit" variant="primary" @click="newComment()"
            >Send
          </b-button>
        </b-col>

      </b-row>
      <b-row class="mt-4">
        <b-col md="12" class="mt-md-0 mt-4">
          <div v-if="treeSituation.length > 0">
            
          </div>
          <CommentThread
              v-for="(situation,index) in treeSituation"
              v-bind:key="index"
              :comment=commentTree
              :index=index
            />

          <div v-if="numberOfThreads > topicsShown" class="button-group">
            <b-button variant="primary" @click.prevent="showMore()">
              view more comments
            </b-button>
          </div>
        </b-col>
      </b-row>

    </b-container>
  </div>

  <!--<div v-else>
    <b-container>
      <b-row class="mt-4 justify-content-center">
        <b-col md="6" md-offset="3">
          <h1>{{ $t('login-text') }}</h1>
          <b-btn variant="primary" :to="{ name: 'login' }">{{ $t('login-button') }}</b-btn>
        </b-col>
      </b-row>
    </b-container>
  </div>-->
</template>

<script>

  import {mapState} from 'vuex'
  import GrowingTextarea from "./GrowingTextarea";
  import UserAvatar from "./UserAvatar";
  import CommentThread from "./CommentThread";

  export default {
    name: "Comments",
    components: {
      GrowingTextarea,
      UserAvatar,
      CommentThread
    },
    data() {
      return {
        commentTree: [],
        treeSituation: [],
        newSituationOnLoad: true,
        topicsOffset:0,
        topicsShown: 2,
        repliesShownDefault: 10,
        replySubmitted: null,
        commentTitle: '',
        commentText: '',
        replyTexts: [],
        defaultImage: require('@/assets/graphic-community.png'),
        comments: [],
        numberOfThreads: 0
      }
    },
    computed: {
      ...mapState('user', [
        'logged', 'infos'
      ]),

      ...mapState('project', [
        'setForumThreads'
      ]),
    },
    watch: {
      setForumThreads(newValue, oldValue) {
        if (newValue.data.length && oldValue.data.length) {
          if (newValue.data.length > oldValue.data.length) {
            this.comments = newValue.data
            this.buildCommentTree()
          }
        }
      },
    },
    mounted: function () {
      this.loadComments();
    },
    methods: {
      loadComments: function () {
        console.log('Loading comments db ...')

        this.$store.dispatch('project/getForumThreads', {
          'limit':this.topicsShown,
          'offset':this.topicsOffset
        }).then(res => {
          this.comments = res.data
          this.numberOfThreads = res.count
          this.buildCommentTree()
        });
      },
      buildCommentTree() {
        console.log('Building comment tree')
        if (this.newSituationOnLoad) {
          this.treeSituation = [];
          this.replyTexts = [];
        }

        //console.log('build tree');
        this.commentTree = [];
        var unfoundChildren = [];
        //console.log('Found comments: ' + this.comments.length)
        for (let i = 0; i < this.comments.length; i++) {

          if (this.comments[i].parent === null) {

            //console.log('Topics id:' + this.comments[i].parent + ' with ID:' + this.comments[i].id  )
            this.commentTree.push([this.comments[i], []]);

            if (this.newSituationOnLoad) {
              this.treeSituation.push([this.repliesShownDefault, false]);
              this.replyTexts.push('');
            }
            if (this.replySubmitted != null) {
              this.replyTexts[this.replySubmitted] = '';
              this.replySubmitted = null;
            }
          }
        }

        for (let i = 0; i < this.comments.length; i++) {
          if (this.comments[i].parent) {

            //console.log('has parent');
            var parentFound = false;

            for (let j = 0; j < this.commentTree.length; j++) {
              //console.log('Parent:' + this.comments[i].parent + ' - CommId: ' + this.commentTree[j][0].id)
              if (this.comments[i].parent === this.commentTree[j][0].id) {
                this.addChildToTree(j, this.comments[i]);
                parentFound = true;
              }
            }

            if (!parentFound) {
              //console.log('parent not found');
              unfoundChildren.unshift(this.comments[i]);
            }
          }
        }

        for (let i = unfoundChildren.length - 1; i >= 0; i--) {
          //console.log('lost child');
          for (let j = 0; j < this.commentTree.length; j++) {
            if (unfoundChildren[i].parent === this.commentTree[j][0].comment_id) {
              this.addChildToTree(j, unfoundChildren[i]);
              break;
            }
          }

        }
        console.log('comment tree generated');
        console.log(this.commentTree);
        console.log('reply texts');
        console.log(this.replyTexts);
      },
      addChildToTree(parentIndex, child) {
        //console.log('parent found');
        this.commentTree[parentIndex][1].push(child);
      },
      showMore() {
        this.topicsShown += 2;
        this.loadComments()
      },
      newComment: function (parentId, index) {


        console.log('NEW COMMENT');

        let comment;
        if (!parentId && !index) {
          this.newSituationOnLoad = true;

          this.opened = [];
          console.log('new comment topic - no parent');

          comment = {
            user_id: this.infos.id,
            parent: null,
            text: null,
            content: {
              title: this.commentTitle,
              text: this.commentText
            }
          };
        } else {
          console.log('reply comment on topic- has parent');
          console.log(parentId)
          this.newSituationOnLoad = false;
          this.replySubmitted = index;

          comment = {
            user_id: this.infos.id,
            parent: parentId,
            text: null,
            content: {
              text: this.replyTexts[index]
            }
          };

        }

        console.log('create: ' + parentId);
        console.log('new comment created');
        console.log(comment);

        this.$store.dispatch('project/setProjectComment', {'short_name': 'NA', 'comment': comment}).then(res => {
          if (res.status == 'success') {
            //this.comments.push(comment)
            this.commentTitle = ''
            this.loadComments();
          }
        });

      }
    }
  }

</script>


<style lang="scss" scoped>

  @import '@/styles/themes.scss';
  @import '@/styles/variables.scss';


  .comments {


    min-height: 50vh;


    .button-secondary-naked {
      padding: 0;
    }


    ul {
      li {
        padding-left: 0;
        margin-left: 0;

        &:before {
          display: none;
        }
      }
    }


    .form-field {
      display: block;

      margin-bottom: $spacing-2;
    }

    .comment {
      position: relative;
      padding-left: calc(40px + #{$spacing-2});


      .avatar {
        position: absolute;
        top: 0;
        left: 0;
        pointer-events: none;
      }

      p, .subheading {
        white-space: pre-line;
      }


    }

    .comment-list {
      margin-top: $spacing-5;
      margin-bottom: $spacing-3;

      li {
        margin-bottom: $spacing-4;

        .comment {

          &.comment-existing {
            padding-top: calc((40px - #{$font-size-normal} * 1.5) / 2);
            min-height: 40px;

            &.titled {
              padding-top: calc((40px - #{$font-size-medium} * 1.5) / 2);
            }
          }

          .subheading {
            margin-bottom: $spacing-1;
          }

          p {
            margin-bottom: 0;
          }

          .date, .username {
            font-size: $font-size-tiny;
            color: $color-black-tint-50;
            display: inline;

            &.username {
              margin-left: $spacing-1;
            }
          }

          .reply {
            margin-top: $spacing-3;
          }

          .replies {
            margin-top: $spacing-1;

            .reply-list {
              margin: 0;

              li {
                margin-bottom: $spacing-2;
              }
            }
          }

        }

      }

    }
  }

  @media only screen and (min-width: $viewport-tablet-portrait) {

    .comments {

      .comment {
        padding-left: calc(48px + #{$spacing-3});
      }

      .comment-list {
        margin-top: $spacing-6;
        margin-bottom: $spacing-4;

        li {
          margin-bottom: $spacing-5;

          .comment {

            &.comment-existing {
              padding-top: calc((48px - #{$font-size-normal} * 1.5) / 2);
              min-height: 48px;

              &.titled {
                padding-top: calc((48px - #{$font-size-medium} * 1.5) / 2);
              }
            }

            .subheading {
              margin-bottom: $spacing-2;
            }

            .reply {
              margin-top: $spacing-4;
            }


            .replies {
              margin-top: $spacing-2;

              .reply-list {
                margin: 0;

                li {
                  margin-bottom: $spacing-3;
                }
              }
            }

          }

        }


      }
    }

  }

</style>

