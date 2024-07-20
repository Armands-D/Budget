import { ApiError } from "../data_types/MainApi";
import express, { Request, Response, Application} from 'express';

export function sendApiError(res: Response, api_error: ApiError){
  console.log(api_error)
  res.status(api_error.status)
    .send(api_error)
}
