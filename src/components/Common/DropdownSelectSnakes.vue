
<template>
    <div>
    
    <multiselect
    v-model="value" 
    tag-placeholder="Add this as new tag" 
    placeholder="Family, Genus, Binomial or Common Name" 
    label="value" 
    track-by="value"
    group-values="options" 
    group-label="label" 
    :group-select="false" 
    :options="filterOptions" 
    :multiple="true" 
    :taggable="false"
    @search-change="onChange"
    @tag="addTag"
    @select="selectSpecie"
    @remove="deselectSpecie"
    :close-on-select="true" 
    :clear-on-select="true" 
    :hide-selected="false" 
    :preserve-search="false"
    >
     <span slot="noResult">
      No options matching the query
    </span>
    <span slot="noOptions">
      No options available
    </span>
    </multiselect>
    <br><br>
    
    </div>
    
</template>


<script>
  import { mapState, mapActions, mapGetters, mapMutations } from 'vuex'
  import Multiselect from 'vue-multiselect'
  import snakes from '@/assets/snakes.json'

    export default {
    components: {
        Multiselect
    },
    data () {
        return {
        options: snakes,
        value: []
        }
    },
    computed : {

      filterOptions (){
        
        let filteredRound1,filteredRound2,filteredRound1Options;

        let temp = this.options

        filteredRound1 = temp.filter((obj)=>{ return obj.label == 'Binomials' })
        
        filteredRound2 = filteredRound1[0].options.filter((obj)=>{ return obj.value != '' })

        let index = temp.findIndex(x => x.label ==="Binomials");

        temp[index]['options'] = filteredRound2

        return temp
        
      }
    },
    methods: {
        ...mapActions('snakes', [
            'addSnake'
        ]),
        selectSpecie(sp){  
            this.value.pop()
            this.addSnake(sp.value)
        },
        deselectSpecie({value,id}){
            this.value = [{"value":"Family, Genus, Binomial or Common Name","type":""}]
            this.addSnake(null)
        },
        addTag (newTag) {
            const tag = {
                name: newTag,
                code: newTag.substring(0, 2) + Math.floor((Math.random() * 10000000))
            }
            this.options.push(tag)
            this.value.push(tag)
        },
        onChange (value) {},
    }
    }

</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>