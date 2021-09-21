import axios from "axios";
import store from "@/store/index.js";

axios.defaults.headers["Content-Type"] = "application/json";

export default {
  getAmazonS3TasksImportationOptions(projectShortName) {
    return axios.get(
      process.env.BASE_ENDPOINT_URL +
        "project/" +
        projectShortName +
        "/tasks/import?type=s3",
      {
        data: {},
        withCredentials: true
      }
    );
  },

  importAmazonS3Tasks(csrf, project, bucket, files) {
    return axios.post(
      process.env.BASE_ENDPOINT_URL +
        "project/" +
        project.short_name +
        "/tasks/import?type=s3",
      {
        bucket: bucket,
        form_name: "s3",
        ...files.reduce((result, item, index) => {
          result["files-" + index] = item;
          return result;
        }, {})
      },
      {
        withCredentials: true,
        headers: {
          "X-CSRFToken": csrf
        }
      }
    );
  },

  getGoogleDocsTasksImportationOptions(projectShortName) {
    return axios.get(
      process.env.BASE_ENDPOINT_URL +
        "project/" +
        projectShortName +
        "/tasks/import?type=gdocs",
      {
        data: {},
        withCredentials: true
      }
    );
  },

  importGoogleDocsTasks(csrf, projectShortName, link) {
    return axios.post(
      process.env.BASE_ENDPOINT_URL +
        "project/" +
        projectShortName +
        "/tasks/import?type=gdocs",
      {
        googledocs_url: link
      },
      {
        withCredentials: true,
        headers: {
          "X-CSRFToken": csrf
        }
      }
    );
  },

  getLocalCsvTasksImportationOptions(projectShortName) {
    return axios.get(
      process.env.BASE_ENDPOINT_URL +
        "project/" +
        projectShortName +
        "/tasks/import?type=localCSV",
      {
        data: {},
        withCredentials: true
      }
    );
  },

  importLocalCsvTasks(csrf, projectShortName, file) {
    const data = new FormData();
    data.append("file", file);

    return axios.post(
      process.env.BASE_ENDPOINT_URL +
        "project/" +
        projectShortName +
        "/tasks/import?type=localCSV&response_format=json",
      data,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
          "X-CSRFToken": csrf
        }
      }
    );
  },

  getOnlineCsvTasksImportationOptions(projectShortName) {
    return axios.get(
      process.env.BASE_ENDPOINT_URL +
        "project/" +
        projectShortName +
        "/tasks/import?type=csv",
      {
        data: {},
        withCredentials: true
      }
    );
  },

  importOnlineCsvTasks(csrf, projectShortName, link) {
    return axios.post(
      process.env.BASE_ENDPOINT_URL +
        "project/" +
        projectShortName +
        "/tasks/import?type=csv",
      {
        csv_url: link
      },
      {
        withCredentials: true,
        headers: {
          "X-CSRFToken": csrf
        }
      }
    );
  },

  getDropboxTasksImportationOptions(projectShortName) {
    return axios.get(
      process.env.BASE_ENDPOINT_URL +
        "project/" +
        projectShortName +
        "/tasks/import?type=dropbox",
      {
        data: {},
        withCredentials: true
      }
    );
  },

  importDropboxTasks(csrf, projectShortName, files) {
    const data = {
      form_name: "dropbox",
      ...files.reduce((result, item, index) => {
        result["files-" + index] = JSON.stringify(item);
        return result;
      }, {})
    };

    return axios.post(
      process.env.BASE_ENDPOINT_URL +
        "project/" +
        projectShortName +
        "/tasks/import?type=dropbox",
      data,
      {
        withCredentials: true,
        headers: {
          "X-CSRFToken": csrf
        }
      }
    );
  },

  getFlickrTasksImportationOptions(projectShortName) {
    return axios.get(
      process.env.BASE_ENDPOINT_URL +
        "project/" +
        projectShortName +
        "/tasks/import?type=flickr",
      {
        data: {},
        withCredentials: true
      }
    );
  },

  importFlickrTasks(csrf, projectShortName, albumId) {
    return axios.post(
      process.env.BASE_ENDPOINT_URL +
        "project/" +
        projectShortName +
        "/tasks/import?type=flickr",
      {
        form_name: "flickr",
        album_id: albumId
      },
      {
        withCredentials: true,
        headers: {
          "X-CSRFToken": csrf
        }
      }
    );
  },

  getTwitterTasksImportationOptions(projectShortName) {
    return axios.get(
      process.env.BASE_ENDPOINT_URL +
        "project/" +
        projectShortName +
        "/tasks/import?type=twitter",
      {
        data: {},
        withCredentials: true
      }
    );
  },

  importTwitterTasks(csrf, projectShortName, source, maxTweets) {
    return axios.post(
      process.env.BASE_ENDPOINT_URL +
        "project/" +
        projectShortName +
        "/tasks/import?type=twitter",
      {
        form_name: "twitter",
        max_tweets: maxTweets,
        source: source
      },
      {
        withCredentials: true,
        headers: {
          "X-CSRFToken": csrf
        }
      }
    );
  },

  async importCSLoggerFile(projectShortName, files, csv, partial = false) {
    const data = new FormData();
    data.append("partial", partial);
    data.append("file", csv);
    data.append("csv_filename", csv.name);
    files.forEach(file => {
      data.append(`media-${file.name}`, file);
    });

    const parameters = {
      type: "cslogger",
      response_format: "json"
    };

    const url = new URL(
      process.env.BASE_ENDPOINT_URL +
        "project/" +
        projectShortName +
        "/tasks/import"
    );

    url.search = new URLSearchParams(parameters).toString();
    const config = {
      onUploadProgress: function(progressEvent) {
        var percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        let up_config = {};
        if (percentCompleted < 100) {
          up_config = {
            label: "Sending files...",
            progress: { value: percentCompleted, max: 100 },
            finite: true
          };
        } else {
          up_config = {
            label: "Creating tasks...",
            sublabel: "This process could take a while, please wait. ",
            progress: null,
            finite: false,
            hideBtn: false
          };
        }
        store.commit("notification/setLoadingConfig", up_config);
      },
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data"
      }
    };
    return axios.post(url, data, config);
  }
};
