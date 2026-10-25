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
    const [result, setResult] = useState(null)

    const quizId = params.quizId;

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

    // console.log(answers, "gg")

    const answer = async () => {
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
        setResult({ totalPoint, myPoint })

        const { data } = await supabase
            .from("quiz_attempts")
            .insert({
                quizId: quizId,
                totalScore: totalPoint,
                score: myPoint,
            })
            .select("*");

        const attemptId = data[0].id;

        for (let i = 0; i < questions.length; i++) {
            const correctAnswer = questions[i].question2_answers.find((answer) => {
                return answer.isCorrect;
            });
            const { data, error } = await supabase.from("quiz_attempts_answer").insert({
                attemptId: attemptId,
                answerId: answers[questions[i].id],
                isCorrect: correctAnswer.id === answers[questions[i]],
            });
            console.log(data, error)
        }

    }

    const getAnswerColour = ({ isCorrect, isSelected }) => {
        if (result && isCorrect) return "border-green-500"
        if (result && isSelected) return "border-red-500"
        if (isSelected) return "border-sky-500"
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
                                            className={`flex items-center gap-3 border border-2 rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer ${getAnswerColour(
                                                {
                                                    isCorrect: answer.isCorrect,
                                                    isSelected: answers[question.id] === answer.id
                                                }
                                            )}`}
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
                {result && (
                    <div className="mt-6 rounded-xl border bg-card p-6 shadow-sm">
                        <div className="mb-5">
                            <h2 className="text-xl font-bold tracking-tight">
                                Quiz Results
                            </h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Here's how you performed.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="rounded-lg border bg-muted/40 p-4">
                                <p className="text-sm font-medium text-muted-foreground">
                                    Total Points
                                </p>
                                <p className="mt-2 text-3xl font-bold">
                                    {result.totalPoint}
                                </p>
                            </div>

                            <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                                <p className="text-sm font-medium text-muted-foreground">
                                    Your Points
                                </p>
                                <p className="mt-2 text-3xl font-bold text-primary">
                                    {result.myPoint}
                                    <span className="ml-1 text-base font-normal text-muted-foreground">
                                        / {result.totalPoint}
                                    </span>
                                </p>
                            </div>
                        </div>

                        <div className="mt-5">
                            <div className="mb-2 flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Your score</span>
                                <span className="font-semibold">
                                    {result.totalPoint > 0
                                        ? Math.round(
                                            (result.myPoint / result.totalPoint) * 100
                                        )
                                        : 0}%
                                </span>
                            </div>

                            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                                <div
                                    className="h-full rounded-full bg-primary transition-all duration-500"
                                    style={{
                                        width: `${result.totalPoint > 0
                                            ? Math.min(
                                                100,
                                                Math.max(
                                                    0,
                                                    (result.myPoint / result.totalPoint) * 100
                                                )
                                            )
                                            : 0
                                            }%`,
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default page