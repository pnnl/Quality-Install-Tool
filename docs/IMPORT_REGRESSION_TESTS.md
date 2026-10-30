# Import Regression Tests

After installing dependencies, run the focused import checks from the repository root:

```sh
CI=true yarn test --watch=false --runInBand --runTestsByPath src/__tests__/components/import_document.test.tsx src/__tests__/json_serialization_utils.test.ts
```

These tests cover overlapping imports, same-file retries, file-read and JSON errors,
database failures, partial-import reporting, and chained migrations for older exports.

Expected result: both test suites pass, with nine passing tests.