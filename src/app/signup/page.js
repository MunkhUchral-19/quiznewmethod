"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { supabase } from "../../../lib/client"
import { useRouter } from "next/navigation"
import { useState } from "react"

const signup = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const router = useRouter()

    const signup = async () => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password
        })
        if (error) {
            alert("Cannot be empty")
            return
        }
        router.push(`./login`)
        console.log(data, error)
    }
    return (
        <div className="min-h-screen bg-muted/40 flex items-center justify-center p-6">

            <div className="w-full max-w-md">

                <div className="bg-background border rounded-2xl shadow-sm p-8">

                    {/* Header */}
                    <div className="text-center space-y-2 mb-8">
                        <h1 className="text-3xl font-bold tracking-tight">
                            Create Account
                        </h1>

                        <p className="text-sm text-muted-foreground">
                            Sign up to create your account
                        </p>
                    </div>

                    <Separator className="mb-8" />

                    {/* Signup Form */}
                    <div className="space-y-5">

                        {/* Email */}
                        <div className="space-y-2">
                            <Label htmlFor="email">
                                Email
                            </Label>

                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(event) =>
                                    setEmail(event.target.value)
                                }
                            />
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <Label htmlFor="password">
                                Password
                            </Label>

                            <Input
                                id="password"
                                type="password"
                                placeholder="Create a password"
                                value={password}
                                onChange={(event) =>
                                    setPassword(event.target.value)
                                }
                            />
                        </div>

                        {/* Signup Button */}
                        <Button
                            onClick={signup}
                            className="w-full"
                            size="lg"
                        >
                            Sign Up
                        </Button>

                    </div>

                    {/* Footer */}
                    <p className="text-center text-xs text-muted-foreground mt-6">
                        By signing up, you agree to create an account
                        with the information provided.
                    </p>

                </div>

            </div>
        </div>
    )
}

export default signup