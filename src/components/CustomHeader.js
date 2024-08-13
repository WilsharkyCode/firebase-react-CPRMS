import SignOutBtn from "./SignOutBtn";

export default function CustomHeader() {
  return (
    <>
      {/*Header Container Start*/}
      <div className=" flex justify-center bg-slate-100 drop-shadow-md ">
        <div className="bg-slate-100 flex items-baseline p-2">
          <h5 className="h5 text-pastelpurple font-semibold md:mr-96 mr-10">
            ALADANA DENTAL CLINIC
          </h5>

          <button className="bg-slate-50 hover:bg-slate-200 px-4 py-2 drop-shadow-md mr-2 rounded-sm ">
            Birthdays
          </button>
          <SignOutBtn />
        </div>
      </div>
      {/*Header Container End*/}
    </>
  );
}
