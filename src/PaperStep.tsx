import React from "react";
import { Stack, Autocomplete, TextField, Paper } from "@mui/material";

export default function PaperStep({ form, setForm, existingPapers }: any) {
  return (
    <Stack spacing={3}>
      <Autocomplete
        options={existingPapers}
        value={
          existingPapers.find(
            (paper: any) => paper.id === form.selectedPaperId
          ) || null
        }
        getOptionLabel={(opt: any) => opt.title}
        onChange={(_, val) => {
          if (val) {
            setForm({
              ...form,
              selectedPaperId: val.id,
              isNewPaper: false,
            });
          } else {
            setForm({
              ...form,
              selectedPaperId: "",
              isNewPaper: true,
            });
          }
        }}
        renderInput={(params) => (
          <TextField {...params} label="Select Existing Paper" />
        )}
      />

      {form.isNewPaper && (
        <Paper variant="outlined" sx={{ p: 3, bgcolor: "action.hover" }}>
          <Stack spacing={2}>
            <TextField
              label="Paper Title"
              fullWidth
              value={form.newPaper.title}
              onChange={(e) =>
                setForm({
                  ...form,
                  newPaper: {
                    ...form.newPaper,
                    title: e.target.value,
                  },
                })
              }
            />

            <TextField
              label="Authors (Comma separated)"
              fullWidth
              value={form.newPaper.authors.join(",")}
              onChange={(e) =>
                setForm({
                  ...form,
                  newPaper: {
                    ...form.newPaper,
                    authors: e.target.value.split(","),
                  },
                })
              }
            />

            <Stack direction="row" spacing={2}>
              <TextField
                label="Year"
                type="number"
                sx={{ width: "30%" }}
                value={form.newPaper.year}
                onChange={(e) =>
                  setForm({
                    ...form,
                    newPaper: {
                      ...form.newPaper,
                      year: parseInt(e.target.value),
                    },
                  })
                }
              />

              <TextField
                label="DOI (Optional)"
                sx={{ flexGrow: 1 }}
                value={form.newPaper.doi}
                onChange={(e) =>
                  setForm({
                    ...form,
                    newPaper: {
                      ...form.newPaper,
                      doi: e.target.value,
                    },
                  })
                }
              />
            </Stack>
          </Stack>
        </Paper>
      )}
    </Stack>
  );
}
