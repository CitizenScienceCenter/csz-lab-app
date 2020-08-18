import { i18n } from "./i18n.js";

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
  return i18n.messages[i18n.locale][tag];
}

export function getPybossaTranslation(reason) {
  const tag = reason.split(" ");
  const complete = tag.join("-");
  return i18n.messages[i18n.locale][complete];
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

// Default configuration of buttons for cover buttons
const buttons = {
  contribution_btn: {},
  test_btn: {},
  request_approval_btn: {},
  modify_draft_btn: {},
  shareable_btn: {},
  publish_btn: {}
};
export function getAccessBR(project, accessBR) {
  // initialize buttons
  clearAccessBR();
  const info = project.hasOwnProperty("info");
  console.log("###################");
  console.log(`${project.published},  ${project.info.pending_approval}`);
  console.log(accessBR);
  // validate if user is owner
  if (accessBR.projectOwner) {
    // validate if project is already published
    if (project.published) {
      buttons.request_approval_btn.show = true;
      buttons.request_approval_btn.disabled = true;
      buttons.request_approval_btn.name = "project-draft-published";
    } else {
      // validate if project is pending for approval
      if (info && project.info.pending_approval) {
        buttons.request_approval_btn.disabled = true;
        buttons.request_approval_btn.name = "project-draft-pending-approval";
      } else {
        commonBR("draft");
        buttons.shareable_btn.show = true;
        buttons.shareable_btn.name = "project-share-link";
        // validate if user is admin
        if (!accessBR.adminUser) {
          buttons.request_approval_btn.name =
            "project-draft-approve-your-project";
        } else {
          commonBR("test");
          return buttons;
        }
        // this is executed always if user is not adminUser
        buttons.request_approval_btn.show = true;
        return buttons;
      }
    }
  }
  // Validate if this is an anonymous project
  else if (accessBR.anonymousProject) {
    // validate if user is admin
    if (!accessBR.adminUser) {
      commonBR("contribution");
    }
    // Validate if project is not published
    else if (!project.published) {
      commonBR("draft");
      commonBR("test");
      buttons.publish_btn.disabled = !project.info.pending_approval;
      return buttons;
    }
  }
  commonBR("contribution");
  return buttons;
}
// This function helps getAccessBR with common excecutions
function commonBR(id) {
  switch (id) {
    case "contribution":
      buttons.contribution_btn.show = true;
      buttons.contribution_btn.name = "project-contribute";
      break;
    case "draft":
      buttons.modify_draft_btn.show = true;
      buttons.modify_draft_btn.name = "project-draft-complete";
      buttons.test_btn.show = true;
      buttons.test_btn.name = "project-draft-test";
      break;
    case "test":
      buttons.publish_btn.show = true;
      buttons.publish_btn.name = "project-draft-publish";
      break;
    default:
      break;
  }
}
export function clearAccessBR() {
  for (const key in buttons) {
    if (buttons.hasOwnProperty(key)) {
      buttons[key] = { show: false, disabled: false, name: null };
    }
  }
}
