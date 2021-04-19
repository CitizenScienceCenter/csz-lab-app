<template>
  <div>
    <multiselect
      v-model="value"
      :options="dynamicList"
      :block-keys="['Tab', 'Enter']"
      :multiple="false"
      :height="500"
      :taggable="true"
      @tag="addTag"
      @select="selectSpecie"
      @search-change="changeSearch"
      @open="openSelect"
      @input="valueChange"
      group-values="options"
      group-label="label"
      :group-select="false"
      :placeholder="defaultText"
      tag-placeholder=""
      trackBy="value"
      label="value"
      :custom-label="customLabel"
      :options-limit="totalItems"
      :clearOnSelect="false"
      :close-on-select="true"
      selectLabel="Please click to select"
      deselectLabel="Selected"
    >
      <template slot="singleLabel" slot-scope="props">
        <p>{{ props.option.value }}</p>
      </template>
      <template slot="option" slot-scope="props">
        <div>
          <!-- <div>{{props}}</div> -->
          <span v-if="props.option.isTag">{{ props.search }}</span>
          <span v-if="props.option.$groupLabel">{{
            props.option.$groupLabel
          }}</span>
          <p v-if="props.option.value">{{ props.option.value }}</p>
          <small class="common-name" v-if="props.option.resumedCommonName">
            aka: {{ props.option.resumedCommonName }}
          </small>
          <small
            class="common-name"
            v-if="
              props.option.commonName &&
                typeof props.option.commonName == 'string'
            "
          >
            aka: {{ props.option.commonName }}
          </small>
        </div>
      </template>
    </multiselect>

    <label class="typo__label"></label>
    <div
      v-if="
        value.value != 'Family, Genus, Binomial or Common Name' ||
          value.length > 0
      "
      style="margin-bottom:1em"
    >
      <a href="#" block v-b-toggle.taxonomy variant="info">More info</a>
      <b-collapse id="taxonomy">
        <b-card-body>
          <ul>
            <li v-if="value.value">name: {{ value.value }}</li>
            <li v-if="value.synonyms">
              synonyms: {{ value.synonyms.join(",") }}
            </li>
            <li v-if="value.type">type: {{ value.type }}</li>
            <li v-if="value.genus">genus: {{ value.genus }}</li>
            <li v-if="value.family">family: {{ value.family }}</li>
            <li v-if="value.commonName">Common name: {{ value.commonName }}</li>
          </ul>
        </b-card-body>
      </b-collapse>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters, mapMutations } from "vuex";
import Multiselect from "vue-multiselect";
import snakes from "@/assets/snakes.json";

export default {
  name: "DropdownSelectSnakes",
  components: { Multiselect },
  data() {
    return {
      value: "",
      defaultText:
        "Type at least 2 letters for Family, Genus, Binomial or Common Name",
      totalItems: 0,
      fullList: snakes,
      dynamicList: [],
      itemSelected: false
    };
  },
  computed: {
    ...mapState("snakes", ["snake"]),
    setTotalItems() {
      // Get the total of options for dropdown select just for families and genus
      this.totalItems =
        this.dynamicList.reduce(function(t, i) {
          return t + i.options.length;
        }, 0) +
        this.dynamicList.length +
        1; // this consider the rows for groups and tag
    }
  },
  methods: {
    ...mapActions("snakes", ["addSnake"]),
    filterOptions() {
      let filteredRound1, filteredRound2;
      const temp = JSON.parse(JSON.stringify(this.fullList));

      filteredRound1 = temp.filter(obj => {
        return obj.label == "Binomials";
      });

      filteredRound2 = filteredRound1[0].options.filter(obj => {
        return obj.value != "" && obj.value != undefined;
      });

      let index = temp.findIndex(x => x.label === "Binomials");

      temp[index]["options"] = filteredRound2;

      return temp;
    },

    selectSpecie(sp) {
      this.value = sp;
      this.addSnake(sp.value);
      this.itemSelected = true;
    },
    addTag(newTag) {
      const tag = {
        value: newTag,
        code: newTag.substring(0, 2) + Math.floor(Math.random() * 10000000)
      };
      this.options.push(tag);
      this.value = tag;
      this.addSnake(tag.value);
    },
    changeSearch(searchQuery) {
      if (searchQuery.length > 0 && searchQuery.length < 2) {
        this.dynamicList = [];
        this.setTotalItems;
        return;
      }
      if (!this.itemSelected && searchQuery) {
        searchQuery = searchQuery.toLowerCase();
        this.dynamicList = this.filterOptions();
        this.dynamicList.forEach(element => {
          element.options = element.options.filter(x => {
            if (x.value.toLowerCase().includes(searchQuery)) {
              return x;
            } else if (x.commonName) {
              if (Array.isArray(x.commonName)) {
                x["resumedCommonName"] = this.getSimilar(
                  x.commonName,
                  searchQuery
                );
                return x;
              } else if (x.commonName.toLowerCase().includes(searchQuery)) {
                return x;
              }
            }
          });
        });
        this.setTotalItems;
      }
    },
    openSelect() {
      this.itemSelected = false;
      this.setTotalItems;
    },
    valueChange(newValue) {
      if (!newValue) {
        this.value = {
          value: this.defaultText
        };
      }
    },
    customLabel({ value, commonName }) {
      if (commonName) {
        return `${value} – ${commonName}`;
      }
      return `${value}`;
    },

    getSimilar(names, query) {
      //Return the 2 most similar elements from array to searching text
      if (names.some(x => x.toLowerCase().includes(query))) {
        const [first_match, second_match] = names.filter(x =>
          x.toLowerCase().includes(query)
        );
        return second_match ? first_match + ", " + second_match : first_match;
      }
    }
  },
  created() {
    // Initial set of variables
    this.setTotalItems;
  },
  watch: {
    snake() {
      if (!this.snake) {
        this.value = "";
      }
    }
  }
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style lang="scss">
@import "@/scss/variables.scss";
.multiselect__element {
  .multiselect__option--highlight {
    background: $color-secondary-tint-30;
    &.multiselect__option--selected {
      background: $color-primary-tint-30;
      p {
        font-weight: bold;
      }
    }
    &.multiselect__option--selected::after {
      content: attr(data-deselect);
      background: $color-primary-tint-30;
    }
    .common-name {
      color: whitesmoke;
    }
  }
  .multiselect__option--selected {
    p {
      font-weight: bold;
    }
  }
  .multiselect__option--highlight::after {
    content: attr(data-select);
    background: $color-secondary-tint-30;
  }
}
.common-name {
  color: $color-black-tint-30;
  font-style: italic;
  position: absolute;
  top: 50%;
}
</style>
