import React, { useMemo, useState } from "react";
import DatasetStep from "./DatasetStep";
import PaperStep from "./PaperStep";
import AnnotationStep from "./AnnotationStep";
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
  Typography,
  Autocomplete,
  Chip,
  Stack,
  Paper,
  MenuItem,
  Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { TASK_COLOR_MAP } from "./utils";

interface SubmissionState {
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
  }[];
}

const steps = ["Dataset Context", "Publication Details", "Technical Specs"];

export default function SubmissionForm({ existingRows }: any) {
  const [activeStep, setActiveStep] = useState(0);
  const [form, setForm] = useState<SubmissionState>({
    isNewDataset: true,
    selectedDatasetId: "",
    newDataset: {
      name: "",
      genre: "",
      description: [""],
      languages: [],
      docType: "",
      docCount: 0,
      extends: [],
    },
    isNewPaper: true,
    selectedPaperId: "",
    newPaper: {
      title: "",
      authors: [""],
      year: new Date().getFullYear(),
      doi: "",
      openAlexId: "",
      link: "",
    },
    annotations: [
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

  const existingDatasets = useMemo(() => {
    const seen = new Map();

    existingRows.forEach((row: any) => {
      const key = row.dataset_id || row.dataset_name;

      if (key && !seen.has(key)) {
        seen.set(key, {
          dataset_id: row.dataset_id,
          dataset_name: row.dataset_name,
        });
      }
    });

    return Array.from(seen.values());
  }, [existingRows]);

  const existingPapers = useMemo(() => {
    const seen = new Map();

    existingRows.forEach((row: any) => {
      row.annotation_entries.forEach((entry: any) => {
        const key =
          entry.paper_link ||
          entry.doi ||
          entry.open_alex_id ||
          entry.paper_name;

        if (key && !seen.has(key)) {
          seen.set(key, {
            id: key,
            title: entry.paper_name,
          });
        }
      });
    });

    return Array.from(seen.values());
  }, [existingRows]);

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleSubmit = () => {
    const finalPayload = {
      timestamp: new Date().toISOString(),
      contribution: form,
    };
    const jsonString = JSON.stringify(finalPayload, null, 2);
    const body = encodeURIComponent(
      `## New Data Contribution\n\n\`\`\`json\n${jsonString}\n\`\`\``
    );
    window.open(
      `https://github.com/YOUR_REPO/issues/new?title=Contribution:+${
        form.newDataset.name || form.selectedDatasetId
      }&body=${body}`
    );
  };

  console.log("Form State:", form);

  const renderStep1 = () => (
    <DatasetStep
      form={form}
      setForm={setForm}
      existingDatasets={existingDatasets}
    />
  );

  const renderStep2 = () => (
    <PaperStep form={form} setForm={setForm} existingPapers={existingPapers} />
  );

  const renderStep3 = () => <AnnotationStep form={form} setForm={setForm} />;

  return (
    <Box sx={{ width: "100%", py: 4 }}>
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box sx={{ minHeight: "400px", mb: 4 }}>
        {activeStep === 0 && renderStep1()}
        {activeStep === 1 && renderStep2()}
        {activeStep === 2 && renderStep3()}
      </Box>

      <Divider sx={{ my: 2 }} />
      <Stack direction="row" justifyContent="space-between">
        <Button disabled={activeStep === 0} onClick={handleBack}>
          Back
        </Button>
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
