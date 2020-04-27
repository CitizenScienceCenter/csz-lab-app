<template>
    <div class="comments">

        <template v-if="logged">

            <h3 class="subheading">{{ $t('newtopic-heading') }}</h3>

            <div class="comment">

                <user-avatar class="avatar" :username="infos.name"></user-avatar>

                <div class="form-field">
                    <growing-textarea v-model="commentTitle" :placeholder="$t('newtopic-title-placeholder')" fat></growing-textarea>
                </div>
                <div class="form-field">
                    <growing-textarea v-model="commentText" :placeholder="$t('newtopic-text-placeholder')"></growing-textarea>
                </div>

                <div class="button-group right-aligned">
                    <button :disabled="commentTitle === '' || commentText === ''" class="button button-primary" @click="newComment()">{{ $t('newtopic-button') }}</button>
                </div>

            </div>

        </template>

        <template v-else>

            <p>{{ $t('login-text') }}</p>
            <router-link tag="button" to="/login" class="button button-primary">{{ $t('login-button') }}</router-link>

        </template>

        <ul v-if="treeSituation.length > 0" class="comment-list">
            <li v-if="index < topicsShown" v-for="(situation,index) in treeSituation">

                <div class="comment comment-existing withTitles">

                    <user-avatar class="avatar" :username="commentTree[index][0].username"></user-avatar>

                    <h3 class="subheading">{{ commentTree[index][0].content.title }}</h3>
                    <p>{{ commentTree[index][0].content.text }}</p>
                    <span class="date">{{ giveDateTime(commentTree[index][0].comment_created) }}</span>
                    <span class="username">by {{ commentTree[index][0].username }}</span>

                    <template v-if="!user.isAnon">
                        <div v-if="!situation[1]" class="button-group right-aligned">
                            <button @click.prevent="showReplyField(index)" class="button button-secondary button-secondary-naked">{{ $t('reply-button') }}</button>
                        </div>
                        <div v-else class="comment reply">
                            <user-avatar class="avatar" :username="user.currentUser.username"></user-avatar>

                            <div class="form-field">
                                <growing-textarea v-model="replyTexts[index]" :placeholder="$t('reply-placeholder')"></growing-textarea>
                            </div>
                            <div class="button-group right-aligned">
                                <button :disabled="replyTexts[index].length === 0" class="button button-primary" @click="newComment(commentTree[index][0].comment_id, index)">{{ $t('reply-button') }}</button>
                            </div>
                        </div>
                    </template>

                    <div class="replies" v-if="commentTree[index][1].length > 0">

                        <ul class="reply-list">

                            <li v-if="replyIndex < situation[0]" v-for="(reply,replyIndex) in commentTree[index][1]">
                                <div class="comment comment-existing">
                                    <user-avatar class="avatar" :username="reply.username"></user-avatar>
                                    <p>{{ reply.content.text }}</p>
                                    <span class="date">{{ giveDateTime(reply.comment_created) }}</span>
                                    <span class="username">by {{ reply.username }}</span>
                                </div>
                            </li>

                        </ul>
                        <div v-if="commentTree[index][1].length > situation[0]" class="button-group">
                            <button @click.prevent="expand(index)" class="button button-secondary button-secondary-naked">{{ $t('more-replies-button') }}</button>
                        </div>
                    </div>

                </div>
            </li>
        </ul>
        <div v-if="commentTree.length > topicsShown" class="button-group">
            <button @click.prevent="showMore()" class="button button-secondary">{{ $t('more-comments-button') }}</button>
        </div>

    </div>
</template>

<script>

    import {mapState} from 'vuex'
    import GrowingTextarea from "./GrowingTextarea";
    import UserAvatar from "./UserAvatar";


    export default {
        name: "Comments",
        components: {
            GrowingTextarea,
            UserAvatar
        },
        data() {
            return {
                commentTree: [],
                treeSituation: [],
                newSituationOnLoad: true,
                topicsShown: 5,
                repliesShownDefault: 2,
                replySubmitted: null,

                commentTitle: '',
                commentText: '',
                replyTexts: []
            }
        },
        props: {
            sourceId: {
              type: String,
              default: null
            }
        },
        watch: {
            sourceId: function() {
                this.loadComments();
            }
        },
        computed: {
            ...mapState('user', [
                'logged','infos']
                //comments: state => state.c3s.comments.comments,
                //loading: state => state.c3s.settings.loading
            )
        },
        mounted: function() {
            this.loadComments();
        },
        methods: {
            loadComments: function() {
                console.log('Loading comments db ...')
               /* let query = {
                    'select': {
                        'fields': [
                            'comments.id as comment_id',
                            'comments.created_at as comment_created',
                            '*'
                        ],
                        'tables': [
                            'comments'
                        ],
                        'orderBy': {
                            'comment_created': 'DESC'
                        }
                    },
                    "join": {
                        "type": "LEFT",
                        "conditions":{
                            "from": {
                                "table": "users",
                                "field": "id"
                            },
                            "to": {
                                "table": "comments",
                                "field": "user_id"
                            }
                        }
                    },
                    'where': [
                        {
                            "field": 'source_id',
                            'op': 'e',
                            'val': this.sourceId
                        }
                    ]
                };

                this.$store.dispatch('c3s/media/getMedia', [query, 'c3s/comments/SET_COMMENTS', 9999] ).then(res => {

                    this.commentTitle = '';
                    this.commentText = '';
                    //console.log('comments loaded:');
                    this.buildCommentTree();
                    //console.log( this.commentTree );

                });*/
            },
            buildCommentTree() {

                if( this.newSituationOnLoad ) {
                    this.treeSituation = [];
                    this.replyTexts = [];
                }

                //console.log('build tree');
                this.commentTree = [];
                var unfoundChildren = [];

                for( let i = 0; i < this.comments.length; i++ ) {

                    //console.log('comment check');

                    if( this.comments[i].parent === null ) {

                        //console.log('has no parent');

                        this.commentTree.push( [ this.comments[i], [] ] );

                        if( this.newSituationOnLoad ) {
                            this.treeSituation.push( [ this.repliesShownDefault, false ] );
                            this.replyTexts.push( '' );
                        }
                        if( this.replySubmitted != null ) {
                            this.replyTexts[this.replySubmitted] = '';
                            this.replySubmitted = null;
                        }
                    }
                    else {

                        //console.log('has parent');
                        var parentFound = false;

                        for( let j = 0; j < this.commentTree.length; j++ ) {

                            if( this.comments[i].parent === this.commentTree[j][0].comment_id ) {
                                this.addChildToTree( j, this.comments[i] );
                                parentFound = true;
                            }
                        }

                        if( !parentFound ) {
                            //console.log('parent not found');
                            unfoundChildren.unshift( this.comments[i] );
                        }
                    }
                }

                for( let i = unfoundChildren.length-1; i >= 0; i-- ) {

                    //console.log('lost child');

                    for( let j = 0; j < this.commentTree.length; j++ ) {
                        if( unfoundChildren[i].parent === this.commentTree[j][0].comment_id ) {
                            this.addChildToTree( j, unfoundChildren[i] );
                            break;
                        }
                    }

                }
                //console.log('comment tree generated');
                //console.log('reply texts');
                //console.log( this.replyTexts );
            },
            addChildToTree( parentIndex, child ) {
                //console.log('parent found');
                this.commentTree[parentIndex][1].push( child );
            },
            giveDateTime(timestamp) {
                var date = new Date(timestamp);
                var date_time =  date.getDate() +'.'+ (date.getMonth()+1) +'.'+ date.getFullYear()+', '+ date.getHours() +':'+ (date.getMinutes()<10?'0':'') + date.getMinutes();
                //console.log( date_time );
                return date_time;
            },
            showMore() {
                this.topicsShown += 10;
            },
            expand(index) {
                this.treeSituation[index][0] += 10;

                this.treeSituation.push( ['dummy object'] );
                this.treeSituation.pop();

                //console.log( 'expand');
                //console.log( this.treeSituation );
            },
            showReplyField(index) {
                this.treeSituation[index][1] = true;

                this.treeSituation.push( ['dummy object'] );
                this.treeSituation.pop();

                //console.log( 'show');
                //console.log( this.treeSituation );
            },
            newComment: function(parentId, index) {


                //console.log('new comment');

                let comment;
                if( !parentId && !index ) {
                    this.newSituationOnLoad = true;

                    this.opened = [];
                    //console.log('no parent');

                    comment = {
                        user_id: this.infos.id,
                        source_id: this.sourceId,
                        content: {
                            title: this.commentTitle,
                            text: this.commentText
                        }
                    };
                }
                else {
                    this.newSituationOnLoad = false;
                    this.replySubmitted = index;

                    comment = {
                        user_id: this.infos.id,
                        source_id: this.sourceId,
                        parent: parentId,
                        content: {
                            text: this.replyTexts[index]
                        }
                    };
                }

                console.log('create: '+ parentId);
                console.log('new comment created');
                console.log(comment);

                /*this.$store.dispatch('c3s/comments/createComment', comment).then(res => {

                    //console.log('new comment created');

                    this.loadComments();

                });*/
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
                        font-size: $font-size-small;
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
                padding-left: calc( 48px + #{$spacing-3} );
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

