"use client"

"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { supabase } from "../../../lib/client"
import { useRouter } from "next/navigation"
import { useState } from "react"

const login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const router = useRouter()

    const login = async () => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        })
        if (error) {
            alert("invalid email or password")
            return
        }
        router.push(`./home`)
        console.log(data, error)
    }
    return (
        <div className="min-h-screen bg-muted/40 flex items-center justify-center p-6">

            <div className="w-full max-w-md">

                <div className="bg-background border rounded-2xl shadow-sm p-8">

                    {/* Header */}
                    <div className="text-center space-y-2 mb-8">
                        <h1 className="text-3xl font-bold tracking-tight">
                            Welcome Back
                        </h1>

                        <p className="text-sm text-muted-foreground">
                            Log in to continue to your account
                        </p>
                    </div>

                    <Separator className="mb-8" />

                    {/* Login Form */}
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
                                placeholder="Enter your password"
                                value={password}
                                onChange={(event) =>
                                    setPassword(event.target.value)
                                }
                            />
                        </div>

                        {/* Login Button */}
                        <Button
                            onClick={login}
                            className="w-full"
                            size="lg"
                        >
                            Login
                        </Button>

                    </div>

                    {/* Footer */}
                    <p className="text-center text-xs text-muted-foreground mt-6">
                        Enter your credentials to access your account.
                    </p>

                </div>

            </div>
        </div>
    )
}

export default login