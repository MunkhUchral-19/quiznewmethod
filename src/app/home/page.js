"use client"
import { useState } from "react"
import { supabase } from "../../../lib/client"
const home = () => {
    const [quiz, setQuiz] = useState("")
    const [questions, setQuestions] = useState([
        {
            question: "",
            point: 1000,
            answers: ["", "", "", ""],
            correctIndex: 0,
        },
    ]);

    const createQuiz = async () => {
        const { data, error } = await supabase.from("quiz2").insert({ "quizName": quiz })
        console.log(data, error)
        setQuiz("")
        alert("Successuly created")
    }

    const addQuestion = () => {
        setQuestions([
            ...questions,
            {
                question: "",
                point: 1000,
                answers: ["", "", "", ""],
                correctIndex: 0,
            },
        ])
    }

    return (
        <div>
            <input
                placeholder="Quiz name"
                onChange={(event) => setQuiz(event.target.value)}
                value={quiz}
            />
            <button onClick={createQuiz}>Create Quiz</button>
            <div>
                {questions.map((question, index) => {
                    return (
                        <div>
                            <input placeholder="questions" />
                            <input placeholder="point" min={1} />
                            <div>
                                {question.answers.map((answer) => {
                                    return (
                                        <div>
                                            <input type="checkbox" />
                                            <input placeholder="answer" />
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )
                })}
            </div>

            <button onClick={addQuestion}>Add question</button>
        </div>
    )
}

export default home