<template>
    <b-container>
        <b-row align-h="center" class="mb-5">
            <b-col md="9">
                <div class="comment comment-existing" style="padding: 10px 60px; border:1px solid;">
                    <!--<p>{{ reply.content.text }}</p>-->
                    <span class="date">{{ giveDateTime(reply.created) }}</span>
                    <span class="username">by {{ reply.username }}</span>
                    <span class="role">({{ reply.role }})</span>
                </div>
            </b-col>
        </b-row>
        <hr>
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
              type: Array,
              default: []
            }
        },
        computed:{
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