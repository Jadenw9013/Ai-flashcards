"use client"
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs"
import { Box, Button, Card, CardActionArea, CardContent, Container, Divider, Toolbar } from "@mui/material"
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material"
import { Paper, TextField, Typography } from "@mui/material"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { db } from "@/firebase"
import { collection, doc, getDoc, writeBatch } from "firebase/firestore"
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft"
import ArrowRightIcon from "@mui/icons-material/ArrowRight"
import Link from "next/link"




// Custom arrow components
function PrevArrow(props) {
    const { onClick } = props
    return (
        <Box
            onClick={onClick}
            sx={{
                position: "absolute",
                top: "50%",
                left: "-30px",
                transform: "translateY(-50%)",
                cursor: "pointer",
                zIndex: 1,
            }}
        >
            <ArrowLeftIcon fontSize="large" />
        </Box>
    )
}

function NextArrow(props) {
    const { onClick } = props
    return (
        <Box
            onClick={onClick}
            sx={{
                position: "absolute",
                top: "50%",
                right: "-30px",
                transform: "translateY(-50%)",
                cursor: "pointer",
                zIndex: 1,
            }}
        >
            <ArrowRightIcon fontSize="large" />
        </Box>
    )
}

export default function Generate() {
    const {isLoaded, isSignedIn, user} = useUser()
    const [flashcards, setFlashcards] = useState([])
    const [flipped, setFlipped] = useState([])
    const [text, setText] = useState("")
    const [name, setName] = useState("")
    const [open, setOpen] = useState(false)
    const router = useRouter()

    const handleSubmit = async () => {
        fetch("api/generate", {
            method: "POST",
            body: text,
        })
            .then((res) => res.json())
            .then((data) => setFlashcards(data))
    }

    const handleCardClick = (id) => {
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[id]
        }))
    }

    const handleOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    const saveFlashcards = async () => {
        if(!name) {
            alert("Please enter a name")
            return
        }
        /* IF NOT SIGNED IN */
        if(!isSignedIn) {
            router.push("/sign-in")
        }
        else{/* IF SIGNED IN */
            const batch = writeBatch(db)
            const userDocRef = doc(collection(db, "users"), user.id)
            const docSnap = await getDoc(userDocRef)
    
            if(docSnap.exists()) {
                const collections = docSnap.data().flashcards || []
                if(collections.find((f) => f.name === name)) {
                    alert("Flashcard collection with the same name already exists.")
                    return 
                }
                else{
                    collections.push({name})
                    batch.set(userDocRef, {flashcards: collections}, {merge: true})
                }
            }
            else{
                batch.set(userDocRef, {flashcards: [{name}]})
            }
    
            const colRef = collection(userDocRef, name)
            flashcards.forEach((flashcard) => {
                const cardDocRef = doc(colRef)
                batch.set(cardDocRef, flashcard)
            })
    
            await batch.commit()
            handleClose()
            router.push("/flashcards")
        }
    }

    const settings = {
        dots: false, // Disabled dots
        infinite: true,
        speed: 800,
        slidesToShow: 3,
        slidesToScroll: 1,
        prevArrow: <PrevArrow />,
        nextArrow: <NextArrow />,
    }

    return(
        <>
            {/* HEADER */}
            <Container maxWidth="lg">      
                <Toolbar sx={{ justifyContent: "space-between" }}>
                <Typography variant="h6" sx={{fontWeight: "bold", cursor: "pointer", color: "#a010ef" }}>
                    <Link href="../" style={{ textDecoration: "none", color: "inherit" }}> FlashCards</Link>
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
            </Container>

            {/* GENERATE BOX */}
            <Container maxWidth="md">
                
                <Box
                    sx={{
                        color: "#4312ed",
                        mt:4,
                        mb:6,
                        display:"flex",
                        flexDirection: "column",
                        alignItems: "center"
                    }}
                >
                    <Typography variant="h4">Generate Flashcards</Typography>
                    <Paper sx={{p:4, width: "100%"}}>
                        <TextField 
                            value={text} 
                            onChange={(e) => setText(e.target.value)} 
                            label="Enter your topic" 
                            fullWidth
                            multiline
                            rows={4}
                            variant="outlined"
                            sx={{
                                mb: 2,
                                "& .MuiOutlinedInput-root": {
                                "& fieldset": {
                                    borderColor: "#4312ed", // Default border color
                                },
                                "&:hover fieldset": {
                                    borderColor: "#4312ed", // Border color when hovered
                                },
                                "&.Mui-focused fieldset": {
                                    borderColor: "#4312ed", // Border color when focused
                                },
                                },
                                "& .MuiInputLabel-root": {
                                color: "#4312ed", // Label color
                                "&.Mui-focused": {
                                    color: "#4312ed", // Label color when focused
                                },
                                },
                                "& .MuiInputLabel-shrink": {
                                top: -8, // Adjust label position when floating
                                left: 0,
                                color: "#4312ed", // Label color when floating
                                },
                            }}
                        />

                        <Button
                            variant="contained" 
                            sx={{                             
                                background: "linear-gradient(to bottom right, #4312ed, #a010ef)",
                                borderColor: "#000",
                                color: "#fff",
                                borderRadius: 3,
                                textTransform: 'none', // Prevents automatic capitalization
                                "&:hover": {
                                borderColor: "#000",
                                background: "linear-gradient(to bottom right, #a010ef, #4312ed )" // Darker shade on hover
                                }
                            }}
                            onClick={handleSubmit}
                            fullWidth
                        >
                            Generate
                        </Button>
                    </Paper>
                </Box>


                {/* GENERATE FLASHCARDS */}
                {flashcards.length > 0 && (
                    <Box sx={{mt: 4, color: "#a010ef"}}>
                        <Typography variant="h5">Flashcards Preview</Typography>
                        <Slider {...settings}>
                            {flashcards.map((flashcard, index) => (
                                <Box key={index} px={2}>
                                    <Card>
                                        <CardActionArea 
                                            onClick={() => handleCardClick(index)}
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
                                </Box>
                            ))}
                        </Slider>
                        <Box sx={{mt: 4, display:"flex", justifyContent: "center", gap: 2}}>
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
                                    background: "#4312ed" // Darker shade on hover
                                    }
                                }}
                                onClick={handleOpen}
                            >
                                Save
                            </Button>
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
                                    background: "#4312ed" // Darker shade on hover
                                    }
                                }}
                                href="../"
                            >
                                Cancel
                            </Button>
                        </Box>
                    </Box>
                )}

                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>Save Flashcards</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Please enter a name for your flashcards collection
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Collection Name"
                            fullWidth
                            value={name}
                            variant="outlined"
                            sx={{
                                mt: 3,
                                "& .MuiOutlinedInput-root": {
                                "& fieldset": {
                                    borderColor: "#ccc", // Default border color
                                },
                                "&:hover fieldset": {
                                    borderColor: "#000", // Border color when hovered
                                },
                                "&.Mui-focused fieldset": {
                                    borderColor: "#000", // Border color when focused
                                },
                                },
                                "& .MuiInputLabel-root": {
                                color: "#000", // Label color
                                "&.Mui-focused": {
                                    color: "#000", // Label color when focused
                                },
                                },
                                "& .MuiInputLabel-shrink": {
                                top: -8, // Adjust label position when floating
                                left: 0,
                                color: "#000", // Label color when floating
                                }
                            }}
                            onChange={(e) => setName(e.target.value)}
                        />  
                    </DialogContent>
                    <DialogActions>
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
                                background: "#4312ed" // Darker shade on hover
                                }
                            }}
                            onClick={saveFlashcards}
                        >
                            Save
                        </Button>

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
                                background: "#4312ed" // Darker shade on hover
                                }
                            }}
                            onClick={handleClose}
                        >
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </>
    )
}
