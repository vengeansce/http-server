const http = require('http');

function Server() {
  this.routes = [];
  this.notFound = null;
}

Server.prototype.get = function (url, cb) {
  this.routes.push({ url, method: 'GET', handler: cb });
};

Server.prototype.listen = function (port = 8080) {
  http
    .createServer((req, res) => {
      console.time('Transaction');
      // Atau routesnya object biar lebih cepat
      const route = this.routes.find(
        (route) => req.method == route.method && req.url == route.url
      );
      if (route) {
        route.handler(req, res);
      } else {
        if (typeof this.notFound == 'function') {
          this.notFound(req, res);
        } else {
          res.end('404 Not Found');
        }
      }
      console.timeEnd('Transaction');
    })
    .listen(port);
  console.log(`App listening at http://localhost:${port}`);
};

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
