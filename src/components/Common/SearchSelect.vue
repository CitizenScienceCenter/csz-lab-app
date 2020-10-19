<i18n>
    {
    "en": {

    "label-families": "Families",
    "label-genera": "Genera",
    "label-binomials": "Binomials"

    },
    "de": {

    "label-families": "Familien",
    "label-genera": "Genera",
    "label-binomials": "Binomiale"

    }
    }
</i18n>

<template>
    <div class="search-select">

        <div ref="input" class="custom-input" :class="{'disabled':disabled}">
            <input type="text" ref="answer"
                :placeholder="placeholder"
                v-model="inputValue"
                v-on:keyup.prevent="handleInputKeys"
                @click.prevent="!showResults ? showResults = true : showResults = false"
                @blur="inputBlur"
                :class="{'italic': returnObject && Object.keys(returnObject).length > 0 && returnObject.type === 'binomial' && !showResults}" />
            <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve">
                <path d="M127.3,192h257.3c17.8,0,26.7,21.5,14.1,34.1L270.1,354.8c-7.8,7.8-20.5,7.8-28.3,0L113.2,226.1 C100.6,213.5,109.5,192,127.3,192z"/>
            </svg>
        </div>


        <div v-show="showResults && maxOptionIndex >= 0" ref="results" class="results">
            <ul @click="clickOnResults">
                <div v-for="filteredOptionContainer in filteredOptionContainers">
                    <li class="label" v-if="filteredOptionContainer.options.length > 0 && filteredOptionContainer.showLabel">
                        {{ $t(filteredOptionContainer.label) }}
                    </li>
                    <li v-for="(option,index) in filteredOptionContainer.options"
                        :ref="'option_'+(index+filteredOptionContainer.startId)"
                        @click="optionClick( (index+filteredOptionContainer.startId) )"
                        :class="{
                            'binomial' : filteredOptionContainer.label === 'label-binomials',
                            'focused' : focusedOptionIndex === index+filteredOptionContainer.startId
                        }">
                        {{ option.value }}
                        <div class="aka" v-if="( filteredOptionContainer.foundInCommonName && filteredOptionContainer.foundInCommonName[index] ) || ( filteredOptionContainer.foundInSynonyms[index] && filteredOptionContainer.foundInSynonyms[index].length > 0 )">
                            <span class="label">aka: </span>
                            <span class="commonName" v-if="filteredOptionContainer.foundInCommonName[index]">{{ option.commonName }}</span>
                            <span class="synonym" v-for="synonymIndex in filteredOptionContainer.foundInSynonyms[index]">{{ option.synonyms[synonymIndex] }}</span>
                        </div>
                    </li>
                </div>
            </ul>
        </div>
    </div>
</template>

<script>
    export default {
        name: "SearchSelect",
        data() {
            return {
                focusedOptionIndex: 0,
                maxOptionIndex: 0,
                inputValue: '',
                returnObject: null,
                showResults: false
            }
        },
        props: {
            value: {
                type: Object,
                default: function() { return {} }
            },
            placeholder: {
                type: String,
                default: ''
            },
            optionContainers: {
                type: Array,
                default: function () { return [] }
            },
            disabled: {
                type: Boolean,
                default: false
            }
        },
        mounted() {
            this.setAnswerFocus();
            window.addEventListener("resize", this.resize);
            window.addEventListener("scroll", this.scroll);
        },
        watch: {
            showResults: function(to, from) {
                if( to ) {
                    const self = this;
                    self.setResultSize();
                }
            },
            value: function(to, from) {

                if( this.value && Object.keys(this.value).length > 0 ) {
                    this.showResults = false;
                }
                else if( this.value === null ) {
                    this.setAnswerFocus();
                    this.returnObject = null;
                    this.inputValue = '';
                }
            },
            returnObject( to, from ){
                this.$emit('input', this.returnObject );
            },
            inputValue: function(to, from) {

                //if( !this.returnObject || !this.returnObject.hasOwnProperty('info') ) {
                if( !this.returnObject || Object.keys(this.returnObject).length === 0 ) {
                    this.returnObject = {};
                }
                else {
                    if( this.returnObject.value !== this.inputValue ) {
                        this.returnObject = {};
                    }
                }

                this.$emit('input', this.returnObject );


                if( this.inputValue !== '' ) {
                    if( this.value ) {
                        if( this.inputValue !== this.value.value ) {
                            this.showResults = true;
                        }
                        else {
                            this.showResults = false;
                        }
                    }
                    else {
                        this.showResults = true;
                    }
                }
                else {
                    this.showResults = false;
                }

                this.$refs.results.scrollTop = 0;

            }
        },
        computed: {
            filteredOptionContainers: function() {

                if( this.optionContainers && this.optionContainers.length > 0 ) {
                    let filteredOptionContainers = [];

                    let self = this;
                    for( let i = 0; i < this.optionContainers.length; i++ ) {


                        let filteredOptionContainer = { 'label': this.optionContainers[i].label, 'showLabel': this.optionContainers[i].showLabel, 'options': [], 'foundInCommonName': [], 'foundInSynonyms': [] };

                        let options;
                        if( this.inputValue.length > 0 ) {

                            options = this.optionContainers[i].options.filter( function(option) {

                                let foundInValue = false;
                                let foundInCommonName = false;
                                let foundInSynonyms = [];

                                if( option.value.toUpperCase().includes( self.inputValue.toUpperCase() ) ) {
                                    foundInValue = true;
                                }

                                if ( option.commonName && option.commonName.toUpperCase().includes( self.inputValue.toUpperCase() ) ) {
                                    foundInCommonName = true;
                                }

                                if ( option.synonyms && option.synonyms.length > 0 ) {
                                    // check synonyms if exist
                                    for( let j = 0; j < option.synonyms.length; j++ ) {
                                        if( option.synonyms[j].toUpperCase().includes( self.inputValue.toUpperCase() ) ) {
                                            foundInSynonyms.push( j );
                                        }
                                    }
                                }

                                if( foundInValue || foundInCommonName || foundInSynonyms.length > 0 ) {
                                    filteredOptionContainer.foundInCommonName.push(foundInCommonName);
                                    filteredOptionContainer.foundInSynonyms.push(foundInSynonyms);
                                    return true;
                                }
                                else {
                                    return false;
                                }

                            } );

                        }
                        else {
                            options = this.optionContainers[i].options;
                        }

                        filteredOptionContainer.options =  options;

                        // startIds for ref rendering
                        let startId = 0;
                        if( i > 0 ) {

                            startId = filteredOptionContainers[i-1].startId + filteredOptionContainers[i-1].options.length;

                        }
                        filteredOptionContainer.startId = startId;

                        filteredOptionContainers.push( filteredOptionContainer );

                    }

                    this.focusedOptionIndex = 0;
                    this.maxOptionIndex = filteredOptionContainers[filteredOptionContainers.length-1].startId + filteredOptionContainers[filteredOptionContainers.length-1].options.length -1;

                    return filteredOptionContainers;
                }
                else {
                    return {}
                }
            }
        },
        methods: {
            setResultSize() {

                this.$refs.answer.scrollIntoViewIfNeeded();

                let inputRect = this.$refs.input.getBoundingClientRect();

                let maxHeight;
                if( window.innerHeight - (inputRect.y+inputRect.height/2) > window.innerHeight/3 ) {
                    //downwards
                    maxHeight = window.innerHeight- (inputRect.y+inputRect.height);
                    this.$refs.results.classList.remove('upwards');
                }
                else {
                    //upwards
                    maxHeight = inputRect.y;
                    this.$refs.results.classList.add('upwards');
                }

                maxHeight *= 0.8;
                this.$refs.results.style.maxHeight = maxHeight+'px';


            },
            resize() {
              if( this.showResults ) {
                  this.setResultSize();
              }
            },
            scroll() {
                if( this.showResults ) {
                    this.setResultSize();
                }
            },
            setAnswerFocus() {

                if( window.innerWidth >= 1024 ) {
                    this.$refs.answer.focus();
                }

            },
            inputBlur: function() {
                const self = this;
                setTimeout(function(){
                    self.showResults = false;
                }, 500);
            },
            clickOnResults: function() {
                this.setAnswerFocus();
            },
            optionClick(id) {
                this.focusedOptionIndex = id;
                this.selectOptionById(id);
            },
            selectOptionById(id) {
                let counter = 0;
                let found = false;
                for( let i = 0; i < this.filteredOptionContainers.length; i++ ) {
                    for( let j = 0; j < this.filteredOptionContainers[i].options.length; j++ ) {
                        if( counter === id ) {
                            found = true;
                            this.returnObject = this.filteredOptionContainers[i].options[j];
                            break;
                        }
                        counter++;
                    }
                    if( found ) {
                        break;
                    }
                }
                this.inputValue = this.returnObject.value;
            },
            handleInputKeys: function(event) {
                if( this.showResults ) {

                    switch(event.key) {
                        case 'ArrowDown':
                            if( this.focusedOptionIndex < this.maxOptionIndex ) {
                                this.focusedOptionIndex++;
                                //this.$refs['option_'+this.focusedOptionIndex][0].scrollIntoView({block: "end"});

                                if( this.$refs['option_'+this.focusedOptionIndex][0].offsetTop + this.$refs['option_'+this.focusedOptionIndex][0].offsetHeight - this.$refs.results.scrollTop > this.$refs.results.offsetHeight ) {
                                    this.$refs.results.scrollTop = this.$refs['option_'+this.focusedOptionIndex][0].offsetTop - ( this.$refs.results.offsetHeight - this.$refs['option_'+this.focusedOptionIndex][0].offsetHeight );
                                }

                            }
                            break;
                        case 'ArrowUp':
                            this.$refs.answer.setSelectionRange(this.inputValue.length,this.inputValue.length);
                            if( this.focusedOptionIndex > 0 ) {
                                this.focusedOptionIndex--;
                                //this.$refs['option_'+this.focusedOptionIndex][0].scrollIntoView({block: "end"});

                                if( this.$refs['option_'+this.focusedOptionIndex][0].offsetTop < this.$refs.results.scrollTop ) {
                                    this.$refs.results.scrollTop = this.$refs['option_'+this.focusedOptionIndex][0].offsetTop;
                                }

                            }
                            else {
                                this.$refs.results.scrollTop = 0;
                            }
                            break;
                        case 'Tab':
                        case 'Enter':
                            if( this.$refs['option_'+this.focusedOptionIndex][0] ) {
                                this.selectOptionById(this.focusedOptionIndex);
                            }
                            break;
                        case 'Escape':
                            this.showResults = false;
                            break;
                    }
                }
            }
        }
    }
</script>

<style lang="scss">


    @import '@/styles/theme.scss';
    @import '@/styles/shared/variables.scss';

    .search-select {
        position: relative;

        .custom-input {

            input {
                padding-right: 32px!important;
            }

            svg {
                position: absolute;
                top: 13px;
                right: 10px;
                height: 12px;
                fill: $color-black;
                pointer-events: none;
            }

            &.disabled {
                pointer-events: none;
                opacity: 0.25;
            }

            input.italic {
                font-style: italic;
            }
        }

        .results {

            z-index: 100;
            position: absolute;
            top: 40px;
            left: 0;
            width: 100%;
            overflow: hidden;
            overflow-y: scroll;

            background: white;
            border-radius: $border-radius;
            box-shadow: 0px 0px 12px -4px rgba($color-black, 0.4);

            &.upwards {
                top: auto;
                bottom: 40px;
            }

            ul {

                li {
                    margin: 0;
                    padding: $spacing-1 $spacing-2;
                    line-height: 1.5;
                    color: $color-black-tint-40;

                    &.label {
                        font-size: $font-size-small;
                        font-weight: 700;
                        color: $color-black;
                        line-height: 2;
                    }

                    &:before {
                        display: none;
                    }

                    &.focused {
                        background: $color-primary;
                        color: white;
                    }

                    cursor: pointer;

                    &.binomial {
                        font-style: italic;

                        .aka {
                            margin-top: 4px;
                            font-size: $font-size-small;

                            .label {
                                font-style: normal;
                            }
                            .commonName, .synonym {
                                &:after {
                                    content: ', ';
                                }
                                &:last-child {
                                    &:after {
                                        content: '';
                                    }
                                }
                                &.commonName {
                                    font-style: normal;
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    @media only screen and (min-width: $viewport-tablet-portrait) {

        .search-select {

            .results {
                top: 48px;

                &.upwards {
                    bottom: 48px;
                }

            }

        }

    }


</style>
