"use client"
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { collection, doc, getDoc, getDocs } from "firebase/firestore"
import { db } from "@/firebase"
import { useSearchParams } from "next/navigation"
import { Box, Button, Card, CardActionArea, CardContent, Container, Divider, Toolbar } from "@mui/material"
import { Grid, Typography } from "@mui/material"
import Link from "next/link"

export default function Flashcard() {
    const {isLoaded, isSignedIn, user} = useUser()
    const [flashcards, setFlashcards] = useState([])
    const [flipped, setFlipped] = useState([])

    const searchParams = useSearchParams()
    const search = searchParams.get("id")

    useEffect(() => {
        async function getFlashcard(){
            if(!search || !user) return
            const docRef = collection(doc(collection(db, "users"), user.id), search)
            const docSnap = await getDocs(docRef)
            const flashcards = []
            
            docSnap.forEach((doc) => {
                flashcards.push({id: doc.id,...doc.data()})
            })
            setFlashcards(flashcards)
        }
        getFlashcard()
    }, [user, search])

    const handleCardClick = (id) => {
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[id]
        }))
    }

    if(!isLoaded || !isSignedIn) {
        return <></>
    }

    return(
        <>
            {/* HEADER */}
            <Container maxWidth="lg">
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
            </Container>

            {/* MAIN */}
            <Container maxWidth="100vw">
                <Grid container spacing={3} sx={{mt:4}}>
                    {/* GENERATE FLASHCARDS */}
                
                    {flashcards.map((flashcard, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Card>
                                <CardActionArea 
                                    onClick={() => {
                                        handleCardClick(index)
                                    }}
                                >
                                    <CardContent>
                                        <Box
                                            sx={{
                                                perspective: "1000px",
                                                "& > div": {
                                                    transition: "transform 0.6s",
                                                    transformStyle: "preserve-3d",
                                                    position:"relative",
                                                    width: "100%",
                                                    height: "200px",
                                                    boxShadow: "0 4px 8px 0 rgba(0,0,0, 0.2)",
                                                    transform: flipped[index]
                                                        ? "rotateY(180deg)" 
                                                        : "rotateY(0deg)"
                                                },
                                                "& > div > div": {             
                                                    position:"absolute",
                                                    width: "100%",
                                                    height: "100%",
                                                    backfaceVisibility: "hidden",
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    padding: 2,
                                                    boxSizing: "border-box"
                                                },
                                                "& > div > div:nth-of-type(2)":{
                                                    transform: "rotateY(180deg)"
                                                }  
                                            }}
                                        >
                                            <div>
                                                <div>
                                                    <Typography varian="h5" component="div">
                                                        {flashcard.front}
                                                    </Typography>
                                                </div>
                                                <div>
                                                    <Typography varian="h5" component="div">
                                                        {flashcard.back}
                                                    </Typography>
                                                </div>
                                            </div>
                                        </Box>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </>
    )


}