const http = require('http');
const EventEmitter = require('events');

function astro() {
  const routes = {};

  class Server extends EventEmitter {
    listen(port = 8080, cb) {
      http
        .createServer((req, res) => {
          const method = routes[req.method];
          if (method) {
            const route = routes[req.method][req.url];
            if (route) route.handler(req, res);
            else {
              const emit404 = this.emit('404', req, res);
              if (!emit404) {
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
    }
  }

  http.METHODS.forEach((method) => {
    routes[method] = {};
    Server.prototype[method.toLowerCase()] = function (url, cb) {
      routes[method][url] = { handler: cb };
    };
  });

  return new Server();
}

module.exports = astro;
