*This repository is set up for GitHub Pages, and you're welcome to fork it for reuse or customization.*

# Quality Install Tool

## An outline of the App startup process
1. The server will serve the built (by webpack) version of `index.html` for any route.
2. `index.html` will load `index.css` and `App.css`.
3. `index.html` will load `App.js` and will place our top-level
React component, `<App />`, on the page.
4. `App.tsx` defines the routes used by React Router.
5. The routes of the form `/app/<database name>/:docId` use the `MdxTemplateView` component to render the templates from `src/templates` and connect them to the database. `src/templates/templates_config.ts` provides a mapping from database name to the template `title` and the template as a React component.

## Installing dependencies
When installing dependencies, using `yarn install --frozen-lock` is prefered over `yarn install` to ensure that the install does not update any packages and cause dependency issues.

## Development server
The `yarn run start` command launches a server on localhost:3000. The browser view will automatically update whenever any file within the `src` folder is modified and saved. 

You must rerun `yarn run start` in order to see the effect of any changes made to files outside of the `src` folder. This comes up if you make configuration changes in `config` or you change the resources in `public`.

## Serving the production build
The `yarn run build` command generates a production build that is stored in the  
`/build` folder. This can be served as a static web site.

Use `npx http-server-spa ./build` from the top-level project folder
to serve the static files locally at `localhost:8080`. This
serves `/build/index.html` for all routes (those without file extensions) and the 
files within `./build/public/` for all other paths.

## linting and formatting
The `yarn lint` command runs a linter to ensure all code is to the formatting standards for the repo before
a pull request is made.

The command `yarn lint:fix` can be used to automatically fix any linting or formatting errors that can be fixed.


## Creating a New Workflow Template

Here's a step-by-step walkthrough on creating a new workflow template:

1. ### Workflow Template using MDX:

This process involves a combination of Markdown content and reusable React components, leading to the creation of dynamic and printable reports. [More about MDX](https://mdxjs.com/). 

Utilize the directory **src/template/<TEMPLATE_NAME>.mdx** as the destination for locating and storing new template files. 

In this codebase, reports are generated using the 'Tabs' and 'Tab' components to create a tabbed interface. For example:

```HTML
---
EXAMPLE MDX
---

<Tabs>
  <!-- Input Components: Project and installation details -->
  <Tab eventKey="KEY" title="Project">
    RELATED_CONTENT
    <ProjectInfoInputs {...props} />    
  </Tab>
  <Tab eventKey="KEY" title="Assessment">
    ## HEADING
    RELATED_CONTENT
  </Tab>
  .
  .
  .
  <!-- Report Components: Components to generate the printable report -->
  <Tab eventKey="KEY" title="Report">
    <PrintSection>
    CONTENT_TO_INLCUDE_IN_PRINTABLE_REPORT
    </PrintSection>
  </Tab>
</Tabs>
```

Information regarding the reusable React components accessible within this codebase is provided in the section below [Short codes for the MDX templates](#short-codes-for-the-MDX-template).

2. ### Configuration File:

To add a new template, make use of the **src/templates/templates_config.ts** file. 

a. **Import the New Template:**
```typescript
import WorkflowHPWHTemplate from './hpwh_workflow.mdx'
// other imports
```

b. **Define a Template:**
In the configuration file, create an entry for the new template. Specify its name, title, and reference the imported template file. 

```typescript
template_name: {
  title: 'TITLE OF THE TEMPLATE',
  template: 'IMPORTED TEMPLATE FILE',
}

// For example:
hpwh_workflow: {
  title: 'Heat Pump Water Heater',
  template: WorkflowHPWHTemplate,
}
```

## Data Storage
Data from this app will be stored on the client's device using 'PouchDB,' a JavaScript database library designed for local data storage and synchronization. PouchDB uses IndexedDB as the storage backend. [More about PouchDB](https://pouchdb.com/guides/databases.html).

Please note that data stored in this way may be lost if the user clears their browser cache.


## Short codes for the MDX templates 

To avoid the template writter needing to import React components, a set of 
components are automatically imported into the templates as *MDX shortcodes*.
This happens in the `MdxWrapper` component.

Reusable components include properties (props) that pass relevant data to meet specific needs. The usage of these props can vary depending on the specific React components used. The commonly used props are as follows:

- '`label'`: Used for providing labels or titles for components.
- `'path'`: Used to specify a variable path for storing data. Examples include "location" and "installation.location."
- `'id'`: Assigned as a unique identifier to specific components, particularly used as a reference for storing photo and file attachments in the database.
- `'hint'`: Used to provide additional information or guidance to users about the input.

### Input Components:

Input components are designed to collect and aggregate data for the quality installation report.
 
### Collapsible
Wrap the content to be shown/hidden: The content will toggle between being shown and hidden on clicking. The `'header'` prop is specific to this component and displays the title.
```HTML
<Collapsible header="HEADER">
  CONTENT_TO_BE_SHOWN_OR_HIDDEN
</Collapsible>
```

### DateInput
A calendar date input component.

```HTML
<DateInput label="INPUT_LABEL" path="DOCUMENT_PATH" />
```

### Figure

This is a component for displaying a figure. The `'src'` prop is specific to this component and is used to specify the source (URL) of an image.

```HTML
<Figure src="IMAGE_SRC">
  FIGURE_CAPTION
</Figure>
```

### NumberInput

A number input component. The props `'min'` and `'max'` are be used for setting minimum and maximum allowable values for the number input. Defaulted to POSITIVE_INFINITY and POSITIVE_INFINITY respectively.

```HTML
<NumberInput label="INPUT_LABEL" hint="HINT" min="min" max="max" />
```

### PhotoInput
This component allows users to take or upload photos. It currently supports only the JPEG image format. When the 'uploadable' prop is enabled, users can upload photos. If this prop is not enabled, the component allows only the use of the camera to take photos on mobile devices.
```HTML
<PhotoInput id="ATTACHMENT_ID" label="PHOTO_LABEL" uploadable>
  PHOTO_DESCRIPTION
</PhotoInput>
```

### Select
A select input component with selectable options in dropdown.
```HTML
<Select label="INPUT_LABEL" options={["OPTION_1", "OPTION_2"]} path="DOCUMENT_PATH" />
```

### StringInput
A string input component
```HTML
<StringInput label="INPUT_LABEL" path="DOCUMENT_PATH" hint="HINT" />
```

### TextInput
A textarea input component for multiline text input.
```HTML
<TextInput label="INPUT_LABEL" path="DOCUMENT_PATH" />
```

### USStateSelect
A select input with the 50 U.S. States preloaded as options
```HTML
<USStateSelect label="INPUT_LABEL" path="DOCUMENT_PATH" />
```

### FileInput
A PDF file input component
```HTML
<FileInput id="ATTACHMENT_ID" label="FILE_INPUT_LABEL">
  PRINTABLE_CONTENT
</FileInput>
```

### ProjectInfoInputs
Wraps inputs components to capture information about the project site and inspecting company details in a document.

```HTML
<ProjectInfoInputs {...props} />
```

### Report Components:

Report components are designed to render and display content intended for reporting and printing.

### PrintSection
PRINTABLE_CONTENT placed within this component is designated for printing.

```HTML
<PrintSection label="PRINT_BUTTON_TEXT">
  PRINTABLE_CONTENT
</PrintSection>
```

### Photo
This component displays photos within the report section, formatted for printing.

```HTML
<Photo id="ATTACHMENT_ID" label="PHOTO_LABEL" required>
  PHOTO_DESCRIPTION
</Photo>
```

### PDFRenderer
A PDF rendering component for displaying PDF documents content. Uses `'id'` to retrieve uploaded PDF and render its content in the web page.

```HTML
<PDFRenderer id="ATTACHMENT_ID" label="FILE_LABEL" />
```
