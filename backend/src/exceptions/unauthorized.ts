class UnauthorizedError extends Error {
  constructor(message?: string) {
    super(message);
    this.message = message ?? 'Unauthorized: Invalid token';
  }
}

export default UnauthorizedError;
