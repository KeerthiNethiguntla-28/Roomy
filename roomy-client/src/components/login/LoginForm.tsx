"use client";
import React, { useState, useEffect, use } from "react";
import { TextField, Button, Typography, Container } from "@mui/material";
import { useLoginMutation } from "@/store/services/auth";
import { LoginReq } from "@/models/login/login";
import toast, { Toaster } from "react-hot-toast";
import { redirect } from "next/navigation";
import "../../components/homepage/css/login.css";

export default function LoginComponent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, { data: loginData, error: loginError, isLoading: loginLoading }] = useLoginMutation();

  const handleEmailChange = (event: any) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: any) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const loginData: LoginReq = { email, password };
    await login(loginData);
  };

  useEffect(() => {
    if (loginError) {
      toast.error("An error occurred while logging in");
    }
  }, [loginError]);

  useEffect(() => {
    if (loginData?.success) {
      redirect("/");
    }
  }, [loginData]);

  return (
    <>
      <Container maxWidth="xs">
        <Typography variant="h4" align="center" gutterBottom>
          Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={handleEmailChange}
          />
          <TextField
            label="Password"
            variant="outlined"
            fullWidth
            margin="normal"
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            {loginLoading ? "Loading..." : "Login"}
          </Button>
        </form>
      </Container>
      <Toaster />
    </>
  );
}
