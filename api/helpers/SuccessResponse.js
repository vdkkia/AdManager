const Response = require("./Response");
class SuccessResponse extends Response {
  constructor(msg, data) {
    super();
    this.data = data;
    this.msg = msg;
  }
  getMessage() {
    return this.msg;
  }

  getData() {
    return this.data;
  }
}

module.exports = SuccessResponse;
