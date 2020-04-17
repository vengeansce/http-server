const http = require('http');

class Server {
  constructor() {
    this.on404 = null;
    this.routes = { GET: {} };

    http.METHODS.forEach((method) => {
      this.routes[method] = {};
      this[method.toLowerCase()] = (url, cb) => {
        this.routes[method][url] = { handler: cb };
      };
    });
  }

  listen(port = 8080, cb) {
    http
      .createServer((req, res) => {
        console.time();
        try {
          const route = this.routes[req.method][req.url];
          if (route) route.handler(req, res);
          else {
            if (typeof this.on404 == 'function') {
              this.on404(req, res);
            } else {
              res.end('404 Not Found');
            }
          }
        } catch (err) {
          res.end(
            `${
              req.method + req.url
            }\nOps sory, server doesn't support this http method.`
          );
        }
        console.timeEnd();
      })
      .listen(port);

    if (typeof cb == 'function') cb();
  }
}

const app = new Server();
const port = 8000;

app.get('/', (req, res) => {
  res.end('Home');
});

app.on404 = (req, res) => {
  res.end('Ops, 404 Halaman Tidak Ditemukan');
};

app.listen(port, () =>
  console.log(`App listening at http://localhost:${port}`)
);
