"use client"
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { collection, doc, getDoc, setDoc } from "firebase/firestore"
import { db } from "@/firebase"
import { useRouter } from "next/navigation"
import { Card, CardActionArea, CardContent, Container, Grid, Typography, Box, Toolbar, AppBar, Button, Divider } from "@mui/material"
import Link from "next/link"

export default function Flashcards() {
    const { isLoaded, isSignedIn, user } = useUser()
    const [flashcards, setFlashcards] = useState([])
    const router = useRouter()

    useEffect(() => {
        async function getFlashcards() {
            if (!user) return
            const docRef = doc(collection(db, "users"), user.id)
            const docSnap = await getDoc(docRef)

            if (docSnap.exists()) {
                const collections = docSnap.data().flashcards || []
                setFlashcards(collections)
            } else {
                await setDoc(docRef, { flashcards: [] })
            }
        }
        getFlashcards()
    }, [user])

    if (!isLoaded || !isSignedIn) {
        return <></>
    }

    const handleCardClick = (id) => {
        router.push(`/flashcard?id=${id}`)
    }

    return (
        <Container maxWidth="lg">
            {/* HEADER */}
            <Toolbar sx={{ justifyContent: "space-between" }}>
                <Typography variant="h6" sx={{fontWeight: "bold", cursor: "pointer", color: "#a010ef" }}>
                    <Link href="../" style={{ textDecoration: "none", color: "inherit" }}> FlashAI</Link>
                </Typography>
                <Box>
                <SignedOut>
                    <Button
                    variant="outlined"
                    color="inherit"
                    href="/sign-in"
                    sx={{ mx: 1, borderRadius: 3, color: "#a010ef"}}
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

            <Toolbar>
                <Typography variant="h5" sx={{fontWeight: "bolder", }}>
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
                Your Collection
                </span>
                </Typography>
            </Toolbar>
            

            {/* MAIN CONTENT - FLASHCARD COLLECTIONS*/}
            <Grid
                container
                spacing={3}
                sx={{ mt: 1 }}
            >
                {flashcards.length > 0 ? (
                    flashcards.map((flashcard, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Card
                                sx={{
                                    background: "linear-gradient(to bottom right, #4312ed, #a010ef)",
                                    color: "white",
                                    height: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
                                    borderRadius: 2,
                                    transition: "transform 0.3s ease",
                                    "&:hover": {
                                        transform: "translateY(-5px)",
                                    },
                                }}
                            >
                                <CardActionArea onClick={() => handleCardClick(flashcard.name)}>
                                    <CardContent>
                                        <Typography variant="h6" fontWeight="bold">
                                            {flashcard.name}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))
                ) : (
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            height: "50vh",
                            textAlign: "center",
                            ml: 20
                        }}
                    >
                        <Typography variant="h4" color="textSecondary" sx={{ mb: 2, color: "#a010ef" }}>
                            No flashcards available. Start by creating a new flashcard.
                        </Typography>
                        <Button 
                            variant="contained" 
                            sx={{                             
                                background: "#a010ef",
                                borderColor: "#000",
                                color: "#fff",
                                borderRadius: 3,
                                textTransform: 'none', // Prevents automatic capitalization
                                "&:hover": {
                                borderColor: "#000",
                                background: "##4312ed" // Darker shade on hover
                                }
                            }}
                            onClick={() => router.push("/generate")}
                        >
                            Generate
                        </Button>
                    </Box>
                )}
            </Grid>
        </Container>
    )
}
