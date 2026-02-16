import { useState, useMemo } from "react";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";
import { useTheme } from "@mui/material/styles";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import CombinedDrawer from "./CombinedDrawer";
import { getTaskColor } from "./utils";

import datas from "./data/entries/datasets.json";
import paps from "./data/entries/papers.json";

const dat = datas;
const pap = paps;

export interface AnnotationEntry {
  annotation_tasks: string[];
  annotation_description: string[];
  subset: number;
  agreement_type?: string;
  agreement?: any;
  annotator_type?: string;
  paper_name: string;
  authors: string;
  year: number;
  paper_link?: string;
  doi?: string;
  open_alex_id?: string;
}

export interface ReleaseRow {
  id: string;
  dataset_id: string;
  dataset_name: string;
  dataset_description: string[];
  release_size: number;
  dataset_document_type: string;
  dataset_language: string;
  dataset_domain: string;
  release_name: string;
  release_link?: string;
  accessibility: string;
  annotation_entries: AnnotationEntry[];
  all_tasks: string[];
}

const columns: GridColDef[] = [
  { field: "release_name", headerName: "Release", width: 220 },
  { field: "dataset_name", headerName: "Dataset", width: 220 },
  { field: "dataset_domain", headerName: "Domain", width: 160 },
  { field: "dataset_language", headerName: "Language", width: 160 },
  { field: "dataset_document_type", headerName: "Doc Type", width: 180 },
  { field: "release_size", headerName: "Doc Count", width: 160 },
  {
    field: "all_tasks",
    headerName: "Annotation Tasks",
    width: 320,
    renderCell: (params) => (
      <Stack spacing={0.5} sx={{ py: 0.5 }}>
        {params.value.map((label: string) => (
          <Chip
            key={label}
            label={label}
            size="small"
            sx={{ bgcolor: getTaskColor(label), color: "white" }}
          />
        ))}
      </Stack>
    ),
  },
];

function App() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<ReleaseRow | null>(null);

  const handleClickOpen = (row: ReleaseRow) => {
    setSelectedRow(row);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const rows = useMemo<ReleaseRow[]>(() => {
    const releaseMap = new Map<string, ReleaseRow>();

    for (const paper of pap.papers) {
      for (const annotation of paper.annotations) {
        const dataset = dat.datasets.find((i) => i.dataset_id === annotation.dataset_id);
        if (!dataset) continue;

        const releaseName =
          annotation.release_name === "PARENT"
            ? dataset.dataset_name
            : annotation.release_name;

            const key = `${dataset.dataset_id}__${releaseName}`;

            if (!releaseMap.has(key)) {
              releaseMap.set(key, {
                id: key,
                dataset_id: dataset.dataset_id,
                dataset_name: dataset.dataset_name,
                dataset_description: dataset.description,
                dataset_document_count: dataset.document_count,
                dataset_document_type: dataset.document_type,
                dataset_language: dataset.language.join(", "),
                dataset_domain: dataset.domain || "N/A",
                release_size: annotation.subset || 0,
                release_name: releaseName,
                release_link: annotation.release_link,
                accessibility: annotation.accessibility,
                annotation_entries: [],
                all_tasks: [],
              });
            }

            const rel = releaseMap.get(key)!;

            const entry: AnnotationEntry = {
              annotation_tasks: annotation.annotation_task,
              annotation_description: annotation.description,
              subset: typeof annotation.subset === "number" ? annotation.subset : 0,
              agreement_type: annotation.agreement_type,
              agreement: annotation.agreement_score,
              annotator_type: annotation.annotator_type,
              paper_name: paper.paper_title,
              authors: paper.authors.join(", "),
              year: paper.year,
              paper_link: paper.paper_link,
              doi: paper.doi,
              open_alex_id: paper.open_alex_id,
            };

            rel.annotation_entries.push(entry);
            rel.all_tasks.push(...annotation.annotation_task);
            rel.release_size = Math.max(rel.release_size, entry.subset);
      }
    }

    return Array.from(releaseMap.values()).map((r) => ({
      ...r,
      all_tasks: Array.from(new Set(r.all_tasks)),
    }));
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        bgcolor: "background.default",
        color: "text.primary",
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
            bgcolor: "background.paper",
            borderColor: "divider",
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

            </Stack>

            <Box
              sx={{
                height: "73vh",
                width: "100%",
                borderRadius: 2,
                overflow: "hidden",
                border: 1,
                borderColor: "divider",
              }}
            >
              <DataGrid
                rows={rows}
                columns={columns}
                showToolbar
                getRowHeight={() => "auto"}
                disableRowSelectionOnClick
                onRowClick={(params) => handleClickOpen(params.row)}
                sx={{
                  border: 0,

                  "& .MuiDataGrid-columnHeaders": {
                    position: "sticky",
                    top: 0,
                    zIndex: 3,
                    bgcolor: "background.paper",
                    borderBottom: 1,
                    borderColor: "divider",
                },

                "& .MuiDataGrid-row": {
                  cursor: "pointer",
                  position: "relative",
                },

                "& .MuiDataGrid-row:hover::before": {
                  content: '""',
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: "4px",
                  background: theme.palette.primary.main,
                },

                "& .MuiDataGrid-row:nth-of-type(odd)": {
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.02)"
                    : "rgba(0,0,0,0.02)",
                },

                "& .MuiDataGrid-row:hover": {
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.06)"
                    : "rgba(0,0,0,0.04)",
                },

                "& .Mui-selected": {
                  backgroundColor: `${theme.palette.primary.main}33 !important`,
                },
                }}
              />
            </Box>
          </CardContent>
        </Card>
        <CombinedDrawer
          open={open}
          onClose={handleClose}
          row={selectedRow}
          rows={rows}
          setRow={setSelectedRow}
        />
      </Box>
    </Box>
  );
}

export default App;
