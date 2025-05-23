import app from "./app";

const PORT = process.env.POST || 4000;

app.listen(PORT, () => {
  console.log(`Server is listening on port : ${PORT}`);
  console.log("🚀 Jenkins 자동 배포 테스트용 로그!");
});
