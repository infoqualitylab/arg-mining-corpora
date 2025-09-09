import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";

import type { Papers } from "./data/interfaces/papers";
import corp from "./data/entries/corpora.json";
import type { Corpora } from "./data/interfaces/corpora";
import pap from "./data/entries/papers.json";

const corpora: Corpora = corp
const papers: Papers = pap

type CorpusType = Corpora["corpora"][number];


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
  {
    field: "agreement_interpretation",
    headerName: "Interpretation",
    width: 200,
  },
  { field: "accessibility", headerName: "Accessibility", width: 200 },
  { field: "corpora_link", headerName: "Corpora Link", width: 200 },
  { field: "paper_link", headerName: "Paper Link", width: 200 },
];

function App() {
  const [loading] = useState(false);
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    for (const paper of pap.papers) {
      console.log(paper);
      for (const annotation of paper.annotations) {
        const corpora = corp.corpora.find(
          (i) => i.corpora_id === annotation.corpora_id,
        );
        if (corpora) {
          setRows([
            ...rows,
            {
              id: paper.paper_id,
              corpora_name: corpora.corpora_name,
              paper_name: paper.paper_name,
              authors: paper.authors,
              date: paper.date,
              genre: corpora.genre,
              language: corpora.language,
              document_types: corpora.document_types,
              document_count: corpora.document_count,
              annotation_description: annotation.annotation_description,
              annotator_count: annotation.annotator_count,
              annotator_type: annotation.annotator_type,
              agreement: annotation.agreement,
              agreement_interpretation: annotation.agreement_interpretation,
              accessibility: annotation.accessibility,
              corpora_link: annotation.corpora_link,
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
              Grouped by Corpora
            </Typography>
            <DataGrid rows={rows} columns={columns} />
          </CardContent>
        </Card>
      )}
    </Box>
  );
}

export default App;
