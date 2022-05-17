import api from "../../api/project";
import builder from "./project-builder";
import menu from "./project-menu";
import { getTranslationLocale, getPybossaTranslation } from "@/helper";
import {router} from "@/router/router";

const errors = {
  GET_ALL_PROJECTS_LOADING_ERROR: "Error during projects loading",
  GET_USER_PROJECTS_LOADING_ERROR: "Error during user projects loading",
  GET_PROJECT_LOADING_ERROR: "Error during project loading",
  POST_PROJECT_ERROR: "Error during project creation",
  GET_PROJECT_USER_PROGRESS_LOADING_ERROR:
    "Error during project user progress loading",
  GET_FEATURED_PROJECTS_LOADING_ERROR: "Error during featured projects loading",
  GET_CATEGORIES_LOADING_ERROR: "Error during categories loading",
  UPLOAD_PROJECT_AVATAR_ERROR: "Error during project avatar upload",
  GET_PROJECT_UPDATE_OPTIONS_LOADING_ERROR:
    "Error during project update options loading",
  GET_PUBLISH_PROJECT_OPTIONS_LOADING_ERROR:
    "Error during project publish options loading",
  PUBLISH_PROJECT_ERROR: "Error during project publishing",
  GET_PROJECT_STATS_LOADING_ERROR: "Error during project stats loading",
  GET_PROJECT_RESULTS_LOADING_ERROR: "Error during project results loading",
  UPLOAD_PROJECT_ERROR: "Error during project update",
  GET_PROJECT_DELETION_OPTIONS_LOADING_ERROR: "Error during project deletion",
  DELETE_PROJECT_ERROR: "Error during project deletion"
};

// global state for this module

const state = {
  categories: [], // all categories
  projects: [], // all projects
  projectComments: [],
  forumThreads: [],

  categoryProjects: {}, // projects ordered by category
  categoryPagination: {}, // contains a pagination object for each category

  // selected project data
  selectedProject: {},
  selectedProjectUserProgress: { done: 0, total: 0 }, // logged user progress
  selectedProjectStats: {},
  selectedProjectResults: {},

  // form options
  projectCreationOptions: {},
  projectUpdateOptions: {},
  publishProjectOptions: {},
  projectCommentsOptions: {},
  projectDeletionOptions: {},
  deleteCommentsOptions: {},

  //shareable link
  projectShareableLink: null,
  projectShareableKey: {},
  enableTestEnvironment: false,

  privateProjectOptions: {},

  showProjectPassModal: false,
  accessForSelectedProject: {
    access: false,
    project_id: null
  },

  loading: false
};

// filter methods on the state data
const getters = {
  /**
   * Filters the loaded projects by category
   * @param state
   * @return {function({id: *}): T[]}
   */
  getProjectsWithCategory: state => ({ id }) => {
    return state.projects.filter(project => {
      return project.category_id === id;
    });
  },
  getUserProgressInPercent: state => {
    const progress =
      (state.selectedProjectUserProgress.done /
        state.selectedProjectUserProgress.total) *
      100;
    return isNaN(progress) ? 0 : progress;
  },
  getUserProgress: state => {
    return state.selectedProjectUserProgress;
  },
  projects: state => {
    let projects = [];
    for (const categoryId in state.categoryProjects) {
      if (categoryId !== "featured") {
        projects = projects.concat(state.categoryProjects[categoryId]);
      }
    }
    return projects;
  },

  globalPagination: state => {
    const pagination = {
      next: false,
      page: 1,
      per_page: 20,
      prev: false,
      total: 0
    };
    for (const [key, category] of Object.entries(state.categoryPagination)) {
      if (key !== "featured") {
        pagination.total += category.total;
      }
    }

    return pagination;
  },

  comments: state => {
    return state.projectComments;
  }
};

// async methods making mutations are placed here
const actions = {
  /**
   * Gets all the available categories
   * @param commit
   * @return {Promise<T | never>}
   */
  getCategories({ commit }) {
    return api
      .getCategories()
      .then(value => {
        commit("setCategories", value.data);
        return value.data;
      })
      .catch(reason => {
        commit(
          "notification/showError",
          {
            title: getTranslationLocale("GET_FEATURED_PROJECTS_LOADING_ERROR"),
            content: reason
          },
          { root: true }
        );
        return false;
      });
  },

  /**
   * Gets all the published projects (draft projects are private)
   * @param commit
   * @return {Promise<T | boolean>}
   */
  getAllProjects({ commit }) {
    return api
      .getAllProjects()
      .then(value => {
        commit("setProjects", value.data);
        return value.data;
      })
      .catch(reason => {
        commit(
          "notification/showError",
          {
            title: getTranslationLocale("GET_ALL_PROJECTS_LOADING_ERROR"),
            content: reason
          },
          { root: true }
        );
        return false;
      });
  },

  /**
   * Get all projects with a pagination system for the given category
   * Can also get the featured projects with the category short name 'featured'
   * @param commit
   * @param category
   * @param page
   * @return {Promise<T | boolean>}
   */
  getProjectsWithCategory({ commit }, { category, page, params }) {
    return api
      .getProjectsWithCategory(category.short_name, page, params)
      .then(value => {
        commit("setProjectsForCategory", {
          category: value.data.active_cat.short_name,
          projects: value.data.projects
        });
        commit("setPaginationForCategory", {
          category: value.data.active_cat.short_name,
          pagination: value.data.pagination
        });
        return value.data;
      })
      .catch(reason => {
        if (category.short_name !== "featured") {
          commit(
            "notification/showError",
            {
              title: getTranslationLocale("GET_CATEGORIES_LOADING_ERROR"),
              content: reason
            },
            { root: true }
          );
          return false;
        }
      });
  },

  /**
   * Get a project by id
   * The json results will be different depending on if you are the owner or not
   * @param commit
   * @param state
   * @param rootState
   * @param id
   * @return {Promise<T | boolean>}
   */
  getProject({ commit, state, rootState }, id) {
    return api
      .getProjectById(id, rootState.user.infos.api_key)
      .then(value => {
        commit("setSelectedProject", value.data);
        // stores the task presenter directly in the task store
        if ("task_presenter" in value.data.info) {
          commit("task/setTaskPresenter", value.data.info.task_presenter, {
            root: true
          });
        } else {
          commit("task/setTaskPresenter", "", { root: true });
        }
        return value.data;
      })
      .catch(reason => {
        commit(
          "notification/showError",
          {
            title: getTranslationLocale("GET_PROJECT_LOADING_ERROR"),
            content: reason
          },
          { root: true }
        );
        // If project does not exist, it redirect to the 404 page
        router.push("/project-not-found");
        return false;
      });
  },

  getProjectSharedLinkConfirmation({ commit }, payload) {
    return api
      .projectSharedLinkConfirmation(payload.key, payload.short_name)
      .then(value => {
        if (value.data.status == "success") {
          commit("setProjectTestEnvironment", true);
          commit("setProjectShareableLink", payload.fullpath);
          commit("setSelectedProject", value.data.project);
        }
        return value.data.status;
      })
      .catch(reason => {
        commit(
          "notification/showError",
          {
            title: getTranslationLocale("error"),
            content: reason
          },
          { root: true }
        );
        return false;
      });
  },

  getProjectTestEnv({ commit, state, rootState }, project) {
    return api
      .getProjectByIdTestEnv(project.short_name)
      .then(value => {
        commit("setSelectedProject", value.data);
        // stores the task presenter directly in the task store
        if ("task_presenter" in value.data.info) {
          commit("task/setTaskPresenter", value.data.info.task_presenter, {
            root: true
          });
        } else {
          commit("task/setTaskPresenter", "", { root: true });
        }
        return value.data;
      })
      .catch(reason => {
        commit(
          "notification/showError",
          {
            title: getTranslationLocale("GET_PROJECT_LOADING_ERROR"),
            content: reason
          },
          { root: true }
        );
        return false;
      });
  },

  /**
   * Creates a project with the builder data
   * It will not import a project avatar
   * @param commit
   * @param state
   * @param rootState
   * @param builder
   * @return {Promise<T | boolean>}
   */
  createProject({ commit, state, rootState }, builder) {
    return api
      .createProject(rootState.user.infos.api_key, builder)
      .then(value => {
        commit("setSelectedProject", value.data);
        return state.selectedProject;
      })
      .catch(reason => {
        const responseData = reason.response.data;
        if ("status" in responseData && responseData.status === "failed") {
          if (
            responseData.exception_cls &&
            responseData.exception_cls === "DBIntegrityError"
          ) {
            // specific error message when duplicated project name
            commit(
              "notification/showError",
              {
                title: getTranslationLocale("error"),
                content: getTranslationLocale("project-name-already-taken")
              },
              { root: true }
            );
            return false;
          }
        }
        commit(
          "notification/showError",
          {
            title: errors.POST_PROJECT_ERROR,
            content: reason
          },
          { root: true }
        );
        return false;
      });
  },

  /**
   * Gets a CSRF token to delete the project
   * @param commit
   * @param project
   * @returns {Promise<T | boolean>}
   */
  getProjectDeletionOptions({ commit }, project) {
    return api
      .getProjectDeletionOptions(project.short_name)
      .then(value => {
        commit("setProjectDeletionOptions", value.data);
        return value.data;
      })
      .catch(reason => {
        const response = reason.response.data;
        commit(
          "notification/showError",
          {
            title: getTranslationLocale(
              "GET_PROJECT_DELETION_OPTIONS_LOADING_ERROR"
            ),
            content: "description" in response ? response.description : reason
          },
          { root: true }
        );
        return false;
      });
  },

  /**
   * Allow to delete the given project
   * @param commit
   * @param state
   * @param dispatch
   * @param project
   * @returns {Promise<any> | Thenable<any> | * | PromiseLike<T | never> | Promise<T | never>}
   */
  deleteProject({ commit, state, dispatch }, project) {
    return dispatch("getProjectDeletionOptions", project).then(response => {
      if (response) {
        return api
          .deleteProject(state.projectDeletionOptions.csrf, project.short_name)
          .then(value => {
            commit(
              "notification/showSuccess",
              {
                title: getTranslationLocale("success"),
                content: value.data.flash
              },
              { root: true }
            );
            return value.data;
          })
          .catch(reason => {
            commit(
              "notification/showError",
              {
                title: getTranslationLocale("DELETE_PROJECT_ERROR"),
                content: reason
              },
              { root: true }
            );
            return false;
          });
      }
      return false;
    });
  },

  /**
   * Returns the global user contribution progress for the given project
   * @param commit
   * @param rootState
   * @param project
   * @return {Promise<T | boolean>}
   */
  getUserProgress({ commit, rootState }, project) {
    return api
      .getProjectUserProgress(
        project.id,
        rootState.user.logged ? rootState.user.infos.api_key : false
      )
      .then(value => {
        commit("setSelectedProjectUserProgress", value.data);
        return value.data;
      })
      .catch(reason => {
        commit(
          "notification/showError",
          {
            title: getTranslationLocale(
              "GET_PROJECT_USER_PROGRESS_LOADING_ERROR"
            ),
            content: reason
          },
          { root: true }
        );
        return false;
      });
  },

  resetTaskProgress({ commit }, values) {
    commit("setSelectedProjectUserProgress", values);
  },

  /**
   * Gets a CSRF token to update the project with the updateProject method
   * @param commit
   * @param project
   * @return {Promise<T | boolean>}
   */
  getProjectUpdateOptions({ commit }, project) {
    return api
      .getProjectUpdateOptions(project.short_name)
      .then(value => {
        commit("setProjectUpdateOptions", value.data);
        return value.data;
      })
      .catch(reason => {
        commit(
          "notification/showError",
          {
            title: getTranslationLocale(
              "GET_PROJECT_UPDATE_OPTIONS_LOADING_ERROR"
            ),
            content: reason
          },
          { root: true }
        );
        return false;
      });
  },

  /**
   * Update the project data with the given form
   * @param commit
   * @param dispatch
   * @param state
   * @param project
   * @param form
   * @return {Promise<any> | Thenable<any> | * | PromiseLike<T | never> | Promise<T | never>}
   */
  updateProject({ commit, dispatch, state }, { project, form }) {
    return dispatch("getProjectUpdateOptions", project).then(response => {
      if (response) {
        return api
          .updateProject(
            state.projectUpdateOptions.form.csrf,
            project.short_name,
            project.id,
            form
          )
          .then(value => {
            // nothing to commit
            return value.data;
          })
          .catch(reason => {
            commit(
              "notification/showError",
              {
                title: getTranslationLocale("UPLOAD_PROJECT_ERROR"),
                content: reason
              },
              { root: true }
            );
            return false;
          });
      }
      return false;
    });
  },

  /**
   * Allows to upload an avatar for the given project
   * The avatar image must be a base64 url
   * @param commit
   * @param state
   * @param dispatch
   * @param project
   * @param image
   * @return {Promise<any> | Thenable<any> | * | PromiseLike<T | never> | Promise<T | never>}
   */
  uploadAvatar({ commit, state, dispatch }, { project, image }) {
    return dispatch("getProjectUpdateOptions", project).then(response => {
      if (response) {
        return api
          .uploadAvatar(
            state.projectUpdateOptions.upload_form.csrf,
            project.short_name,
            image
          )
          .then(value => {
            // nothing to commit
            return value.data;
          })
          .catch(reason => {
            commit(
              "notification/showError",
              {
                title: getTranslationLocale("UPLOAD_PROJECT_AVATAR_ERROR"),
                content: getTranslationLocale("profile-pic-too-big")
              },
              { root: true }
            );
            return false;
          });
      }
      return false;
    });
  },

  /**
   * Gets a CSRF token to publish the project with the publishProject method
   * @param commit
   * @param project
   * @return {Promise<T | boolean>}
   */
  getPublishProjectOptions({ commit }, project) {
    return api
      .getPublishProjectOptions(project.short_name)
      .then(value => {
        commit("setPublishProjectOptions", value.data);
        return value.data;
      })
      .catch(reason => {
        commit(
          "notification/showError",
          {
            title: getTranslationLocale(
              "GET_PUBLISH_PROJECT_OPTIONS_LOADING_ERROR"
            ),
            content: reason
          },
          { root: true }
        );
        return false;
      });
  },

  /**
   * Publish the given project
   * @param commit
   * @param state
   * @param dispatch
   * @param project
   * @return {Promise<any> | Thenable<any> | * | PromiseLike<T | never> | Promise<T | never>}
   */
  publishProject({ commit, state, dispatch }, project) {
    return dispatch("getPublishProjectOptions", project).then(response => {
      if (response) {
        return api
          .publishProject(state.publishProjectOptions.csrf, project.short_name)
          .then(value => {
            commit("updateSelectedProject", { published: true });
            commit(
              "notification/showSuccess",
              {
                title: getTranslationLocale("success"),
                content: "The project " + project.name + " is now public"
              },
              { root: true }
            );
            return value.data;
          })
          .catch(reason => {
            commit(
              "notification/showError",
              {
                title: getTranslationLocale("PUBLISH_PROJECT_ERROR"),
                content: reason
              },
              { root: true }
            );
            return false;
          });
      }
      return false;
    });
  },

  /**
   * Approve the given project
   * @param commit
   * @param state
   * @param dispatch
   * @param project
   * @return {Promise<any> | Thenable<any> | * | PromiseLike<T | never> | Promise<T | never>}
   */
  approveProject({ commit, state, dispatch }, project) {
    return dispatch("getPublishProjectOptions", project).then(response => {
      if (response) {
        return api
          .approveProject(state.publishProjectOptions.csrf, project.short_name)
          .then(value => {
            if (value.data.status === "success") {
              commit("updateSelectedProject", { published: false });
              commit(
                "notification/showSuccess",
                {
                  title: getTranslationLocale("success"),
                  content: getPybossaTranslation(value.data.flash)
                },
                { root: true }
              );
              return true;
            } else {
              commit(
                "notification/showError",
                {
                  title: getTranslationLocale("error"),
                  content: getPybossaTranslation(value.data.flash)
                },
                { root: true }
              );
              return false;
            }
            //return value.data
          })
          .catch(reason => {
            commit(
              "notification/showError",
              {
                title: getTranslationLocale("PUBLISH_PROJECT_ERROR"),
                content: reason
              },
              { root: true }
            );
            return false;
          });
      }
      return false;
    });
  },

  /**
   * Returns all the stats about the given project
   * @param commit
   * @param project
   * @return {Promise<T | boolean>}
   */
  getStatistics({ commit }, project) {
    return api
      .getStatistics(project.short_name)
      .then(value => {
        commit("setSelectedProjectStats", value.data);
        return value.data;
      })
      .catch(reason => {
        commit(
          "notification/showError",
          {
            title: getTranslationLocale("GET_PROJECT_STATS_LOADING_ERROR"),
            content: reason
          },
          { root: true }
        );
        return false;
      });
  },

  /**
   * Returns all the task results about the given project
   * @param commit
   * @param project
   * @return {Promise<T | boolean>}
   */
  getResults({ commit }, project) {
    return api
      .getResults(project.short_name)
      .then(value => {
        commit("setSelectedProjectResults", value.data);
        return value.data;
      })
      .catch(reason => {
        commit(
          "notification/showError",
          {
            title: getTranslationLocale("GET_PROJECT_RESULTS_LOADING_ERROR"),
            content: reason
          },
          { root: true }
        );
        return false;
      });
  },
  setProjectCommentsOptions({ commit }, short_name) {
    return api
      .setProjectCommentsOptions(short_name)
      .then(value => {
        commit("setProjectCommentsOptions", value.data);
        return value.data;
      })
      .catch(reason => {
        commit(
          "notification/showError",
          {
            title: "Error getting proeject commnets options",
            content: reason
          },
          { root: true }
        );
        return false;
      });
  },

  /**
   * Publish the given project
   * @param commit
   * @param state
   * @param dispatch
   * @param project
   * @return {Promise<any> | Thenable<any> | * | PromiseLike<T | never> | Promise<T | never>}
   */
  setProjectComment({ commit, state, dispatch }, payload) {
    return dispatch("setProjectCommentsOptions", payload.short_name).then(
      response => {
        if (response) {
          return api
            .setProjectComment(
              state.projectCommentsOptions.csrf,
              payload.short_name,
              payload.comment
            )
            .then(value => {
              return value.data;
            })
            .catch(reason => {
              commit("setProjectComments", []);
              commit(
                "notification/showError",
                {
                  title: "Error",
                  content: "Could not save your comment. Try again later!"
                },
                { root: true }
              );
              return false;
            });
        }
        return false;
      }
    );
  },

  getProjectComments({ commit }, payload) {
    return api
      .getProjectComments(payload.limit, payload.offset, payload.id)
      .then(value => {
        commit("setProjectComments", value.data);
        return value.data;
      })
      .catch(reason => {
        commit("setProjectComments", []);
        return false;
      });
  },

  getForumThreads({ commit }, payload) {
    return api
      .getForumThreads(payload.limit, payload.offset)
      .then(value => {
        commit("setForumThreads", value.data);
        //commit('comments/SET_NUMBER_OF_THREADS', value.count)
        return value.data;
      })
      .catch(reason => {
        commit("setProjectComments", []);
        return false;
      });
  },

  getShareableLink({ commit }, project) {
    return api
      .getShareableLink(project.short_name)
      .then(value => {
        commit("setProjectShareableLink", value.data.key);
        return value.data;
      })
      .catch(reason => {
        commit(
          "notification/showError",
          {
            title: "Shareable link error!",
            content: reason
          },
          { root: true }
        );
      });
  },

  setPrivateProjectOptions({ commit }, short_name) {
    return api
      .setPrivateProjectOptions(short_name)
      .then(value => {
        commit("setPrivateProjectOptions", value.data);
        return value.data;
      })
      .catch(reason => {
        commit(
          "notification/showError",
          {
            title: "Error getting private project options",
            content: reason
          },
          { root: true }
        );
        return false;
      });
  },

  getAccessToProject({ commit, state, dispatch }, privateProject) {
    return dispatch("setPrivateProjectOptions", privateProject.short_name).then(
      response => {
        if (response) {
          return api
            .getAccessToProject(
              state.privateProjectOptions.csrf,
              privateProject.short_name,
              privateProject.password
            )
            .then(value => {
              return value.data;
            })
            .catch(reason => {
              commit(
                "notification/showError",
                {
                  title: "password",
                  content: reason
                },
                { root: true }
              );
            });
        }
        return false;
      }
    );
  },

  isProjectPrivate({ commit, state }, project) {
    return api
      .isProjectPrivate(project.id)
      .then(value => {
        return value.data;
      })
      .catch(reason => {
        commit(
          "notification/showError",
          {
            title: "Private project",
            content: reason
          },
          { root: true }
        );
      });
    return false;
  },

  deleteCommentsOptions({ commit }, comment_id) {
    return api
      .deleteCommentsOptions(comment_id)
      .then(value => {
        commit("deleteCommentsOptions", value.data);
        return value.data;
      })
      .catch(reason => {
        commit(
          "notification/showError",
          {
            title: "Error getting comments options",
            content: reason
          },
          { root: true }
        );
        return false;
      });
  },

  deleteComment({ commit, state, dispatch }, payload) {
    return dispatch("deleteCommentsOptions", payload.comment_id).then(
      response => {
        if (response) {
          return api
            .deleteComment(state.deleteCommentsOptions.csrf, payload.comment_id)
            .then(value => {
              if (value.data.status === "success") {
                //commit('setProjectComments', value.data.data)
                //return true
                return dispatch("getProjectComments", {
                  id: payload.thread_id,
                  limit: 1000,
                  offset: 0
                });
              } else {
                commit(
                  "notification/showError",
                  {
                    title: getTranslationLocale("error"),
                    content: "Could not delete your comment!"
                  },
                  { root: true }
                );
                return false;
              }
            })
            .catch(reason => {
              commit("setProjectComments", []);
              commit(
                "notification/showError",
                {
                  title: "Error",
                  content: "Could not delete your comment!"
                },
                { root: true }
              );
              return false;
            });
        }
        return false;
      }
    );
  },

  updateProjectComment({ commit, state, dispatch }, payload) {
    return dispatch("setProjectCommentsOptions", payload.short_name).then(
      response => {
        if (response) {
          return api
            .updateProjectComment(
              state.projectCommentsOptions.csrf,
              payload.short_name,
              payload.comment
            )
            .then(value => {
              return value.data;
            })
            .catch(reason => {
              //commit('setProjectComments',[])
              commit(
                "notification/showError",
                {
                  title: "Error",
                  content: "Could not save your comment. Try again later!"
                },
                { root: true }
              );
              return false;
            });
        }
        return false;
      }
    );
  },

  deleteThread({ commit, state, dispatch }, payload) {
    return dispatch("deleteCommentsOptions", payload.comment_id).then(
      response => {
        if (response) {
          return api
            .deleteComment(state.deleteCommentsOptions.csrf, payload.comment_id)
            .then(value => {
              if (value.data.status === "success") {
                return dispatch("getForumThreads", { limit: 1000, offset: 0 });
              } else {
                commit(
                  "notification/showError",
                  {
                    title: getTranslationLocale("error"),
                    content: "Could not delete your comment!"
                  },
                  { root: true }
                );
                return false;
              }
            })
            .catch(reason => {
              commit("setProjectComments", []);
              commit(
                "notification/showError",
                {
                  title: "Error",
                  content: "Could not delete your comment!"
                },
                { root: true }
              );
              return false;
            });
        }
        return false;
      }
    );
  }
};

// methods that change the state
const mutations = {
  setCategories(state, categories) {
    state.categories = categories;
  },
  setProjects(state, projects) {
    state.projects = projects;
  },
  setSelectedProject(state, project) {
    state.selectedProject = project;
  },
  updateSelectedProject(state, projectData) {
    state.selectedProject = { ...state.selectedProject, ...projectData };
  },
  setSelectedProjectUserProgress(state, progress) {
    state.selectedProjectUserProgress = progress;
  },
  setProjectUpdateOptions(state, options) {
    state.projectUpdateOptions = options;
  },
  setPublishProjectOptions(state, options) {
    state.publishProjectOptions = options;
  },
  setProjectDeletionOptions(state, options) {
    state.projectDeletionOptions = options;
  },
  setSelectedProjectStats(state, stats) {
    state.selectedProjectStats = stats;
  },
  setSelectedProjectResults(state, results) {
    state.selectedProjectResults = results;
  },
  setProjectsForCategory(state, { category, projects }) {
    state.categoryProjects = {
      ...state.categoryProjects,
      [category]: projects
    };
  },
  setPaginationForCategory(state, { category, pagination }) {
    state.categoryPagination = {
      ...state.categoryPagination,
      [category]: pagination
    };
  },
  setProjectCommentsOptions(state, options) {
    state.projectCommentsOptions = options;
  },
  setProjectComments(state, comments) {
    state.projectComments = comments;
  },
  setForumThreads(state, comments) {
    state.forumThreads = comments;
  },
  setProjectShareableLink(state, link) {
    state.projectShareableLink = link;
  },
  setShareableProjectKey(state, key) {
    state.projectShareableKey = key;
  },
  setProjectTestEnvironment(state, status) {
    state.enableTestEnvironment = status;
  },
  deleteCommentsOptions(state, options) {
    state.deleteCommentsOptions = options;
  },
  setPrivateProjectOptions(state, status) {
    state.privateProjectOptions = status;
  },
  setProjectPassModal(state, status) {
    state.showProjectPassModal = status;
  },
  setAccessForSelectedProject(state, status) {
    state.accessForSelectedProject = status;
  },
  setLoadingProject(state, value) {
    state.loading = value;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
  errors,
  modules: {
    builder,
    menu
  }
};
