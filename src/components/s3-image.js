import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

const S3Item = ({ imageUrl, lowResUrl }) => {
    const [showModal, setShowModal] = useState(false);

    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = imageUrl; // Use the presigned URL
        link.setAttribute('download', 'image.jpg'); // Specify a default file name
        document.body.appendChild(link);
        link.click(); // Trigger the download
        document.body.removeChild(link); // Clean up the DOM
    };

    return (
        <>
            <div
                className="image-item"
                style={{ backgroundImage: `url(${imageUrl})` }}
                onClick={handleShow} // Click to enlarge
            >
                {/* Additional content can be added here */}
            </div>

            {/* Modal for enlarging the image */}
            <Modal show={showModal} onHide={handleClose} size="lg" centered>
                
                <Modal.Body style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <img
                        src={imageUrl}
                        alt="Enlarged"
                        style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain' }} // Responsive image
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleDownload}>
                        Download
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default S3Item;
