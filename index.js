const http = require('http');

class Server {
  constructor() {
    this.routes = { GET: {} };
    this.notFound = null;
  }

  get(url, cb) {
    this.routes.GET[url] = { handler: cb };
  }

  listen(port = 8080) {
    http
      .createServer((req, res) => {
        console.time();
        try {
          const route = this.routes[req.method][req.url];
          if (route) {
            route.handler(req, res);
          } else {
            if (typeof this.notFound == 'function') {
              this.notFound(req, res);
            } else {
              res.end('404 Not Found');
            }
          }
        } catch (err) {
          res.end(
            `${
              req.method + req.url
            }\nOps, something error may server doesnt support this http method.`
          );
        }
        console.timeEnd();
      })
      .listen(port);
    console.log(`App listening at http://localhost:${port}`);
  }
}

const app = new Server();

app.get('/', (req, res) => {
  res.end('Home');
});

app.get('/dashboard', (req, res) => {
  res.end('Dashboard');
});

app.notFound = (req, res) => {
  res.end('Ops, 404 Halaman Tidak Ditemukan');
};

app.listen();
