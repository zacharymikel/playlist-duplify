export default class Error {
  status;
  message;

  constructor(status, message) {
    this.status = status;
    this.message = message; 
  }
}