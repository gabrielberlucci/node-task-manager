export class HardwareInfoError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'HardwareInfoError';
    Error.captureStackTrace(this, this.constructor);
  }
}
