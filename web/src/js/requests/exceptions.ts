import { AxiosResponse } from "axios";

export class FetchError extends Error {
  constructor(message:string = "Something wrong while making request."){
    super(message)
    this.name = "FetchError"
  }
}

export class FetchNoResponse extends FetchError {
  constructor(message:string = "No response."){
    super(message)
    this.name = "FetchNoResponse"
  }
}

export class FetchFailResponse extends FetchError {
  response: AxiosResponse;
  constructor(
    response: AxiosResponse,
    message: string = "Something went wrong."
  ) {
    super(message);
    this.response = response
    this.name = "FetchFailResponse"
  }
}

export class FetchAuthenticationError extends FetchFailResponse {
}

export class FetchIncorrectDataError extends FetchFailResponse {
}
