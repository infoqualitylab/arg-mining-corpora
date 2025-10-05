import Ajv from "ajv";
import addFormats from "ajv-formats";
import corpora_schema from "./data/schema/corpora.json";
import papers_schema from "./data/schema/papers.json";
import corpora_data from "./data/entries/corpora.json";
import papers_data from "./data/entries/papers.json";

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
ajv.addSchema(corpora_schema, "corpora.json");
ajv.addSchema(papers_schema, "papers.json");
const validate_corpora = ajv.compile(corpora_schema);
const validate_papers = ajv.compile(papers_schema);

function validateData() {
  let success = 0;
  const corpora_valid = validate_corpora(corpora_data);
  if (!corpora_valid) {
    success = 1;
    console.error("Corpora data validation errors:", validate_corpora.errors);
  } else {
    console.log("Corpora data is valid.");
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
