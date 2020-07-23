const Response = require("./Response");
class ErrorResponse extends Response {
  constructor(status, msg) {
    super();
    this.status = status;
    this.msg = msg;
  }

  getStatus() {
    return this.status;
  }

  getMessage() {
    return this.msg;
  }
}

module.exports = ErrorResponse;
