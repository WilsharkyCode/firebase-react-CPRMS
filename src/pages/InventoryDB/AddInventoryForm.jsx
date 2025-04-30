import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { database } from "../../config/firebase-config";
import { ref, set, onValue } from "firebase/database";
import { Toolbar } from "@mui/material";

export default function AddInventoryForm() {
  const [addItem, setAddItem] = useState({
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

  const handleBackButton = useCallback(() => {
    navigate("/inventory");
  }, [navigate]);

  const addItems = (e) => {
    e.preventDefault();
    try {
      const itemId = new Date().getTime().toString();
      set(ref(database, "Inventory/" + itemId), {
        ...addItem,
      });
      navigate("/inventory");
    } catch (error) {
      console.error("Error adding inventory item");
    }
  };

  return (
    <div className="bg-slate-200 min-h-screen flex flex-col">
      <Toolbar className="my-4">
        <div className="flex-grow flex items-center justify-center px-4">
          <form
            className="bg-slate-100 drop-shadow-lg md:scale-100 scale-90 w-full max-w-md rounded-xl p-6"
            onSubmit={addItems}
          >
            <h3 className="text-xl font-semibold mb-4 text-center">
              Add Inventory Item
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">Item Name:</label>
                <input
                  className="add-input w-full"
                  type="text"
                  value={addItem.itemName}
                  onChange={(e) =>
                    setAddItem({ ...addItem, itemName: e.target.value })
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
                  value={addItem.itemQuantity}
                  onChange={(e) =>
                    setAddItem({
                      ...addItem,
                      itemQuantity: Number(e.target.value),
                    })
                  }
                  placeholder="Quantity"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block mb-1">Supplier Name:</label>
                <input
                  className="add-input w-full"
                  type="text"
                  value={addItem.supplierName}
                  onChange={(e) =>
                    setAddItem({ ...addItem, supplierName: e.target.value })
                  }
                  placeholder="Supplier"
                />
              </div>

              <div>
                <label className="block mb-1">Category:</label>
                <select
                  className="add-input w-full"
                  value={addItem.categoryID}
                  onChange={(e) =>
                    setAddItem({ ...addItem, categoryID: e.target.value })
                  }
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.categoryName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-1">Branch:</label>
                <select
                  className="add-input w-full"
                  value={addItem.branchID}
                  onChange={(e) =>
                    setAddItem({ ...addItem, branchID: e.target.value })
                  }
                  //required
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
                  value={addItem.dateBought}
                  onChange={(e) =>
                    setAddItem({ ...addItem, dateBought: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            {/* Form Options */}
            <Toolbar className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                className="text-btn rounded-md md:px-14 md:hidden block"
                type="submit"
              >
                Add
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
                Add
              </button>
            </Toolbar>
          </form>
        </div>
      </Toolbar>
    </div>
  );
}
