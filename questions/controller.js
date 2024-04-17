import { getAll, save, savePicture, getLastId as getLastQuestion } from "./model.js";

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
