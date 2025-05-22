import express from "express";

const app : express.Express = express();

app.get('/', (req : express.Request, res : express.Response) => {
  res.send('Hello Typescript!');
  res.statusCode = 200;
})

app.listen(3000, ()=> {
  console.log("Server is listening on port 3000");
});
