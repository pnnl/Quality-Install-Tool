const path = require('path');
const fs = require('fs-extra');
const paths = require('../config/paths');

module.exports.copyAndRenameCss = function() {
    const appCssSource = path.join(paths.appSrc, 'App.css'); // Replace 'app.css' with the actual source file name and path
    const printCssDest = path.join(paths.appPublic, 'print.css');
    
    /* Adding the PDF worker js and PDF worker map to Public folder. This is for the PDDRenderer component using react-pdf and pdfjs-dist */
    const appPdfWorkerJsSource = path.join(paths.appNodeModules, 'pdfjs-dist/legacy/build/pdf.worker.js');
    const appPdfWorkerMapSource = path.join(paths.appNodeModules, 'pdfjs-dist/legacy/build/pdf.worker.js.map');
    const appPdfWorkerJsDest = path.join(paths.appPublic, 'pdf.worker.js');
    const appPdfWorkerMapDest = path.join(paths.appPublic, 'pdf.worker.js.map');

    const bootstrapCssSource = path.join(paths.appNodeModules, 'bootstrap/dist/css/bootstrap.min.css');
    const bootstrapCssDest = path.join(paths.appPublic, 'bootstrap.min.css');

    try {
      
      // Copy and rename the 'app.css' file to 'print.css' in the build directory
      fs.copySync(appCssSource, printCssDest);
      fs.copySync(bootstrapCssSource, bootstrapCssDest);
      // copy the pdf worker js and pdf worker map to public folder
      fs.copySync(appPdfWorkerJsSource, appPdfWorkerJsDest);
      fs.copySync(appPdfWorkerMapSource, appPdfWorkerMapDest);

      console.log('app.css copied and renamed to print.css successfully.');
    } catch (err) {
      console.error('Error copying and renaming app.css:', err);
      process.exit(1); // Exit the build process with an error if the copy fails
    }
  }
//TODO Document this function