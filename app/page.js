"use client";
import Image from "next/image";
import getStripe from "@/utils/get-stripe";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import {
  Box,
  Button,
  Container,
  Grid,
  Toolbar,
  Typography,
  Paper,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import Head from "next/head";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


/* FINAL PRODUCT */
export default function Home() {
  
  const router = useRouter();

  const handleCheckout = async (plan) => {
    try {
      const checkoutSession = await fetch("/api/checkout_sessions", {
        method: "POST",
        headers: {
          origin: "http://localhost:3000",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plan }),
      });

      const checkoutSessionJson = await checkoutSession.json();

      if (checkoutSession.statusCode === 500) {
        console.error(checkoutSessionJson.message);
        return;
      }

      const stripe = await getStripe();
      const { error } = await stripe.redirectToCheckout({
        sessionId: checkoutSessionJson.id,
      });

      if (error) {
        console.warn(error.message);
      }
    } catch (err) {
      console.error("Error during checkout:", err);
    }
  };

  const handleGetStarted = () => {
    router.push("/generate");
  };

  const handleCollections = () => {
    router.push("/flashcards");
  };

  return (
    <Container maxWidth="lg">
      <Head>
        <title>Flashcard SaaS</title>
        <meta name="description" content="Create flashcards from your text" />
      </Head>

      {/* HEADER */}
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography variant="h6" sx={{fontWeight: "bold", cursor: "pointer", color: "#a010ef" }}>
          FlashAI
        </Typography>
        <Box>
          <SignedOut>
            <Button
              variant="outlined"
              color="inherit"
              href="/sign-in"
              sx={{ mx: 1, borderRadius: 3, color: "#a010ef" }}
            >
              Sign In
            </Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Box>
      </Toolbar>
      
      <Divider/>

      {/* BIG TITLE SECTION */}
      <Box
        sx={{
          textAlign: "center",
          py: 6,
          mt: 5
        }}
      >
        {/* TITLE and BUTTON */}
        <Typography variant="h2" gutterBottom align="center">
          <span style={{ 
            display: "block", 
            fontWeight: 700, 
            fontSize: "4rem", 
            background: "linear-gradient(to bottom right, #4312ed, #a010ef)", // Gradient background
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent", // Make text transparent to show gradient
            letterSpacing: "0.05em", 
            marginBottom: "0.5rem",
            dropShadow: "2px 2px 2px rgba(0, 0, 0, 0.5)" // Slight shadow for depth
          }}>
           AI Flashcard Generator
          </span>
          <span style={{ 
            display: "block", 
            fontWeight: 700, 
            fontSize: "4rem", 
            background: "linear-gradient(to bottom right, #4312ed, #a010ef)", // Gradient background
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent", // Make text transparent to show gradient
            letterSpacing: "0.05em", 
            marginBottom: "0.5rem",
            dropShadow: "2px 2px 2px rgba(0, 0, 0, 0.5)" // Slight shadow for depth
          }}>
           Learning Tool
          </span>
        </Typography>

        <Typography variant="h5" color="textSecondary" gutterBottom sx={{ mt: 2 }}>
          AI developed and study-friendly flashcards.
        </Typography>

        <Button
          variant="contained"
          sx={{ 
            mt: 4, 
            mx: 2,  
            borderRadius: 3,
            background: "linear-gradient(to bottom right, #4312ed, #a010ef)", // Gradient black 
          }}
          onClick={handleGetStarted}
          size="large"
        >
          Get Started
        </Button>
        <Button
          variant="outlined"
          sx={{ 
            mt: 4, 
            mx: 2 ,
            borderRadius: 3,
            borderColor: "#a010ef", // Set border color to black
            color:"#a010ef",
            '&:hover': {
              borderColor: "#4312ed", // Ensure the border color remains black on hover
              background: "#f0f0f0", // Ensure the background color remains transparent on hover
              color: "#4312ed", // Ensure the text color remains black on hover
            }
          }}
          onClick={handleCollections}
          size="large"
        >
          Explore Collections
        </Button>
      </Box>

      

      {/* FEATURES SECTION */}
      <Box sx={{my: 5}}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Paper
              elevation={3}
              sx={{
                p: 4,
                background: "linear-gradient(to bottom right, #4312ed, #a010ef)", // Gradient black
                color: "white", // Text color
                textAlign: "center",
                height: "100%",
                borderRadius: 2,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center"
              }}
            >
              <Typography variant="h6" gutterBottom>
                Effortless Input
              </Typography>
              <Typography color="rgba(255, 255, 255, 0.7)"> {/* Semi-transparent white */}
                Enter your text effortlessly and generate flashcards with ease.
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper
              elevation={3}
              sx={{
                p: 4,
                background: "linear-gradient(to bottom right, #4312ed, #a010ef)", // Gradient black
                color: "white", // Text color
                textAlign: "center",
                height: "100%",
                borderRadius: 2,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center"
              }}
            >
              <Typography variant="h6" gutterBottom>
                Intelligent Design
              </Typography>
              <Typography color="rgba(255, 255, 255, 0.7)"> {/* Semi-transparent white */}
                Our AI transforms your text into smart flashcards for effective studying.
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper
              elevation={3}
              sx={{
                p: 4,
                background: "linear-gradient(to bottom right, #4312ed, #a010ef)", // Gradient black
                color: "white", // Text color
                textAlign: "center",
                height: "100%",
                borderRadius: 2,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center"
              }}
            >
              <Typography variant="h6" gutterBottom>
                Accessible Anywhere
              </Typography>
              <Typography color="rgba(255, 255, 255, 0.7)"> {/* Semi-transparent white */}
                Study on the go with access from any device, anywhere.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
