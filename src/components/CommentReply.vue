<template>
    <b-container>
        <b-row align-h="center" >
            <b-col md="9">
                <div class="comment comment-existing" style="padding: 10px 30px; border:1px solid;border-radius:7px;    border-color: lightgray;">
                    <!--<b-img v-if="userProfile.info.avatar_url" height="32" width="32" rounded="circle" :src="userProfile.info.avatar_url"></b-img>
                    <b-img v-else height="32" width="32" rounded="circle" :src='defaultImage' ></b-img>&ensp;-->
                    <label for="username" class="d-block" style="float:left;margin: 0;">{{ reply.username }}</label>
                    <span class="role">{{ (reply.role) ? reply.role : '' }}</span>
                    <span class="date text-muted" style="font-size:0.85rem;margin-left:10px">{{ giveDateTime(reply.created) }}</span>
                    <p >{{ reply.content.text }}</p>                    
                </div>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>

    import {mapState} from 'vuex'

    export default {
        name: "Reply",
        data(){
            return {
                replyTexts: []
            } 
        },
        props: {
            reply: {
              type: Object,
              default: []
            }
        },
        methods:{
            giveDateTime(timestamp) {
                var date = new Date(timestamp);
                var date_time =  date.getDate() +'.'+ (date.getMonth()+1) +'.'+ date.getFullYear()+', '+ date.getHours() +':'+ (date.getMinutes()<10?'0':'') + date.getMinutes();
                //console.log( date_time );
                return date_time;
            }
        }
    
    }

</script>