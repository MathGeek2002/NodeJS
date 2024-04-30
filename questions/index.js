import { Router } from "express";
import { showAllQuestions, saveQuestionAsync, showQuizQuestion, showQuizResults, checkAnswere, beginQuiz } from "./controller.js";
import { removeQuestion, get, getAll } from "./model.js";

const router = Router();

router.get('/', async (req, res) => showAllQuestions(res));

router.get('/new', async (req, res) => { 
    
    var newQuestion = {
        id: undefined,
        description: '',
        answerDescription1: '',
        answerValue1: '0',
        answerDescription2: '',
        answerValue2: '0',
        answerDescription3: '',
        answerValue3: '0'
    };
    res.render('QuestionForm', {question: newQuestion});
});

router.post('/fileupload', async (req, res) => {

    await saveQuestionAsync(req, res);
    
    res.redirect('/');
});

router.post('/editQuestion', async (req, res) => {

    var question = await get(req.fields.questionID);
    res.render('QuestionForm', {question: question});
});

router.post('/removeQuestion', async (req, res) => {

    removeQuestion(req.fields, req.files);

    var questionId = req.fields.questionID;
    var userId = req.user.id;
    res.cookie(`Deleted ${questionId}`, `Question with id: ${questionId} deleted by user with id: ${userId}`);

    res.redirect('/');
});

router.get('/quiz/:questionIndex', async (req, res) => {
    
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

router.post('/checkQuiz/:questionIndex', async (req, res) => {
    
    const questions = await getAll();
    var questionIndex = parseInt(req.params.questionIndex);
    var question = questions[questionIndex];

    checkAnswere(req, res, question);
    
    var nextQuestionIndex = questionIndex + 1;
    res.redirect(`/questions/quiz/${nextQuestionIndex}`);
});

export { router };