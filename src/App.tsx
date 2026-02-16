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
          <Chip key={label} label={label} size="small" variant="outlined" />
        ))}
      </Stack>
    ),
  },
];

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

function CombinedDrawer({ open, onClose, row }: any) {
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
      <Box sx={{ width: 1000, height: "100%", display: "flex" }}>
        {/* LEFT DATASET */}
        <Box sx={{ width: "45%", p: 3, borderRight: 1, borderColor: "divider" }}>
          <Typography variant="overline">DATASET</Typography>
          <Typography variant="h5" fontWeight={600}>{row.dataset_name}</Typography>

          <Divider sx={{ my: 2 }} />

          {row.dataset_description?.map((d: string, i: number) => (
            <Typography key={i} variant="body2" paragraph>{d}</Typography>
          ))}

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle2">Dataset Details</Typography>
          <Typography variant="body2">Documents: {row.dataset_document_count}</Typography>
          <Typography variant="body2">Type: {row.dataset_document_type}</Typography>
          <Typography variant="body2">Language: {row.dataset_language}</Typography>
          <Typography variant="body2">Domain: {row.dataset_domain}</Typography>

          <Typography variant="body2" sx={{ mt: 1 }}>
            Extends: {row.dataset_extends?.join(", ") || "None"}
          </Typography>
        </Box>

        {/* RIGHT RELEASE */}
        <Box sx={{ width: "55%", p: 3 }}>
          <Typography variant="overline">RELEASE</Typography>
          <Typography variant="h5" fontWeight={600}>{row.release_name}</Typography>

          <Typography variant="body2" color="text.secondary">
            {row.paper_name} ({row.year})
          </Typography>

          <Typography variant="body2" color="text.secondary" gutterBottom>
            {row.authors}
          </Typography>

          <Stack direction="row" spacing={2} flexWrap="wrap" mb={2}>
            {row.doi && <Link href={row.doi}>DOI</Link>}
            {row.paper_link && <Link href={row.paper_link}>Paper</Link>}
            {row.open_alex_id && <Link href={row.open_alex_id}>OpenAlex</Link>}
            {row.release_link && <Link href={row.release_link}>Release</Link>}
          </Stack>

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle2">Annotation Tasks</Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" mb={2}>
            {row.annotation_tasks.map((t: string) => (
              <Chip key={t} label={t} />
            ))}
          </Stack>

          <Typography variant="subtitle2">Annotation Description</Typography>
          {row.annotation_description?.map((d: string, i: number) => (
            <Typography key={i} variant="body2" paragraph>{d}</Typography>
          ))}

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle2">Agreement</Typography>
          <Typography variant="body2">
            {row.agreement_type}: {formatAgreement(row.agreement)}
          </Typography>

          <Typography variant="body2">Annotators: {row.annotator_type}</Typography>
          <Typography variant="body2">Accessibility: {row.accessibility}</Typography>

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle2">Dataset Coverage</Typography>
          <Box sx={{ height: 260 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={pieData} dataKey="value" outerRadius={90}>
                  {pieData.map((_: any, i: number) => (
                    <Cell key={i} fill={i === 0 ? theme.palette.primary.main : theme.palette.action.hover} />
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

// -------- App --------
function App() {
  const [dense, setDense] = useState(false);
  const [selectedRow, setSelectedRow] = useState<FullRow | null>(null);

  const rows = useMemo(() => {
    let rs: FullRow[] = [];

    for (const paper of pap.papers) {
      for (const [index, annotation] of paper.annotations.entries()) {
        const dataset = dat.datasets.find((i: any) => i.dataset_id === annotation.dataset_id);

        if (dataset) {
          rs.push({
            id: paper.paper_id + "-" + index,

            dataset_id: dataset.dataset_id,
            dataset_name: dataset.dataset_name,
            dataset_description: dataset.description,
            dataset_document_count: dataset.document_count,
            dataset_document_type: dataset.document_type,
            dataset_language: dataset.language.join(", "),
            dataset_domain: dataset.genre,
            dataset_extends: dataset.extends,

            release_name: annotation.release_name === "PARENT" ? dataset.dataset_name : annotation.release_name,
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
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", p: 2 }}>
      <Card variant="outlined">
        <CardContent>
          <Stack direction="row" justifyContent="space-between" mb={2}>
            <Typography variant="h4" fontWeight={600}>Argumentation Mining Datasets</Typography>

            <Stack direction="row" spacing={2} alignItems="center">
              <FormControlLabel
                control={<Switch checked={dense} onChange={() => setDense(!dense)} />}
                label="Dense"
              />

              <IconButton href="https://github.com/infoqualitylab/arg-mining-corpora">
                <GitHubIcon />
              </IconButton>
            </Stack>
          </Stack>

          <Divider sx={{ mb: 2 }} />

          <Box sx={{ height: "70vh" }}>
            <DataGrid
              rows={rows}
              columns={columns}
              slots={{ toolbar: GridToolbar }}
              density={dense ? "compact" : "standard"}
              getRowHeight={() => "auto"}
              onRowClick={(params) => setSelectedRow(params.row)}
            />
          </Box>
        </CardContent>
      </Card>

      <CombinedDrawer open={!!selectedRow} row={selectedRow} onClose={() => setSelectedRow(null)} />
    </Box>
  );
}

export default App;
