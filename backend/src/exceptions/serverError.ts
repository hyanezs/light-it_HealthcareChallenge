class ServerError extends Error {
    constructor(message: string) {
      super(message);
      this.message = message;
    }
  }
  
  export default ServerError;
  