<template>
    <b-container>
        <b-row class="mt-4 justify-content-center">
            <b-col md="6" md-offset="3">

                <h1>{{ $t('reset-password') }}</h1>

                <b-form class="mt-4" @submit.prevent="onSubmit">
                    <b-form-group
                            id="input-group-1"
                            :label="$t('login-input-email')"
                            label-for="email">
                        <b-form-input
                                id="email"
                                v-model="form.email"
                                type="email"
                                required
                                :placeholder="$t('login-input-email-placeholder')">
                        </b-form-input>
                    </b-form-group>

                    <b-button type="submit" variant="primary">{{$t('submit-btn')}}</b-button>
                </b-form>

            </b-col>
        </b-row>
    </b-container>
</template>

<script>
    import { mapActions } from 'vuex'

    export default {
        name: 'ResetPassword',
        data: () => ({
            form: {
                email: ''
            }
        }),
        methods: {
            ...mapActions('user', [
                'forgotPassword'
            ]),

            onSubmit () {
                this.forgotPassword(this.form.email)
            }
        }
    }
</script>

<style scoped>

</style>