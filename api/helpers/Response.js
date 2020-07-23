class Response {
  constructor() {}

  getStatus() {
    return 200;
  }

  getData() {
    return undefined;
  }
  getPayload() {
    const response = {
      meta: { stauts: this.getStatus(), message: this.getMessage() }
    };
    if (!!this.getData()) response.data = this.getData();
    return response;
  }

  getMessage() {}

  send(res) {
    res.status(this.getStatus()).send(this.getPayload());
  }
}
module.exports = Response;
