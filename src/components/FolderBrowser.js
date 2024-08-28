import React, { useState, useEffect } from "react";
import { FaFolder, FaHome } from "react-icons/fa"; // Folder and Home icons
import "./FolderBrowser.css"; // Optional, for custom styles

const FolderBrowser = ({ initialFolders, onFolderPathChange }) => {
    const [breadcrumbs, setBreadcrumbs] = useState([]);

    // Effect to split the initial folder path into breadcrumbs
    useEffect(() => {
        const initialBreadcrumbs = initialFolders.split('/').filter(Boolean); // Remove empty strings
        setBreadcrumbs(initialBreadcrumbs);
    }, [initialFolders]);

    const handleFolderClick = (folderName) => {
        const newBreadcrumbs = [...breadcrumbs, folderName];
        setBreadcrumbs(newBreadcrumbs);
        const path = newBreadcrumbs.join("/") + "/";
        onFolderPathChange(path); // Update the path in parent component
    };

    const handleBreadcrumbClick = (index) => {
        // Do nothing if the current crumb is clicked
        if (index === breadcrumbs.length - 1) return;

        const newBreadcrumbs = breadcrumbs.slice(0, index + 1);
        setBreadcrumbs(newBreadcrumbs);
        const path = newBreadcrumbs.join("/") + "/";
        onFolderPathChange(path); // Update the path in parent component
    };

    const handleHomeClick = () => {
        setBreadcrumbs([]); // Reset breadcrumbs to root
        onFolderPathChange(""); // Set path to root
    };

    return (
        <div className="folder-browser text-info">
            <div className="breadcrumbs">
                <span className="text-info" onClick={handleHomeClick} style={{ cursor: "pointer" }}>
                    <FaHome className="folder-icon" /> Home /
                </span>
                {breadcrumbs.map((crumb, index) => (
                    <span
                        className="text-info"
                        key={index}
                        onClick={() => handleBreadcrumbClick(index)}
                        style={{ cursor: index === breadcrumbs.length - 1 ? "default" : "pointer" }}
                    >
                        {crumb} /
                    </span>
                ))}
            </div>
        </div>
    );
};

export default FolderBrowser;
