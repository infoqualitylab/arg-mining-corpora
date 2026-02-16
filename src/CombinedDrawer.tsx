import { useTheme } from "@mui/material/styles";
import {
  Drawer,
  Box,
  Card,
  Chip,
  Divider,
  Stack,
  Typography,
  Link,
} from "@mui/material";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import ReleaseLineageGraph from "./ReleaseLineageGraph";
import type { ReleaseRow } from "./App";
import { getTaskColor, formatAgreement } from "./utils";

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

          <Typography variant="subtitle2">Release History</Typography>

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

export default CombinedDrawer;
