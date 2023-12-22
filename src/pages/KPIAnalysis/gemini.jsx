import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import Card from "@/components/ui/Card";
import LoaderCircle from "@/components/Loader-circle";
function ApiDisplay() {
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch data from your Django API when the component mounts
        fetch("https://django-apis-0a980656a9f1.herokuapp.com/generate-data/")
            .then((response) => response.json())
            .then((data) => {
                setResponse(data.response);
                setLoading(false);
                console.log(data);
            })
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    return (
        <Card title="AI Analysis">
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
