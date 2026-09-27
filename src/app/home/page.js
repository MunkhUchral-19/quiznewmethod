"use client"
import { useState } from "react"
import { supabase } from "../../../lib/client"
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
        const { response } = await supabase.from("quiz2").insert({ "quizName": quiz }).select("*").single();

        const quizId = response.data.id;

        for (let i = 0; i < questions.length; i++) {

        }


        console.log(response)
        setQuiz("")
        alert("Successuly created")
    }

    console.log(questions)

    return (
        <div>
            <input
                placeholder="Quiz name"
                onChange={(e) => handleQuizName(e)}
                value={quiz}
            />

            <button onClick={createQuiz}>Create Quiz</button>


            <div>
                {questions.map((question, questionIndex) => {
                    return (
                        <div key={questionIndex}>
                            <input placeholder="questions"
                                value={question.question}
                                onChange={(e) => handleQuestion(e.target.value, 'question', questionIndex)}
                            />

                            <input placeholder="point"
                                min={0}
                                onChange={(event) => handleQuestion(Number(event.target.value), "point", questionIndex)}
                            />

                            <div>
                                {question.answers.map((answer, answerIndex) => {
                                    return (
                                        <div key={answerIndex}>
                                            <input type="checkbox" onChange={(e) => handleQuestion(answerIndex, "correctIndex", questionIndex)} />
                                            <input placeholder="answer" value={answer} onChange={(e) => handleAnswers(questionIndex, answerIndex, e.target.value)} />
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