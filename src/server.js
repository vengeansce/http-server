const http = require('http');

function Server() {
  this.on404 = null;
  this.routes = {};
  http.METHODS.forEach((method) => {
    this.routes[method] = {};
  });
}

http.METHODS.forEach((method) => {
  Server.prototype[method.toLowerCase()] = function (url, cb) {
    this.routes[method][url] = { handler: cb };
  };
});

Server.prototype.listen = function (port = 8080, cb) {
  http
    .createServer((req, res) => {
      const method = this.routes[req.method];
      if (method) {
        const route = this.routes[req.method][req.url];
        if (route) route.handler(req, res);
        else {
          if (typeof this.on404 == 'function') {
            this.on404(req, res);
          } else {
            res.end('404 Not Found');
          }
        }
      } else {
        res.end(
          `${
            req.method + req.url
          }\nOps sory, server doesn't support this http method.`
        );
      }
    })
    .listen(port);

  if (typeof cb == 'function') cb();
};

module.exports = Server;
