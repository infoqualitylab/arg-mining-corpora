import { useState, useMemo } from "react";
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
  { field: "dataset_name", headerName: "Dataset Name", width: 260 },
  { field: "genre", headerName: "Genre", width: 180 },
  { field: "language", headerName: "Language", width: 180 },
  { field: "document_type", headerName: "Document Type", width: 200 },
  { field: "document_count", headerName: "Document Count", width: 180 },
  { field: "release_name", headerName: "Release Name", width: 240 },
  {
    field: "release_link",
    headerName: "Release Link",
    width: 260,
    renderCell: (params) => (
      params.value === "-" ? (<span>{params.value}</span>) : (
        <a href={params.value} target="_blank" rel="noopener noreferrer">
          {params.value}
        </a>
      )
    ),
  },
  { field: "accessibility", headerName: "Accessibility", width: 200 },
  {
    field: "annotation_tasks",
    headerName: "Annotation Task(s)",
    width: 280,
    renderCell: (params) => (
      <Stack spacing={0.5} sx={{ py: 0.5 }}>
        {params.value.map((label: string) => (
          <Chip key={label} label={label} size="small" variant="outlined" />
        ))}
      </Stack>
    ),
  },
  { field: "subset", headerName: "Subset", width: 140 },
];

function App() {
  const [spanning, setSpanning] = useState(false);

  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<FullRow | null>(null);

  const handleClickOpen = (row: FullRow) => {
    setSelectedRow(row);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const rows = useMemo<FullRow[]>(() => {
    let rs: FullRow[] = [];
    for (const paper of pap.papers) {
      for (const [index, annotation] of paper.annotations.entries()) {
        const dataset = dat.datasets.find(
          (i) => i.dataset_id === annotation.dataset_id,
        );
        if (dataset) {
          rs.push({
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
          });
        }
      }
    }
    return rs;
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        backgroundColor: "#020617",
        px: { xs: 1, md: 2 },
        py: 2,
        fontFamily: `'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif`,
      }}
    >
      <Box sx={{ width: "100%" }}>
        <Card
          variant="outlined"
          sx={{
            borderRadius: 3,
            backgroundColor: "#020617",
            borderColor: "rgba(148,163,184,0.2)",
          }}
        >
          <CardContent sx={{ p: { xs: 2, md: 3 } }}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", sm: "center" }}
              sx={{ mb: 2 }}
            >
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 600, letterSpacing: -0.2 }}>
                  Argumentation Mining Datasets
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Explore datasets and annotation details.
                </Typography>
              </Box>

              <Stack direction="row" spacing={2} alignItems="center">
                <IconButton
                  aria-label="GitHub Repository"
                  href="https://github.com/infoqualitylab/arg-mining-corpora"
                  target="_blank"
                >
                  <GitHubIcon />
                </IconButton>
              </Stack>
            </Stack>

            <Divider sx={{ mb: 2 }} />

            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={2}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", md: "center" }}
              sx={{ mb: 2 }}
            >
              <Typography variant="body2" color="text.secondary">
                Click a row to view details.
              </Typography>

              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={spanning}
                      onChange={() => setSpanning(!spanning)}
                    />
                  }
                  label="Row Spanning"
                />
              </FormGroup>
            </Stack>

            <Box
              sx={{
                height: "73vh",
                width: "100%",
                borderRadius: 2,
                overflow: "hidden",
                border: "1px solid rgba(148,163,184,0.2)",
              }}
            >
              <DataGrid
                rows={rows}
                columns={columns}
                showToolbar
                getRowHeight={() => "auto"}
                rowSpanning={spanning}
                disableRowSelectionOnClick
                onRowClick={(params) => handleClickOpen(params.row)}
                sx={{
                  border: 0,

                  /* Sticky headers now work because grid scrolls */
                  "& .MuiDataGrid-columnHeaders": {
                    position: "sticky",
                    top: 0,
                    zIndex: 3,
                    backgroundColor: "#020617",
                    borderBottom: "1px solid rgba(148,163,184,0.25)",
                  },

                  /* Click affordance */
                  "& .MuiDataGrid-row": {
                    cursor: "pointer",
                    position: "relative",
                  },

                  /* Left accent */
                  "& .MuiDataGrid-row:hover::before": {
                    content: '""',
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: "4px",
                    background: "#6366f1",
                  },

                  /* Zebra */
                  "& .MuiDataGrid-row:nth-of-type(odd)": {
                    backgroundColor: "rgba(15,23,42,0.25)",
                  },

                  /* Hover */
                  "& .MuiDataGrid-row:hover": {
                    backgroundColor: "rgba(99,102,241,0.28)",
                    boxShadow: "inset 0 0 0 1px rgba(99,102,241,0.6)",
                  },

                  /* Selected */
                  "& .Mui-selected": {
                    backgroundColor: "rgba(99,102,241,0.35) !important",
                  },
                }}
              />
            </Box>
          </CardContent>
        </Card>

        <DescriptionDialog
          open={open}
          handleClose={handleClose}
          selectedRow={selectedRow}
        />
      </Box>
    </Box>
  );
}

export default App;

