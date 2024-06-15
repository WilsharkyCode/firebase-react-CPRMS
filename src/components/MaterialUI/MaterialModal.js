import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useState } from "react";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  boxShadow: 24,
  p: 4,
};

export default function BasicModal({ ButtonName, Header, Body }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Button
        className="bg-slate-50 text-slate-400 hover:bg-slate-200 shadow-sm h-10 text-sm mx-1"
        onClick={handleOpen}
      >
        {ButtonName}
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="bg-slate-50 rounded">
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {Header}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {Body}
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}
