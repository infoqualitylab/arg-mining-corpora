import { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import DescriptionDialog from "./DescriptionDialog";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import GitHubIcon from "@mui/icons-material/GitHub";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";

import type { GridColDef } from "@mui/x-data-grid";
import type { Corpora } from "./data/interfaces/corpora";
import type { Papers } from "./data/interfaces/papers";

import corps from "./data/entries/corpora.json";
import paps from "./data/entries/papers.json";

const corp: Corpora = corps;
// TODO find a better way to handle ts-ignore
// @ts-expect-error
const pap: Papers = paps;

// Full list based on papers
export interface FullRow {
  id: string;
  corpus_name: string;
  corpus_description: string[];
  paper_name: string;
  paper_description: string[];
  authors: string;
  year: number;
  genre: string;
  language: string;
  document_type: string;
  document_count: number;
  annotation_description: string[];
  annotator_count: number | string;
  annotation_tasks: string[];
  annotator_type: string;
  agreement: number | string | [number, number];
  accessibility: string;
  corpora_link: string;
  paper_link: string;
}

const columns: GridColDef[] = [
  { field: "corpus_name", headerName: "Corpus Name", width: 200 },
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
    field: "document_type",
    headerName: "Document Type",
    width: 200,
    rowSpanValueGetter: (value, row) => {
      return row ? `${row.corpus_name}-${row.document_type}` : value;
    },
  },
  {
    field: "document_count",
    headerName: "Document Count",
    width: 200,
    rowSpanValueGetter: (value, row) => {
      return row ? `${row.corpus_name}-${row.document_count}` : value;
    },
  },
  {
    field: "genre",
    headerName: "Genre",
    width: 200,
    rowSpanValueGetter: (value, row) => {
      return row ? `${row.corpus_name}-${row.genre}` : value;
    },
  },
  {
    field: "language",
    headerName: "Language",
    width: 200,
    rowSpanValueGetter: (value, row) => {
      return row ? `${row.corpus_name}-${row.language}` : value;
    },
  },
  {
    field: "paper_name",
    headerName: "Paper Name",
    width: 200,
    rowSpanValueGetter: (value, row) => {
      return row ? `${row.corpus_name}-${row.paper_name}` : value;
    },
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
  {
    field: "authors",
    headerName: "Authors",
    width: 200,
    rowSpanValueGetter: (value, row) => {
      return row ? `${row.paper_name}-${row.authors}` : value;
    },
  },
  {
    field: "year",
    headerName: "Year",
    width: 200,
    rowSpanValueGetter: (value, row) => {
      return row ? `${row.paper_name}-${row.year}` : value;
    },
  },
  {
    field: "annotation_tasks",
    headerName: "Annotation Task(s)",
    width: 200,
    renderCell: (params) => (
      <Box sx={{ marginTop: 1, marginBottom: 1 }}>
        <Stack spacing={1}>
          {params.value.map((label: string) => (
            <Chip
              label={label}
              sx={{
                height: "auto",
                "& .MuiChip-label": {
                  display: "block",
                  whiteSpace: "normal",
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
  {
    field: "accessibility",
    headerName: "Accessibility",
    width: 200,
    rowSpanValueGetter: (value, row) => {
      return row ? `${row.corpoa_link}-${row.accessibility}` : value;
    },
  },
];

function App() {
  const [spanning, setSpanning] = useState(true);

  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<FullRow | null>(null);
  //TODO might need more than a row in future
  const handleClickOpen = (row: FullRow) => {
    setSelectedRow(row);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const [rows] = useState<FullRow[]>(() => {
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
              corpus_description: corpus.description,
              paper_name: paper.paper_title,
              paper_description: paper.description,
              authors: paper.authors.join(", "),
              year: paper.year,
              genre: corpus.genre,
              language: corpus.language.join(", "),
              document_type: corpus.document_type,
              document_count: corpus.document_count,
              annotation_description: annotation.description,
              annotator_count: annotation.annotator_count,
              annotation_tasks: annotation.annotation_task,
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
      <Card variant="outlined">
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography gutterBottom variant="h3">
              Argumentation Mining Corpora
            </Typography>
            <IconButton
              color="primary"
              aria-label="GitHub Repository"
              href="https://github.com/infoqualitylab/arg-mining-corpora"
              target="_blank"
            >
              <GitHubIcon />
            </IconButton>
          </Box>
          <Divider />
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={spanning}
                  onChange={() => setSpanning(!spanning)}
                  aria-label="Row Spanning Toggle"
                />
              }
              label="Row Spanning"
            />
          </FormGroup>
          <DataGrid
            rows={rows}
            columns={columns}
            showToolbar
            getRowHeight={() => "auto"}
            rowSpanning={spanning}
            disableRowSelectionOnClick
            onRowClick={(params) => handleClickOpen(params.row)}
            aria-label="Argumentation Mining Corpora Data Grid"
          />
        </CardContent>
      </Card>
      <DescriptionDialog
        open={open}
        handleClose={handleClose}
        selectedRow={selectedRow}
      />
    </Box>
  );
}

export default App;
