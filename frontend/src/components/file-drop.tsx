"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { instructorService } from "@/app/instructor/instructorlogic";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert"; 
import { Upload } from "lucide-react";

const FileDrop = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState<boolean>(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!selectedFile) {
            setError("Please select a file first");
            return;
        }

        setIsUploading(true);
        setError(null);

        try {
            // Use your instructorService uploadCSV method
            const result = await instructorService.uploadCSV(
                selectedFile,
                "2",        // courseId
                "STAC67"       // courseCode - you might want to make this dynamic
            );

            if (result) {
                console.log("Upload successful:", result);
                // Optional: reset form
                setSelectedFile(null);
                // Reset file input
                const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
                if (fileInput) fileInput.value = '';
            } else {
                // uploadCSV returns null on error
                setError("Upload failed - please try again");
            }
            
        } catch (error: unknown) {
            const message = error instanceof Error 
                ? error.message 
                : "An unknown error occurred";
            console.error(`Upload error: ${message}`);
            setError(message);
        } finally {
            setIsUploading(false);
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
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex-col items-center gap-4">
                <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <Button 
                    type="submit" 
                    disabled={isUploading || !selectedFile}
                    className="flex items-center gap-2"
                >
                    {isUploading ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Uploading...
                        </>
                    ) : (
                        <>
                            <Upload className="h-4 w-4" />
                            Upload CSV
                        </>
                    )}
                </Button>
            </div>
        </form>
        
        {error && (
            <Alert variant="destructive" className="mt-4">
                <AlertDescription>
                    Error: {error}
                </AlertDescription>
            </Alert>
        )}
</div>
    );
};

export default FileDrop;