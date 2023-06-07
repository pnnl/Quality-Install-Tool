# BASC QA Tool


## An outline of the App startup process
1. The server will serve the built (by webpack) version of `index.html` for any route.
2. `index.html` will load `index.css` and `App.css`.
3. `index.html` will load `App.js` and will place our top-level
React component, `<App />`, on the page.
4. `App.tsx` defines the routes used by React Router.
5. The routes of the form `/app/<database name>/:docId` use the `MdxTemplateView` component to render the templates from `src/templates` and connect them to the database. `src/templates/templates_config.ts` provides a mapping from database name to the template `title` and the template as a React component.

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

## Deployment
The QA webapp is hosted using github pages. When a commit is pushed to `main`, a github action is triggered which will build the widget and deploy the built artifact the branch `gh-pages`. This operation will overwrite the existing contents of the `gh-pages` branch. The target branch can be customized (see: https://github.com/tschaub/gh-pages)
## linting and formatting
The `yarn lint` command runs a linter to ensure all code is to the formatting standards for the repo before
a pull request is made.

## Short codes for the MDX templates 
To avoid the template writter needing to import React components, a set of 
components are automatically imported into the templates as *MDX shortcodes*.
This happens in the `MdxWrapper` component.

### Collapse
Wrap content to be shown/hidden
```
<Collapse header="HEADER">
  CONTENT_TO_BE_SHOWN_OR_HIDDEN
</Collapse>
```

### DateInput
A calendar date input
```
<DateInput label="INPUT_LABEL" path="DOCUMENT_PATH" />
```

### Figure
```
<Figure src="IMAGE_SRC">
  FIGURE_CAPTION
</Figure>
```

### NumberInput
```
<NumberInput label="INPUT_LABEL" prefix="INPUT_PREFIX" suffix="INPUT_SUFFIX" />
```

### Photo
```
<Photo id="ATTACHMENT_ID" label="PHOTO_LABEL" required>
  PHOTO_DESCRIPTION
</Photo>
```

### PhotoInput
```
<PhotoInput id="ATTACHMENT_ID" label="PHOTO_LABEL">
  PHOTO_DESCRIPTION
</PhotoInput>
```

### PrintSection
```
<PrintSection label="PRINT_BUTTON_TEXT">
  PRINTABLE_CONTENT
</PrintSection>
```

### Select
```
<Select label="INPUT_LABEL" options={["OPTION_1", "OPTION_2"] path="DOCUMENT_PATH"} />
```

### StringInput
```
<StringInput label="INPUT_LABEL" path="DOCUMENT_PATH" />
```

### TextInput
```
<TextInput label="INPUT_LABEL" path="DOCUMENT_PATH" />
```

### USStateSelect
A select input with the 50 U.S. States preloaded as options
```
<USStateSelect label="INPUT_LABEL" path="DOCUMENT_PATH" />
```