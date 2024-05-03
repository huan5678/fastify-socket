import { CustomError } from "./custom-error";

// 定義一個 BadRequestError 類，表示 HTTP 400 錯誤。通常用於表示客戶端請求錯誤。
export class BadRequestError extends CustomError {
  constructor(message = "Bad Request", internalErrorNumber?: number) {
    super(message, 400, internalErrorNumber);
  }
}

// 定義一個 UnauthorizedError 類，表示 HTTP 401 錯誤。用於需要使用者認證的情況。
export class UnauthorizedError extends CustomError {
  constructor(message = "Unauthorized", internalErrorNumber?: number) {
    super(message, 401, internalErrorNumber);
  }
}

// 定義一個 ForbiddenError 類，表示 HTTP 403 錯誤。用於表示伺服器拒絕執行此請求。
export class ForbiddenError extends CustomError {
  constructor(message = "Forbidden", internalErrorNumber?: number) {
    super(message, 403, internalErrorNumber);
  }
}

// 定義一個 NotFoundError 類，表示 HTTP 404 錯誤。用於請求的資源不存在。
export class NotFoundError extends CustomError {
  constructor(message = "Not Found", internalErrorNumber?: number) {
    super(message, 404, internalErrorNumber);
  }
}

// 定義一個 InternalServerError 類，表示 HTTP 500 錯誤。用於伺服器內部錯誤。
export class InternalServerError extends CustomError {
  constructor(message = "Internal Server Error", internalErrorNumber?: number) {
    super(message, 500, internalErrorNumber);
  }
}

// 定義一個 BadGatewayError 類，表示 HTTP 502 錯誤。用於作為網關或代理工作的伺服器收到無效回應。
export class BadGatewayError extends CustomError {
  constructor(message = "Bad Gateway", internalErrorNumber?: number) {
    super(message, 502, internalErrorNumber);
  }
}

// 定義一個 ServiceUnavailableError 類，表示 HTTP 503 錯誤。用於伺服器暫不可用。
export class ServiceUnavailableError extends CustomError {
  constructor(message = "Service Unavailable", internalErrorNumber?: number) {
    super(message, 503, internalErrorNumber);
  }
}

// 定義一個 GatewayTimeoutError 類，表示 HTTP 504 錯誤。用於網關超時。
export class GatewayTimeoutError extends CustomError {
  constructor(message = "Gateway Timeout", internalErrorNumber?: number) {
    super(message, 504, internalErrorNumber);
  }
}

// 定義一個 NotImplementedError 類，表示 HTTP 501 錯誤。用於伺服器不支持請求的功能。
export class NotImplementedError extends CustomError {
  constructor(message = "Not Implemented", internalErrorNumber?: number) {
    super(message, 501, internalErrorNumber);
  }
}

// 定義一個 TooManyRequestsError 類，表示 HTTP 429 錯誤。用於客戶端發送的請求過多。
export class TooManyRequestsError extends CustomError {
  constructor(message = "Too Many Requests", internalErrorNumber?: number) {
    super(message, 429, internalErrorNumber);
  }
}
