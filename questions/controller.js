import { quizResultCookie } from "../consts.js";
import { getAll, save, getQuestionsNumber, remove } from "./model.js";

export async function showAllQuestions(res)
{
    const questions = await getAll();
    res.render('QuestionsList', {questions: questions});
}

export async function saveQuestionAsync(question)
{
    await save(question);
}

export async function removeQuestion(req, res)
{
    var questionId = parseInt(req.body.id);
    await remove(questionId);

    var userId = req.user.id;
    res.cookie(`Deleted ${questionId}`, `Question with id: ${questionId} deleted by user with id: ${userId}`);

    res.status(200).send('sucessfuly removed');
}

export async function beginQuiz(res)
{
    res.cookie(quizResultCookie, '0');
}

export async function showQuizQuestion(res, currentQuestion, currentQuestionIndex)
{
    res.render('QuizForm', {question: currentQuestion, questionIndex: currentQuestionIndex});
}

export async function showQuizResults(req, res)
{
    var questionsNumber = await getQuestionsNumber();
    var result = parseInt(req.cookies.quizResultCookie, 0);
    var percentage = Math.floor(result * 100 / questionsNumber); 

    console.log(`quiz results = ${percentage}%`);
    res.render('QuizResults', {result: result, questionsNumber: questionsNumber, percentage: percentage});
}

export async function checkAnswere(req, res, question)
{
    var answreValue1 = req.fields.answer1;
    var answreValue2 = req.fields.answer2;
    var answreValue3 = req.fields.answer3;

    var firstCorrect = question.answerValue1 === answreValue1;
    var secondCorrect = question.answerValue2 === answreValue2;
    var thirdCorrect = question.answerValue3 === answreValue3;   

    var correctAnswere = firstCorrect && secondCorrect && thirdCorrect;

    if(correctAnswere)
    {
        var currentResult = parseInt(req.cookies.quizResultCookie, 0);
        currentResult++;

        res.cookie(quizResultCookie, currentResult.toString());
    }
}