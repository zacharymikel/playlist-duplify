export default class Error {
  status: any;
  message: string;

  constructor(status: number, message: string) {
    this.status = status;
    this.message = message; 
  }
}