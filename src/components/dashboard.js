import React, { useState, useEffect } from "react";
import { Spinner, Row, Col, Container, Button } from "react-bootstrap";
import FolderBrowser from "./FolderBrowser";
import FileUploader from "./FileUploader";
import { FaFolder } from "react-icons/fa";
import './Dashboard.css'; // Make sure to create a CSS file for additional styles

const S3Item = React.lazy(() => import("./s3-image"));

function Dashboard({ s3 }) {
    const [images, setImages] = useState([]);
    const [folders, setFolders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [folderPath, setFolderPath] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        fetchContents(folderPath);
    }, [s3, folderPath]);

    const fetchContents = async (path) => {
        setLoading(true);
        setError(""); // Reset error state
        try {
            const params = {
                Bucket: process.env.REACT_APP_BUCKET_NAME,
                Prefix: path,
                Delimiter: "/",
            };

            const data = await s3.listObjectsV2(params).promise();
            const imageExtensions = [".webp", ".jpg", ".jpeg", ".png", ".gif"];

            const fetchedFolders = data.CommonPrefixes.map((prefix) => ({
                name: prefix.Prefix.split("/").slice(-2, -1)[0],
                path: prefix.Prefix,
            }));

            const fetchedImages = await Promise.all(
                data.Contents
                    .filter((item) => {
                        const isTopLevel = item.Key === path || !item.Key.replace(path, "").includes("/");
                        const extension = item.Key.split(".").pop().toLowerCase();
                        return isTopLevel && imageExtensions.includes(`.${extension}`);
                    })
                    .map(async (item) => {
                        const signedUrl = await s3.getSignedUrlPromise("getObject", {
                            Bucket: params.Bucket,
                            Key: item.Key,
                            Expires: 60 * 60,
                        });

                        return {
                            url: signedUrl,
                            key: item.Key,
                        };
                    })
            );

            setFolders(fetchedFolders);
            setImages(fetchedImages);
        } catch (error) {
            console.error("Error fetching contents:", error.message);
            setError("Failed to load contents. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleFolderClick = (path) => {
        setFolderPath(path);
        setImages([]);
        setFolders([]);
    };

    const handleUploadComplete = () => {
        fetchContents(folderPath);
    };

    const [showUploader, setShowUploader] = useState(false);

    return (
        <Container fluid className="dashboard-container">
            <div className="side-panel">
                <Button variant="primary" onClick={() => setShowUploader(true)} className="upload-button">
                    Upload Files
                </Button>
            </div>
            <div className="main-content">
                <FolderBrowser
                    initialFolders={folderPath}
                    onFolderPathChange={handleFolderClick}
                />
                <div className="images-gallery p-5 thin-scroll">
                    {loading && <Spinner animation="border" />}
                    {error && <p className="text-danger">{error}</p>}
                    {folders.length === 0 && images.length === 0 && !loading && <p className="text-white">Empty</p>}

                    <Row className="folder-row">
                        {folders.map((folder) => (
                            <Col key={folder.path} sm={2} className="folder-col" onClick={() => handleFolderClick(folder.path)}>
                                <div className="folder-item d-block" style={{ textAlign: "center", width: "150px", margin: "10px auto" }}>
                                    <FaFolder className="folder-icon" style={{ fontSize: "150px" }} />
                                    <p className="text-white">{folder.name}</p>
                                </div>
                            </Col>
                        ))}
                    </Row>

                    <Row className="image-row">
                        {images.map((image) => (
                            <Col key={image.key} sm={2} className="image-col">
                                <S3Item imageUrl={image.url} />
                            </Col>
                        ))}
                    </Row>
                </div>
            </div>
            <FileUploader
                s3={s3}
                onUploadComplete={handleUploadComplete}
                currentFolderPath={folderPath}
                show={showUploader}
                onHide={() => setShowUploader(false)}
            />
        </Container>
    );
}

export default Dashboard;
