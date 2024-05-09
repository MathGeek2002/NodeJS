import * as fs from 'fs';
import { pictureParh } from '../consts.js'
import {  MongoClient } from 'mongodb';

let collection = null;

async function connect() 
{
  if (collection) 
  {
    return collection;
  }
  const client = new MongoClient('mongodb://localhost:27017');

  await client.connect();

  const db = client.db('DataBase');
  collection = db.collection('questions');

  return collection;
}

export async function getLastId() 
{
  var lastId = 0;
  const collection = await connect();
  var questions = await collection.find({}).sort( {"id": -1} ).toArray();

  if(questions.length > 0)
  {
    lastId = questions[0].id;
  }

  return lastId;
}

export async function getAll()
{
  const collection = await connect();
  const docs = await collection.find({});

  return docs.toArray();
}

export async function getQuestionsNumber()
{
  const questions = await getAll();

  return questions.length;
}

export async function get(uid) 
{
  var question = null;
  const collection = await connect();
  
  var query = {"id": parseInt(uid)};
  try
  {
    var questions = await collection.find(query).toArray();

    if(questions.length > 0)
    {
      question = questions[0];
    }
  }
  catch(error)
  {
    throw error;
  }
  
  return question;
}

export async function removeQuestion(fields, files)
{
    await remove(fields.questionID);

    fs.unlink(pictureParh + fields.questionID + '.png', function(error) {
      if(error) 
      {
          console.log("Error during file removeing: " + error);
          throw error;
      }
    });

    console.log(`Question with id ${fields.questionID} deleted successfully`);
}

async function remove(id) 
{
  const collection = await connect();
  var query = {"id": parseInt(id)};

  await collection.deleteOne(query);
}

export async function savePicture(fields, files, id)
{
    var oldpath = files.filetoupload.path;
    var newpath = pictureParh + id + '.png';
    
    fs.rename(oldpath, newpath, function (error) 
    {  
      if (error) 
      {
        console.log(`Error during file saveing: ${error}`);
        throw error;
      }
    });
    
    console.log(`Picture saved successfully at path: ${newpath}`);
};

export async function save(question)
{
    if (!question.id) 
    {
      question.id = await getLastId() + 1;
      question = await insert(question);
    }
    else 
    {
      question = await update(question);
    }

    return question;
}

async function insert(question) 
{
  const collection = await connect();
  const data = collection.insertOne(question);

  return data;
}

async function update(question) 
{
  const collection = await connect();
  var query = { "id": parseInt(question.id) };
  var updatedQuestion = await collection.updateOne(query, { $set: question });

  return updatedQuestion;
}
