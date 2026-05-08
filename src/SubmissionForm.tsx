import { useState } from "react";
import {
  Box,
  Stack,
  TextField,
  Typography,
  Button
} from "@mui/material";

export default function SubmissionForm() {
  const [form, setForm] = useState({
    datasetName: "",
    releaseOf: "",
    extendsDatasets: "",
    datasetDescription: "",
    datasetLink: "",
    paperLink: "",
    annotationDescription: ""
  });

  const handleSubmit = () => {
    const payload = {
      timestamp: new Date().toISOString(),
      contribution: form
    };

    const jsonString = JSON.stringify(payload, null, 2);

    const body = encodeURIComponent(
      `## New Dataset Submission\n\n\`\`\`json\n${jsonString}\n\`\`\``
    );

    window.open(
      `https://github.com/infoqualitylab/arg-mining-corpora/issues/new?title=${encodeURIComponent(
        form.datasetName
      )}&body=${body}`
    );
  };

  return (
    <Box
      sx={{
        maxWidth: 800,
        mx: "auto",
        py: 6,
        px: 2
      }}
    >
      <Stack spacing={4}>
        <Typography variant="h4">
          Dataset Submission Form
        </Typography>

        <TextField
          label="Name of Your Dataset"
          fullWidth
          value={form.datasetName}
          onChange={(e) =>
            setForm({
              ...form,
              datasetName: e.target.value
            })
          }
        />

        <TextField
          label="If this is a release of another dataset, name it here"
          fullWidth
          value={form.releaseOf}
          onChange={(e) =>
            setForm({
              ...form,
              releaseOf: e.target.value
            })
          }
        />

        <TextField
          label="If this dataset extends other datasets, name them here"
          fullWidth
          value={form.extendsDatasets}
          onChange={(e) =>
            setForm({
              ...form,
              extendsDatasets: e.target.value
            })
          }
        />

        <TextField
          label="Description of Your Dataset (genre, language, details)"
          multiline
          rows={6}
          fullWidth
          value={form.datasetDescription}
          onChange={(e) =>
            setForm({
              ...form,
              datasetDescription: e.target.value
            })
          }
        />

        <TextField
          label="Link to Your Dataset"
          fullWidth
          value={form.datasetLink}
          onChange={(e) =>
            setForm({
              ...form,
              datasetLink: e.target.value
            })
          }
        />

        <TextField
          label="Link to Associated Paper"
          fullWidth
          value={form.paperLink}
          onChange={(e) =>
            setForm({
              ...form,
              paperLink: e.target.value
            })
          }
        />

        <TextField
          label="Brief Description of Annotation Tasks"
          multiline
          rows={4}
          fullWidth
          value={form.annotationDescription}
          onChange={(e) =>
            setForm({
              ...form,
              annotationDescription: e.target.value
            })
          }
        />

        <Button
          variant="contained"
          size="large"
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </Stack>
    </Box>
  );
}
