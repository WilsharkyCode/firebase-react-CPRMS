import { createContext, useReducer, useEffect } from "react"

const INITIAL_ID ={
    patientUID: JSON.parse(localStorage.getItem('patient') || null )
}

export const RecordContext = createContext(INITIAL_ID);

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

export const RecordContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(RecordReducer, INITIAL_ID);

    useEffect(() => {
        localStorage.setItem('patient', JSON.stringify(state.patientUID));
    },  [state.patientUID] );



    return(
        <RecordContext.Provider value={{patientUID: state.patientUID, dispatch}}>
            {children}
        </RecordContext.Provider>
    );
}
