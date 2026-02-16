import { useTheme } from "@mui/material/styles";
import {
  Box,
  Stack,
  Typography,
} from "@mui/material";
import type { ReleaseRow } from "./App";

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

export default ReleaseLineageGraph;
