import React, { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { S3 } from "aws-sdk";

const FileUploader = ({ s3, onUploadComplete, currentFolderPath, show, onHide }) => {
    const [files, setFiles] = useState(null);
    const [error, setError] = useState("");

    const handleFileChange = (event) => {
        const selectedFiles = event.target.files;
        const validFiles = Array.from(selectedFiles).filter(file => {
            const isImage = file.type.startsWith("image/");
            return isImage;
        });

        if (validFiles.length > 5) { // Change to 5
            setError("You can upload a maximum of 5 images.");
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
            onHide(); // Close modal after upload
        } catch (error) {
            console.error("Error uploading files:", error);
            alert("Failed to upload files.");
        }
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Upload Files to</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <b>{currentFolderPath}</b>
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
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleUpload}>
                    Upload
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default FileUploader;
