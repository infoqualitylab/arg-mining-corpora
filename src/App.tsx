import { useState, useMemo } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";
import { useTheme } from "@mui/material/styles";
import {
  Drawer,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
  FormControlLabel,
  FormGroup,
  Stack,
  Switch,
  Typography,
  Link,
} from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

import datas from "./data/entries/datasets.json";
import paps from "./data/entries/papers.json";

const dat = datas;
const pap = paps;

/* ----------------------------- TYPES ----------------------------- */

export interface FullRow {
  id: string;

  dataset_id: string;
  dataset_name: string;
  dataset_description: string[];
  dataset_document_count: number;
  dataset_document_type: string;
  dataset_language: string;
  dataset_domain: string;
  dataset_extends?: string[];

  release_name: string;
  release_link?: string;
  accessibility: string;

  annotation_tasks: string[];
  annotation_description: string[];
  subset: number | string;
  agreement_type: string;
  agreement: any;
  annotator_type: string;

  paper_name: string;
  authors: string;
  year: number;
  paper_link?: string;
  doi?: string;
  open_alex_id?: string;
}

/* ----------------------- TASK COLOR SYSTEM ----------------------- */

const TASK_COLOR_MAP: Record<string, string> = {
  stance: "#2563eb",
  argument_component: "#7c3aed",
  relation: "#059669",
  claim_detection: "#0ea5e9",
  premise_detection: "#d97706",
};

function getTaskColor(task: string) {
  return TASK_COLOR_MAP[task] || "#64748b";
}

/* -------------------------- AGREEMENT ---------------------------- */

function formatAgreement(agreement: any) {
  if (agreement === null || agreement === undefined) return "N/A";

  if (typeof agreement === "number") return agreement;

  if (Array.isArray(agreement)) {
    return `${agreement[0]} - ${agreement[1]}`;
  }

  if (typeof agreement === "object") {
    return Object.entries(agreement)
      .map(([k, v]) => `${k}: ${v}`)
      .join(" | ");
  }

  return agreement;
}

/* -------------------------- LINEAGE ------------------------------ */

function ReleaseLineageGraph({
  rows,
  datasetId,
  selectedRelease,
  onSelectRelease,
}: {
  rows: FullRow[];
  datasetId: string;
  selectedRelease: string;
  onSelectRelease: (releaseName: string) => void;
}) {
  const theme = useTheme();

  const lineageRows = rows.filter((r) => r.dataset_id === datasetId);

  const uniqueReleases = Array.from(
    new Map(lineageRows.map((r) => [r.release_name, r])).values()
  ).sort((a, b) => a.year - b.year);

  return (
    <Stack spacing={2} alignItems="center">
      {uniqueReleases.map((r, idx) => {
        const selected = r.release_name === selectedRelease;

        return (
          <Stack key={r.release_name} alignItems="center" spacing={1}>
            <Box
              onClick={() => onSelectRelease(r.release_name)}
              sx={{
                px: 2,
                py: 1,
                borderRadius: 2,
                cursor: "pointer",
                border: "2px solid",
                borderColor: selected
                  ? theme.palette.primary.main
                  : theme.palette.divider,
                bgcolor: selected
                  ? theme.palette.primary.main + "22"
                  : theme.palette.background.paper,
                transition: "all .2s",
                "&:hover": {
                  borderColor: theme.palette.primary.main,
                },
              }}
            >
              <Typography fontSize={13} fontWeight={600} textAlign="center">
                {r.release_name}
              </Typography>
              <Typography fontSize={11} color="text.secondary" textAlign="center">
                {r.year}
              </Typography>
            </Box>

            {idx !== uniqueReleases.length - 1 && (
              <Box
                sx={{
                  width: 2,
                  height: 28,
                  bgcolor: theme.palette.divider,
                }}
              />
            )}
          </Stack>
        );
      })}
    </Stack>
  );
}

/* --------------------------- DRAWER ------------------------------ */

function CombinedDrawer({ open, onClose, row, rows, setRow }: any) {
  const theme = useTheme();
  if (!row) return null;

  const subsetNumber = typeof row.subset === "number" ? row.subset : 0;
  const totalDocs = row.dataset_document_count || 1;

  const pieData = [
    { name: "Annotated", value: subsetNumber },
    { name: "Remaining", value: Math.max(totalDocs - subsetNumber, 0) },
  ];

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 1150, height: "100%", display: "flex" }}>
        {/* DATASET SIDE */}
        <Box sx={{ width: "45%", p: 3, borderRight: 1, borderColor: "divider", overflowY: "auto" }}>
          <Typography variant="overline" color="text.secondary">
            DATASET
          </Typography>
          <Typography variant="h5" fontWeight={700} mb={2}>
            {row.dataset_name}
          </Typography>

          <Divider sx={{ mb: 2 }} />

          {row.dataset_description?.map((d: string, i: number) => (
            <Typography key={i} variant="body2" paragraph>
              {d}
            </Typography>
          ))}

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle2" gutterBottom>
            Dataset Details
          </Typography>

          <Stack spacing={0.5}>
            <Typography variant="body2">Documents: {row.dataset_document_count}</Typography>
            <Typography variant="body2">Type: {row.dataset_document_type}</Typography>
            <Typography variant="body2">Language: {row.dataset_language}</Typography>
            <Typography variant="body2">Domain: {row.dataset_domain}</Typography>
          </Stack>

          <Divider sx={{ my: 3 }} />

          <Typography variant="subtitle2" gutterBottom>
            Release Lineage
          </Typography>

          <ReleaseLineageGraph
            rows={rows}
            datasetId={row.dataset_id}
            selectedRelease={row.release_name}
            onSelectRelease={(releaseName) => {
              const newRow = rows.find(
                (r: FullRow) =>
                  r.dataset_id === row.dataset_id && r.release_name === releaseName
              );
              if (newRow) setRow(newRow);
            }}
          />
        </Box>

        {/* RELEASE SIDE */}
        <Box sx={{ width: "55%", p: 3, overflowY: "auto" }}>
          <Typography variant="overline" color="text.secondary">
            RELEASE
          </Typography>

          <Typography variant="h5" fontWeight={700}>
            {row.release_name}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {row.paper_name} ({row.year})
          </Typography>

          <Typography variant="body2" color="text.secondary" mb={1}>
            {row.authors}
          </Typography>

          <Stack direction="row" spacing={2} flexWrap="wrap" mb={2}>
            {row.doi && <Link href={row.doi}>DOI</Link>}
            {row.paper_link && <Link href={row.paper_link}>Paper</Link>}
            {row.open_alex_id && <Link href={row.open_alex_id}>OpenAlex</Link>}
            {row.release_link && <Link href={row.release_link}>Release</Link>}
          </Stack>

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle2" gutterBottom>
            Annotation Tasks
          </Typography>

          <Stack direction="row" spacing={1} flexWrap="wrap" mb={2}>
            {row.annotation_tasks.map((t: string) => (
              <Chip
                key={t}
                label={t}
                size="small"
                sx={{
                  bgcolor: getTaskColor(t),
                  color: "white",
                  fontWeight: 600,
                }}
              />
            ))}
          </Stack>

          <Typography variant="subtitle2">Description</Typography>
          {row.annotation_description?.map((d: string, i: number) => (
            <Typography key={i} variant="body2" paragraph>
              {d}
            </Typography>
          ))}

          <Divider sx={{ my: 2 }} />

          <Stack spacing={0.5} mb={3}>
            <Typography variant="body2">
              Agreement ({row.agreement_type}): {formatAgreement(row.agreement)}
            </Typography>
            <Typography variant="body2">Annotators: {row.annotator_type}</Typography>
            <Typography variant="body2">Accessibility: {row.accessibility}</Typography>
          </Stack>

          <Typography variant="subtitle2" gutterBottom>
            Coverage
          </Typography>

          <Box sx={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={90} label>
                  {pieData.map((_, i) => (
                    <Cell
                      key={i}
                      fill={i === 0 ? theme.palette.primary.main : theme.palette.grey[500]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
}

/* --------------------------- COLUMNS ----------------------------- */

const columns: GridColDef[] = [
  { field: "dataset_name", headerName: "Dataset", width: 220 },
  { field: "release_name", headerName: "Release", width: 220 },
  { field: "dataset_domain", headerName: "Domain", width: 160 },
  { field: "dataset_language", headerName: "Language", width: 160 },
  { field: "dataset_document_type", headerName: "Doc Type", width: 180 },
  { field: "dataset_document_count", headerName: "Doc Count", width: 160 },
  {
    field: "annotation_tasks",
    headerName: "Annotation Tasks",
    width: 320,
    renderCell: (params) => (
      <Stack direction="row" spacing={0.5} flexWrap="wrap">
        {params.value.map((label: string) => (
          <Chip
            key={label}
            label={label}
            size="small"
            sx={{
              bgcolor: getTaskColor(label),
              color: "white",
              fontWeight: 600,
            }}
          />
        ))}
      </Stack>
    ),
  },
];

/* ----------------------------- APP ------------------------------- */

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
        const dataset = dat.datasets.find((i) => i.dataset_id === annotation.dataset_id);

        if (dataset) {
          rs.push({
            id: paper.paper_id + "-" + index,

            dataset_id: dataset.dataset_id,
            dataset_name: dataset.dataset_name,
            dataset_description: dataset.description,
            dataset_document_count: dataset.document_count,
            dataset_document_type: dataset.document_type,
            dataset_language: dataset.language.join(", "),
            dataset_domain: dataset.domain || "N/A",
            dataset_extends: dataset.extends,

            release_name:
              annotation.release_name === "PARENT"
                ? dataset.dataset_name
                : annotation.release_name,
            release_link: annotation.release_link,
            accessibility: annotation.accessibility,

            annotation_tasks: annotation.annotation_task,
            annotation_description: annotation.description,
            subset: annotation.subset,
            agreement_type: annotation.agreement_type,
            agreement: annotation.agreement_score,
            annotator_type: annotation.annotator_type,

            paper_name: paper.paper_title,
            authors: paper.authors.join(", "),
            year: paper.year,
            paper_link: paper.paper_link,
            doi: paper.doi,
            open_alex_id: paper.open_alex_id,
          });
        }
      }
    }

    return rs;
  }, []);

  return (
    <Box sx={{ height: 700, width: "100%" }}>
      <Card variant="outlined">
        <CardContent>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography gutterBottom variant="h3">
              Argumentation Mining datasets
            </Typography>

            <IconButton
              color="primary"
              href="https://github.com/infoqualitylab/arg-mining-datasets"
              target="_blank"
            >
              <GitHubIcon />
            </IconButton>
          </Box>

          <Divider />

          <Typography sx={{ mt: 2, mb: 2 }}>
            Click a row to view dataset + release details.
          </Typography>

          <FormGroup>
            <FormControlLabel
              control={<Switch checked={spanning} onChange={() => setSpanning(!spanning)} />}
              label="Row Spanning"
            />
          </FormGroup>

          <DataGrid
            rows={rows}
            columns={columns}
            slots={{ toolbar: GridToolbar }}
            getRowHeight={() => "auto"}
            rowSpanning={spanning}
            disableRowSelectionOnClick
            onRowClick={(params) => handleClickOpen(params.row)}
          />
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
  );
}

export default App;
