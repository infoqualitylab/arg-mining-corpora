import React from "react";
import {
  Stack,
  Autocomplete,
  TextField,
  Paper,
  Typography,
  Button
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

export default function DatasetStep({
  form,
  setForm,
  existingDatasets
}: any) {
  return (
    <Stack spacing={3}>
      <Autocomplete
        options={existingDatasets}
        value={
          existingDatasets.find(
            (dataset: any) =>
              dataset.dataset_id === form.selectedDatasetId
          ) || null
        }
        getOptionLabel={(opt: any) => opt.dataset_name}
        onChange={(_, val) => {
          if (val) {
            setForm({
              ...form,
              selectedDatasetId: val.dataset_id,
              isNewDataset: false
            });
          } else {
            setForm({
              ...form,
              selectedDatasetId: "",
              isNewDataset: true
            });
          }
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Select Existing Dataset"
          />
        )}
      />

      {form.isNewDataset && (
        <Paper
          variant="outlined"
          sx={{ p: 3, bgcolor: "action.hover" }}
        >
          <Typography
            variant="subtitle2"
            gutterBottom
          >
            New Dataset Details
          </Typography>

          <Stack spacing={2}>
            <TextField
              label="Dataset Name"
              fullWidth
              value={form.newDataset.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  newDataset: {
                    ...form.newDataset,
                    name: e.target.value
                  }
                })
              }
            />

            <TextField
              label="Genre"
              fullWidth
              value={form.newDataset.genre}
              onChange={(e) =>
                setForm({
                  ...form,
                  newDataset: {
                    ...form.newDataset,
                    genre: e.target.value
                  }
                })
              }
            />

            <Typography variant="caption">
              Description Paragraphs
            </Typography>

            {form.newDataset.description.map(
              (paragraph: string, index: number) => (
                <TextField
                  key={index}
                  multiline
                  rows={2}
                  value={paragraph}
                  onChange={(e) => {
                    const next = [
                      ...form.newDataset.description
                    ];

                    next[index] = e.target.value;

                    setForm({
                      ...form,
                      newDataset: {
                        ...form.newDataset,
                        description: next
                      }
                    });
                  }}
                />
              )
            )}

            <Button
              startIcon={<AddIcon />}
              onClick={() =>
                setForm({
                  ...form,
                  newDataset: {
                    ...form.newDataset,
                    description: [
                      ...form.newDataset.description,
                      ""
                    ]
                  }
                })
              }
            >
              Add Paragraph
            </Button>
          </Stack>
        </Paper>
      )}
    </Stack>
  );
}
