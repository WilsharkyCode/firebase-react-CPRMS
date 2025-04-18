import { useState, useCallback } from "react";
import { ref, remove } from "firebase/database";
import { database } from "../../config/firebase-config";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TrashIcon from "../Icons/trash-icon-white.png";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { Tooltip } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  boxShadow: 24,
  p: 4,
};

export default function WarningModal({ id, dataRecords }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  //deletes Item form DB, callback to not auto trigger the function
  const handleDelete = useCallback((dataRecords, id) => {
    // delete every record with a certain ID
    dataRecords
      .filter(
        (treatmentRecords) =>
          treatmentRecords.patientID &&
          (Array.isArray(treatmentRecords.patientID) ||
            typeof treatmentRecords.patientID === "string") &&
          treatmentRecords.patientID.includes(id)
      )
      .forEach((treatmentRecords) =>
        remove(ref(database, "TreatmentRecords/" + treatmentRecords.id))
      );

    remove(ref(database, "patients/" + id));
    console.log("Delete Success");
  }, []);

  return (
    <div>
      <Tooltip title="Delete" arrow>
        <button
          className="icons-btn bg-red-400 hover:bg-red-500"
          onClick={handleOpen}
        >
          <img src={TrashIcon} alt="Delete" width="20px" height="20px" />
        </button>
      </Tooltip>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="bg-slate-50 rounded">
          <Typography id="modal-modal-title" variant="h6" component="h2">
            WARNING
          </Typography>
          <Typography id="modal-modal-description" sx={{ my: 2 }}>
            This will delete the patient and all of their records. This action
            cannot be undone.
          </Typography>

          <Button onClick={handleClose}>Cancel</Button>
          <Button
            className=" bg-red-400 hover:bg-red-500 text-white float-right"
            onClick={() => handleDelete(dataRecords, id)}
          >
            Delete
          </Button>
        </Box>
      </Modal>
    </div>
  );
}
