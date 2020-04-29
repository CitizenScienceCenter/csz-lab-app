<template>
    <b-container>
            <b-row align-h="center" class="mb-5">
                <b-col md="9">
                    <div class="comment comment-existing withTitles"  style="border: 1px solid green;">

                        <!--<b-img v-if="infos.avatar_url" height="32" width="32" rounded="circle" :src="infos.avatar_url"></b-img>
                        <b-img v-else height="32" width="32" rounded="circle" :src='defaultImage' ></b-img>&ensp;-->
                        <h3 class="subheading">Comment ID: {{ comment.id }}</h3>
                        <h3 class="subheading">{{ comment[index][0].content.title }}</h3>
                            
                            <p>{{ comment[index][0].content.text }}</p>
                            <span class="date">{{ giveDateTime(comment[index][0].created) }}</span>
                            <span class="username">by {{ comment[index][0].username }}</span>
                            <span class="role">({{ comment[index][0].role }})</span>

                            <template v-if="logged">

                               <b-button size="sm"  variant="primary"
                                   v-b-toggle="'google-doc-collapse'+index"  ref="card-google-doc" class="text-center material" :class="{ 'material-selected': isGoogleDocVisible }"
                                   >{{ $t('reply-button') }}</b-button>    

                                <b-collapse :id="'google-doc-collapse'+index" v-model="isGoogleDocVisible">

                                    <b-form-group
                                        id="reply-group-1"
                                        label="Reply to comment"
                                        label-for="reply"
                                        description="Reply to comment">
                                        <b-form-textarea
                                            size="lg"
                                            v-model="replyTexts[index]" :placeholder="$t('reply-placeholder')" />
                                    </b-form-group>
                                           
                                </b-collapse>

                                    <div class="replies" v-if="comment[index][1].length > 0">

                                        <ul class="reply-list">

                                            <li v-if="replyIndex < situation[0]" v-for="(reply,replyIndex) in comment[index][1]" >

                                                <CommentReply :reply=comment[index][1] />
                                               
                                            </li>

                                        </ul>

                                        <div v-if="comment[index][1].length > situation[0]" class="button-group">
                                            <button @click.prevent="expand(index)" class="button button-secondary button-secondary-naked">{{ $t('more-replies-button') }}</button>
                                        </div>

                                    </div>                                    
                                
                            </template>
                            
                    </div>
                </b-col>
            </b-row>

            <hr>

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
            }
        },
        computed:{
            ...mapState('user', [
                'logged','infos'
            ]),
            isGoogleDocVisible: {
                get () {
                    return this.isGoogleDocImporterVisible
                }
            }
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
            }
        }
    
    }

</script>