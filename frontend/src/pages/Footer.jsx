import React from "react";
import { Box, Container, Typography, Link } from "@mui/material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        position: "fixed",
        zIndex:1001,
        bottom: 0,
        width: "100%",
        backgroundColor: "#2a387c",
        color: "white",
        py: 2,
        px: 3,
        textAlign: "center",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Container maxWidth="lg" sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="body2">&copy; {new Date().getFullYear()} Copy Rights Belongs to Tharini Group </Typography>
        
        <Box sx={{ display: "flex", gap: 2 }}>
          <Link href="/privacy-policy" color="inherit" underline="hover">
            Privacy Policy
          </Link>
          <Link href="/terms-of-service" color="inherit" underline="hover">
            Terms of Service
          </Link>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
