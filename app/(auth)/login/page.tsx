"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Store } from "lucide-react"
import { registerUser } from "@/app/actions/auth"

type Mode = "login" | "signup"

export default function AuthPage() {
    const router = useRouter()
    const [mode, setMode] = useState<Mode>("login")
    const [loginEmail, setLoginEmail] = useState("")
    const [loginPassword, setLoginPassword] = useState("")
    const [signupData, setSignupData] = useState({
        businessName: "",
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    })
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [loading, setLoading] = useState(false)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")
        setSuccess("")

        try {
            const result = await signIn("credentials", {
                email: loginEmail,
                password: loginPassword,
                redirect: false,
                callbackUrl: "/dashboard",
            })

            if (result?.error) {
                setError("Invalid email or password")
            } else if (result?.ok) {
                router.push("/dashboard")
                router.refresh()
            } else {
                setError("Login failed. Please try again.")
            }
        } catch (err) {
            console.error("Login error:", err)
            setError("An error occurred. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")
        setSuccess("")

        try {
            const result = await registerUser(signupData)

            if (!result.success) {
                setError(result.error || "Could not create account")
                return
            }

            setSuccess("Account created! Signing you in...")

            const loginResult = await signIn("credentials", {
                email: signupData.email,
                password: signupData.password,
                redirect: false,
                callbackUrl: "/dashboard",
            })

            if (loginResult?.error) {
                setError("Account created but automatic login failed. Please sign in manually.")
            } else {
                router.push("/dashboard")
                router.refresh()
            }
        } catch (err) {
            console.error("Signup error:", err)
            setError("Failed to create account. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    const switchMode = (nextMode: Mode) => {
        setMode(nextMode)
        setError("")
        setSuccess("")
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center space-y-4">
                    <div className="flex justify-center">
                        <div className="rounded-full bg-primary/10 p-3">
                            <Store className="h-6 w-6 text-primary" />
                        </div>
                    </div>
                    <div className="flex justify-center gap-2">
                        <Button
                            variant={mode === "login" ? "default" : "outline"}
                            size="sm"
                            onClick={() => switchMode("login")}
                            disabled={loading}
                            className="w-32"
                        >
                            Sign in
                        </Button>
                        <Button
                            variant={mode === "signup" ? "default" : "outline"}
                            size="sm"
                            onClick={() => switchMode("signup")}
                            disabled={loading}
                            className="w-32"
                        >
                            Sign up
                        </Button>
                    </div>
                    <div>
                        <CardTitle className="text-2xl">
                            {mode === "login" ? "Welcome back" : "Create your account"}
                        </CardTitle>
                        <CardDescription>
                            {mode === "login"
                                ? "Enter your credentials to access your account"
                                : "Fill in your business details to get started"}
                        </CardDescription>
                    </div>
                </CardHeader>

                {mode === "login" ? (
                    <form onSubmit={handleLogin}>
                        <CardContent className="space-y-4">
                            {error && (
                                <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                                    {error}
                                </div>
                            )}
                            <div className="space-y-2">
                                <Label htmlFor="login-email">Email</Label>
                                <Input
                                    id="login-email"
                                    type="email"
                                    placeholder="m@example.com"
                                    required
                                    value={loginEmail}
                                    onChange={(e) => setLoginEmail(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="login-password">Password</Label>
                                <Input
                                    id="login-password"
                                    type="password"
                                    required
                                    value={loginPassword}
                                    onChange={(e) => setLoginPassword(e.target.value)}
                                />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" type="submit" disabled={loading}>
                                {loading ? "Signing in..." : "Sign in"}
                            </Button>
                        </CardFooter>
                    </form>
                ) : (
                    <form onSubmit={handleSignup}>
                        <CardContent className="space-y-4">
                            {error && (
                                <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                                    {error}
                                </div>
                            )}
                            {success && (
                                <div className="rounded-md bg-emerald-50 p-3 text-sm text-emerald-600">
                                    {success}
                                </div>
                            )}
                            <div className="space-y-2">
                                <Label htmlFor="business-name">Business Name</Label>
                                <Input
                                    id="business-name"
                                    placeholder="Acme Store"
                                    required
                                    value={signupData.businessName}
                                    onChange={(e) =>
                                        setSignupData((prev) => ({ ...prev, businessName: e.target.value }))
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="name">Your Name</Label>
                                <Input
                                    id="name"
                                    placeholder="Jane Doe"
                                    required
                                    value={signupData.name}
                                    onChange={(e) =>
                                        setSignupData((prev) => ({ ...prev, name: e.target.value }))
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="signup-email">Email</Label>
                                <Input
                                    id="signup-email"
                                    type="email"
                                    placeholder="owner@store.com"
                                    required
                                    value={signupData.email}
                                    onChange={(e) =>
                                        setSignupData((prev) => ({ ...prev, email: e.target.value }))
                                    }
                                />
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="signup-password">Password</Label>
                                    <Input
                                        id="signup-password"
                                        type="password"
                                        required
                                        value={signupData.password}
                                        onChange={(e) =>
                                            setSignupData((prev) => ({ ...prev, password: e.target.value }))
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                                    <Input
                                        id="signup-confirm-password"
                                        type="password"
                                        required
                                        value={signupData.confirmPassword}
                                        onChange={(e) =>
                                            setSignupData((prev) => ({ ...prev, confirmPassword: e.target.value }))
                                        }
                                    />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-2">
                            <Button className="w-full" type="submit" disabled={loading}>
                                {loading ? "Creating account..." : "Create account"}
                            </Button>
                            <p className="text-xs text-muted-foreground text-center">
                                By creating an account you agree to our terms of service.
                            </p>
                        </CardFooter>
                    </form>
                )}
            </Card>
        </div>
    )
}

