"use client"
import { useState } from "react"
import { supabase } from "../../../lib/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

const home = () => {
    const [quiz, setQuiz] = useState("")
    const [questions, setQuestions] = useState([
        {
            question: "",
            point: 0,
            answers: ["", "", "", ""],
            correctIndex: 0,
        },
    ]);

    const handleQuizName = (event) => setQuiz(event.target.value)



    const addQuestion = () => {
        setQuestions([
            ...questions,
            {
                question: "",
                point: 0,
                answers: ["", "", "", ""],
                correctIndex: 0,
            },
        ])
    }

    const handleQuestion = (value, field, questionIndex) => {
        const updatedQuestion = questions.map((question, index) => {
            if (questionIndex === index) {
                return { ...question, [field]: value }
            } else {
                return question;
            }
        })

        setQuestions(updatedQuestion);
    }

    const handleAnswers = (questionIndex, answerIndex, value) => {
        const updatedQuestions = questions.map((question, qIndex) => {
            if (qIndex === questionIndex) {
                return {
                    ...question,
                    answers: question.answers.map((answer, aIndex) => {
                        if (aIndex === answerIndex) {
                            return value;
                        } else {
                            return answer;
                        }
                    })
                }
            } else {
                return question;
            }
        })
        setQuestions(updatedQuestions)
    }



    const createQuiz = async () => {
        const response = await supabase.from("quiz2").insert({ "quizName": quiz }).select("*").single();

        const quizId = response.data.id;

        for (let i = 0; i < questions.length; i++) {
            const response = await supabase
                .from("quiz2_questions")
                .insert({
                    question: questions[i].question,
                    quizId: quizId,
                    point: questions[i].point,
                })
                .select("*");

            const questionId = response.data[0].id;

            for (let j = 0; j < questions[i].answers.length; j++) {
                const response = await supabase
                    .from("question2_answers")
                    .insert({
                        questionId: questionId,
                        answer: questions[i].answers[j],
                        isCorrect: questions[i].correctIndex === j
                    })
                    .select("*");
                console.log(response)
            }

            console.log(response, "questions")
        }


        console.log(response)
        setQuiz("")
        if (response) {
            alert("Successuly created")
        } else (
            alert("error occured")
        )

    }

    console.log(questions)

    return (
        <div className="min-h-screen bg-muted/40 p-6 md:p-10">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Header */}
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">
                        Create Quiz
                    </h1>

                    <p className="text-muted-foreground">
                        Create your quiz and add questions with their answers.
                    </p>
                </div>

                {/* Quiz Information */}
                <div className="bg-background rounded-xl border shadow-sm p-6 space-y-5">

                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold">
                                Quiz Information
                            </h2>

                            <p className="text-sm text-muted-foreground">
                                Give your quiz a name.
                            </p>
                        </div>

                        <Badge variant="secondary">
                            Quiz
                        </Badge>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                        <Label htmlFor="quiz-name">
                            Quiz name
                        </Label>

                        <Input
                            id="quiz-name"
                            placeholder="Enter quiz name"
                            value={quiz}
                            onChange={(e) => handleQuizName(e)}
                        />
                    </div>

                    <Button
                        onClick={createQuiz}
                        className="w-full sm:w-auto"
                    >
                        Create Quiz
                    </Button>
                </div>

                {/* Questions */}
                <div className="space-y-5">

                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-semibold">
                                Questions
                            </h2>

                            <p className="text-sm text-muted-foreground">
                                Add questions and select the correct answer.
                            </p>
                        </div>

                        <Badge variant="outline">
                            {questions.length}{" "}
                            {questions.length === 1
                                ? "Question"
                                : "Questions"}
                        </Badge>
                    </div>

                    {questions.map((question, questionIndex) => (
                        <div
                            key={questionIndex}
                            className="bg-background rounded-xl border shadow-sm p-6 space-y-6"
                        >

                            {/* Question Header */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                                        {questionIndex + 1}
                                    </div>

                                    <div>
                                        <h3 className="font-semibold">
                                            Question {questionIndex + 1}
                                        </h3>

                                        <p className="text-sm text-muted-foreground">
                                            Enter the question and its answers.
                                        </p>
                                    </div>
                                </div>

                                <Badge variant="secondary">
                                    {question.point}{" "}
                                    {question.point === 1
                                        ? "point"
                                        : "points"}
                                </Badge>
                            </div>

                            <Separator />

                            {/* Question Input */}
                            <div className="space-y-2">
                                <Label htmlFor={`question-${questionIndex}`}>
                                    Question
                                </Label>

                                <Input
                                    id={`question-${questionIndex}`}
                                    placeholder="Enter your question"
                                    value={question.question}
                                    onChange={(e) =>
                                        handleQuestion(
                                            e.target.value,
                                            "question",
                                            questionIndex
                                        )
                                    }
                                />
                            </div>

                            {/* Point Input */}
                            <div className="space-y-2 max-w-[200px]">
                                <Label htmlFor={`points-${questionIndex}`}>
                                    Points
                                </Label>

                                <Input
                                    id={`points-${questionIndex}`}
                                    type="number"
                                    min={0}
                                    placeholder="Points"
                                    value={question.point}
                                    onChange={(e) =>
                                        handleQuestion(
                                            Number(e.target.value),
                                            "point",
                                            questionIndex
                                        )
                                    }
                                />
                            </div>

                            {/* Answers */}
                            <div className="space-y-3">
                                <div>
                                    <Label>
                                        Answers
                                    </Label>

                                    <p className="text-sm text-muted-foreground">
                                        Select the correct answer.
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    {question.answers.map(
                                        (answer, answerIndex) => (
                                            <div
                                                key={answerIndex}
                                                className={`flex items-center gap-3 rounded-lg border p-3 transition-colors ${question.correctIndex ===
                                                    answerIndex
                                                    ? "border-primary bg-primary/5"
                                                    : "bg-background"
                                                    }`}
                                            >
                                                <Checkbox
                                                    checked={
                                                        question.correctIndex ===
                                                        answerIndex
                                                    }
                                                    onCheckedChange={() =>
                                                        handleQuestion(
                                                            answerIndex,
                                                            "correctIndex",
                                                            questionIndex
                                                        )
                                                    }
                                                />

                                                <Label
                                                    className="w-20 shrink-0"
                                                >
                                                    Answer {answerIndex + 1}
                                                </Label>

                                                <Input
                                                    placeholder={`Enter answer ${answerIndex + 1
                                                        }`}
                                                    value={answer}
                                                    onChange={(e) =>
                                                        handleAnswers(
                                                            questionIndex,
                                                            answerIndex,
                                                            e.target.value
                                                        )
                                                    }
                                                />

                                                {question.correctIndex ===
                                                    answerIndex && (
                                                        <Badge>
                                                            Correct
                                                        </Badge>
                                                    )}
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Add Question */}
                <Button
                    variant="outline"
                    onClick={addQuestion}
                    className="w-full h-12 border-dashed"
                >
                    + Add Question
                </Button>

            </div>
        </div>
    )
}

export default home