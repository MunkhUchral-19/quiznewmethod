"use client"
import { useEffect, useState } from "react"
import { supabase } from "../../../lib/client"
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const history = () => {
    const router = useRouter();
    const [history, setHistory] = useState([])

    useEffect(() => {
        const getScore = async () => {
            const response = await supabase.from("quiz_attempts").select("*, quiz2(*)")
            setHistory(response.data)
        }

        getScore();
    }, [])
    console.log(history)
    const groupedHistory = history.reduce((groups, item) => {
        const quizId = item.quizId;

        if (!groups[quizId]) {
            groups[quizId] = [];
        }

        groups[quizId].push(item);

        return groups;
    }, {});



    return (
        <div className="min-h-screen bg-muted/30 p-6 md:p-10">
            <div className="mx-auto max-w-5xl space-y-8">
                <Button
                    variant="outline"
                    onClick={() => router.push("/quiz")}
                >
                    <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
                    Back to quizzes
                </Button>

                {/* Page header */}
                <div>
                    <Badge variant="secondary" className="mb-3">
                        Your activity
                    </Badge>

                    <h1 className="text-3xl font-bold tracking-tight">
                        Quiz History
                    </h1>

                    <p className="mt-2 text-sm text-muted-foreground">
                        Review your scores and track your progress over time.
                    </p>
                </div>

                {/* Summary */}
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-xl border bg-background p-5">
                        <p className="text-sm text-muted-foreground">
                            Quizzes completed
                        </p>
                        <p className="mt-2 text-3xl font-bold">
                            {Object.keys(groupedHistory).length}
                        </p>
                    </div>

                    <div className="rounded-xl border bg-background p-5">
                        <p className="text-sm text-muted-foreground">
                            Total attempts
                        </p>
                        <p className="mt-2 text-3xl font-bold">
                            {history.length}
                        </p>
                    </div>
                </div>

                {/* History list */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">
                        Your quizzes
                    </h2>

                    {Object.entries(groupedHistory).length === 0 ? (
                        <div className="rounded-xl border border-dashed bg-background p-10 text-center">
                            <h3 className="font-semibold">
                                No quiz history yet
                            </h3>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Your completed quizzes will appear here.
                            </p>
                        </div>
                    ) : (
                        Object.entries(groupedHistory).map(
                            ([quizId, attempts]) => (
                                <div
                                    key={quizId}
                                    className="overflow-hidden rounded-xl border bg-background shadow-sm"
                                >
                                    {/* Quiz heading */}
                                    <div className="flex flex-wrap items-center justify-between gap-3 p-5">
                                        <div>
                                            <h3 className="text-lg font-semibold">
                                                {attempts[0].quiz2?.quizName ||
                                                    `Quiz ${quizId}`}
                                            </h3>

                                            <p className="mt-1 text-sm text-muted-foreground">
                                                {attempts.length}{" "}
                                                {attempts.length === 1
                                                    ? "attempt"
                                                    : "attempts"}
                                            </p>
                                        </div>

                                        <Badge variant="outline">
                                            {attempts.length}{" "}
                                            {attempts.length === 1
                                                ? "Attempt"
                                                : "Attempts"}
                                        </Badge>
                                    </div>

                                    <Separator />

                                    {/* Attempts */}
                                    <div className="flex gap-4 overflow-x-auto p-5">
                                        {attempts.map((item, index) => {
                                            const score = Number(item.score) || 0;
                                            const total = Number(item.totalScore) || 0;

                                            const percentage =
                                                total > 0
                                                    ? Math.min(
                                                        100,
                                                        Math.max(
                                                            0,
                                                            (score / total) * 100
                                                        )
                                                    )
                                                    : 0;

                                            return (
                                                <div
                                                    key={item.id}
                                                    className="min-w-[220px] flex-1 rounded-lg border p-4 transition-colors hover:bg-muted/40"
                                                >
                                                    <div className="flex items-center justify-between gap-2">
                                                        <p className="text-sm font-medium">
                                                            Attempt {index + 1}
                                                        </p>

                                                        <Badge
                                                            variant={
                                                                percentage >= 80
                                                                    ? "default"
                                                                    : "secondary"
                                                            }
                                                        >
                                                            {Math.round(percentage)}%
                                                        </Badge>
                                                    </div>

                                                    <div className="my-4">
                                                        <p className="text-sm text-muted-foreground">
                                                            Score
                                                        </p>

                                                        <p className="mt-1 text-2xl font-bold">
                                                            {item.score}
                                                            <span className="ml-1 text-sm font-normal text-muted-foreground">
                                                                / {item.totalScore}
                                                            </span>
                                                        </p>
                                                    </div>

                                                    <Progress
                                                        value={percentage}
                                                        className="h-2"
                                                    />
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )
                        )
                    )}
                </div>
            </div>
        </div>
    );


}

export default history