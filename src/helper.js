import { i18n } from "./i18n.js";
import media_ext from "@/data/media_files_ext.json";
import Papa from "papaparse";

export function uuid() {
  let dt = new Date().getTime();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    let r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

export function dataURItoBlob(dataURI) {
  const binary = atob(dataURI.split(",")[1]);
  const array = [];
  for (let i = 0; i < binary.length; i++) {
    array.push(binary.charCodeAt(i));
  }
  return new Blob([new Uint8Array(array)], { type: "image/jpeg" });
}

export function buildTemplateFromModel(templateModel, templateData) {
  // escape template
  const template = JSON.stringify(templateModel.template)
    .replace(/\\n/g, "\n") // replace escaped \n with correctly encoded new lines
    .replace(/(^"|"$)/g, "`") // use ` quotes instead of " quotes for the template string
    .replace(/\\"/g, '"'); // replace \" with "

  // generates the component data property with the given template data
  const data =
    "() => { return " +
    JSON.stringify({ ...templateModel.data, ...templateData }) +
    "}";

  // generates all the template model methods in correctly formatted strings
  let methods = "";
  for (let property in templateModel.methods) {
    if (templateModel.methods.hasOwnProperty(property)) {
      methods +=
        "\t" +
        property +
        ": " +
        templateModel.methods[property].toString() +
        ",\n";
    }
  }
  methods = "{\n" + methods + "  }";

  // generates all computed properties
  let computed = "";
  for (let property in templateModel.computed) {
    if (templateModel.computed.hasOwnProperty(property)) {
      computed +=
        "\t" +
        property +
        ": " +
        templateModel.computed[property].toString() +
        ",\n";
    }
  }
  computed = "{\n" + computed + "  }";

  // generates all watchers
  let watch = "";
  for (let property in templateModel.watch) {
    if (templateModel.watch.hasOwnProperty(property)) {
      watch +=
        "\t" +
        property +
        ": " +
        templateModel.watch[property].toString() +
        ",\n";
    }
  }
  watch = "{\n" + watch + "  }";

  // gets the created function in string
  const created = templateModel.created.toString();

  // gets the mounted function in string
  const mounted = templateModel.mounted.toString();

  // transforms props in JSON string
  const props = JSON.stringify(templateModel.props);

  // returns the final template with correct indent
  return (
    `{
  template: ` +
    template +
    `,\n
  data: ` +
    data +
    `,\n
  methods: ` +
    methods +
    `,\n
  computed: ` +
    computed +
    `,\n
  watch: ` +
    watch +
    `,\n
  created: ` +
    created +
    `,\n
  mounted: ` +
    mounted +
    `,\n
  props: ` +
    props +
    `\n
}`
  );
}

export function getFormErrorsAsString(errors) {
  // console.log(errors)
  const fields = Object.keys(errors);
  let result = "<ul>";

  for (let fldIndex in fields) {
    const fieldName = fields[fldIndex];
    result += "<li>" + fieldName + ": ";

    // print field errors in a new list
    result += "<ul>";
    for (let error of errors[fieldName]) {
      result += "<li>" + error + "</li>";
    }
    result += "</ul>";

    result += "</li>";
  }

  result += "</ul>";
  return result;
}

export function validateEmail(email) {
  const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(String(email).toLowerCase());
}

export function getTranslationLocale(tag) {
  return i18n.messages[i18n.locale][tag] || tag;
}

export function getPybossaTranslation(reason) {
  const tag = reason.split(" ");
  const complete = tag.join("-");
  return i18n.messages[i18n.locale][complete] || reason;
}

export function getFormErrorsAsStringOnlyErrorMsg(errors) {
  // console.log(errors)
  const fields = Object.keys(errors);
  let result = "";
  for (let fldIndex in fields) {
    const fieldName = fields[fldIndex];
    for (let error of errors[fieldName]) {
      result = error;
    }
  }
  return result;
}

export function giveDateTime(timestamp) {
  var date = new Date(timestamp);
  var date_time =
    date.getDate() +
    "." +
    (date.getMonth() + 1) +
    "." +
    date.getFullYear() +
    ", " +
    date.getHours() +
    ":" +
    (date.getMinutes() < 10 ? "0" : "") +
    date.getMinutes();
  //console.log( date_time );
  return date_time;
}

export function saveJsonObj2File(obj) {
  const data = JSON.stringify(obj);
  const blob = new Blob([data], { type: "text/plain" });
  const e = document.createEvent("MouseEvents"),
    a = document.createElement("a");
  a.download = "data.json";
  a.href = window.URL.createObjectURL(blob);
  a.dataset.downloadurl = ["text/json", a.download, a.href].join(":");
  e.initEvent(
    "click",
    true,
    false,
    window,
    0,
    0,
    0,
    0,
    0,
    false,
    false,
    false,
    false,
    0,
    null
  );
  a.dispatchEvent(e);
}

export function utf8ToUnicode(text) {
  const utf = require("utf8");
  try {
    // Convert \\x to \x
    text = text.replace(/\\x([0-9A-Fa-f]{2})/g, function() {
      // Convert hex to int the char sequence after \x
      return String.fromCharCode(parseInt(arguments[1], 16));
    });
    const final_text = utf.decode(text);
    return final_text;
  } catch (error) {
    console.error(error);
    return text;
  }
}

// This function send event occurence to google analytics
export function trackEvent(_this, info = undefined) {
  if (info) {
    _this.$gtag.event(info.action, {
      event_category: info.category,
      event_label: info.label,
      event_value: 1
    });
  }
}

// Get the width screen size using javascript.get
export function getWidthScreen() {
  return window.screen.width;
}

// Get MIME type for url file
export function getMIME(raw_url) {
  let response = null;
  const img_ext = new Set(media_ext.image);
  const video_ext = new Set(media_ext.video);
  const audio_ext = new Set(media_ext.sound);
  const video_embed = new Set(["youtube", "vimeo"]);

  const types = new Map();
  //add images to the Map
  img_ext.forEach(img => types.set(img, "img"));
  //add video to the Map
  video_ext.forEach(video => types.set(video, "video"));
  //add audio to the Map
  audio_ext.forEach(audio => types.set(audio, "audio"));

  // Validate if url belongs to image, video or audio
  let ext;
  try {
    const url = new URL(raw_url);
    /* Special case */
    // Embed video (i.e., youtube, vimeo)
    if ([...video_embed].some(x => url.hostname.includes(x))) {
      response = "vembed";
    }
    // Validate if url is valid protocol
    if (["http", "https"].some(x => url.protocol.includes(x))) {
      ext = url.pathname.split(".").pop();
    }
  } catch (e) {
    if (typeof raw_url == "string") ext = raw_url.split(".").pop();
  } finally {
    if (types.get(`.${ext}`)) return types.get(`.${ext}`);
    else if (response) return response;
  }

  /* Special case */
  // CSLogger types
  response = csloggerType(raw_url);
  return response;
}

// group array of object by key and return grouped array of arrays
export function groupBy(key, array) {
  const group_obj = array.reduce((r, a) => {
    r[a[key]] = [...(r[a[key]] || []), a];
    return r;
  }, {});
  // remove wrong parameters
  delete group_obj[""];
  return group_obj;
}

// convert CSV file to Json format
export async function csvToJson(csv) {
  return new Promise((resolve, reject) => {
    Papa.parse(csv, {
      header: true,
      complete: results => {
        resolve(results.data);
        reject(results.error);
      }
    });
  });
}

// CSLogger implementation only
// Validate type of response from string
function csloggerType(response) {
  // Get the type of response
  const type = response.split(":")[0].toLowerCase();
  let res = null;
  // By default all responses are text
  if (type && type.length > 0 && type != "filename") {
    res = "text";
  }
  switch (type) {
    case "geo":
      res = "geo";
      break;
    case "true" || "false":
      res = "bool";
      break;
    case "date":
      res = "date";
      break;
    case "value":
      res = "value";
      break;
    case "time_range":
      res = "time_range";
      break;
  }
  return res;
}
