import { createContext, useReducer} from "react"

const INITIAL_ID ={
    patientUID: null,
};

//initializes Context
export const RecordContext = createContext(INITIAL_ID);

//Sets and Nullifies Patient UID
const RecordReducer = (state, action) => {
    switch(action.type){
        case "OPEN_RECORD": {
            return {patientUID: action.payload}
                
        };
        case "CLOSE_RECORD": {
            return {patientUID: null};
        };
        default:
            return state;
    }
};

//LOGIC
export const RecordContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(RecordReducer, INITIAL_ID);


    return(
        <RecordContext.Provider value={{patientUID: state.patientUID, dispatch}}>
            {children}
        </RecordContext.Provider>
    );
}
