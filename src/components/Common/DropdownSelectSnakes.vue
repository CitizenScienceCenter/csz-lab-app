<template>
  <div>
  <!--<label class="typo__label">Groups</label>
  <multiselect 
    v-model="value" 
    tag-placeholder="Add this as new tag"
    :taggable="true" 
    @tag="addTag"
    :options="options" 
    :multiple="false" 
    group-values="options" 
    group-label="label" 
    :group-select="false" 
    placeholder="Family, Genus, Binomial or Common Name" 
    track-by="value" 
    label="value">
    <span slot="noResult">Oops! No elements found. Consider changing the search query.</span>

  </multiselect>
  <pre class="language-json"><code>{{ value }}</code></pre>-->

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
  <label class="typo__label">Groups</label>
  <pre class="language-json"><code>{{ value }}</code></pre>
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

        filteredRound1 = temp.filter((obj)=>{ return obj.label == 'label-binomials' })
        
        filteredRound2 = filteredRound1[0].options.filter((obj)=>{ return obj.value != '' })

        let index = temp.findIndex(x => x.label ==="label-binomials");

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
