"use client"
import { supabase } from "../../../lib/client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation";


const quiz = () => {
    const [quiz, setQuiz] = useState([])
    const router = useRouter();

    useEffect(() => {
        const getQuiz = async () => {
            const response = await supabase.from("quiz2").select("*");
            console.log(response)
            setQuiz(response.data)
        }
        getQuiz();
    }, [])

    const handleRedirect = (quizId) => {
        router.push(`/quiz/${quizId}`)
    }

    return (
        <div className="min-h-screen bg-muted/40 p-6 md:p-10">
            <Button
                variant="outline"
                onClick={() => router.push("/home")}
            >
                Create New Quiz
            </Button>
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Quizzes
                        </h1>

                        <p className="text-muted-foreground mt-1">
                            Choose a quiz to get started.
                        </p>
                    </div>

                    <Badge variant="secondary">
                        {quiz.length} {quiz.length === 1 ? "Quiz" : "Quizzes"}
                    </Badge>
                </div>

                {/* Quiz List */}
                <div className="grid gap-4 sm:grid-cols-2">

                    {quiz.map((item) => {
                        return (
                            <div
                                key={item.id}
                                className="group bg-background border rounded-xl p-5 shadow-sm hover:shadow-md transition-all"
                            >
                                <div className="flex flex-col justify-between h-full gap-5">

                                    <div className="space-y-2">
                                        <h2 className="text-lg font-semibold group-hover:text-primary transition-colors">
                                            {item.quizName}
                                        </h2>

                                        <p className="text-sm text-muted-foreground">
                                            Created{" "}
                                            {new Date(
                                                item.created_at
                                            ).toLocaleString()}
                                        </p>
                                    </div>

                                    <Button
                                        variant="outline"
                                        className="w-full"
                                        onClick={() => handleRedirect(item.id)}
                                    >
                                        Start Quiz
                                    </Button>

                                </div>
                            </div>
                        )
                    })}

                </div>

                {/* Empty State */}
                {quiz.length === 0 && (
                    <div className="bg-background border rounded-xl p-10 text-center">
                        <h2 className="text-lg font-semibold">
                            No quizzes yet
                        </h2>

                        <p className="text-sm text-muted-foreground mt-1">
                            There aren't any quizzes available.
                        </p>
                    </div>
                )}

            </div>
        </div>
    )
}

export default quiz