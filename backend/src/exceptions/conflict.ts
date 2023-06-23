class ConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.message = message;
  }
}

export default ConflictError;
