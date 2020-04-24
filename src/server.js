const http = require('http');
const EventEmitter = require('events');
const qs = require('querystring');

const defaultParams = { baseURL: '' };

function astro(config = defaultParams) {
  const routes = {};

  class Server extends EventEmitter {
    listen(port = 8080, cb) {
      http
        .createServer((req, res) => {
          const method = routes[req.method];
          if (method) {
            const route = method[req.url];
            if (route) {
              let body = [];

              req.on('data', (chunk) => {
                body.push(chunk);
              });

              req.on('end', () => {
                req.body = qs.parse(Buffer.concat(body).toString());
                route.handler(req, _res(res));
              });
            } else {
              res.statusCode = 404;
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
      routes[method][config.baseURL + url] = { handler: cb };
    };
  });

  return new Server();
}

const _res = (res) => ({
  ...res,
  send(data, config) {
    if (typeof data == 'object') {
      let body;
      if (data instanceof Error) {
        body = {
          message: data.message || http.STATUS_CODES[400],
          code: 400,
          status: 'error',
          result: null,
        };
      } else {
        body = { message: null, code: 200, status: 'ok', result: data };
      }
      body = { ...body, ...config };
      res.writeHead(body.code, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(body));
    } else {
      res.end(data);
    }
    return res;
  },
});

module.exports = astro;
