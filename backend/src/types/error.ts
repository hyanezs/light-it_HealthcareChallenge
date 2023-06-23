enum ErrorStatusCodes {
  OK = 200,

  BAD_REQUEST = 400,

  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  CONFLICT = 409,
  NOT_FOUND = 404,

  SERVER_ERROR = 500,
}

type Error = {
  message: string;
  type: ErrorStatusCodes | undefined;
  stack?: any;
  sqlMessage?: any;
  name: string;
};

export { ErrorStatusCodes, type Error };
