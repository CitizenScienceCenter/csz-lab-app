export function uuid () {
  let dt = new Date().getTime()
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    let r = (dt + Math.random() * 16) % 16 | 0
    dt = Math.floor(dt / 16)
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
  })
}

export function dataURItoBlob (dataURI) {
  const binary = atob(dataURI.split(',')[1])
  const array = []
  for (let i = 0; i < binary.length; i++) {
    array.push(binary.charCodeAt(i))
  }
  return new Blob([new Uint8Array(array)], {type: 'image/jpeg'})
}

export function buildTemplateFromModel (templateModel, templateData) {
  // escape template
  const template = JSON.stringify(templateModel.template)
    .replace(/\\n/g, '\n') // replace escaped \n with correctly encoded new lines
    .replace(/(^"|"$)/g, '`') // use ` quotes instead of " quotes for the template string
    .replace(/\\"/g, '"') // replace \" with "

  // generates the component data property with the given template data
  const data = '() => { return ' + JSON.stringify({ ...templateModel.data, ...templateData }) + '}'

  // generates all the template model methods in correctly formatted strings
  let methods = ''
  for (let property in templateModel.methods) {
    if (templateModel.methods.hasOwnProperty(property)) {
      methods += '\t' + property + ': ' + templateModel.methods[property].toString() + ',\n'
    }
  }
  methods = '{\n' + methods + '  }'

  // generates all computed properties
  let computed = ''
  for (let property in templateModel.computed) {
    if (templateModel.computed.hasOwnProperty(property)) {
      computed += '\t' + property + ': ' + templateModel.computed[property].toString() + ',\n'
    }
  }
  computed = '{\n' + computed + '  }'

  // generates all watchers
  let watch = ''
  for (let property in templateModel.watch) {
    if (templateModel.watch.hasOwnProperty(property)) {
      watch += '\t' + property + ': ' + templateModel.watch[property].toString() + ',\n'
    }
  }
  watch = '{\n' + watch + '  }'

  // gets the created function in string
  const created = templateModel.created.toString()

  // gets the mounted function in string
  const mounted = templateModel.mounted.toString()

  // transforms props in JSON string
  const props = JSON.stringify(templateModel.props)

  // returns the final template with correct indent
  return `{
  template: ` + template + `,\n
  data: ` + data + `,\n
  methods: ` + methods + `,\n
  computed: ` + computed + `,\n
  watch: ` + watch + `,\n
  created: ` + created + `,\n
  mounted: ` + mounted + `,\n
  props: ` + props + `\n
}`
}

export function getFormErrorsAsString (errors) {
  // console.log(errors)
  const fields = Object.keys(errors)
  let result = '<ul>'

  for (let fldIndex in fields) {
    const fieldName = fields[fldIndex]
    result += '<li>' + fieldName + ': '

    // print field errors in a new list
    result += '<ul>'
    for (let error of errors[fieldName]) {
      result += '<li>' + error + '</li>'
    }
    result += '</ul>'

    result += '</li>'
  }

  result += '</ul>'
  return result
}

export function validateEmail (email) {
  const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return regex.test(String(email).toLowerCase())
}
