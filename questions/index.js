import { Router } from "express";
import { showAllQuestions, saveQuestionAsync, showQuizQuestion, showQuizResults, checkAnswere, beginQuiz, removeQuestion } from "./controller.js";
import { get, getAll } from "./model.js";

const privateRouter = Router();
const publicRouter = Router();

privateRouter.get('/', async (req, res) => showAllQuestions(res));

privateRouter.post('/registerQuestion', async(req, res) => {

    var newQuenstion = req.body;

    await saveQuestionAsync(newQuenstion);

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(newQuenstion);
});

privateRouter.post('/findQuestion', async(req, res) => {

    var questionId = req.body.id;

    var question = await get(questionId);

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(question);
});

privateRouter.post('/editQuestion', async (req, res) => {

    var question = await get(req.fields.questionID);
    res.render('QuestionForm', {question: question});
});

privateRouter.delete('/removeQuestion', async (req, res) => {

    await removeQuestion(req, res);
});

publicRouter.get('/quiz/:questionIndex', async (req, res) => {
    
    var questionIndex = req.params.questionIndex;

    if(questionIndex == 0)
    {
        beginQuiz(res);
    }

    const questions = await getAll();
    
    if(questions.length > questionIndex)
    {
        var question = questions[questionIndex];
        showQuizQuestion(res, question, questionIndex);
    }
    else
    {
        showQuizResults(req, res);
    }
});

publicRouter.post('/checkQuiz/:questionIndex', async (req, res) => {
    
    const questions = await getAll();
    var questionIndex = parseInt(req.params.questionIndex);
    var question = questions[questionIndex];

    checkAnswere(req, res, question);
    
    var nextQuestionIndex = questionIndex + 1;
    res.redirect(`/questionsPublic/quiz/${nextQuestionIndex}`);
});

export { privateRouter, publicRouter };