<template>
  <div>
    <multiselect 
      v-model="value" 
      :options="filterOptions"
      :multiple="false"
      :height="500"
      :taggable="true" 
      @tag="addTag"
      @select="selectSpecie"
      group-values="options" 
      group-label="label" 
      :group-select="false" 
      placeholder="Family, Genus, Binomial or Common Name" 
      tag-placeholder="Click to add" 
      trackBy="value" 
      label="value"
      :clearOnSelect="true">
    </multiselect>
    
    <label class="typo__label"></label>
    <div v-if="value.value != 'Family, Genus, Binomial or Common Name' || value.length >0 " style='margin-bottom:1em'>
      <a href="#" block v-b-toggle.taxonomy variant="info">More info</a>
      <b-collapse id="taxonomy" >
        <b-card-body>
          <ul>
            <li v-if="value.value">name: {{ value.value }}</li>
            <li v-if="value.synonyms">synonyms: {{ value.synonyms.join(',') }}</li>
            <li v-if="value.type">type: {{ value.type }}</li>
            <li v-if="value.genus">genus: {{ value.genus }}</li>
            <li v-if="value.family">family:  {{ value.family }}</li>
            <li v-if="value.commonName">Common name: {{ value.commonName }}</li>
          </ul>
        </b-card-body>
      </b-collapse>
    </div>
  </div>
</template>

<script>
  import { mapState, mapActions, mapGetters, mapMutations } from 'vuex'
  import Multiselect from 'vue-multiselect'
  import snakes from '@/assets/snakes.json'

  export default {
    name: 'DropdownSelectSnakes',
    components: { Multiselect },
    data (){
      return { 
        value: {"value":"Family, Genus, Binomial or Common Name"},
        options:snakes
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
    methods : {
      ...mapActions('snakes', [
        'addSnake'
      ]),

      selectSpecie(sp){       
        this.value = sp
        this.addSnake(sp.value)
      },
      addTag (newTag) {
        const tag = {
          value: newTag,
          code: newTag.substring(0, 2) + Math.floor((Math.random() * 10000000))
        }
        this.options.push(tag)
        this.value = tag
        this.addSnake(tag.value)
      }
    }
    
  }
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
