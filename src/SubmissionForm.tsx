import { useForm, useFieldArray } from "react-hook-form";
import {
  Box, Button, TextField, MenuItem, Typography, Stack, Paper, Divider, Chip
} from "@mui/material";
import { TASK_COLOR_MAP } from "./utils"; // Import your existing task list

export default function SubmissionForm({ existingRows }: { existingRows: any[] }) {
  const { register, control, handleSubmit, watch } = useForm({
    defaultValues: {
      dataset_name: "",
      dataset_genre: "",
      dataset_description: [""],
      language: [""],
      document_type: "",
      document_count: 0,
      parent_dataset: [""],
      annotation_entries: [
        {
        paper_name: "", annotation_tasks: [],
        annotator_type: "", agreement_type: "",
        agreement_score: "", accessibility: "",
        release_link: "", release_name: "", subset: ""
        }
      ],
     papers: [
      {
        paper_title: "", authors: [""],
        year: 2026,
        doi: "", open_alex_id: "",
        paper_link: ""
      }
     ]
    }
  });

  const { fields: descFields, append: appendDesc } = useFieldArray({
    control,
    name: "dataset_description" as any
  });

  const onSubmit = (data: any) => {
    const jsonBlob = JSON.stringify(data, null, 2);
    const body = encodeURIComponent(
      `## New Dataset Contribution\n\n\`\`\`json\n${jsonBlob}\n\`\`\``
    );
    window.open(`https://github.com/infoqualitylab/arg-mining-corpora/issues/new?title=Data+Submission&body=${body}`);
  };

    return (
      <Box sx={{ maxWidth: 800, mx: "auto", py: 4 }}>
      <Typography variant="h4" mb={4}>Contribute to the Collection</Typography>

      <Paper sx={{ p: 4 }}>
      <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
      <section>
      <Typography variant="subtitle2" color="primary" gutterBottom>1. Dataset Metadata</Typography>
      <TextField {...register("dataset_name")} label="Dataset Name" fullWidth margin="normal" />

      <Typography variant="body2" sx={{ mt: 2 }}>Description Paragraphs:</Typography>
      {descFields.map((field, index) => (
        <TextField 
        key={field.id} 
        {...register(`dataset_description.${index}` as any)} 
        fullWidth multiline rows={2} margin="dense" 
        />
      ))}
      <Button onClick={() => appendDesc("")}>+ Add Paragraph</Button>
      </section>

      <Divider />

      <section>
      <Typography variant="subtitle2" color="primary" gutterBottom>2. Lineage & Inheritance</Typography>
      <TextField
      select
      fullWidth
      label="Extends Existing Dataset?"
      {...register("parent_dataset")}
      helperText="Select 'None' if this is an entirely new corpus."
      >
      <MenuItem value="">None (Original)</MenuItem>
      {existingRows.map(row => (
        <MenuItem key={row.id} value={row.dataset_id}>{row.dataset_name}</MenuItem>
      ))}
      </TextField>
      </section>

      <Divider />

      <section>
      <Typography variant="subtitle2" color="primary" gutterBottom>3. Task Classification</Typography>
      <Typography variant="body2" mb={1}>Select all that apply:</Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
      {Object.keys(TASK_COLOR_MAP).map((task) => (
        <Chip 
        key={task} 
        label={task} 
        variant="outlined"
        onClick={() => {/* Logic to toggle in hook-form */}}
        />
      ))}
      </Box>
      </section>

      <Button type="submit" variant="contained" size="large" sx={{ py: 2 }}>
      Generate GitHub Issue
      </Button>
      </Stack>
      </form>
      </Paper>
      </Box>
    );
}
