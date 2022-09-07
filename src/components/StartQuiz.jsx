import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button, Container } from "react-bootstrap";
export default function StartQuiz() {
    const { category, limit } = useParams();
    const [actualQuestion, setActualQuestion] = useState(0);
    const [questions, setQuestions] = useState([]);
    const [btnColor, setBtnColor] = useState("warning");
    const [btnDisabled, setBtnDisabled] = useState();
    const [btnNextDisabled, setBtnNextDisabled] = useState(true);
    const [quizEnd, setQuizEnd] = useState(false);
    const [score, setScore] = useState(0);

    useEffect(() => {
        fetch(`/api/v1/questions?category=${category}&limit=${limit}`)
            .then((res) => res.json())
            .then((data) => setQuestions(data));
    }, []);

    return (
        <Container className="text-center">
            <h1 className="mt-4 mb-4">{category.toUpperCase()}</h1>
            <h2>
                Pregunta {actualQuestion + 1} de {questions.length}
            </h2>
            <h2 className="mb-5">
                Puntuación: {score} de {questions.length}
            </h2>

            <div className="mt-5 mb-5">
                {questions.map((question, index) => {
                    if (index == actualQuestion) {
                        return (
                            <>
                                <h1 className="text-center text-break mb-4">
                                    {question.question}
                                </h1>

                                {Object.keys(question.answers).map((key) => {
                                    const value = question.answers[key];

                                    return (
                                        <div className="d-grid mb-2">
                                            <Button
                                                variant={btnColor}
                                                disabled={btnDisabled}
                                                className="mt-4"
                                                size="lg"
                                                onClick={(e) => {
                                                    if (
                                                        key ===
                                                        question.correct_answer
                                                    ) {
                                                        setBtnColor("success");
                                                        setBtnDisabled(true);
                                                        setScore(score + 1);
                                                    } else {
                                                        setBtnColor("danger");
                                                        setBtnDisabled(true);
                                                    }
                                                    setBtnNextDisabled(false);
                                                }}
                                            >
                                                {value}
                                            </Button>
                                        </div>
                                    );
                                })}
                            </>
                        );
                    }
                })}
            </div>
            <div>
                {quizEnd ? (
                    <Link to={`/scoreQuiz/${score}`}>
                        <Button disabled={btnNextDisabled}>
                            Ver puntuación
                        </Button>
                    </Link>
                ) : (
                    <Button
                        disabled={btnNextDisabled}
                        onClick={() => {
                            setActualQuestion(actualQuestion + 1);
                            setBtnDisabled(false);
                            setBtnColor("warning");
                            setBtnNextDisabled(true);
                            if (actualQuestion == questions.length - 2) {
                                setQuizEnd(true);
                            }
                        }}
                    >
                        SIGUIENTE
                    </Button>
                )}
            </div>
        </Container>
    );
}