"use client"
import { useParams } from "next/navigation"
import { supabase } from "../../../../lib/client";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";

const page = () => {
    const params = useParams();
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        const getQuizQuestions = async () => {
            const response = await supabase.from("quiz2_questions").select("*, question2_answers(*)").eq("quizId", params.quizId);
            setQuestions(response.data)
        };
        getQuizQuestions();
    }, [])
    console.log(questions)

    return (
        <div className="min-h-screen bg-muted/40 p-6 md:p-10">
            <div className="max-w-3xl mx-auto space-y-6">

                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight">
                        Quiz
                    </h1>
                    <p className="text-muted-foreground">
                        Answer each question carefully.
                    </p>
                </div>

                {questions.map((question, index) => {
                    return (
                        <div
                            key={question.id}
                            className="bg-background border rounded-xl p-6 shadow-sm"
                        >
                            {/* Question header */}
                            <div className="flex items-start justify-between gap-4 mb-5">
                                <div className="flex gap-3">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                                        {index + 1}
                                    </span>

                                    <h2 className="text-lg font-semibold leading-8">
                                        {question.question}
                                    </h2>
                                </div>

                                <Badge variant="secondary">
                                    {question.point}{" "}
                                    {question.point === 1 ? "Point" : "Points"}
                                </Badge>
                            </div>

                            {/* Answers */}
                            <div className="space-y-3">
                                {question.question2_answers.map((answer, answerIndex) => {
                                    return (
                                        <div
                                            key={answer.id}
                                            className="flex items-center gap-3 border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                                        >
                                            <div className="flex items-center justify-center w-8 h-8 rounded-full border text-sm font-medium">
                                                {String.fromCharCode(65 + answerIndex)}
                                            </div>

                                            <span className="text-sm font-medium">
                                                {answer.answer}
                                            </span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )
                })}

            </div>
        </div>
    )
}

export default page