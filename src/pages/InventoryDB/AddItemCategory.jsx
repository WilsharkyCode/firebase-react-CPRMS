import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { database } from "../../config/firebase-config";
import { set, ref, push } from "firebase/database";
import { Toolbar } from "@mui/material";

export default function AddItemCategory() {
  const navigate = useNavigate();
  const [addItem, setAddItem] = useState({
    categoryName: "",
  });

  const addItems = (e) => {
    e.preventDefault();
    try {
      const TRRef = ref(database, "ItemCategory/");
      const NewTRRef = push(TRRef);
      set(NewTRRef, {
        categoryName: addItem.categoryName,
      });
      navigate("/inventory");
    } catch (error) {
      console.error("Error adding document:", error);
    }
  };

  const handleBackButton = useCallback(() => {
    navigate("/inventory");
  }, [navigate]);

  return (
    <div className="bg-slate-200 min-h-screen flex flex-col">
      <Toolbar className="my-4">
        <div className="flex-grow flex items-center justify-center px-4">
          <form
            className="bg-slate-100 drop-shadow-lg md:scale-100 scale-90 w-full max-w-md rounded-xl p-6"
            onSubmit={addItems}
          >
            <h3 className="text-xl font-semibold mb-4 text-center">
              New Item Category
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block mb-1">Category Name:</label>
                <input
                  className="add-input w-full"
                  type="text"
                  placeholder="Category Name"
                  onChange={(e) =>
                    setAddItem({ ...addItem, categoryName: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <Toolbar className="mt-6 grid grid-cols-1 md:grid-cols-2  gap-4">
            <button className="text-btn rounded-md md:px-14 md:hidden block" type="submit">
              Add
            </button>
              <button
                className="bg-slate-100 hover:bg-slate-400 text-slate-500 hover:text-white rounded-md md:px-14 py-2 text-center drop-shadow-md border-gray-300 border-1"
                onClick={handleBackButton}
              >
                Back
              </button>
              <button className="text-btn rounded-md md:px-14 md:block hidden" type="submit">
                Add
              </button>
            </Toolbar>
          </form>
        </div>
      </Toolbar>
    </div>
  );
}