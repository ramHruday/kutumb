import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

const S3Item = ({ image, s3, bucket }) => {
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [HDloading, setHDLoading] = useState(true);
    const [imageUrl, setImageUrl] = useState();
    const [HDimageURL, setHDimageURL] = useState();

    const handleClose = () => setShowModal(false);
    const handleShow = () => {
        getS3ImageSignedURL(image.Key.replace('low_res', 'high_res'), setHDimageURL, setHDLoading)
        setShowModal(true)
    };

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = HDimageURL ?? imageUrl; // Use the presigned URL
        link.setAttribute('download', 'image.jpg'); // Specify a default file name
        document.body.appendChild(link);
        link.click(); // Trigger the download
        document.body.removeChild(link); // Clean up the DOM
    };

    const getS3ImageSignedURL = async (key, setURL, setL) => {
        try {
            const url = await s3.getSignedUrlPromise("getObject", {
                Bucket: bucket,
                Key: key,
                Expires: 60 * 60, // 1 hour
            });
            setURL(url);
            setL(false);
        } catch (error) {
            console.error("Error fetching signed URL:", error);
            setL(false);
        }
    };

    // Fetch the signed URL when the component mounts
    useEffect(() => {
        if (image && image.Key) {
            getS3ImageSignedURL(image.Key, setImageUrl, setLoading);
        }
    }, [image]);

    if (loading) {
        return <div
            className="image-item shimmer"
        >

        </div>
    }

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
            <Modal show={showModal} onHide={handleClose} size="xl" centered>

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
