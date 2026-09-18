import {NextFunction, Request, Response} from "express";
import httpStatus from "http-status";

import './App.css'

function App() {

  return (
    <>

   NOTE: {/* [eta akta prisma file er code...sob error/red mark gula ignore....just see ur logic/core code] */}




    {/* catchAsync */}
    {/* kibabe  prisma te backend e catchAsync e use kore  tar code */}
    {/* 1.eta prisma te akta src/app ba src er vitore utiles folder baniye ba onno jekono folder banano nijer sobider te */}
    {/* 2.eta controller e use korte hoy
     1.const register/login = catchAsync(async(req:reqest , res:response, next:nextFunction)=>{
      er vitore nicher code dite hbe 
      })
    */}
  export const catchAsync = (fn: Function) => {
    return async (req: Request, res: Response, next: NextFunction) => {
    try {
        await fn(req, res, next);
    } catch (error) {
        console.log(error);
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Failed to user Register",
      error: (error as Error).message,
      });
    }
  };
};


   {/* 2nd send Response  */}
   {/* kibabe  prisma te backend e sendResponse e use kore  tar code */}
    {/* 1.eta prisma te akta src/app ba src er vitore utiles folder baniye ba onno jekono folder banano nijer sobider te */}
    {/* 2.eta controller e use korte hoy sendResponse e 
     1.const register/login = catchAsync(async(req:reqest , res:response, next:nextFunction)=>{
      ........etc
      sendResponse(res,{
         success: true,
    statusCode: httpsStatus.created,
    message:"sadlfdsaljfjoofd/message je name dite paro",
    data: {
    user/patient/other je name payload dow
    },
    meta: data.meta, //option hisebe jei jaigai use korte hobe oi jaigai sudu response e call diba
      })
      })
    */}

type TMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

type TResponse<T> = {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta?: TMeta;
};

export const sendResponse = <T>(res: Response, data: TResponse<>) => {
  res.status(data.statusCode).json({
    success: data.success,
    statusCode: data.statusCode,
    message: data.message,
    data: data.data,
    meta: data.meta,
  });
};


{/* globalErrorHandleing */}
   {/* 1.eta prisma te akta src/app ba src er vitore middleWare folder baniye ba onno jekono folder banano nijer sobider te */}
  {/* eta sudu prisma te src/app.ts file dite hobe */}
  {/* app.use(globalErrorHandler) */}
  {/* 
  //tum jei file e catchAsync ase sekane... global error handling use korle catch er vitore nicher deya field gula comment korte hobe
  export const catchAsync = (fn: RequestHandler) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await fn(req, res, next);
        } catch (error) {
            // console.log(error);

            // res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            //     success: false,
            //     statusCode: httpStatus.INTERNAL_SERVER_ERROR,
            //     message: "Failed to register user",
            //     error: (error as Error).message
            // })

            next(error)
        }
    }
}
  */}
  import { NextFunction, Request, Response } from 'express';
import httpStatus from "http-status";
import { Prisma } from '../../generated/prisma/client';
import config from '../config';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const globalErrorHandler = async (
    err: any,
    _req: Request,
    res: Response,
    _next: NextFunction,
) => {
    if (config.node_env === 'development') {
        console.log('Error from Global Error Handler', err)
    }

    let statusCode : number = httpStatus.INTERNAL_SERVER_ERROR;
    let errorMessage = err.message || "Internal Server Error";
    let errorName = err.name || "Internal Server Error";
    // let errorDetails = err.stack

    if (err instanceof Prisma.PrismaClientValidationError) {
        statusCode = httpStatus.BAD_REQUEST;
        errorMessage = "You have provided incorrect field type or missing fields"
    } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
            statusCode = httpStatus.BAD_REQUEST,
                errorMessage = "Duplicate Key Error"
        } else if (err.code === "P2003") {
            statusCode = httpStatus.BAD_REQUEST,
                errorMessage = "Foreign key constraint failed"
        } else if (err.code === "P2025") {
            statusCode = httpStatus.BAD_REQUEST,
                errorMessage = "An operation failed because it depends on one or more records that were required but not found."
        }
    } else if (err instanceof Prisma.PrismaClientInitializationError) {
        if (err.errorCode === "P1000") {
            statusCode = httpStatus.UNAUTHORIZED;
            errorMessage = "Authentication failed against database server. Please Check Your Credentials"
        } else if (err.errorCode === "P1001") {
            statusCode = httpStatus.BAD_REQUEST;
            errorMessage = "Can't reach database server"
        }
    } else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
        statusCode = httpStatus.INTERNAL_SERVER_ERROR;
        errorMessage = "Error occurred during query execution"
    } else if (err instanceof Error) {
        errorMessage = err.message
    }

    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        statusCode: statusCode || httpStatus.INTERNAL_SERVER_ERROR,
        name: config.node_env === 'development' ? errorName : "Internal Server Error",
        message: config.node_env === 'development' ? errorMessage : "Internal Server Error",
        error: config.node_env === 'development' ? err : undefined,
        stack: config.node_env  === 'development' ? err.stack : undefined,
    })
}

{/* notFound */}
    {/* 1.eta prisma te akta src/app ba src er vitore middleWare folder baniye ba onno jekono folder banano nijer sobider te */}  
      {/* app.use(notFound) */}
     import { Request, Response } from "express"
import httpStatus from "http-status"

export const notFound = (req: Request, res: Response) => {
    res.status(httpStatus.NOT_FOUND).json({
        message: "Route not found",
        path: req.originalUrl,
        date: new Date()
    })
}



{/* BKASH IMPLEMENT */}
 {/* bkash er kiso jinish create execute other kaj korer jonno nicher jinish gula lagbei eta prisma te lib/bkash.ts file kule add korte hobe */}

 import config from "../config";
import { redisClient } from "./redis";

export const getBkashIdToken = async () => {
  try {
    const IdTokenKey = "bkash:idToken";
    const RefreshTokenKey = "bkash:refreshToken";

    let bkashIdToken = await redisClient.get(IdTokenKey);
    const bkashIdTokenTTL = await redisClient.ttl(IdTokenKey);

    const bkashRefreshToken = await redisClient.get(RefreshTokenKey);
    const bkashRefreshTokenTTL = await redisClient.ttl(RefreshTokenKey);

    // console.log({
    //     bkashIdToken,
    //     bkashIdTokenTTL,
    //     bkashRefreshToken,
    //     bkashRefreshTokenTTL
    // });

    //bkash id token remaining time is less than equal 10 minutes or bkash id is expired
    // bkash refresh token must exist
    // bkash refresh token remaining time is more than 10 minutes
    if (
      (bkashIdTokenTTL <= 600 || !bkashIdToken) &&
      bkashRefreshToken &&
      bkashRefreshTokenTTL > 600
    ) {
      const refreshTokenResponse = await fetch(
        `${config.bkash_base_url}/tokenized/checkout/token/refresh`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            username: config.bkash_username,
            password: config.bkash_password,
          },
          body: JSON.stringify({
            app_key: config.bkash_app_key,
            app_secret: config.bkash_app_secret,
            refresh_token: bkashRefreshToken,
          }),
        },
      );
      if (!refreshTokenResponse.ok) {
        throw new Error("Bkash Access Token Grant Failed");
      }

      const bkashRefreshTokenResult = await refreshTokenResponse.json();

      bkashIdToken = bkashRefreshTokenResult.id_token as string;

      await redisClient.set(IdTokenKey, bkashIdToken, {
        expiration: {
          type: "EX",
          value: 60 * 60,
        },
      });

      return bkashIdToken;
    }

    if (bkashIdTokenTTL > 600) {
      return bkashIdToken;
    }

    const response = await fetch(
      `${config.bkash_base_url}/tokenized/checkout/token/grant`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          username: config.bkash_username,
          password: config.bkash_password,
        },
        body: JSON.stringify({
          app_key: config.bkash_app_key,
          app_secret: config.bkash_app_secret,
        }),
      },
    );

    if (!response.ok) {
      throw new Error("Bkash Access Token Grant Failed");
    }

    const result = await response.json();

    //bkash id token set
    await redisClient.set(IdTokenKey, result.id_token, {
      expiration: {
        type: "EX",
        value: 60 * 60, // 1hour
      },
    });

    //bkash refresh token set
    await redisClient.set(RefreshTokenKey, result.refresh_token, {
      expiration: {
        type: "EX",
        value: 60 * 60 * 24 * 28, // 28 days
      },
    });

    bkashIdToken = result.id_token;

    return bkashIdToken;
  } catch (error: any) {
    throw new Error(error.message);
  }
};


    </>
  )
}

export default App
