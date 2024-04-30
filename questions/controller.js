import { quizResultCookie } from "../consts.js";
import { getAll, save, savePicture, getLastId as getLastQuestion, getQuestionsNumber } from "./model.js";

export async function showAllQuestions(res)
{
    const questions = await getAll();
    res.render('QuestionsList', {questions: questions});
}

export async function saveQuestionAsync(req, res)
{
    var questionId = parseInt(req.fields.id);

    const question = {
        id: questionId,
        description: req.fields.question,
        answreDescription1: req.fields.description1,
        answreValue1: req.fields.answer1,
        answreDescription2: req.fields.description2,
        answreValue2: req.fields.answer2,
        answreDescription3: req.fields.description3,
        answreValue3: req.fields.answer3
    };

    await save(question);

    var userId = req.user.id;
    if(!questionId)
    {
        var newQuestion = await getLastQuestion();
        questionId = newQuestion.id;
        res.cookie(`Created ${questionId}`, `Question with id ${questionId} was created by user with id: ${userId}`);
    }
    else
    {
        res.cookie(`Edited ${questionId}`, `Question with id ${questionId} was changed by user with id: ${userId}`);
    }

    await savePicture(req.fields, req.files, questionId); 
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
    
    console.log(`quiz results = ${result} / ${questionsNumber}`);
    res.render('QuizResults', {result: result, questionsNumber: questionsNumber});
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