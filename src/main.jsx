import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Catatan: sengaja TIDAK memakai <StrictMode>.
// Di mode dev, StrictMode menjalankan setiap efek dua kali (efek -> cleanup -> efek)
// untuk mengetes cleanup. Itu bagus untuk belajar, tetapi membuat log efek di demo
// terlihat ganda. Untuk mencobanya: bungkus <App /> dengan <StrictMode>.
createRoot(document.getElementById('root')).render(<App />)
