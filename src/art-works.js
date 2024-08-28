import React, { useContext, useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
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

  return user ? (
    <Row>
      <Dashboard />
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
