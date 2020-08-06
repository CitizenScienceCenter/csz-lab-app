<template>
  <div class="wrapper">
    <!-- Sidebar  -->
    <nav id="sidebar" :class="{ active: hidden }">
      <div class="sidebar-header">
        <b-row>
          <b-col cols="12"><h3>Project Editor</h3></b-col>
          <b-col cols="12" class="mr-4"
            ><div v-show="!hidden">
              <b-button @click="onclick" variant="outline-light" size="md">
                <i class="fas fa-arrow-left"></i>
              </b-button>
            </div>
            <div v-show="hidden">
              <b-button @click="onclick" variant="outline-light" size="sm">
                <i class="fas fa-arrow-right"></i>
              </b-button></div
          ></b-col>
        </b-row>
      </div>
      <ul class="list-unstyled components">
        <li id="project" @click="changeContent($event)">
          <a>
            <i class="fas fa-home"></i>
            Project
          </a>
        </li>
        <li id="about" @click="changeContent($event)">
          <a>
            <i class="fas fa-users"></i>
            About
          </a>
        </li>
        <li id="tasks" @click="changeContent($event)">
          <a>
            <b-row>
              <b-col :cols="!hidden ? '8' : '12'"
                ><i class="fas fa-briefcase"></i> Tasks</b-col
              >
              <b-col cols="2" v-show="!hidden">
                <div @click="addComponent('tasks')">
                  <i class="fas fa-plus"></i></div
              ></b-col>
            </b-row>
          </a>
        </li>
        <li>
          <a>
            <b-row>
              <b-col :cols="!hidden ? '8' : '12'"
                ><i class="fas fa-comments"></i> Forum</b-col
              >
              <b-col cols="2" v-show="!hidden"
                ><b-form-checkbox name="check-button" switch size="sm">
                </b-form-checkbox
              ></b-col>
            </b-row>
          </a>
        </li>
        <li>
          <a>
            <b-row>
              <b-col :cols="!hidden ? '8' : '12'"
                ><i class="fas fa-question"></i> FAQ</b-col
              >
              <b-col cols="2" v-show="!hidden"
                ><b-form-checkbox name="check-button" switch> </b-form-checkbox
              ></b-col>
            </b-row>
          </a>
        </li>
        <!-- <li>
          <a
            href="#pageSubmenu"
            data-toggle="collapse"
            aria-expanded="false"
            class="dropdown-toggle"
          >
            <i class="fas fa-paper-plane"></i>
            Contact
          </a>
          <ul class="collapse list-unstyled" id="pageSubmenu">
            <li>
              <a href="#">Page 1</a>
            </li>
            <li>
              <a href="#">Page 2</a>
            </li>
            <li>
              <a href="#">Page 3</a>
            </li>
          </ul>
        </li> -->
      </ul>
    </nav>

    <!-- Page Content  -->
    <div id="content">
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
            <b-button :to="{ name: 'flexyproject.editor' }" class="btn-warning"
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
      currentView: "project",
      children: []
    };
  },
  methods: {
    onclick() {
      this.hidden = !this.hidden;
    },
    changeContent(event) {
      this.currentView = event.currentTarget.id;
      console.log(this.currentView); // returns 'foo'
    },
    checkContent(event) {
      return this.currentView === event;
    },
    addComponent(idSection) {
      this.children.push(Cover);
      console.log(this.children);
    },
    removeComponent(idComponent) {
      this.children.splice(idComponent, 1);
    }
  },
  computed: {}
};
</script>

<style scoped>
a,
a:hover,
a:focus {
  color: inherit;
  text-decoration: none;
  transition: all 0.3s;
}

.navbar {
  padding: 15px 10px;
  background: #fff;
  border: none;
  border-radius: 0;
  margin-bottom: 40px;
  box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1);
}

.navbar-btn {
  box-shadow: none;
  outline: none !important;
  border: none;
}

.line {
  width: 100%;
  height: 1px;
  border-bottom: 1px dashed #ddd;
  margin: 40px 0;
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
  align-items: stretch;
}

#sidebar {
  min-width: 250px;
  max-width: 250px;
  background: rgba(46, 45, 45, 0.8);
  color: #fff;
  transition: all 0.3s;
  float: left;
}

#sidebar.active {
  min-width: 80px;
  max-width: 100px;
  text-align: center;
}

#sidebar.active .sidebar-header h3,
#sidebar.active .CTAs {
  display: none;
}

#sidebar ul li a {
  text-align: left;
  cursor: pointer;
}

#sidebar.active ul li a {
  padding: 20px 10px;
  text-align: center;
  font-size: 0.85em;
  cursor: pointer;
}

#sidebar.active ul li a i {
  margin-right: 0;
  display: block;
  font-size: 1.8em;
  margin-bottom: 5px;
}

#sidebar.active ul ul a {
  padding: 10px !important;
}

#sidebar.active .dropdown-toggle::after {
  top: auto;
  bottom: 10px;
  right: 50%;
  -webkit-transform: translateX(50%);
  -ms-transform: translateX(50%);
  transform: translateX(50%);
}

#sidebar .sidebar-header {
  padding: 20px;
  background: #494a4d;
}

#sidebar .sidebar-header strong {
  display: none;
  font-size: 1.8em;
}

#sidebar ul.components {
  padding: 20px 0;
}

#sidebar ul li a {
  padding: 10px;
  font-size: 1.1em;
  display: block;
}

#sidebar ul li a:hover {
  color: #19191a;
  background: #fff;
}

#sidebar ul li a i {
  margin-right: 10px;
}

#sidebar ul li.active > a,
a[aria-expanded="true"] {
  color: #fff;
  background: #6c6c6d;
}

a[data-toggle="collapse"] {
  position: relative;
}

.dropdown-toggle::after {
  display: block;
  position: absolute;
  top: 50%;
  right: 20px;
  transform: translateY(-50%);
}

ul ul a {
  font-size: 0.9em !important;
  padding-left: 30px !important;
  background: #6d7fcc;
}

/* ---------------------------------------------------
    CONTENT STYLE
----------------------------------------------------- */

#content {
  width: 100%;
  padding: 0px;
  min-height: 100vh;
  transition: all 0.3s;
}

/* ---------------------------------------------------
    MEDIAQUERIES
----------------------------------------------------- */

@media (max-width: 768px) {
  #sidebar {
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
  #sidebar.active {
    margin-left: 0 !important;
  }
  #sidebar .sidebar-header h3,
  #sidebar .CTAs {
    display: none;
  }
  #sidebar .sidebar-header strong {
    display: block;
  }
  #sidebar ul li a {
    padding: 20px 10px;
  }
  #sidebar ul li a span {
    font-size: 0.85em;
  }
  #sidebar ul li a i {
    margin-right: 0;
    display: block;
  }
  #sidebar ul ul a {
    padding: 10px !important;
  }
  #sidebar ul li a i {
    font-size: 1.3em;
  }
  #sidebar {
    margin-left: 0;
  }
  #sidebarCollapse span {
    display: none;
  }
}
</style>
