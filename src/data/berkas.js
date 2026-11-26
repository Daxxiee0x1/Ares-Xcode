export const BERKAS_AWAL = [
  {
    nama: 'index.html',
    bahasa: 'html',
    ringkasan: 'Halaman beranda contoh untuk pratinjau langsung.',
    kode: `<!doctype html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Beranda</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <main class="card">
    <p class="tag">Ares Xcode</p>
    <h1>Halo, dunia!</h1>
    <p>Halaman contoh ini memakai style.css yang sama dengan halaman lain.</p>
    <p><a href="about.html">Tentang proyek ini →</a></p>
  </main>
</body>
</html>
`,
  },
  {
    nama: 'about.html',
    bahasa: 'html',
    ringkasan: 'Halaman sekunder yang berbagi lembar gaya yang sama.',
    kode: `<!doctype html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Tentang</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <main class="card">
    <p class="tag">Ares Xcode</p>
    <h1>Tentang proyek ini</h1>
    <p>Halaman ini memakai style.css yang sama dengan beranda.</p>
    <p><a href="index.html">← Kembali ke beranda</a></p>
  </main>
</body>
</html>
`,
  },
  {
    nama: 'style.css',
    bahasa: 'css',
    ringkasan: 'Token warna kertas, tinta, dan sinyal kuning untuk pratinjau.',
    kode: `:root {
  --kertas: #f6f3ea;
  --ink: #1c1b19;
  --sinyal: #ffc72c;
}

body {
  margin: 0;
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: var(--kertas);
  color: var(--ink);
  font-family: system-ui, sans-serif;
}

/* kartu utama */
.card {
  max-width: 32rem;
  margin: 1rem;
  padding: 2rem;
  border: 2px solid var(--ink);
  border-radius: 24px;
  background: #fff;
}

.tag {
  display: inline-block;
  margin: 0 0 1rem;
  padding: 0.2rem 0.8rem;
  background: var(--sinyal);
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 700;
}

a { color: inherit; }
`,
  },
]
