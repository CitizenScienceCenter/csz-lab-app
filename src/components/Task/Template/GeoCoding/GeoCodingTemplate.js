// eslint-disable-next-line no-unused-vars
const component =
  {
    template: `
      <!-- This template use https://bootstrap-vue.js.org/ and https://vuelayers.github.io -->

      <div>
        <!-- Form -->
        <b-row v-if="!jobDone">
          <b-col>
            <h2>{{ taskInfo.question }}</h2>
            <h4>{{ localizationName }}</h4>
            
            <div class="mt-4">
              <b-btn @click="addMarker" :disabled="markedPlaces.length > 0" variant="primary" class="mt-2 mt-md-0">Add a marker</b-btn>
              <b-btn @click="deleteMarker" v-if="markedPlaces.length > 0" variant="danger" class="mt-2 mt-md-0">Delete the marker</b-btn>
              <b-btn @click="skipTask" v-if="markedPlaces.length === 0" class="mt-2 mt-md-0">I have not found if, continue to the next task</b-btn>
            </div>
            
            <p class="mt-2">Task: <b-badge variant="warning">{{ task.id }}</b-badge></p>
            
          </b-col>
        </b-row>
      
        <b-row v-if="!jobDone">
          <b-col>
            <!-- Map -->
            <vl-map
                  :load-tiles-while-animating="true"
                  :load-tiles-while-interacting="true"
                  style="height: 400px"
            >
              <vl-view :zoom.sync="zoom" :center.sync="center" :rotation.sync="rotation"></vl-view>
        
              <!-- City marker -->
              <vl-feature id="city-marker">
                <vl-geom-point :coordinates="localization"></vl-geom-point>
                <vl-style-box>
                  <vl-style-icon src="https://i.imgur.com/IYuHNue.png" :scale="0.5" :anchor="[0.5, 1]"></vl-style-icon>
                </vl-style-box>
              </vl-feature>
              
              <!-- Display a bounding box over the current location -->
              <vl-feature v-if="boundingbox.length > 0">
                <vl-geom-polygon :coordinates="boundingbox"></vl-geom-polygon>
              </vl-feature>
        
              <!-- Display all the points -->
              <vl-feature :key="index" v-for="(pointer, index) in markedPlaces">
                <vl-geom-point :coordinates="pointer.geometry.coordinates"></vl-geom-point>
                <vl-style-box>
                  <vl-style-icon src="https://i.imgur.com/FlxUAyh.png" :scale="0.5" :anchor="[0.5, 1]"></vl-style-icon>
                </vl-style-box>
              </vl-feature>
              
              <!-- Drawer -->
              <vl-layer-vector id="draw-pane">
                <vl-source-vector ident="draw-target" :features.sync="markedPlaces"></vl-source-vector>
              </vl-layer-vector>
              <vl-interaction-draw v-if="canAddMarker && markedPlaces.length === 0" source="draw-target" type="point"></vl-interaction-draw>
        
              <!-- Display the Open street map -->
              <vl-layer-tile id="osm">
                <vl-source-osm></vl-source-osm>
              </vl-layer-tile>
            </vl-map>
    
            <!-- Selected position coordinates -->
            <div class="mt-2">
              Selected position: 
              <ul>
                <li>Longitude <b-badge>{{ markedPlaces.length > 0 ? markedPlaces[0].geometry.coordinates[0] : '-' }}</b-badge></li>
                <li>Latitude <b-badge>{{ markedPlaces.length > 0 ? markedPlaces[0].geometry.coordinates[1] : '-' }}</b-badge></li>
              </ul>
            </div>
            
          </b-col>
        </b-row>
        
        <!-- Submit button -->
        <b-row v-if="!jobDone">
          <b-col>
            <b-btn @click="submit" variant="success" size="lg">Save these coordinates</b-btn>     
          </b-col>
        </b-row>
        
        <!-- Task end message -->
        <b-row v-if="jobDone">
          <b-col>
            <b-jumbotron header="This the end!" lead="Thanks you for your participation"></b-jumbotron>
          </b-col>
        </b-row>
      </div>`,

    data: {
      zoom: 15,
      center: [0, 0],
      rotation: 0,

      localizationName: '',
      localization: [0, 0],
      boundingbox: [],

      canAddMarker: false,
      markedPlaces: [],

      jobDone: false
    },

    methods: {

      addMarker () {
        this.canAddMarker = true
      },

      deleteMarker () {
        this.canAddMarker = false
        this.markedPlaces = []
      },

      skipTask () {
        this.pybossa.saveTask(null)
      },

      submit () {
        if (this.markedPlaces.length > 0) {
          this.pybossa.saveTask(this.markedPlaces[0].geometry.coordinates)
        }
      }
    },

    computed: {
      task () {
        return this.pybossa.task
      },
      taskInfo () {
        return this.task && this.task.info ? this.task.info : {}
      }
    },

    watch: {
      task (task) {
        this.canAddMarker = false
        this.markedPlaces = []

        if (task.info) {
          this.pybossa.qetLocalizationsWithQuery(task.info.city).then(results => {
            if (results.length > 0) {
              const place = results[0]

              this.localization = [
                parseFloat(place.lon),
                parseFloat(place.lat)
              ]

              const box = place.boundingbox.map(coordinate => {
                return parseFloat(coordinate)
              })

              const latA = box[0]
              const latB = box[1]
              const lonA = box[2]
              const lonB = box[3]
              this.boundingbox = [[
                [lonA, latA], [lonA, latB], [lonB, latB], [lonB, latA], [lonA, latA]
              ]]

              this.localizationName = place.display_name
              this.center = this.localization
            }
          })
        } else {
          this.jobDone = true
        }
      }
    },

    created () {

    },

    mounted () {
      this.pybossa.run()
    },

    props: {
      /* Injected by the Pybossa App */
      pybossa: {
        required: true
      }
    }
  }

export default component
