import { useState, useMemo } from "react";
import { DataGrid } from "@mui/x-data-grid";
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

interface AnnotationEntry {
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

function formatAgreement(agreement: any) {
  if (!agreement) return "N/A";
  if (typeof agreement === "number") return agreement;
  if (Array.isArray(agreement)) return `${agreement[0]} - ${agreement[1]}`;
  if (typeof agreement === "object") {
    return Object.entries(agreement)
      .map(([k, v]) => `${k}: ${v}`)
      .join(" | ");
  }
  return agreement;
}

function ReleaseLineageGraph({ rows, datasetId, selectedRelease, onSelectRelease }: any) {
  const theme = useTheme();

  const lineageRows = rows
    .filter((r: ReleaseRow) => r.dataset_id === datasetId)
    .sort((a: ReleaseRow, b: ReleaseRow) => {
      const ay = a.annotation_entries[0]?.year || 0;
      const by = b.annotation_entries[0]?.year || 0;
      return ay - by;
    });

  return (
    <Stack spacing={2} alignItems="center">
      {lineageRows.map((r: ReleaseRow, idx: number) => {
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
              }}
            >
              <Typography fontSize={13} fontWeight={600} textAlign="center">
                {r.release_name}
              </Typography>
              <Typography fontSize={11} color="text.secondary" textAlign="center">
                {r.annotation_entries[0]?.year}
              </Typography>
            </Box>

            {idx !== lineageRows.length - 1 && (
              <Box sx={{ width: 2, height: 28, bgcolor: theme.palette.divider }} />
            )}
          </Stack>
        );
      })}
    </Stack>
  );
}

function CombinedDrawer({ open, onClose, row, rows, setRow }: any) {
  const theme = useTheme();
  if (!row) return null;

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 1200, height: "100%", display: "flex" }}>
        {/* DATASET */}
        <Box sx={{ width: "40%", p: 3, borderRight: 1, borderColor: "divider", overflowY: "auto" }}>
          <Typography variant="overline">DATASET</Typography>
          <Typography variant="h5" fontWeight={700} mb={2}>
            {row.dataset_name}
          </Typography>

          {row.dataset_description.map((d: string, i: number) => (
            <Typography key={i} variant="body2" paragraph>
              {d}
            </Typography>
          ))}

          <Divider sx={{ my: 2 }} />

          <Stack spacing={0.5}>
            <Typography variant="body2">Documents: {row.dataset_document_count}</Typography>
            <Typography variant="body2">Type: {row.dataset_document_type}</Typography>
            <Typography variant="body2">Language: {row.dataset_language}</Typography>
            <Typography variant="body2">Domain: {row.dataset_domain}</Typography>
          </Stack>

          <Divider sx={{ my: 3 }} />

          <Typography variant="subtitle2">Release Lineage</Typography>

          <ReleaseLineageGraph
            rows={rows}
            datasetId={row.dataset_id}
            selectedRelease={row.release_name}
            onSelectRelease={(releaseName: string) => {
              const newRow = rows.find(
                (r: ReleaseRow) =>
                  r.dataset_id === row.dataset_id && r.release_name === releaseName
              );
              if (newRow) setRow(newRow);
            }}
          />
        </Box>

        {/* RELEASE */}
        <Box sx={{ width: "60%", p: 3, overflowY: "auto" }}>
          <Typography variant="overline">RELEASE</Typography>
          <Typography variant="h5" fontWeight={700}>
            {row.release_name}
          </Typography>

          {row.release_link && (
            <Link href={row.release_link} sx={{ display: "block", mb: 2 }}>
              Release Link
            </Link>
          )}

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" gutterBottom>
            Annotation Entries
          </Typography>

          <Stack spacing={3}>
            {row.annotation_entries.map((entry: AnnotationEntry, idx: number) => {
              const pieData = [
                { name: "Annotated", value: entry.subset },
                {
                  name: "Remaining",
                  value: Math.max(row.dataset_document_count - entry.subset, 0),
                },
              ];

              return (
                <Card key={idx} variant="outlined" sx={{ p: 2 }}>
                  <Typography fontWeight={700}>
                    {entry.paper_name} ({entry.year})
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {entry.authors}
                  </Typography>

                  <Stack direction="row" spacing={2} flexWrap="wrap" mb={2}>
                    {entry.doi && <Link href={entry.doi}>DOI</Link>}
                    {entry.paper_link && <Link href={entry.paper_link}>Paper</Link>}
                    {entry.open_alex_id && <Link href={entry.open_alex_id}>OpenAlex</Link>}
                  </Stack>

                  <Stack direction="row" spacing={1} flexWrap="wrap" mb={2}>
                    {entry.annotation_tasks.map((t) => (
                      <Chip
                        key={t}
                        label={t}
                        size="small"
                        sx={{ bgcolor: getTaskColor(t), color: "white" }}
                      />
                    ))}
                  </Stack>

                  {entry.annotation_description.map((d, i) => (
                    <Typography key={i} variant="body2" paragraph>
                      {d}
                    </Typography>
                  ))}

                  <Typography variant="body2" mb={2}>
                    Agreement ({entry.agreement_type}): {formatAgreement(entry.agreement)}
                  </Typography>

                  <Box sx={{ width: "100%", height: 200 }}>
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie data={pieData} dataKey="value" outerRadius={70}>
                          {pieData.map((_, i) => (
                            <Cell
                              key={i}
                              fill={
                                i === 0
                                  ? theme.palette.primary.main
                                  : theme.palette.grey[500]
                              }
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                </Card>
              );
            })}
          </Stack>
        </Box>
      </Box>
    </Drawer>
  );
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
