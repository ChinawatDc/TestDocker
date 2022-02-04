const { Pool } = require('pg')

async function func(){
    const pool = new Pool({
    user: 'postgres',
    host: 'db',
    database: 'postgres',
    password: 'example'
    })
    const sql = 'INSERT INTO users(name) VALUES($1) '
    //const sql = 'SELECT * FROM users '
    const values = ['TA']
    
    pool.query(sql, values, (err, res) => {
    //pool.query('SELECT NOW()', (err, res) => {
        console.log(err, res)
        pool.end()
    })
}

func()