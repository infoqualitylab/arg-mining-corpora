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
import type { Datasets } from "./data/interfaces/datasets";
import type { Papers } from "./data/interfaces/papers";

import datas from "./data/entries/datasets.json";
import paps from "./data/entries/papers.json";

const dat: Datasets = datas;
// @ts-expect-error TODO find a better way to handle ts-ignore
const pap: Papers = paps;

// Full list based on papers
export interface FullRow {
  id: string;
  dataset_name: string;
  dataset_description: string[];
  genre: string;
  language: string;
  document_type: string;
  document_count: number;
  release_name: string;
  release_link: string;
  accessibility: string;
  annotation_tasks: string[];
  annotation_description: string[];
  subset: number | string;
  agreement_type: string;
  agreement: number | string | [number, number];
  annotator_type: string;
  paper_name: string;
  authors: string;
  year: number;
  paper_link: string;
}

const columns: GridColDef[] = [
  { field: "dataset_name", headerName: "Dataset Name", width: 200 },
  {
    field: "genre",
    headerName: "Genre",
    width: 200,
    rowSpanValueGetter: (value, row) => {
      return row ? `${row.dataset_name}-${row.genre}` : value;
    },
  },
  {
    field: "language",
    headerName: "Language",
    width: 200,
    rowSpanValueGetter: (value, row) => {
      return row ? `${row.dataset_name}-${row.language}` : value;
    },
  },
  {
    field: "document_type",
    headerName: "Document Type",
    width: 200,
    rowSpanValueGetter: (value, row) => {
      return row ? `${row.dataset_name}-${row.document_type}` : value;
    },
  },
  {
    field: "document_count",
    headerName: "Document Count",
    width: 200,
    rowSpanValueGetter: (value, row) => {
      return row ? `${row.dataset_name}-${row.document_count}` : value;
    },
  },
  {
    field: "release_name",
    headerName: "Release Name",
    width: 200,
  },
  {
    field: "release_link",
    headerName: "Release Link",
    width: 200,
    renderCell: (params) => (
      params.value === "-" ? (<span>{params.value}</span>) : (
      <a href={params.value} target="_blank" rel="noopener noreferrer">
        {params.value}
      </a>
      )
    ),
    rowSpanValueGetter: (value, row) => {
      return row ? `${row.release_name}-${row.release_link}` : value;
    },
  },
  {
    field: "accessibility",
    headerName: "Accessibility",
    width: 200,
    rowSpanValueGetter: (value, row) => {
      return row ? `${row.release_name}-${row.accessibility}` : value;
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
    rowSpanValueGetter: (value, row) => {
      return row ? `${row.annotation_tasks}` : value;
    },
  },
  { field: "subset", headerName: "Subset", width: 200,
    rowSpanValueGetter: (value, row) => {
      return row ? `${row.annotation_tasks}-${row.subset}` : value;
    },
  },
//  { field: "annotator_type", headerName: "Annotator Type", width: 200,
//    rowSpanValueGetter: (value, row) => {
//      return row ? `${row.annotation_tasks}-${row.annotator_type}` : value;
//    }},
//  { field: "agreement", headerName: "Agreement", width: 200,
//    rowSpanValueGetter: (value, row) => {
//      return row ? `${row.annotation_tasks}-${row.agreement}` : value;
//    },
//  },
//  {
//    field: "paper_name",
//    headerName: "Paper Name",
//    width: 200,
//    rowSpanValueGetter: (value, row) => {
//      return row ? `${row.release_name}-${row.paper_name}` : value;
//    },
//  },
//  {
//    field: "authors",
//    headerName: "Authors",
//    width: 200,
//    rowSpanValueGetter: (value, row) => {
//      return row ? `${row.paper_name}-${row.authors}` : value;
//    },
//  },
//  {
//    field: "year",
//    headerName: "Year",
//    width: 200,
//    rowSpanValueGetter: (value, row) => {
//      return row ? `${row.paper_name}-${row.year}` : value;
//    },
//  },
//  {
//    field: "paper_link",
//    headerName: "Paper Link",
//    width: 200,
//    renderCell: (params) => (
//      <a href={params.value} target="_blank" rel="noopener noreferrer">
//        {params.value}
//      </a>
//    ),
//  },
];

function App() {
  const [spanning, setSpanning] = useState(false);

  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<FullRow | null>(null);
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
        const dataset = dat.datasets.find(
          (i) => i.dataset_id === annotation.dataset_id,
        );
        if (dataset) {
          rs = [
            ...rs,
            {
              id: paper.paper_id + "-" + index,
              dataset_name: dataset.dataset_name,
              dataset_description: dataset.description,
              genre: dataset.genre,
              language: dataset.language.join(", "),
              document_type: dataset.document_type,
              document_count: dataset.document_count,
              release_name: annotation.release_name === "PARENT" ? dataset.dataset_name : annotation.release_name,
              release_link: annotation.release_link ? annotation.release_link : "-",
              accessibility: annotation.accessibility,
              annotation_tasks: annotation.annotation_task,
              annotation_description: annotation.description,
              subset: annotation.subset,
              agreement_type: annotation.agreement_type,
              agreement: annotation.agreement_score instanceof Object ? JSON.stringify(annotation.agreement_score) : annotation.agreement_score,
              annotator_type: annotation.annotator_type,
              paper_name: paper.paper_title,
              authors: paper.authors.join(", "),
              year: paper.year,
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
              Argumentation Mining datasets
            </Typography>
            <IconButton
              color="primary"
              aria-label="GitHub Repository"
              href="https://github.com/infoqualitylab/arg-mining-datasets"
              target="_blank"
            >
              <GitHubIcon />
            </IconButton>
          </Box>
          <Divider />
          <Typography
            variant="body1"
            color="textSecondary"
            sx={{ marginTop: 2, marginBottom: 2 }}
          >
            Click on a row to see more details about a dataset and how it was annotated.
          </Typography>
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
            /*columnVisibilityModel={{
              paper_name: false,
              authors: false,
              year: false,
              paper_link: false,
              annotator_type: false,
              accessibility: false,
              }}*/
            showToolbar
            getRowHeight={() => "auto"}
            rowSpanning={spanning}
            disableRowSelectionOnClick
            onRowClick={(params) => handleClickOpen(params.row)}
            aria-label="Argumentation Mining datasets Data Grid"
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
