import * as fs from 'fs';
import {pictureParh, sqlPath} from './consts.js'
import  sqlite  from 'sqlite3';

const db = new sqlite.Database(sqlPath);

export async function getLastId() {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM questions WHERE id = (SELECT MAX(id) FROM questions)';
      db.get(query, (error, results) => 
      {
        if (error) 
        {
          reject(error);
        } 
        else 
        {
          resolve(results);
        }
      });
    });
  }

export async function getAll()
{
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM questions';
        db.all(query, (error, results) => {
            if (error) 
            {
                console.log("Error: ", error);
                reject(error);
            }
            else 
            {
                resolve(results);
            }
        });
      });
}

export async function get(id) 
{
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM questions WHERE id = ?';
      db.get(query, [id], (error, results) => {
        if (error) 
        {
            console.log("Error: ", error);
            reject(error);
        } 
        else 
        {
          resolve(results);
        }
      });
    });
}


export async function removeQuestion(fields, files)
{
    remove(fields.questionID);

    fs.unlink(pictureParh + fields.questionID + '.png', function(error){
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
  return new Promise((resolve, reject) => {
        const query = 'DELETE FROM questions WHERE id = ?';
        db.run(query, [id], (error, results) => {
        if (error)
        {
            reject(error);
        } 
        else 
        {
            resolve(results);
        }
    });
  });
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
      insert(question);
    }
    else 
    {
      update(question);
    }

    return question;
}

async function insert(question) 
{
  return new Promise((resolve, reject) => {

      var columns = 'description, ';
      columns += 'answerDescription1, answerValue1, ';
      columns += 'answerDescription2, answerValue2, '; 
      columns += 'answerDescription3, answerValue3';
      
      const query = `INSERT INTO questions (${columns}) VALUES (?, ?, ?, ?, ?, ?, ?)`;

      db.run(query, [
                      question.description, 
                      question.answreDescription1, question.answreValue1, 
                      question.answreDescription2, question.answreValue2, 
                      question.answreDescription3, question.answreValue3
                    ], function (error, results) {
                      if (error) 
                      {
                          reject(error);
                      } 
                      else 
                      {
                          resolve(results);
                      }
                  });
  });
}

async function update(question) 
{
    return new Promise((resolve, reject) => {
      const query = 'UPDATE questions SET description = ?, \
                    answerDescription1 = ?, answerValue1 = ?, \
                    answerDescription2 = ?, answerValue2 = ?, \
                    answerDescription3 = ?, answerValue3 = ? \
                    WHERE id = ? \
                    ';

      db.run(query, [
                    question.description, 
                    question.answreDescription1, question.answreValue1, 
                    question.answreDescription2, question.answreValue2, 
                    question.answreDescription3, question.answreValue3,
                    question.id
                  ], (error, results) => {
                      if (error) 
                      {
                        reject(error);
                      } 
                      else 
                      {
                        resolve(results);
                      }
                 });
    });
}
