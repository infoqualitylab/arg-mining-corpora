import React, { useState } from "react";
import {
  Box, Stepper, Step, StepLabel, Button, TextField, Typography, 
  Autocomplete, Chip, Stack, Paper, MenuItem, IconButton, Divider
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { TASK_COLOR_MAP } from "./utils";

// --- Form State Types (Matching your App.tsx interfaces) ---
interface SubmissionState {
  // Step 1: Dataset
  isNewDataset: boolean;
  selectedDatasetId: string;
  newDataset: {
    name: string;
    genre: string;
    description: string[];
    languages: string[];
    docType: string;
    docCount: number;
    extends: string[];
  };
  // Step 2: Paper
  isNewPaper: boolean;
  selectedPaperId: string;
  newPaper: {
    title: string;
    authors: string[];
    year: number;
    doi: string;
    openAlexId: string;
    link: string;
  };
  // Step 3: Annotation/Release
  annotations: {
    tasks: string[];
    description: string[];
    annotatorType: string;
    agreementType: string;
    agreementScore: string;
    accessibility: "Free" | "Upon Request" | "Paid" | "Unavailable";
    releaseLink: string;
    releaseName: string;
    releaseSize: number;
  };
}

const steps = ["Dataset Context", "Publication Details", "Technical Specs"];

export default function SubmissionForm({ existingRows }: any) {
  const [activeStep, setActiveStep] = useState(0);
  const [form, setForm] = useState<SubmissionState>({
    isNewDataset: false,
    selectedDatasetId: "",
    newDataset: { name: "", genre: "", description: [""], languages: [], docType: "", docCount: 0, extends: [] },
    isNewPaper: false,
    selectedPaperId: "",
    newPaper: { title: "", authors: [""], year: new Date().getFullYear(), doi: "", openAlexId: "", link: "" },
    annotations: { 
        tasks: [], description: [""], annotatorType: "", agreementType: "", 
        agreementScore: "", accessibility: "Free", releaseLink: "", releaseName: "", releaseSize: 0 
    }
  });

  const existingDatasets = Array.from(new Set(existingRows.map((row: any) => ({ dataset_id: row.dataset_id, dataset_name: row.dataset_name }))));
  const existingPapers = Array.from(new Set(existingRows.flatMap((row: any) => row.annotation_entries.map((entry: any) => ({ id: entry.paper_link || entry.doi || entry.open_alex_id || entry.paper_name, title: entry.paper_name })))));

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleSubmit = () => {
    const finalPayload = {
        timestamp: new Date().toISOString(),
        contribution: form
    };
    const jsonString = JSON.stringify(finalPayload, null, 2);
    const body = encodeURIComponent(`## New Data Contribution\n\n\`\`\`json\n${jsonString}\n\`\`\``);
    window.open(`https://github.com/YOUR_REPO/issues/new?title=Contribution:+${form.newDataset.name || form.selectedDatasetId}&body=${body}`);
  };

  // --- Step Renderers ---

  const renderStep1 = () => (
    <Stack spacing={3}>
      <Typography variant="h6">Is this a new release of an existing dataset?</Typography>
      <Autocomplete
        options={existingDatasets}
        getOptionLabel={(opt: any) => opt.dataset_name}
        onChange={(_, val) => setForm({...form, selectedDatasetId: val?.dataset_id || "", isNewDataset: !val})}
        renderInput={(params) => <TextField {...params} label="Select Existing Dataset (Leave blank if new)" />}
      />

      {form.isNewDataset && (
        <Paper variant="outlined" sx={{ p: 3, bgcolor: 'action.hover' }}>
          <Typography variant="subtitle2" gutterBottom>New Dataset Details</Typography>
          <Stack spacing={2}>
            <TextField label="Dataset Name" fullWidth onChange={(e) => setForm({...form, newDataset: {...form.newDataset, name: e.target.value}})} />
            <TextField label="Genre (e.g., Legal, News)" fullWidth onChange={(e) => setForm({...form, newDataset: {...form.newDataset, genre: e.target.value}})} />
            
            <Typography variant="caption">Description Paragraphs</Typography>
            {form.newDataset.description.map((p, i) => (
              <TextField 
                key={i} multiline rows={2} value={p} 
                onChange={(e) => {
                    const next = [...form.newDataset.description];
                    next[i] = e.target.value;
                    setForm({...form, newDataset: {...form.newDataset, description: next}});
                }}
              />
            ))}
            <Button startIcon={<AddIcon />} onClick={() => setForm({...form, newDataset: {...form.newDataset, description: [...form.newDataset.description, ""]}})}>Add Paragraph</Button>
          </Stack>
        </Paper>
      )}
    </Stack>
  );

  const renderStep2 = () => (
    <Stack spacing={3}>
      <Autocomplete
        options={existingPapers}
        getOptionLabel={(opt: any) => opt.title}
        onChange={(_, val) => setForm({...form, selectedPaperId: val?.id || "", isNewPaper: !val})}
        renderInput={(params) => <TextField {...params} label="Select Existing Paper" />}
      />
      {form.isNewPaper && (
        <Paper variant="outlined" sx={{ p: 3, bgcolor: 'action.hover' }}>
          <Stack spacing={2}>
            <TextField label="Paper Title" fullWidth onChange={(e) => setForm({...form, newPaper: {...form.newPaper, title: e.target.value}})} />
            <TextField label="Authors (Comma separated)" fullWidth onChange={(e) => setForm({...form, newPaper: {...form.newPaper, authors: e.target.value.split(",")}})} />
            <Stack direction="row" spacing={2}>
                <TextField label="Year" type="number" sx={{width: '30%'}} onChange={(e) => setForm({...form, newPaper: {...form.newPaper, year: parseInt(e.target.value)}})} />
                <TextField label="DOI (Optional)" sx={{flexGrow: 1}} onChange={(e) => setForm({...form, newPaper: {...form.newPaper, doi: e.target.value}})} />
            </Stack>
          </Stack>
        </Paper>
      )}
    </Stack>
  );

  const renderStep3 = () => (
    <Stack spacing={3}>
      <Typography variant="subtitle2">Annotation Tasks</Typography>
      <Autocomplete
        multiple
        options={Object.keys(TASK_COLOR_MAP)}
        renderTags={(value, getTagProps) => value.map((option, index) => <Chip label={option} {...getTagProps({ index })} />)}
        renderInput={(params) => <TextField {...params} label="Select Tasks" />}
        onChange={(_, val) => setForm({...form, annotations: {...form.annotations, tasks: val}})}
      />

      <TextField 
        select label="Accessibility" 
        value={form.annotations.accessibility}
        onChange={(e) => setForm({...form, annotations: {...form.annotations, accessibility: e.target.value as any}})}
      >
        {["Free", "Upon Request", "Paid", "Unavailable"].map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
      </TextField>

      <TextField 
        label="Agreement Score Detail" 
        multiline rows={3} 
        placeholder="Provide ranges, averages, or sub-task scores..."
        onChange={(e) => setForm({...form, annotations: {...form.annotations, agreementScore: e.target.value}})} 
      />

      <Stack direction="row" spacing={2}>
        <TextField label="Release Name (e.g. v1.0)" fullWidth onChange={(e) => setForm({...form, annotations: {...form.annotations, releaseName: e.target.value}})} />
        <TextField label="Release Size (Count)" type="number" fullWidth onChange={(e) => setForm({...form, annotations: {...form.annotations, releaseSize: parseInt(e.target.value)}})} />
      </Stack>
    </Stack>
  );

  return (
    <Box sx={{ width: "100%", py: 4 }}>
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}><StepLabel>{label}</StepLabel></Step>
        ))}
      </Stepper>

      <Box sx={{ minHeight: "400px", mb: 4 }}>
        {activeStep === 0 && renderStep1()}
        {activeStep === 1 && renderStep2()}
        {activeStep === 2 && renderStep3()}
      </Box>

      <Divider sx={{ my: 2 }} />
      <Stack direction="row" justifyContent="space-between">
        <Button disabled={activeStep === 0} onClick={handleBack}>Back</Button>
        <Button 
          variant="contained" 
          onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
        >
          {activeStep === steps.length - 1 ? "Generate GitHub Issue" : "Next"}
        </Button>
      </Stack>
    </Box>
  );
}
