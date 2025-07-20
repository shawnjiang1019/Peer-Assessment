"use client";


import { useState, ChangeEvent, FormEvent } from "react";

const FileDrop = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!selectedFile) {
            setError("Please select a file first");
            return;
        }

        const data = new FormData();
        data.append('file', selectedFile);

        try {
            const response = await fetch('https://peer-backend-1014214808131.us-central1.run.app/api/csv', {
                method: 'POST',
                body: data,
                headers: {
                    "cid": "STAC67",

                    // "Content-Type" is automatically set by browser for FormData
                }
            });

            if (!response.ok) {
                const errorResult = await response.json();
                throw new Error(errorResult.error || 'Upload failed');
            }

            const result = await response.json();
            console.log("Upload successful:", result);
            setError(null);
            
        } catch (error: unknown) {
            const message = error instanceof Error 
                ? error.message 
                : "An unknown error occurred";
            console.error(`Upload error: ${message}`);
            setError(message);
        }
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        setError(null);
        const files = e.target.files;
        
        if (files && files.length > 0) {
            setSelectedFile(files[0]);
        } else {
            setSelectedFile(null);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                />
                <button type="submit">Upload CSV</button>
            </form>
            
            {error && <div style={{ color: 'red', marginTop: '10px' }}>Error: {error}</div>}
        </div>
    );
};

export default FileDrop;