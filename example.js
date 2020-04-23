const astro = require('./src/server');

const app = astro();
const port = 8000;

app.get('/', (req, res) => {
  res.end('Home');
});

app.on('404', (req, res) => {
  res.end('Ops, 404 Halaman Tidak Ditemukan');
});

app.listen(port, () =>
  console.log(`App listening at http://localhost:${port}`)
);
