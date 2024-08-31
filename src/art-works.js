import React, { useContext, useEffect, useState } from "react";
import { Col, Row, Spinner } from "react-bootstrap";
import { S3 } from "aws-sdk"; // Import S3
import { MongoContext } from "./context/mongo-context";
import LoginForm from "./components/login-form";
import Dashboard from "./components/dashboard";

function ArtWorks(props) {
    const {
        user,
        setEmail,
        setPassword,
        onSubmit,
        email,
        password,
    } = useContext(MongoContext);

    // State to hold the user's MongoDB document
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true); // Loading state
    const [s3, setS3] = useState(null); // State to hold the S3 instance

    useEffect(() => {
        if (user) {
            // Define the function to get the user's document
            const getUserData = async () => {
                try {
                    // Replace this with your actual function to retrieve user data
                    const resp = await user.functions.user_s3(user.id);
                    setUserData(resp.data);

                    // Initialize the S3 instance after retrieving user data
                    const s3Instance = new S3({
                        accessKeyId: resp.data.s3AccessId,
                        secretAccessKey: resp.data.s3AccessKey,
                        region: process.env.REACT_APP_REGION,
                    });
                    setS3(s3Instance); // Set the S3 instance
                } catch (error) {
                    console.error("Error fetching user data:", error);
                } finally {
                    setLoading(false); // Ensure loading state is set to false
                }
            };

            getUserData();
        } else {
            setLoading(false); // If there's no user, stop loading
        }
    }, [user]);

    if (loading) {
        return <Spinner animation="border" />;
    }

    return userData ? (
        <Row>
            <Dashboard s3={s3} /> {/* Pass the S3 instance to Dashboard */}
        </Row>
    ) : (
        <LoginForm
            onEmailChange={(e) => setEmail(e.target.value)}
            email={email}
            onPassWordChange={(e) => setPassword(e.target.value)}
            password={password}
            onSubmit={onSubmit}
        />
    );
}

export default ArtWorks;
