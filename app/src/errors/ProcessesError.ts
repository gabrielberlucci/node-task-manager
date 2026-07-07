export class ProcessesInfoError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ProcessesInfoError';
    Error.captureStackTrace(this, this.constructor);
  }
}
