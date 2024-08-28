import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { S3 } from "aws-sdk";

const FileUploader = ({ onUploadComplete, currentFolderPath }) => {
    const [files, setFiles] = useState(null);
    const [error, setError] = useState("");

    const s3 = new S3({
        accessKeyId: process.env.REACT_APP_ACCESS_KEY_ID,
        secretAccessKey: process.env.REACT_APP_SECRET_ACCESS_KEY,
        region: process.env.REACT_APP_REGION,
    });

    const handleFileChange = (event) => {
        const selectedFiles = event.target.files;
        const validFiles = Array.from(selectedFiles).filter(file => {
            const isImage = file.type.startsWith("image/");
            return isImage;
        });

        if (validFiles.length > 10) {
            setError("You can upload a maximum of 10 images.");
            setFiles(null);
        } else {
            setError("");
            setFiles(validFiles);
        }
    };

    const handleUpload = async () => {
        if (!files) return;

        const uploadPromises = Array.from(files).map((file) => {
            const params = {
                Bucket: process.env.REACT_APP_BUCKET_NAME,
                Key: `${currentFolderPath}${file.name}`, // Uploading to the current folder path
                Body: file,
                ContentType: file.type,
            };

            return s3.upload(params).promise();
        });

        try {
            await Promise.all(uploadPromises);
            alert("Files uploaded successfully!");
            if (onUploadComplete) {
                onUploadComplete(); // Notify parent component to refresh images
            }
        } catch (error) {
            console.error("Error uploading files:", error);
            alert("Failed to upload files.");
        }
    };

    return (
        <div>
            <Form.Group>
                <Form.Control
                    type="file"
                    multiple
                    label="Choose images to upload"
                    onChange={handleFileChange}
                    aria-label="Choose images to upload"
                />
                {error && <p className="text-danger">{error}</p>}
            </Form.Group>
            <Button variant="primary" onClick={handleUpload}>
                Upload
            </Button>
        </div>
    );
};

export default FileUploader;
