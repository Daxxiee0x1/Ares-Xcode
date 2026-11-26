export const KONTRIBUTOR_LIST = [
  { id: 1, namaPanggilan: 'Budi', namaLengkap: 'Budi Santoso', peran: 'Frontend', inisial: 'BS' },
  { id: 2, namaPanggilan: 'Siti', namaLengkap: 'Siti Rahmawati', peran: 'Desain UI', inisial: 'SR' },
  { id: 3, namaPanggilan: 'Agus', namaLengkap: 'Agus Wijaya', peran: 'Pengujian', inisial: 'AW' },
  { id: 4, namaPanggilan: 'Dewi', namaLengkap: 'Dewi Lestari', peran: 'Dokumentasi', inisial: 'DL' },
  { id: 5, namaPanggilan: 'Rizky', namaLengkap: 'Rizky Pratama', peran: 'Infrastruktur', inisial: 'RP' },
]

export const PINTASAN_LIST = [
  {
    tombol: ['Ctrl', 'K'],
    mac: ['Cmd', 'K'],
    aksi: 'Buka palet perintah',
    cakupan: 'Semua halaman',
    keterangan: 'Cari halaman, pindah berkas, atau ganti tema tanpa menyentuh tetikus.',
  },
  {
    tombol: ['Ctrl', 'P'],
    mac: ['Cmd', 'P'],
    aksi: 'Buka pemilih berkas',
    cakupan: 'Semua halaman',
    keterangan: 'Langsung pilih index.html, about.html, atau style.css lalu buka di editor.',
  },
  {
    tombol: ['Ctrl', 'Enter'],
    mac: ['Cmd', 'Enter'],
    aksi: 'Tampilkan atau tutup preview',
    cakupan: 'Halaman Editor',
    keterangan: 'Beralih antara tampilan kode penuh dan tampilan belah dengan pratinjau.',
  },
  {
    tombol: ['Esc'],
    mac: ['Esc'],
    aksi: 'Tutup dialog atau batalkan edit',
    cakupan: 'Dialog & input tugas',
    keterangan: 'Menutup palet perintah, menu ponsel, atau membatalkan suntingan baris tugas.',
  },
]

export const RINGKASAN_HOOKS = [
  {
    hook: 'useState',
    rute: '/ukuran',
    halaman: 'Ukuran teks editor',
    penjelasan: 'Menyimpan angka ukuran 12 sampai 24 px, besar langkah 1 atau 2 px, dan tumpukan riwayat untuk Urungkan.',
  },
  {
    hook: 'useState',
    rute: '/tugas',
    halaman: 'Daftar tugas proyek',
    penjelasan: 'Menangani tambah, centang, ubah inline, hapus, serta nilai turunan untuk filter Semua, Aktif, dan Selesai.',
  },
  {
    hook: 'useEffect',
    rute: '/riwayat',
    halaman: 'Riwayat commit',
    penjelasan: 'Mengambil JSON dengan AbortController saat kontributor berubah, mencatat urutan Cleanup lalu Efek berjalan.',
  },
]
