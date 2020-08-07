<template>
  <div class="wrapper">
    <!-- Sidebar  -->
    <div class="sidebar" :class="{ active: hidden }">
      <div class="sidebar-header">
        <b-row>
          <b-col cols="10" class="d-flex justify-content-center"
            ><h3>Project Editor</h3></b-col
          >
          <b-col cols="2" class="d-flex justify-content-end"
            ><div v-show="!hidden">
              <b-button @click="hideSidebar" variant="outline-light" class="button">
                <i class="fas fa-arrow-left"></i>
              </b-button>
            </div>
          </b-col>
          <b-col cols="12" class="d-flex justify-content-center">
            <div v-show="hidden">
              <b-button @click="hideSidebar" variant="outline-light">
                <i class="fas fa-arrow-right"></i>
              </b-button></div
          ></b-col>
        </b-row>
      </div>
      <a id="project" @click="changeContent($event)">
        <i class="fas fa-home"></i>
        <span> Project</span>
      </a>
      <a id="about" @click="changeContent($event)">
        <i class="fas fa-users"></i>
        <span>About</span>
      </a>
      <a id="tasks" @click="changeContent($event)">
        <b-row>
          <b-col :cols="!hidden ? '8' : '12'"
            ><i class="fas fa-briefcase"></i> <span> Tasks</span></b-col
          >
          <b-col cols="2" v-show="!hidden">
            <div @click="addComponent('tasks')">
              <i class="fas fa-plus"></i></div
          ></b-col>
        </b-row>
      </a>
      <a>
        <b-row>
          <b-col :cols="!hidden ? '8' : '12'"
            ><i class="fas fa-comments"></i> <span> Forum</span></b-col
          >
          <b-col cols="2" v-show="!hidden"
            ><b-form-checkbox name="check-button" switch size="sm">
            </b-form-checkbox
          ></b-col>
        </b-row>
      </a>
      <a>
        <b-row>
          <b-col :cols="!hidden ? '8' : '12'"
            ><i class="fas fa-question"></i> <span> FAQ</span></b-col
          >
          <b-col cols="2" v-show="!hidden"
            ><b-form-checkbox name="check-button" switch> </b-form-checkbox
          ></b-col>
        </b-row>
      </a>
    </div>
    <!-- Page Content  -->
    <div id="content" :class="{ active: hidden }">
      <div v-show="checkContent('project')">
        <app-cover>
          <h2 class="cover-heading scroll-effect">
            {{ $t("home-heading") }}
          </h2>
          <p class="cover-subheading scroll-effect scroll-effect-delayed-1">
            {{ $t("home-subheading") }}
          </p>
          <p class="text-center scroll-effect scroll-effect-delayed-2">
            <b-button :to="{ name: 'discover' }" variant="primary">{{
              $t("home-start-contributing")
            }}</b-button>
            <!-- Andres: button to test flexy projects -->
            <b-button
              :to="{ name: 'flexyproject.editor' }"
              class="btn-secondary-inverted"
              >Flexy Projects</b-button
            >
          </p>
        </app-cover>
      </div>
      <div v-show="checkContent('about')">
        <app-project-card></app-project-card>
      </div>
      <div v-show="checkContent('tasks')">
        <h1>Tasks</h1>
        <template v-for="(child, index) in children">
          <component :is="child" :key="index">
            <b-button @click="removeComponent(index)" variant="danger"
              ><i class="fas fa-trash"></i
            ></b-button>
          </component>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import Cover from "@/components/Common/Cover";
import ProjectCard from "@/components/Discover";

export default {
  components: {
    "app-cover": Cover,
    "app-project-card": ProjectCard
  },
  data() {
    return {
      hidden: false,
      currentView: "",
      children: []
    };
  },
  methods: {
    hideSidebar() {
      this.hidden = !this.hidden;
    },
    changeContent(event) {
      this.currentView = event.currentTarget.id;
    },
    checkContent(event) {
      return this.currentView === event;
    },

    // Methods for dynamic adding or removing components
    addComponent(idSection) {
      this.children.push(Cover);
      console.log(this.children);
    },
    removeComponent(idComponent) {
      this.children.splice(idComponent, 1);
    }
  },
  created() {
    this.currentView = "project"
  },
};
</script>

<style scoped>
a,
a:hover,
a:focus {
  color: inherit;
  text-decoration: none;
  transition: all 0.2s;
}
i,
span {
  display: inline-block;
}

/* ---------------------------------------------------
    SIDEBAR STYLE
----------------------------------------------------- */

.wrapper {
  display: flex;
}

.sidebar {
  min-width: 250px;
  max-width: 250px;
  background-image: linear-gradient(45deg, #1c4769 50%, #952b3f 100%);
  color: #fff;
  transition: all 0.5s;
  left: 0;
  z-index: 999;
  position: fixed;
  height: 100vh;
}
.sidebar.active {
  min-width: 80px;
  max-width: 100px;
  text-align: center;
}

.sidebar .sidebar-header {
  padding: 18px;
  background: #494a4d;
}
.sidebar.active .sidebar-header h3 {
  display: none;
}
.sidebar-header .button {
  position: relative;
  width: 60px;
  height: 50px;
  background-color: transparent;
  z-index: 999;
  border-radius: 50px;
  border: 0px;
  text-align: center;
}
.sidebar-header .button:hover {
  color: #1c4769;
  background: whitesmoke;
  width: 60px;
  height: 50px;
}

.sidebar a {
  padding: 20px 10px;
  font-size: 1.2em;
  text-align: left;
  display: block;
  cursor: pointer;
}
.sidebar.active a {
  padding: 20px 10px;
  text-align: center;
  font-size: 1.5em;
  cursor: pointer;
}
.sidebar a:hover {
  color: #19191a;
  background: whitesmoke;  
}

.sidebar span{
  transition: font-size 0.5s;
}
.sidebar.active span{
  font-size: 0;
}

.sidebar a i {
  margin-right: 10px;
}
.sidebar.active a i {
  display: block;
  margin-bottom: 5px;
}

/* ---------------------------------------------------
    CONTENT STYLE
----------------------------------------------------- */

#content {
  width: 100%;
  padding: 0px;
  left: 250px;
  position: relative;
  min-height: 100vh;
  transition: all 0.5s;
}
#content.active{
  left: 80px !important;
}

/* ---------------------------------------------------
    MEDIAQUERIES
----------------------------------------------------- */

@media (max-width: 768px) {
  .sidebar {
    min-width: 80px;
    max-width: 80px;
    text-align: center;
    margin-left: -80px !important;
  }
  .dropdown-toggle::after {
    top: auto;
    bottom: 10px;
    right: 50%;
    -webkit-transform: translateX(50%);
    -ms-transform: translateX(50%);
    transform: translateX(50%);
  }
  .sidebar.active {
    margin-left: 0 !important;
  }
  .sidebar .sidebar-header h3 {
    display: none;
  }
  .sidebar .sidebar-header strong {
    display: block;
  }
  .sidebar a {
    padding: 20px 10px;
  }
  .sidebar a span {
    font-size: 0.85em;
  }
  .sidebar a i {
    margin-right: 0;
    display: block;
  }
  .sidebar ul ul a {
    padding: 10px !important;
  }
  .sidebar a i {
    font-size: 1.3em;
  }
  .sidebar {
    margin-left: 0;
  }
  .sidebarCollapse span {
    display: none;
  }
}
</style>
