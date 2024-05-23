import {pictureParh, sqlPath} from '../consts.js'
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

export async function getQuestionsNumber()
{
  const questions = await getAll();

  return questions.length;
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

export async function remove(id) 
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
      columns += 'answerDescription3, answerValue3, ';
      columns += "picture";
      
      const query = `INSERT INTO questions (${columns}) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

      db.run(query, [
                      question.description, 
                      question.answerDescription1, question.answerValue1, 
                      question.answerDescription2, question.answerValue2, 
                      question.answerDescription3, question.answerValue3,
                      question.picture
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
                    answerDescription3 = ?, answerValue3 = ?, \
                    picture = ? \
                    WHERE id = ? \
                    ';

      db.run(query, [
                    question.description, 
                    question.answerDescription1, question.answerValue1, 
                    question.answerDescription2, question.answerValue2, 
                    question.answerDescription3, question.answerValue3,
                    question.picture,
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
