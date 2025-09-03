import Ajv from "ajv";
import corpora_schema from "./data/schema/corpora_schema.json";
import papers_schema from "./data/schema/papers_schema.json";
import annotations_schema from "./data/schema/annotations_schema.json";

const ajv = new Ajv();
const validate_corpora = ajv.compile(corpora_schema);
const validate_papers = ajv.compile(papers_schema);
const validate_annotations = ajv.compile(annotations_schema);
ajv.addSchema(corpora_schema, "corpora_schema");
ajv.addSchema(papers_schema, "papers_schema");
ajv.addSchema(annotations_schema, "annotations_schema");


