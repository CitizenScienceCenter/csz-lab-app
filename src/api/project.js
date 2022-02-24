import axios from "axios";
import slug from "slug";
import { dataURItoBlob } from "@/helper";

axios.defaults.headers["Content-Type"] = "application/json";

export default {
  getCategories() {
    return axios.get(process.env.BASE_API_URL + "category");
  },

  getAllProjects() {
    return axios.get(process.env.BASE_API_URL + "project");
  },

  /**
   * Get all projects with a pagination system for the given category
   * Can also get the featured projects with the category short name 'featured'
   * @param categoryShortName
   * @param page
   * @param params:{orderBy, desc}
   * @return {Promise<T | boolean>}
   */
  getProjectsWithCategory(categoryShortName, page, params) {
    const orderby = params ? params.orderby : "created";
    const desc = params ? params.desc : true;
    return axios.get(
      process.env.BASE_ENDPOINT_URL +
        "project/category/" +
        categoryShortName +
        (typeof page !== "undefined" && page !== 1 ? "/page/" + page : "") +
        `/?orderby=${orderby}${desc ? "&desc=true" : ""}`,
      {
        data: {},
        withCredentials: true
      }
    );
  },

  getProjectById(id, apiKey) {
    return axios.get(
      process.env.BASE_API_URL +
        "project/" +
        id +
        (apiKey ? "?api_key=" + apiKey : ""),
      {
        data: {}
      }
    );
  },

  projectSharedLinkConfirmation(key, shortname) {
    return axios.get(
      process.env.BASE_ENDPOINT_URL +
        "project/" +
        shortname +
        "/test/confirm?share=" +
        key,
      {
        data: {}
      }
    );
  },

  getProjectUserProgress(projectId, apiKey) {
    return axios.get(
      process.env.BASE_API_URL +
        "project/" +
        projectId +
        "/userprogress" +
        (apiKey ? "?api_key=" + apiKey : ""),
      {
        data: {}
      }
    );
  },

  createProject(apiKey, { name, shortDescription, longDescription }) {
    return axios.post(process.env.BASE_API_URL + "project?api_key=" + apiKey, {
      name: name,
      short_name: slug(name, { lower: true, replacement: "_" }),
      description: shortDescription,
      long_description: longDescription
    });
  },

  getProjectDeletionOptions(projectShortName) {
    return axios.get(
      process.env.BASE_ENDPOINT_URL + "project/" + projectShortName + "/delete",
      {
        data: {},
        withCredentials: true
      }
    );
  },

  deleteProject(csrf, projectShortName) {
    return axios.post(
      process.env.BASE_ENDPOINT_URL + "project/" + projectShortName + "/delete",
      {},
      {
        withCredentials: true,
        headers: {
          "X-CSRFToken": csrf
        }
      }
    );
  },

  getProjectUpdateOptions(projectShortName) {
    return axios.get(
      process.env.BASE_ENDPOINT_URL + "project/" + projectShortName + "/update",
      {
        data: {},
        withCredentials: true
      }
    );
  },

  updateProject(csrf, projectShortName, projectId, form) {
    return axios.post(
      process.env.BASE_ENDPOINT_URL + "project/" + projectShortName + "/update",
      {
        ...form,
        id: projectId
      },
      {
        withCredentials: true,
        headers: {
          "X-CSRFToken": csrf
        }
      }
    );
  },

  uploadAvatar(csrf, projectShortName, file) {
    const formData = new FormData();
    formData.append("btn", "Upload");
    formData.append("avatar", dataURItoBlob(file));

    return axios.post(
      process.env.BASE_ENDPOINT_URL +
        "project/" +
        projectShortName +
        "/update?response_format=json",
      formData,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
          "X-CSRFToken": csrf
        }
      }
    );
  },

  getPublishProjectOptions(projectShortName) {
    return axios.get(
      process.env.BASE_ENDPOINT_URL +
        "project/" +
        projectShortName +
        "/publish",
      {
        withCredentials: true,
        data: {}
      }
    );
  },

  publishProject(csrf, projectShortName) {
    return axios.post(
      process.env.BASE_ENDPOINT_URL +
        "project/" +
        projectShortName +
        "/publish",
      {},
      {
        withCredentials: true,
        headers: {
          "X-CSRFToken": csrf
        }
      }
    );
  },

  approveProject(csrf, projectShortName) {
    return axios.post(
      process.env.BASE_ENDPOINT_URL +
        "project/" +
        projectShortName +
        "/approve",
      {},
      {
        withCredentials: true,
        headers: {
          "X-CSRFToken": csrf
        }
      }
    );
  },

  getStatistics(projectShortName) {
    return axios.get(
      process.env.BASE_ENDPOINT_URL + "project/" + projectShortName + "/stats",
      {
        withCredentials: true,
        data: {}
      }
    );
  },

  getResults(projectShortName) {
    return axios.get(
      process.env.BASE_ENDPOINT_URL +
        "project/" +
        projectShortName +
        "/results",
      {
        withCredentials: true,
        data: {}
      }
    );
  },

  getShareableLink(projectShortName) {
    return axios.get(
      process.env.BASE_ENDPOINT_URL + "project/" + projectShortName + "/link",
      {
        withCredentials: true,
        data: {}
      }
    );
  },

  getProjectComments(limit, offset, id) {
    return axios.get(
      process.env.BASE_ENDPOINT_URL +
        "project/forum/thread/" +
        id +
        "/comments?limit=" +
        limit +
        "&offset=" +
        offset,
      {
        withCredentials: true,
        data: {}
      }
    );
  },

  getForumThreads(limit, offset) {
    return axios.get(
      process.env.BASE_ENDPOINT_URL +
        "project/forum/threads?limit=" +
        limit +
        "&offset=" +
        offset,
      {
        withCredentials: true,
        data: {}
      }
    );
  },

  setProjectCommentsOptions(projectShortName) {
    return axios.get(
      process.env.BASE_ENDPOINT_URL +
        "project/" +
        projectShortName +
        "/new-comment",
      {
        withCredentials: true,
        data: {}
      }
    );
  },

  setProjectComment(csrf, projectShortName, comment) {
    return axios.post(
      process.env.BASE_ENDPOINT_URL +
        "project/" +
        projectShortName +
        "/new-comment",
      {
        userId: comment.user_id,
        parentId: comment.parent,
        content: comment.content,
        text: comment.text
      },
      {
        withCredentials: true,
        headers: {
          "X-CSRFToken": csrf
        }
      }
    );
  },

  deleteCommentsOptions(comment_id) {
    return axios.get(
      process.env.BASE_ENDPOINT_URL +
        "project/forum/comment/" +
        comment_id +
        "/delete",
      {
        withCredentials: true,
        data: {}
      }
    );
  },

  deleteComment(csrf, comment_id) {
    return axios.post(
      process.env.BASE_ENDPOINT_URL +
        "project/forum/comment/" +
        comment_id +
        "/delete",
      {},
      {
        withCredentials: true,
        headers: {
          "X-CSRFToken": csrf
        }
      }
    );
  },

  updateProjectComment(csrf, projectShortName, comment) {
    console.log(comment);
    return axios.post(
      process.env.BASE_ENDPOINT_URL +
        "project/" +
        projectShortName +
        "/update-comment",
      {
        id: comment.id,
        parentId: comment.parent,
        content: comment.content
      },
      {
        withCredentials: true,
        headers: {
          "X-CSRFToken": csrf
        }
      }
    );
  },

  setPrivateProjectOptions(projectShortName) {
    return axios.get(
      process.env.BASE_ENDPOINT_URL +
        "project/" +
        projectShortName +
        "/password",
      {
        withCredentials: true,
        data: {}
      }
    );
  },

  getAccessToProject(csrf, projectShortName, password) {
    return axios.post(
      process.env.BASE_ENDPOINT_URL +
        "project/" +
        projectShortName +
        "/password",
      {
        password: password
      },
      {
        withCredentials: true,
        headers: {
          "X-CSRFToken": csrf
        }
      }
    );
  },

  isProjectPrivate(project_id) {
    return axios.get(
      process.env.BASE_ENDPOINT_URL + "project/" + project_id + "/private",
      {
        withCredentials: true,
        data: {}
      }
    );
  }
};
