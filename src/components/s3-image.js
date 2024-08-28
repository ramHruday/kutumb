import React from 'react';

const S3Item = ({ imageUrl }) => {
    return (
        <div className="image-item" style={{ backgroundImage: `url(${imageUrl})` }}>
            {/* You can add additional content here, like overlays or captions if needed */}
        </div>
    );
};

export default S3Item;
