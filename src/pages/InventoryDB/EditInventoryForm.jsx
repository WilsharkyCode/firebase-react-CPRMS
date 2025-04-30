import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { database } from "../../config/firebase-config";
import { set, ref, onValue } from "firebase/database";
import { Toolbar } from "@mui/material";
import CryptoJS from "crypto-js";

// AES Secret Key
const SECRET_KEY = process.env.REACT_APP_AES_ENCRYPTION_KEY;

export default function EditInventoryForm() {
  const [editingItem, setEditingItem] = useState({
    id: null,
    itemName: "",
    itemQuantity: "",
    supplierName: "",
    categoryID: "",
    branchID: "",
    dateBought: "",
  });
  const [categories, setCategories] = useState([]);
  const [branches, setBranches] = useState([]);

  const navigate = useNavigate();

  const handleBackButton = useCallback(() => {
    navigate("/inventory");
  }, [navigate]);

  // 🔓 Decrypt and Retrieve Cached Inventory Item Data
  useEffect(() => {
    if ("caches" in window) {
      caches.open("InventoryItemData").then((cache) => {
        cache.match("InventoryItemData").then((response) => {
          if (response) {
            response.text().then((encryptedText) => {
              try {
                const bytes = CryptoJS.AES.decrypt(encryptedText, SECRET_KEY);
                const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

                if (!decryptedData) {
                  console.error("Failed to decrypt data.");
                  return;
                }

                const parsedData = JSON.parse(decryptedData);
                console.log("Decrypted & Retrieved from cache:", parsedData);
                setEditingItem(parsedData);
              } catch (err) {
                console.error("Decryption or parsing error:", err);
              }
            });
          } else {
            console.log("Nothing in cache");
          }
        });
      });
    }
  }, []);

  // Fetch categories
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

  // Fetch branches
  useEffect(() => {
    const branchRef = ref(database, "Branches/");
    onValue(branchRef, (snapshot) => {
      const data = snapshot.val();
      const loaded = data
        ? Object.keys(data).map((key) => ({ id: key, ...data[key] }))
        : [];
      setBranches(loaded);
    });
  }, []);

  const handleEdit = (e) => {
    e.preventDefault();
    try {
      set(ref(database, "Inventory/" + editingItem.id), {
        itemName: editingItem.itemName,
        itemQuantity: editingItem.itemQuantity,
        supplierName: editingItem.supplierName,
        categoryID: editingItem.categoryID,
        branchID: editingItem.branchID,
        dateBought: editingItem.dateBought,
      });
      navigate("/inventory");
    } catch (error) {
      console.error("Error updating inventory item:", error);
    }
  };

  return (
    <div className="bg-slate-200 min-h-screen flex flex-col">
      <Toolbar className="my-4">
        <div className="flex-grow flex items-center justify-center px-4">
          <form
            className="bg-slate-100 drop-shadow-lg md:scale-100 scale-90 w-full max-w-md rounded-xl p-6"
            onSubmit={handleEdit}
          >
            <h3 className="text-xl font-semibold mb-4 text-center">
              Edit Inventory Item
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block mb-1">Item Name:</label>
                <input
                  className="add-input w-full"
                  type="text"
                  value={editingItem.itemName}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, itemName: e.target.value })
                  }
                  placeholder="Item Name"
                  required
                />
              </div>

              <div>
                <label className="block mb-1">Quantity:</label>
                <input
                  className="add-input w-full"
                  type="number"
                  required
                  value={editingItem.itemQuantity}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      itemQuantity: e.target.value,
                    })
                  }
                  placeholder="Quantity"
                />
              </div>

              <div>
                <label className="block mb-1">Supplier Name:</label>
                <input
                  className="add-input w-full"
                  type="text"
                  value={editingItem.supplierName}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      supplierName: e.target.value,
                    })
                  }
                  placeholder="Supplier Name"
                />
              </div>

              <div>
                <label className="block mb-1">Category:</label>
                <select
                  className="add-input w-full"
                  value={editingItem.categoryID}
                  required
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      categoryID: e.target.value,
                    })
                  }
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.categoryName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-1">Branch:</label>
                <select
                  className="add-input w-full"
                  value={editingItem.branchID}
                  required
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      branchID: e.target.value,  // Fixed typo here from brancID to branchID
                    })
                  }
                >
                  <option value="">Select Branch</option>
                  {branches.map((branch) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.branchName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block mb-1">Date Bought:</label>
                <input
                  className="add-input w-full"
                  type="date"
                  value={editingItem.dateBought}
                  required
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      dateBought: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <Toolbar className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                className="text-btn rounded-md md:px-14 md:hidden block"
                type="submit"
              >
                Save
              </button>
              <button
                className="bg-slate-100 hover:bg-slate-400 text-slate-500 hover:text-white rounded-md md:px-14 py-2 text-center drop-shadow-md border-gray-300 border-1"
                onClick={handleBackButton}
              >
                Back
              </button>
              <button
                className="text-btn rounded-md md:px-14 md:block hidden"
                type="submit"
              >
                Save
              </button>
            </Toolbar>
          </form>
        </div>
      </Toolbar>
    </div>
  );
}
