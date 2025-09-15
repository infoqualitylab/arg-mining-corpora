import { compileFromFile } from 'json-schema-to-typescript';
import * as fs from 'fs';
import * as path from 'path';

const __dirname = path.resolve();
const inputDir = path.join(__dirname, "data/schema");
const outputDir = path.join(__dirname, 'data/interfaces');

fs.readdir(inputDir, (err, files) => {
  if (err) {
    console.error('Error reading input directory:', err);
    return;
  }

  files.forEach(file => {
    if (path.extname(file) === '.json') {
      const schemaPath = path.join(inputDir, file);
      const interfaceName = path.basename(file, '.json') + '.d.ts';
      const outputPath = path.join(outputDir, interfaceName);
      // TODO this declares every field as optional
      compileFromFile(schemaPath)
        .then(ts => fs.writeFileSync(outputPath, ts))
        .then(() => console.log(`Generated ${outputPath}`))
        .catch(err => console.error(`Error generating interface for ${file}:`, err));
    }
  });
});
