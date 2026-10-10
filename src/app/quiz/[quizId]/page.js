"use client"
import { useParams } from "next/navigation"
import { supabase } from "../../../../lib/client";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const page = () => {
    const router = useRouter()
    const params = useParams();
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({})

    useEffect(() => {
        const getQuizQuestions = async () => {
            const response = await supabase.from("quiz2_questions").select("*, question2_answers(*)").eq("quizId", params.quizId);
            setQuestions(response.data)
        };
        getQuizQuestions();
    }, [])
    console.log(questions)

    const handleAnswer = (questionId, answerId) => {
        setAnswers({ ...answers, [questionId]: answerId })
    }

    console.log(answers, "gg")

    const answer = () => {
        let totalPoint = 0;
        let myPoint = 0;

        for (let i = 0; i < questions.length; i++) {
            totalPoint = totalPoint + questions[i].point;
            const correctAnswer = questions[i].question2_answers.find((answer) => {
                return answer.isCorrect
            })
            console.log(correctAnswer, "zuv")

            if (answers[correctAnswer.questionId] === correctAnswer.id) {
                myPoint = myPoint + questions[i].point;
            }
        }
        console.log(totalPoint, myPoint)
    }

    return (
        <div className="min-h-screen bg-muted/40 p-6 md:p-10">
            <Button
                variant="outline"
                onClick={() => router.push("/quiz")}
            >
                ← Back to Quizzes
            </Button>
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
                                            onClick={() => handleAnswer(question.id, answer.id)}
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
                <Button onClick={answer}>
                    Answers
                </Button>

            </div>
        </div>
    )
}

export default page