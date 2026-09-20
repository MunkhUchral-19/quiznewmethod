"use client"

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
        <div>
            <input placeholder="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
            />

            <input placeholder="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
            />

            <button onClick={login}>login</button>
        </div>
    )
}

export default login