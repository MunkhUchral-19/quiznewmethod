"use client"

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
        <div>
            <input placeholder="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
            />

            <input placeholder="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
            />

            <button onClick={signup}>signup</button>
        </div>
    )
}

export default signup