<template>
    <div :class="{'accepted':gdprAccepted}" class="gdpr">
        <div class="content-wrapper">
            <div class="row row-centered">
                <div class="col centered">
                    <div class="drawer">
                        <span>{{ $t('text-cookies') }}</span>
                        <b-button v-if="!logged" variant="primary" @click.prevent="acceptGdpr()">OK</b-button>
                        <span v-else>
                            <b-button variant="primary" @click.prevent="acceptGdpr()">OK</b-button>
                            <!--<b-button variant="primary" @click.prevent="detailsGdpr()">More</b-button>-->
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

    import {mapState} from 'vuex'

    export default {
        name: "GDPR",
        mounted(){
            if (localStorage.getItem('gtag')){
                const data = JSON.parse(localStorage.getItem('gtag'))
                this.gdprAccepted = data['status']
            }
        },
        data: () => {
            return {
                gdprAccepted:false
            }
        },
        methods: {
            acceptGdpr() {
                localStorage.setItem('gtag', JSON.stringify({status:true,id:(this.logged) ? this.infos.id : null}));
                this.gdprAccepted = true
                window['ga-disable-UA-162894944-1'] = false;
            },
            detailsGdpr(){
                this.$router.push({ name: 'profile.edition' })
            }
        },
        computed: {
            ...mapState('user', [
            'logged','infos'
            ])
        }
    }
</script>

<style lang="scss">
    @import '@/styles/themes.scss';
    @import '@/styles/variables.scss';

    .gdpr {
        position: fixed;
        bottom: 0;
        width: 100%;
        pointer-events: none;
        z-index: 500;
        text-align: center;

        .drawer {
            display: inline-block;
            pointer-events: all;
            background-color: rgba( $color-black, 0.8 );
            color: white;
            padding: $spacing-2 $spacing-4;
            border-top-left-radius: $border-radius;
            border-top-right-radius: $border-radius;

            span {
                font-size: $font-size-normal;
                margin-right: $spacing-2;
            }
        }


        &.accepted {
            display: none;
        }
    }


    @media only screen and (min-width: $viewport-tablet-portrait) {

        .gdpr {
            .drawer {
                button {
                    height: 40px;
                    padding: 0 20px;
                }
            }
        }

    }

</style>
