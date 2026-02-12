import { forwardRef } from "react";
import type { ReactElement, Ref, SyntheticEvent } from "react";
import AppBar from "@mui/material/AppBar";
import Alert from "@mui/material/Alert";
import CloseIcon from "@mui/icons-material/Close";
import Dialog from "@mui/material/Dialog";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Slide from "@mui/material/Slide";
import Stack from "@mui/material/Stack";
import type { TransitionProps } from "@mui/material/transitions";
import type { FullRow } from "./App";

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: ReactElement<unknown>;
  },
  ref: Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function DescriptionDialog({
  open,
  handleClose,
  selectedRow,
}: {
  open: boolean;
  handleClose: (event: SyntheticEvent<Element, Event>) => void;
  selectedRow: FullRow | null;
}) {
  return (
    <Dialog
      fullScreen
      open={open}
      onClose={handleClose}
      slots={{
        transition: Transition,
      }}
    >
      <AppBar sx={{ position: "relative" }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="Close"
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            {selectedRow?.dataset_name}
          </Typography>
        </Toolbar>
      </AppBar>
      <Stack sx={{ p: 2 }} spacing={2}>
        <Typography variant="h6">Corpus Description</Typography>
        {selectedRow?.dataset_description.map((text: string) =>
          !text.startsWith("NOTE: ") ? (
            <Typography variant="body1" paragraph>
              {text}
            </Typography>
          ) : (
            <Alert severity="info">{text.slice(6)}</Alert>
          ),
        )}
        <Divider />
        <Stack spacing={1}>
          <Typography variant="h6">Annotation Description</Typography>
          {selectedRow?.annotation_description.map((text: string) =>
            !text.startsWith("NOTE: ") ? (
              <Typography variant="body1" paragraph>
                {text}
              </Typography>
            ) : (
              <Alert severity="info">{text.slice(6)}</Alert>
            ),
          )}
          <Stack  spacing={1}>
            <Typography variant="subtitle1" fontWeight="bold">
              Annotator type: {selectedRow?.annotator_type}
            </Typography>
            <Typography variant="subtitle1" fontWeight="bold">
              Agreement type: {selectedRow?.agreement_type}
            </Typography>
            <Typography variant="subtitle1" fontWeight="bold">
              Agreement: {selectedRow?.agreement}
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </Dialog>
  );
}

export default DescriptionDialog;
