<template>
    <b-container>
        <b-row align-h="center" class="mb-5">
            <b-col md="10">
                <div class="comment comment-existing withTitles"  style="padding: 10px 30px; border:1px solid;border-radius:7px;    border-color: lightgray;">

                    <!--<b-img v-if="infos.avatar_url" height="32" width="32" rounded="circle" :src="infos.avatar_url"></b-img>
                    <b-img v-else height="32" width="32" rounded="circle" :src='defaultImage' ></b-img>&ensp;-->
                    <!--<span class="text-muted" style="font-size:0.85rem;margin-left:10px;position:absolute;right:40px">Comment ID: #{{ comment[index][0].id }}</span>-->
                    <label for="username" class="d-block" style="float:left;margin: 0;">{{ comment[index][0].username }}</label>
                    <span class="date text-muted" style="font-size:0.85rem;margin-left:10px">{{ giveDateTime(comment[index][0].created) }}</span>
                    <span class="role">{{ (comment[index][0].role) ? comment[index][0].role : '' }}</span><br>
                    <h3 class="subheading">{{ comment[index][0].content.title }}</h3>
                    <p>{{ comment[index][0].content.text }}</p>
                    <label for="Comment" class="d-block"  v-b-toggle="'collapse'+index"  ref="card-google-doc"  >Add comment</label>

                    <b-collapse :id="'collapse'+index" >
                        <b-row align-h="center" class="mb-2">
                            <b-col md="11">
                                <b-form-group id="reply-group-1">
                                    <b-form-textarea
                                        size="sm"
                                        rows="1"
                                        max-rows="5"
                                        v-model="replyTexts[index]" placeholder="Add your comment here ... " />
                                </b-form-group>
                                <b-button :disabled="(replyTexts[index]) ? false : true"
                                    size="sm" type="submit" variant="secondary" 
                                    @click="newComment(comment[index][0].id, index)"
                                >Reply</b-button>
                            </b-col>
                        </b-row>                   
                    </b-collapse>

                    <div class="replies" v-if="comment[index][1].length > 0">
                        <hr>
                        <ul class="reply-list">
                            <li v-if="replyIndex < situation[0]" v-for="(reply,replyIndex) in comment[index][1]" >
                                <CommentReply :reply=reply />
                            </li>
                        </ul>
                        <div v-if="comment[index][1].length > situation[0]"  style="text-align:center;">
                            <p  for="username" @click.prevent="expand(index)" >Show more replies ...</p>
                        </div>
                        
                    </div>

                </div>
            </b-col>
        </b-row>        
    </b-container>
</template>


<script>

    import {mapState} from 'vuex'

    import CommentReply from "./CommentReply";

    export default {
        name: "Thread",
        components: {
            CommentReply
        },
        data(){
            return {
                isGoogleDocImporterVisible:false,
                replyTexts: []
            } 
        },
        props: {
            comment: {
              type: Array,
              default: []
            },
            situation:{
                type: Array,
                default: null
            },
            index:{
                type: Number,
                default: null
            },
            treeSituation:{
                type: Array,
                default: []
            }
        },
        computed: {
            ...mapState('user', [
                'logged','infos'
            ]),
            ...mapState('project', {
                comments: state => state.projectComments
            }),
        },
        methods:{
            giveDateTime(timestamp) {
                var date = new Date(timestamp);
                var date_time =  date.getDate() +'.'+ (date.getMonth()+1) +'.'+ date.getFullYear()+', '+ date.getHours() +':'+ (date.getMinutes()<10?'0':'') + date.getMinutes();
                //console.log( date_time );
                return date_time;
            },
            getCollapseId(index){
                return "google-doc-collapse-"+index
            },
            expand(index) {
                //alert('clikced expanded')
                this.treeSituation[index][0] += 10;

                this.treeSituation.push( ['dummy object'] );
                this.treeSituation.pop();

                //console.log( 'expand');
                console.log( this.treeSituation );
            },
            newComment: function(parentId, index) {
                console.log('reply comment on topic- has parent');
                console.log(parentId)
                //this.newSituationOnLoad = false;
                //this.replySubmitted = index;

                let comment = {
                    user_id: this.infos.id,
                    parent: parentId,
                    text:null,
                    content: {
                        text: this.replyTexts[index]
                    }
                };

                this.$store.dispatch('project/setProjectComment',{'short_name':'masks4all', 'comment':comment }).then(res => {
                    if(res.status=='success'){
                        this.replyTexts[index]=''
                        this.$store.dispatch('project/getProjectComments','masks4all' ).then(res => {});
                    }
                });

            }
        }
    
    }

</script>