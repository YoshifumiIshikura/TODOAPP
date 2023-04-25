import express from "express";
import mysql  from "mysql2/promise"

const PORT: number = 8080;
const app = express();
app.use(express.json());
const pool = mysql.createPool({
    host: 'db',
    user: 'root',
    password: 'root',
    database: 'practice',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

app.listen(PORT, ():void => {
    console.log(`Start on port ${PORT}.`);
});

app.get("/", async (req: express.Request, res: express.Response) => {
    try {
        console.log('before');
        await pool.execute('DO SLEEP(10)');
        console.log('after');
        res.send('Hello world');
    } catch(err:any) {
        res.send(err.message);
    }
});


app.get("/todos",async (req:express.Request, res: express.Response) => {
    try {
        const [results]: any = await pool.execute(`SELECT * FROM todos`);
        res.send(results);
        
    } catch(err: any)  {
        res.send(err);
    }
})

//bodyにあるtodoを登録する
app.post("/todos/create", async (req: express.Request, res: express.Response) => {
  try {
    const {title} = req.body;
    const [results]: any = await pool.execute(`INSERT INTO todos (title) VALUES('${title}')`);
    res.json({
        status: 201,
        message: "success create todo!",
        id: results["insertId"],
        title: title,
    })
  } catch (err: any) {
    res.json({
        status: 400,
        error: err.message,
    })
  }
});

//完了済みのidのstateを1にする　※完了していないタスクは0
app.post("/todos/:id/done",async (req:express.Request, res: express.Response) => {
    try {
        const id = req.params.id;
        console.log(id);
        const [results] = await pool.execute(`UPDATE todos SET state = true WHERE id = ${id}`);
        console.log(results);
        res.json({
            results
        })
    } catch(err: any) {
        res.json({
            status: 404,
            error: err.message
        })
    }
    
})

process.on('SIGINT', () => {
    pool.end();
    console.log('Connection pool closed');
    process.exit(0);
});
