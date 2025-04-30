import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { database } from "../../config/firebase-config";
import { set, ref, push, update, get } from "firebase/database";
import { Toolbar } from "@mui/material";
import CryptoJS from "crypto-js";

const SECRET_KEY = process.env.REACT_APP_AES_ENCRYPTION_KEY;

export default function AddInventoryTransactionsForm() {
  const navigate = useNavigate();
  const [InventoryItemData, setInventoryItemData] = useState({ itemName: "", itemQuantity: 0 });

  const [addItem, setAddItem] = useState({
    transactionType: "",
    quantity: "",
    transactionDate: "",
  });

  useEffect(() => {
    if ("caches" in window) {
      caches.open("addInventoryTransaction").then((cache) => {
        cache.match("addInventoryTransaction").then((response) => {
          if (response) {
            response.text().then(async (encryptedText) => {
              try {
                const bytes = CryptoJS.AES.decrypt(encryptedText, SECRET_KEY);
                const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
                if (!decryptedData) {
                  console.error("❌ Failed to decrypt InventoryItemData.");
                  return;
                }
                const parsedData = JSON.parse(decryptedData);
                setInventoryItemData(parsedData);

              } catch (err) {
                console.error("⚠️ Cache or Firebase fetch error:", err);
              }
            });
          }
        });
      });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddItem((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !InventoryItemData?.id ||
      !addItem.transactionType ||
      !addItem.quantity ||
      !addItem.transactionDate
    ) {
      alert("Please complete all fields.");
      return;
    }

    const itemID = InventoryItemData.id;
    const quantity = parseInt(addItem.quantity);
    const originalQty = parseInt(InventoryItemData.itemQuantity);

    let updatedQty;
    if (addItem.transactionType === "OUT") {
      updatedQty = originalQty - quantity;
      if (updatedQty < 0) {
        alert("Cannot perform OUT transaction: insufficient stock.");
        return;
      }
    } else {
      updatedQty = originalQty + quantity;
    }

    try {
      // Add transaction
      const transactionRef = push(ref(database, "/InventoryTransactions"));
      await set(transactionRef, {
        itemID,
        transactionType: addItem.transactionType,
        quantity,
        transactionDate: addItem.transactionDate,
      });

      // Update inventory
      const itemRef = ref(database, `/Inventory/${itemID}`);
      await update(itemRef, {
        itemQuantity: updatedQty,
      });

      alert("Transaction successfully recorded.");
      navigate("/inventory/transactions");
    } catch (error) {
      console.error("❌ Error submitting transaction:", error);
      alert("An error occurred while submitting the transaction.");
    }
  };

  const handleBackButton = useCallback(() => {
    navigate("/inventory/transactions");
  }, [navigate]);

  return (
    <div className="bg-slate-200 min-h-screen flex flex-col">
      <Toolbar className="my-4">
        <div className="flex-grow flex items-center justify-center px-4">
          <form
            className="bg-slate-100 drop-shadow-lg md:scale-100 scale-90 w-full max-w-md rounded-xl p-6"
            onSubmit={handleSubmit}
          >
            <h3 className="text-xl font-semibold mb-4 text-center">
              Add Inventory Transaction
            </h3>

            <input type="hidden" name="itemID" value={InventoryItemData?.id || ""} />

            <div className="mb-4">
              <label className="block mb-1">Item Name:</label>
              <input
                className="add-input w-full bg-gray-200"
                value={InventoryItemData.itemName}
                readOnly
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1">Current Quantity:</label>
              <input
                className="add-input w-full bg-gray-200"
                value={InventoryItemData.itemQuantity}
                readOnly
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block mb-1">Transaction Date:</label>
                <input
                  className="add-input w-full"
                  type="date"
                  name="transactionDate"
                  value={addItem.transactionDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block mb-1">Quantity:</label>
                <input
                  className="add-input w-full"
                  type="number"
                  name="quantity"
                  value={addItem.quantity}
                  onChange={handleChange}
                  placeholder="Quantity"
                  min="1"
                  required
                />
              </div>

              <div>
                <label className="block mb-1">Transaction Type:</label>
                <select
                  className="add-input w-full"
                  name="transactionType"
                  value={addItem.transactionType}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select</option>
                  <option value="IN">IN</option>
                  <option value="OUT">OUT</option>
                </select>
              </div>
            </div>

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
