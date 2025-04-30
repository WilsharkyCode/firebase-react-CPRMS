import React, { useEffect, useState } from "react";
import {
  ref,
  onValue,
  remove,
  get,
} from "firebase/database";
import { database } from "../../config/firebase-config";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Button,
  Switch,
  FormControlLabel,
  Typography,
  Toolbar,
  Modal,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  boxShadow: 24,
  p: 4,
};

export default function DeleteCategoryForm() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [deleteEnabled, setDeleteEnabled] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const catRef = ref(database, "ItemCategory/");
    onValue(catRef, (snapshot) => {
      const data = snapshot.val();
      const loaded = data
        ? Object.keys(data).map((key) => ({ id: key, ...data[key] }))
        : [];
      setCategories(loaded);
    });
  }, []);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const deleteCategoryOnly = async () => {
    try {
      const target = categories.find(
        (cat) => cat.categoryName === selectedCategory
      );
      if (target?.id) {
        await remove(ref(database, `ItemCategory/${target.id}`));
        alert(`Category "${selectedCategory}" deleted.`);
        navigate("/inventory");
      }
    } catch (error) {
      console.error("Error deleting category: ", error);
    }
  };

  const confirmBulkDelete = async () => {
    closeModal();
    try {
      const invRef = ref(database, "Inventory/");
      const snapshot = await get(invRef);
      const inventoryData = snapshot.val();

      const toDelete = inventoryData
        ? Object.entries(inventoryData).filter(
            ([, item]) => item.itemCategory === selectedCategory
          )
        : [];

      for (const [itemId] of toDelete) {
        await remove(ref(database, `Inventory/${itemId}`));

        const transRef = ref(database, "InventoryTransactions/");
        const transSnap = await get(transRef);
        const transactions = transSnap.val();

        if (transactions) {
          const linkedTransactions = Object.entries(transactions).filter(
            ([, tx]) => tx.inventoryID === itemId
          );

          for (const [txId] of linkedTransactions) {
            await remove(ref(database, `InventoryTransactions/${txId}`));
          }
        }
      }

      const target = categories.find(
        (cat) => cat.categoryName === selectedCategory
      );
      if (target?.id) {
        await remove(ref(database, `ItemCategory/${target.id}`));
      }

      alert("Category, items, and related transactions deleted.");
      navigate("/inventory");
    } catch (error) {
      console.error("Error during bulk delete: ", error);
    }
  };

  const handleBackButton = () => {
    navigate("/inventory");
  };

  const handleDeleteClick = () => {
    if (deleteEnabled) {
      openModal();
    } else {
      deleteCategoryOnly();
    }
  };

  return (
    <div className="bg-slate-200 min-h-screen flex flex-col">
      <Toolbar className="my-4">
        <div className="flex-grow flex items-center justify-center px-4">
          <form
            className="bg-slate-100 drop-shadow-lg md:scale-100 scale-90 w-full max-w-md rounded-xl p-6"
            onSubmit={(e) => {
              e.preventDefault();
              handleDeleteClick();
            }}
          >
            <h3 className="text-xl font-semibold mb-4 text-center">
              Delete Item Category
            </h3>

            <div className="grid grid-cols-1 gap-4">
              <FormControl fullWidth>
                <InputLabel>Select Category</InputLabel>
                <Select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  label="Select Category"
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat.id} value={cat.categoryName}>
                      {cat.categoryName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControlLabel
                control={
                  <Switch
                    checked={deleteEnabled}
                    onChange={() => setDeleteEnabled((prev) => !prev)}
                  />
                }
                label="Enable Bulk Delete (Items + Transactions)"
              />
            </div>

            <Toolbar className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                className="text-btn rounded-md md:px-14 md:hidden block"
                type="submit"
                disabled={!selectedCategory}
              >
                Delete
              </button>
              <button
                className="bg-slate-100 hover:bg-slate-400 text-slate-500 hover:text-white rounded-md md:px-14 py-2 text-center drop-shadow-md border-gray-300 border-1"
                type="button"
                onClick={handleBackButton}
              >
                Back
              </button>
              <button
                className="text-btn rounded-md md:px-14 md:block hidden"
                type="submit"
                disabled={!selectedCategory}
              >
                Delete
              </button>
            </Toolbar>
          </form>
        </div>
      </Toolbar>

      {/* Bulk delete warning modal */}
      <Modal
        open={modalOpen}
        onClose={closeModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle} className="bg-slate-50 rounded">
          <Typography id="modal-modal-title" variant="h6" component="h2">
            WARNING
          </Typography>
          <Typography id="modal-modal-description" sx={{ my: 2 }}>
            This will delete all inventory items in category{" "}
            <strong>{selectedCategory}</strong> and their related transactions.
            This action cannot be undone.
          </Typography>
          <div className="flex justify-between mt-4">
            <Button onClick={closeModal}>Cancel</Button>
            <Button
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={confirmBulkDelete}
            >
              Confirm Delete
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
