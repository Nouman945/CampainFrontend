import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import Card from "@/components/ui/Card";
import LoaderCircle from "@/components/Loader-circle";

function ApiDisplay() {
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(true);
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        setLoading(true);
        fetch("https://django-apis-0a980656a9f1.herokuapp.com/generate-data/")
            .then((response) => response.json())
            .then((data) => {
                setResponse(data.response);
                setLoading(false);
            })
            .catch((error) => console.error("Error fetching data:", error));
    }, [refresh]);

    const handleRefresh = () => {
        fetch("https://django-apis-0a980656a9f1.herokuapp.com/clear-data/")
            .then(() => {
                setRefresh(!refresh); // Toggle the refresh state to re-trigger useEffect
            })
            .catch((error) => console.error("Error clearing data:", error));
    };

    return (
        <Card title="AI Analysis">
            <button className="btn btn-success" onClick={handleRefresh}>Refresh Data</button>
            <br/>
            <br/>
            {loading ? (
                <LoaderCircle />
            ) : (
                <div>
                    <ReactMarkdown>{response}</ReactMarkdown>
                </div>
            )}
        </Card>
    );
}

export default ApiDisplay;