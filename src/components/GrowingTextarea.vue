<template>
    <div class="growing-textarea">
        <textarea ref="textarea" :placeholder="placeholder" v-model="inputValue" :style="styleObject"></textarea>
        <span ref="text">Joghurt</span>
    </div>
</template>

<script>
    export default {
        name: "GrowingTextarea",
        data() {
            return {
                inputValue: '',
                firstHeight: null,
                lineHeight: null,
                padding: null,
                numberOfLines: 1,
                styleObject: null
            }
        },
        props: {
            placeholder: String,
            value: String,
            fat: Boolean
        },
        mounted() {
            this.firstHeight = this.$refs.textarea.offsetHeight;
            this.padding = this.firstHeight - this.$refs.text.offsetHeight;
            this.lineHeight = this.firstHeight - this.padding;

            if( this.fat ) {
                this.styleObject = {'font-weight':'700'};
            }
        },
        watch: {
            inputValue() {
                this.$emit('input', this.inputValue);

                this.$refs.textarea.style.height = (this.lineHeight + this.padding)+'px';
            },
            value() {
                this.inputValue = this.value;

                this.numberOfLines = Math.floor( this.$refs.textarea.scrollHeight / this.lineHeight );
                this.$refs.textarea.style.height = (this.numberOfLines * this.lineHeight + this.padding)+'px';
            }
        }
    }
</script>

<style lang="scss">

    @import '@/styles/themes.scss';
    @import '@/styles/variables.scss';

    .growing-textarea {
        position: relative;
        textarea {
            display: block;
            height: 40px;
        }
        span {
            position: absolute;
            left: 0;
            top: 0;
            visibility: hidden;
            display: block;
            line-height: 1.5;
        }
    }

    @media only screen and (min-width: $viewport-tablet-portrait) {

        .growing-textarea {
            textarea {
                height: 48px;
            }
        }
    }
</style>
