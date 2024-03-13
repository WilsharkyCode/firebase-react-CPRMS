import { useCallback } from "react";
import { useNavigate } from "react-router-dom"

export default function BackBtn(){

    const navigate = useNavigate();

    const handleBackButton = useCallback (() => {
        navigate('/');
    },[navigate]);

    return(
        <button onClick={handleBackButton}>Back to Patient Database</button>
    )
}