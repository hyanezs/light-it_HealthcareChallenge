class ForbiddenError extends Error {
  constructor(message?: string) {
    super(message);
    this.message = message ?? 'Forbidden access';
  }
}

export default ForbiddenError;
