import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

export default function BackBtn() {
  const navigate = useNavigate();

  const handleBackButton = useCallback(() => {
    navigate("/");
  }, [navigate]);

  return (
    <button
      className="bg-slate-100 hover:bg-slate-400 text-slate-500 hover:text-white rounded-sm px-4 py-2 
      text-center drop-shadow-md border-gray-300 border-1"
      onClick={handleBackButton}
    >
      Back to Patient Database
    </button>
  );
}
