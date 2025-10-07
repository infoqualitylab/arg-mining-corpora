import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from '@mui/material/Chip';
import Skeleton from "@mui/material/Skeleton";
import Stack from '@mui/material/Stack';
import Typography from "@mui/material/Typography";

import type { GridColDef } from "@mui/x-data-grid";
import type { Corpora } from "./data/interfaces/corpora";
import type { Papers } from "./data/interfaces/papers";

import corps from "./data/entries/corpora.json";
import paps from "./data/entries/papers.json";

const corp: Corpora = corps;
const pap: Papers = paps;

// Full list based on papers
interface FullRow {
  id: string;
  corpus_name: string;
  paper_name: string;
  authors: string;
  year: number;
  genre: string;
  language: string;
  document_type: string;
  document_count: number;
  annotation_description: string;
  annotator_count: number | string;
  annotation_tasks: string[];
  annotator_type: string;
  agreement: number;
  accessibility: string;
  corpora_link: string;
  paper_link: string;
}

const columns: GridColDef[] = [
  { field: "corpus_name", headerName: "Corpus Name", width: 200 },
  { field: "paper_name", headerName: "Paper Name", width: 200 },
  { field: "authors", headerName: "Authors", width: 200 },
  { field: "year", headerName: "Year", width: 200 },
  { field: "genre", headerName: "Genre", width: 200 },
  { field: "language", headerName: "Language", width: 200 },
  { field: "document_type", headerName: "Document Type", width: 200 },
  { field: "document_count", headerName: "Document Count", width: 200 },
  {
    field: "annotation_tasks",
    headerName: "Annotation Task(s)",
    width: 200,
    renderCell: (params) => (
      <Box sx={{ marginTop: 1, marginBottom: 1 }}>
        <Stack spacing={1}>
          {params.value.map((label: string) => (
            <Chip label={label}
              sx={{
                height: 'auto',
                '& .MuiChip-label': {
                  display: 'block',
                  whiteSpace: 'normal',
                },
              }}
            />
          ))}
        </Stack>
      </Box>
    ),
  },
  { field: "annotator_count", headerName: "Annotator Count", width: 200 },
  { field: "annotator_type", headerName: "Annotator Type", width: 200 },
  { field: "agreement", headerName: "Agreement", width: 200 },
  { field: "accessibility", headerName: "Accessibility", width: 200 },
  {
    field: "corpora_link",
    headerName: "Corpora Link",
    width: 200,
    renderCell: (params) => (
      <a href={params.value} target="_blank" rel="noopener noreferrer">
        {params.value}
      </a>
    ),
  },
  {
    field: "paper_link",
    headerName: "Paper Link",
    width: 200,
    renderCell: (params) => (
      <a href={params.value} target="_blank" rel="noopener noreferrer">
        {params.value}
      </a>
    ),
  },
];

function App() {
  const [loading] = useState(false);
  const [rows, setRows] = useState<FullRow[]>(() => {
    let rs: FullRow[] = [];
    for (const paper of pap.papers) {
      for (const [index, annotation] of paper.annotations.entries()) {
        const corpus = corp.corpora.find(
          (i) => i.corpus_id === annotation.corpus_id,
        );
        if (corpus) {
          rs = [
            ...rs,
            {
              id: paper.paper_id + "-" + index,
              corpus_name: corpus.corpus_name,
              paper_name: paper.paper_title,
              authors: paper.authors.join(", "),
              year: paper.year,
              genre: corpus.genre,
              language: corpus.language.join(", "),
              document_type: corpus.document_type,
              document_count: corpus.document_count,
              annotation_tasks: annotation.annotation_task,
              annotator_count: annotation.annotator_count,
              annotator_type: annotation.annotator_type.join(", "),
              agreement: annotation.agreement_score,
              accessibility: annotation.accessibility,
              corpora_link: annotation.corpus_link,
              paper_link: paper.paper_link,
            },
          ];
        }
      }
    }
    return rs;
  });

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
              Full list of corpora for argument mining
            </Typography>
            <DataGrid rows={rows} columns={columns} showToolbar getRowHeight={() => 'auto'}/>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}

export default App;
