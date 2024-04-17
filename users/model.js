import sqlite from 'sqlite3';
import { sqlPath } from '../questions/consts.js';

const db = new sqlite.Database(sqlPath);

export function getUserById(query = {}) 
{
    return new Promise((resolve, reject) => {
        const queryElements = [];
        if (query) 
        {
            for (let key in query) 
            {
                queryElements.push(`${key} = ?`);
            }
        }

        const queryString = `SELECT id, username FROM users WHERE ${queryElements.join(' AND ')}`;

        db.get(queryString, Object.values(query), (error, results) => {
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