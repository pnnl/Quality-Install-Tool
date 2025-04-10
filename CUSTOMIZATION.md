Please see [README.md](README.md) to set the basic configuration parameters, prior to customizing your instance of Quality Install Tool.

# Quality Install Tool Customization

Although the Quality Install Tool (QIT) functions properly without configuration, you may wish to make additional customizations. Most require simple configuration changes, not JavaScript/TypeScript coding.

## Level Zero

### Favicons

Image files for &ldquo;favicons&rdquo; are located in the `public/` directory.

## Level One

### MDX Templates

MDX templates are located in the `templates/` directory.

MDX templates are registered in the `templates/index.ts` source file. To register a template, import the `.mdx` source file and then add a new `TemplateConfiguration` record to the `TEMPLATES` variable. It is recommended that every MDX template has a unique title.

```ts
import ExampleTemplate from './example_template.mdx'

const TEMPLATES: Record<string, TemplateConfiguration> = {
    // ...
    example_template: {
        title: 'Example Template',
        template: ExampleTemplate,
    },
    // ...
}
```

### Environment Variables

The following environment variables are defined in the `.env` source file:

* **REACT_APP_NAME** - The application name.
* **REACT_APP_HOMEPAGE** - The application homepage URL.
* **REACT_APP_POUCHDB_DATABASE_NAME** - The PouchDB database name for projects and installations.
* **REACT_APP_POUCHDB_MIGRATIONS_DATABASE_NAME** - The PouchDB database name for database migrations.

## Level Two

### GitHub

[GitHub](https://github.com/) configuration is located in the `.github/` directory.

### Canonical Name Record

The Canonical Name record is the `CNAME` source file.
