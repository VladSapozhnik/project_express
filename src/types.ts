import { Request } from "express";


export type RequestWithBody<T> = Request<{}, {}, T>
export type RequestWithQuery<T> =  Request<{}, {}, {}, T>
export type RequestWithParams<T> =  Request<T>
export type RequestWithParamsAndBody<T, T2> = Request<T, {}, T2>