import { AuthContext } from "./AuthContext";
import { useContext, useCallback } from "react";

export default function CustomHeader() {
  const { dispatch: authDispatch } = useContext(AuthContext);

  const SignOutDispatch = useCallback(() => {
    authDispatch({ type: "LOGOUT" });
    console.log("LogOut dispatch Successful");
  }, [authDispatch]);

  return (
    <>
      {/*Header Container Start*/}
      <div className=" flex justify-center bg-slate-100 drop-shadow-md ">
        <div className="bg-slate-100 flex items-baseline p-2">
          <h5 class="h5 text-pastelpurple font-semibold md:mr-96 mr-10">
            ALADANA DENTAL CLINIC
          </h5>

          <button className="bg-slate-50 hover:bg-slate-200 px-4 py-2 drop-shadow-md mr-2 rounded-sm ">
            Birthdays
          </button>
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={SignOutDispatch}
          >
            Logout
          </button>
        </div>
      </div>
      {/*Header Container End*/}
    </>
  );
}
