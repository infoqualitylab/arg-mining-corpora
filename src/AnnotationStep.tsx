import React from "react";
import {
  Stack,
  Typography,
  Autocomplete,
  Chip,
  TextField,
  MenuItem,
  Button,
  Paper,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { TASK_COLOR_MAP } from "./utils";

export default function AnnotationStep({ form, setForm }: any) {
  return (
    <Stack spacing={3}>
      {form.annotations.map((annotation: any, annotationIndex: number) => (
        <Paper key={annotationIndex} variant="outlined" sx={{ p: 3 }}>
          <Stack spacing={3}>
            <Typography variant="subtitle2">Release Description</Typography>

            <Autocomplete
              multiple
              options={Object.keys(TASK_COLOR_MAP)}
              value={annotation.tasks}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip label={option} {...getTagProps({ index })} />
                ))
              }
              renderInput={(params) => (
                <TextField {...params} label="Select Argument Mining Tasks" />
              )}
              onChange={(_, val) => {
                const next = [...form.annotations];
                next[annotationIndex] = {
                  ...annotation,
                  tasks: val,
                };

                setForm({
                  ...form,
                  annotations: next,
                });
              }}
            />

            <Typography variant="caption">
              Annotation Description Paragraphs
            </Typography>

            {annotation.description.map(
              (paragraph: string, paragraphIndex: number) => (
                <TextField
                  key={paragraphIndex}
                  multiline
                  rows={2}
                  value={paragraph}
                  onChange={(e) => {
                    const next = [...form.annotations];
                    const descriptions = [...annotation.description];

                    descriptions[paragraphIndex] = e.target.value;

                    next[annotationIndex] = {
                      ...annotation,
                      description: descriptions,
                    };

                    setForm({
                      ...form,
                      annotations: next,
                    });
                  }}
                />
              )
            )}

            <Button
              startIcon={<AddIcon />}
              onClick={() => {
                const next = [...form.annotations];

                next[annotationIndex] = {
                  ...annotation,
                  description: [...annotation.description, ""],
                };

                setForm({
                  ...form,
                  annotations: next,
                });
              }}
            >
              Add Paragraph
            </Button>

            <TextField
              select
              label="Accessibility"
              value={annotation.accessibility}
              onChange={(e) => {
                const next = [...form.annotations];

                next[annotationIndex] = {
                  ...annotation,
                  accessibility: e.target.value,
                };

                setForm({
                  ...form,
                  annotations: next,
                });
              }}
            >
              {["Free", "Upon Request", "Paid", "Unavailable"].map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Agreement Score Detail"
              multiline
              rows={3}
              value={annotation.agreementScore}
              onChange={(e) => {
                const next = [...form.annotations];

                next[annotationIndex] = {
                  ...annotation,
                  agreementScore: e.target.value,
                };

                setForm({
                  ...form,
                  annotations: next,
                });
              }}
            />

            <Stack direction="row" spacing={2}>
              <TextField
                label="Release Name"
                fullWidth
                value={annotation.releaseName}
                onChange={(e) => {
                  const next = [...form.annotations];

                  next[annotationIndex] = {
                    ...annotation,
                    releaseName: e.target.value,
                  };

                  setForm({
                    ...form,
                    annotations: next,
                  });
                }}
              />

              <TextField
                label="Release Size"
                type="number"
                fullWidth
                value={annotation.releaseSize}
                onChange={(e) => {
                  const next = [...form.annotations];

                  next[annotationIndex] = {
                    ...annotation,
                    releaseSize: parseInt(e.target.value),
                  };

                  setForm({
                    ...form,
                    annotations: next,
                  });
                }}
              />
            </Stack>
          </Stack>
        </Paper>
      ))}

      <Button
        startIcon={<AddIcon />}
        onClick={() => {
          setForm({
            ...form,
            annotations: [
              ...form.annotations,
              {
                tasks: [],
                description: [""],
                annotatorType: "",
                agreementType: "",
                agreementScore: "",
                accessibility: "Free",
                releaseLink: "",
                releaseName: "",
                releaseSize: 0,
              },
            ],
          });
        }}
      >
        Add Annotation
      </Button>
    </Stack>
  );
}
