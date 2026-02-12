import Ajv from "ajv";
import addFormats from "ajv-formats";
import datasets_schema from "./data/schema/datasets.json";
import papers_schema from "./data/schema/papers.json";
import datasets_data from "./data/entries/datasets.json";
import papers_data from "./data/entries/papers.json";

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
ajv.addSchema(datasets_schema, "datasets.json");
ajv.addSchema(papers_schema, "papers.json");
const validate_datasets = ajv.compile(datasets_schema);
const validate_papers = ajv.compile(papers_schema);

function validateData() {
  let success = 0;
  const datasets_valid = validate_datasets(datasets_data);
  if (!datasets_valid) {
    success = 1;
    console.error("datasets data validation errors:", validate_datasets.errors);
  } else {
    console.log("datasets data is valid.");
  }

  const papers_valid = validate_papers(papers_data);
  if (!papers_valid) {
    success = 1;
    console.error("Papers data validation errors:", validate_papers.errors);
  } else {
    console.log("Papers data is valid.");
  }
  return success;
}

process.exit(validateData());
