import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";

import type { Papers } from "./data/interfaces/papers";
import corps from "./data/entries/corpora.json";
import type { Corpora } from "./data/interfaces/corpora";
import paps from "./data/entries/papers.json";

const corp: Corpora = corps
const pap: Papers = paps

// Full list based on papers
interface FullRow {
  id: string;
  corpus_name: string;
  paper_name: string;
  authors: string;
  year: number;
  genre: string;
  language: string;
  document_types: string;
  document_count: number;
  annotation_description: string;
  annotator_count: number;
  annotator_type: string;
  agreement: number;
  accessibility: string;
  corpora_link: string;
  paper_link: string;
}


const columns = [
  { field: "corpora_name", headerName: "Corpora Name", width: 200 },
  { field: "paper_name", headerName: "Paper Name", width: 200 },
  { field: "authors", headerName: "Authors", width: 200 },
  { field: "date", headerName: "Date", width: 200 },
  { field: "genre", headerName: "Genre", width: 200 },
  { field: "language", headerName: "Language", width: 200 },
  { field: "document_types", headerName: "Document Types", width: 200 },
  { field: "document_count", headerName: "Document Count", width: 200 },
  {
    field: "annotation_description",
    headerName: "Annotation Description",
    width: 200,
  },
  { field: "annotator_count", headerName: "Annotator Count", width: 200 },
  { field: "annotator_type", headerName: "Annotator Type", width: 200 },
  { field: "agreement", headerName: "Agreement", width: 200 },
  { field: "accessibility", headerName: "Accessibility", width: 200 },
  { field: "corpora_link", headerName: "Corpora Link", width: 200 },
  { field: "paper_link", headerName: "Paper Link", width: 200 },
];

function App() {
  const [loading] = useState(false);
  const [rows, setRows] = useState<FullRow[]>([]);

  useEffect(() => {
    for (const paper of pap.papers) {
      console.log(paper);
      for (const annotation of paper.annotations) {
        const corpus = corp.corpora.find(
          (i) => i.corpus_id === annotation.corpus_id,
        );
        if (corpus) {
          setRows([
            ...rows,
            {
              id: paper.paper_id,
              corpus_name: corpus.corpus_name,
              paper_name: paper.paper_title,
              authors: paper.authors,
              date: paper.year,
              genre: corpus.genre,
              language: corpus.language,
              document_types: corpus.document_type,
              document_count: corpus.document_count,
              annotation_description: annotation.description,
              annotator_count: annotation.annotator_count,
              annotator_type: annotation.annotator_type,
              agreement: annotation.agreement_score,
              accessibility: annotation.accessibility,
              corpora_link: annotation.corpus_link,
              paper_link: paper.paper_link,
            },
          ]);
        }
      }
    }
  }, []);

  return (
    <Box style={{ height: 300, width: "100%" }}>
      {loading ? (
        <Skeleton />
      ) : (
        <Card variant="outlined">
          <CardContent>
            <Typography
              gutterBottom
              sx={{ color: "text.secondary", fontSize: 14 }}
            >
              Grouped by Paper
            </Typography>
            <DataGrid rows={rows} columns={columns} />
          </CardContent>
        </Card>
      )}
    </Box>
  );
}

export default App;
