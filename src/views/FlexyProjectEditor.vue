<template>
  <div class="wrapper">
    <nav class="sidebar" :class="{ active: hidden }">
      <!-- sidebar header -->
      <div class="sidebar-header">
        <input type="checkbox" id="check" hidden v-model="hidden" />
        <b-row>
          <b-col cols="10" class="d-flex justify-content-center">
            <h3>Project Editor</h3>
            <label for="check">
              <span class="fas fa-arrow-left sidebar-btn"></span>
            </label>
          </b-col>
        </b-row>
      </div>
      <!-- sidebar body -->
      <div class="sidebar-body">
        <ul>
          <li :class="{selected: checkContent('project')}">
            <a
              id="project"
              @click="changeContent($event)"
            >
              <i class="fas fa-home"></i>
              <span> Project</span>
            </a>
          </li>
          <li :class="{selected: checkContent('about')}">
            <a id="about" @click="changeContent($event)">
              <i class="fas fa-users"></i>
              <span>About</span>
            </a>
          </li>
          <li :class="{selected: checkContent('tasks')}">
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
          </li>
          <li>
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
          </li>
          <li>
            <a>
              <b-row>
                <b-col :cols="!hidden ? '8' : '12'"
                  ><i class="fas fa-question"></i> <span> FAQ</span></b-col
                >
                <b-col cols="2" v-show="!hidden"
                  ><b-form-checkbox name="check-button" switch>
                  </b-form-checkbox
                ></b-col>
              </b-row>
            </a>
          </li>
        </ul>
      </div>
    </nav>

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
    checkContent(view_id) {
      console.log(view_id);
      return this.currentView === view_id;
    },

    // Methods for dynamic adding or removing components
    addComponent(idSection) {
      this.children.push(Cover);
    },
    removeComponent(idComponent) {
      this.children.splice(idComponent, 1);
    }
  },
  created() {
    this.currentView = "project";
  }
};
</script>

<style scoped>
/* ---------------------------------------------------
    SIDEBAR STYLE
----------------------------------------------------- */

.wrapper {
  display: flex;
}

.sidebar {
  min-width: 250px;
  max-width: 250px;
  background-image: linear-gradient(45deg, #16496b 50%, #c5202e 100%);
  color: #fff;
  transition: all 0.5s;
  left: 0;
  z-index: 3;
  position: fixed;
  height: 100vh;
  box-sizing: border-box;
}
.sidebar.active {
  min-width: 80px;
  max-width: 80px;
  text-align: center;
}

.sidebar .sidebar-header {
  padding: 18px;
  background: #494a4d;
  min-height: 100px;
}
.sidebar.active .sidebar-header {
  min-height: 100px;
}
.sidebar.active .sidebar-header h3 {
  display: none;
}
.sidebar .sidebar-header .sidebar-btn {
  z-index: 2;
  color: whitesmoke;
  position: fixed;
  cursor: pointer;
  font-size: 25px;
  margin: 10px auto;
  transition: all 1s ease;
}
.sidebar .sidebar-header .sidebar-btn:hover {
  color: #c5202e;
}
.sidebar.active .sidebar-header .sidebar-btn {
  font-size: 30px;
  transform: rotate(180deg);
}

.sidebar .sidebar-body ul li a {
  padding: 20px 10px;
  font-size: 1.2em;
  text-align: left;
  display: block;
  cursor: pointer;
  width: 100%;
  border-left: 5px solid transparent;
  transition: padding-left 0.5s ease;
}
.sidebar.active .sidebar-body ul li a {
  padding: 20px 0px;
  text-align: center;
  font-size: 1.5em;
}
.sidebar .sidebar-body ul li a:hover {
  color: #19191a;
  background: whitesmoke;
}
.sidebar .sidebar-body ul li.selected a {
  color: #19191a;
  background: whitesmoke;
  border-left-color: #c5202e;
  font-weight: 600;
  padding-left: 25px;
}
.sidebar.active .sidebar-body ul li.selected a{
  padding-left: 15px;
}

.sidebar .sidebar-body ul li a span {
  transition: font-size 0.5s;
}
.sidebar.active .sidebar-body ul li a span {
  font-size: 0;
}

.sidebar .sidebar-body ul li a i {
  margin-right: 10px;
}
.sidebar.active .sidebar-body ul li a i {
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
#content.active {
  left: 80px !important;
}

/* ---------------------------------------------------
    MEDIAQUERIES
----------------------------------------------------- */

/* @media (max-width: 768px) {
  .sidebar {
    min-width: 80px;
    max-width: 80px;
    text-align: center;
    margin-left: -80px !important;
  }
  .sidebar.active {
    margin-left: 0 !important;
  }
  .sidebar .sidebar-header h3 {
    display: none;
  }
  .sidebar a {
    padding: 20px 10px;
  }
  .sidebar a span {
    font-size: 0;
  }
  .sidebar a i {
    margin-right: 0;
    display: block;
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
} */
</style>
