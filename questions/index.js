import { Router } from "express";
import { showAllQuestions, saveQuestionAsync } from "./controller.js";
import { removeQuestion, get } from "./model.js";

const router = Router();

router.get('/', async (req, res) => showAllQuestions(res));

router.get('/new', async (req, res) => { 
    
    var question = {
        id: undefined,
        description: '',
        answerDescription1: '',
        answerValue1: '0',
        answerDescription2: '',
        answerValue2: '0',
        answerDescription3: '',
        answerValue3: '0'
    };
    res.render('QuestionForm', {question: question});
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

export { router };