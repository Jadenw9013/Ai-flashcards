import { SignedIn, SignedOut, SignUp, UserButton } from "@clerk/nextjs";
import { AppBar, Box, Button, Container, Toolbar, Typography, Paper, Divider } from "@mui/material";
import Link from "next/link";

export default function SignUpPage() {
    return (
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
            <Container maxWidth="sm">
                <Paper
                    elevation={3}
                    sx={{
                        mt: 4,
                        p: 4,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        backgroundColor: "#f9f9f9",
                        borderRadius: "8px"
                    }}
                >
                    <Typography 
                        variant="h4" 
                        sx={{ 
                            mb: 2, 
                            fontWeight: "bold", 
                            color: "#333" 
                        }}
                    >
                        Sign Up
                    </Typography>
                    <SignUp />
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" sx={{ color: "#666" }}>
                            Already have an account?{" "}
                            <Link href="/sign-in" passHref style={{ color: "#3f51b5", textDecoration: "none" }}>
                                Sign In
                            </Link>
                        </Typography>
                    </Box>
                </Paper>
            </Container>
        </>
    );
}
