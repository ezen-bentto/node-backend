import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";

export const registerMiddlewares = (app: express.Application) => {
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(morgan("dev"));
};
