/* ====== Helpers ====== */
const qsel = s => document.querySelector(s)
const qall = s => Array.from(document.querySelectorAll(s))

/* ====== Persistence ======
localStorage keys:
- users => { username: password }
- participants => [ {name, quizType, score, timestamp}, ... ]
- currentUser => string
- selectedQuiz => string
*/

function getUsers(){ return JSON.parse(localStorage.getItem('users') || '{}') }
function setUsers(u){ localStorage.setItem('users', JSON.stringify(u)) }
function getParticipants(){ return JSON.parse(localStorage.getItem('participants') || '[]') }
function setParticipants(p){ localStorage.setItem('participants', JSON.stringify(p)) }

/* ================== INDEX (LOGIN / REGISTER) ================== */
if (qsel('#btnLogin') || qsel('#btnRegister')) {
  const btnLogin = qsel('#btnLogin')
  const btnRegister = qsel('#btnRegister')
  const showRegister = qsel('#showRegister')
  const showLogin = qsel('#showLogin')
  const loginName = qsel('#loginName')
  const loginPass = qsel('#loginPass')
  const regName = qsel('#regName')
  const regPass = qsel('#regPass')

  // toggle
  showRegister && showRegister.addEventListener('click', e=>{ e.preventDefault(); qsel('#formLogin').style.display='none'; qsel('#formRegister').style.display='block' })
  showLogin && showLogin.addEventListener('click', e=>{ e.preventDefault(); qsel('#formRegister').style.display='none'; qsel('#formLogin').style.display='block' })

  // register
  btnRegister && btnRegister.addEventListener('click', ()=>{
    const name = regName.value && regName.value.trim()
    const pass = regPass.value
    if(!name || !pass){ alert('Lengkapi Nama & Kata Sandi.'); return }
    const users = getUsers()
    if(users[name]){ alert('Nama sudah terdaftar. Silakan login.'); return }
    users[name] = pass
    setUsers(users)
    alert('Pendaftaran berhasil. Silakan login.')
    regName.value = ''; regPass.value = ''
    qsel('#formRegister').style.display='none'; qsel('#formLogin').style.display='block'
  })

  // login
  btnLogin && btnLogin.addEventListener('click', ()=>{
    const name = loginName.value && loginName.value.trim()
    const pass = loginPass.value
    if(!name || !pass){ alert('Masukkan Nama & Kata Sandi.'); return }
    const users = getUsers()
    if(users[name] && users[name] === pass){
      localStorage.setItem('currentUser', name)
      window.location.href = 'choose.html'
    } else {
      alert('Nama pengguna atau kata sandi salah.')
    }
  })
}

/* ================== CHOOSE PAGE ================== */
if (qall('.quiz-type').length) {
  const user = localStorage.getItem('currentUser') || 'Tamu'
  qsel('#userGreeting').innerText = user

  qsel('#btnLogout').addEventListener('click', ()=>{
    localStorage.removeItem('currentUser')
    window.location.href = 'index.html'
  })

  qsel('#btnResults').addEventListener('click', ()=> window.location.href = 'results.html')

  qall('.quiz-type').forEach(b=>{
    b.addEventListener('click', ()=>{
      const type = b.dataset.type
      localStorage.setItem('selectedQuiz', type)
      window.location.href = 'quiz.html'
    })
  })
}

/* ================== QUIZ DATA (10 soal tiap kategori, terurut) ================== */
const quizzes = {
  umum: [
    { q:"Ibu kota Indonesia adalah?", a:["Jakarta","Bali","Bandung","Medan"], c:0 },
    { q:"Gunung tertinggi di dunia?", a:["Kilimanjaro","Everest","Merapi","Elbrus"], c:1 },
    { q:"Mata uang Jepang?", a:["Won","Dollar","Yen","Baht"], c:2 },
    { q:"Siapa penemu telepon?", a:["Edison","Bell","Tesla","Marconi"], c:1 },
    { q:"Planet terbesar di tata surya?", a:["Bumi","Mars","Jupiter","Saturnus"], c:2 },
    { q:"Bahasa resmi PBB yang utama?", a:["Indonesia","Spanyol","Inggris","Prancis"], c:2 },
    { q:"Hari kemerdekaan RI?", a:["17 Agustus 1945","1 Januari 1945","10 November 1945","2 Mei 1945"], c:0 },
    { q:"Simbol kimia air?", a:["O2","H2","H2O","CO2"], c:2 },
    { q:"Benua tempat Indonesia?", a:["Afrika","Asia","Eropa","Oceania"], c:1 },
    { q:"Bahasa markup untuk struktur web?", a:["CSS","HTML","SQL","Python"], c:1 }
  ],
  teknologi: [
    { q:"Siapa pendiri Microsoft?", a:["Bill Gates","Steve Jobs","Larry Page","Mark Zuckerberg"], c:0 },
    { q:"HTML singkatan dari?", a:["Hyperlinks and Text Markup","Hyper Text Markup Language","Home Tool Markup Language","Hyper Transfer Markup"], c:1 },
    { q:"CSS berfungsi untuk?", a:["Logika","Data","Tata Letak & Styling","Database"], c:2 },
    { q:"Bahasa untuk logika di web?", a:["HTML","CSS","JavaScript","Markdown"], c:2 },
    { q:"Sistem operasi open-source?", a:["Windows","macOS","Linux","iOS"], c:2 },
    { q:"React dibuat oleh?", a:["Google","Meta (Facebook)","Microsoft","Apache"], c:1 },
    { q:"Protocol web aman?", a:["HTTP","FTP","SMTP","HTTPS"], c:3 },
    { q:"API singkatan dari?", a:["Application Programming Interface","Applied Programming Index","App Program Inline","Advanced Protocol Interface"], c:0 },
    { q:"Contoh DB NoSQL?", a:["MySQL","Postgres","MongoDB","SQLite"], c:2 },
    { q:"Versi kontrol populer?", a:["SVN","Git","FTP","HTTP"], c:1 }
  ],
  sains: [
    { q:"Air terdiri dari molekul?", a:["CO2","H2","H2O","O2"], c:2 },
    { q:"Planet terdekat Matahari?", a:["Venus","Merkurius","Bumi","Mars"], c:1 },
    { q:"Fotosintesis terjadi di bagian?", a:["Akar","Daun","Batang","Biji"], c:1 },
    { q:"Gaya yang menarik benda ke bumi?", a:["Listrik","Gaya","Gravitasi","Magnet"], c:2 },
    { q:"Unsur utama udara?", a:["Nitrogen","Helium","Argon","Klorin"], c:0 },
    { q:"Satuan suhu SI?", a:["Celsius","Kelvin","Fahrenheit","Reaumur"], c:1 },
    { q:"Sel adalah unit dasar dari?", a:["Jaringan","Organ","Sel","Sistem"], c:2 },
    { q:"Partikel bermuatan negatif?", a:["Proton","Elektron","Neutron","Atom"], c:1 },
    { q:"Proses cair -> gas disebut?", a:["Menguap/evaporasi","Mencair","Membeku","Mengkristal"], c:0 },
    { q:"Benda yang memantulkan cahaya disebut?", a:["Transparan","Opaque","Reflektor","Penyerap"], c:2 }
  ],
  bahasa: [
    { q:"Sinonim 'indah'?", a:["Cantik","Buruk","Bosan","Tua"], c:0 },
    { q:"Antonim 'besar'?", a:["Tinggi","Kecil","Luas","Panjang"], c:1 },
    { q:"Bahasa Inggris 'buku'?", a:["Pen","Paper","Book","Bag"], c:2 },
    { q:"Kata tanya 'siapa' = ?", a:["What","When","Who","Where"], c:2 },
    { q:"Gaya bahasa berlebih disebut?", a:["Hiperbola","Metafora","Simile","Istilah"], c:0 },
    { q:"Kata kerja = ?", a:["Noun","Verb","Adj","Adv"], c:1 },
    { q:"Sinonim 'cepat'?", a:["Lambat","Cepat","Laju","Lega"], c:1 },
    { q:"'Rumah' termasuk?", a:["Kata kerja","Kata benda","Kata sifat","Kata keterangan"], c:1 },
    { q:"Prefiks 'un-' memberi makna?", a:["Negasi/tidak","Tambah","Waktu","Jumlah"], c:0 },
    { q:"'They' merujuk ke?", a:["Tunggal","Jamak","Masa lalu","Tidak pasti"], c:1 }
  ]
}

/* ================== QUIZ PAGE (1 soal per tampilan, no live score) ================== */
if (qsel('#questionBox')) {
  const quizType = localStorage.getItem('selectedQuiz') || 'umum'
  const questions = quizzes[quizType] || quizzes.umum
  const total = questions.length
  let index = 0
  let score = 0
  const currentUser = localStorage.getItem('currentUser') || 'Tamu'

  // elements
  const quizTitle = qsel('#quizTitle')
  const idxLabel = qsel('#indexLabel')
  const totalLabel = qsel('#totalLabel')
  const qbox = qsel('#questionBox')
  const nextBtn = qsel('#nextBtn')
  const prevBtn = qsel('#prevBtn')
  const finishArea = qsel('#finishArea')
  const backToChoose = qsel('#btnBackToChoose')
  const logoutBtn = qsel('#btnLogout2')
  const userNameLabel = qsel('#currentUserName')

  quizTitle.innerText = 'Kuis — ' + (quizType.charAt(0).toUpperCase() + quizType.slice(1))
  idxLabel.innerText = index + 1
  totalLabel.innerText = total
  userNameLabel.innerText = currentUser

  // store per-question answered state (so user cannot change previous answers)
  const answers = new Array(total).fill(null) // null or chosen index

  function renderQuestion(i){
    const q = questions[i]
    qbox.innerHTML = ''
    const h = document.createElement('h3'); h.innerText = q.q; qbox.appendChild(h)
    q.a.forEach((opt, oi) => {
      const btn = document.createElement('div')
      btn.className = 'option'
      btn.setAttribute('data-index', oi)
      btn.innerText = opt
      // if already answered for this question, lock and show feedback
      if(answers[i] !== null){
        btn.classList.add('disabled')
        btn.onclick = null
        if(oi === q.c) btn.classList.add('correct')
        if(oi === answers[i] && answers[i] !== q.c) btn.classList.add('wrong')
      } else {
        btn.onclick = ()=> selectAnswer(btn, oi, i)
      }
      qbox.appendChild(btn)
    })
    idxLabel.innerText = i+1
    totalLabel.innerText = total
    prevBtn.style.visibility = i>0 ? 'visible' : 'hidden'
    nextBtn.innerText = (i === total-1) ? 'Selesai' : 'Berikutnya'
  }

  let answeredThis = false
  function selectAnswer(el, chosenIndex, qIndex){
    if(answers[qIndex] !== null) return // already answered
    // lock all options for this question visually
    const siblings = Array.from(qbox.querySelectorAll('.option'))
    siblings.forEach(s => { s.classList.add('disabled'); s.onclick = null })
    // record answer
    answers[qIndex] = chosenIndex
    answeredThis = true
    // show correct/wrong visuals
    const correctIndex = questions[qIndex].c
    if(chosenIndex === correctIndex){
      el.classList.add('correct')
      score++
    } else {
      el.classList.add('wrong')
      // highlight correct
      const correctEl = siblings[correctIndex]
      if(correctEl) correctEl.classList.add('correct')
    }
  }

  nextBtn.addEventListener('click', ()=>{
    if(answers[index] === null){
      alert('Pilih jawaban dulu sebelum lanjut.')
      return
    }
    if(index < total-1){
      index++
      renderQuestion(index)
    } else {
      finishQuiz()
    }
  })

  prevBtn.addEventListener('click', ()=>{
    if(index>0){
      index--
      renderQuestion(index)
    }
  })

  function finishQuiz(){
    // store participant result
    const parts = getParticipants()
    parts.push({ name: currentUser, quizType, score, timestamp: Date.now() })
    setParticipants(parts)
    // show finish area with result and show controls
    qbox.style.display = 'none'
    nextBtn.style.display = 'none'
    prevBtn.style.display = 'none'
    finishArea.style.display = 'block'
    finishArea.innerHTML = `<h3>🎉 Kuis Selesai</h3>
      <p>Skor Anda: <strong>${score}</strong> dari ${total}</p>
      <p>Akun: <strong>${currentUser}</strong></p>`
    backToChoose.style.display = 'inline-block'
    // show top scorer summary
    const top = getTopScorer(getParticipants(), quizType)
    const elTop = document.createElement('p')
    elTop.innerHTML = `<strong>Top scorer untuk ${quizType}:</strong> ${top ? top.name + ' — ' + top.score : '-' }`
    finishArea.appendChild(elTop)
    // add button to full results page
    const gotoResults = document.createElement('button')
    gotoResults.className = 'btn'
    gotoResults.innerText = 'Lihat Semua Hasil & Peserta'
    gotoResults.style.marginTop = '12px'
    gotoResults.onclick = ()=> window.location.href = 'results.html'
    finishArea.appendChild(gotoResults)
  }

  backToChoose.addEventListener('click', ()=> window.location.href = 'choose.html')
  logoutBtn.addEventListener('click', ()=> { localStorage.removeItem('currentUser'); window.location.href='index.html' })

  // start
  renderQuestion(index)
}

/* ================== RESULTS PAGE ================== */
if (qsel('#allParticipants')) {
  const parts = getParticipants().slice().reverse()
  const list = qsel('#allParticipants')
  list.innerHTML = ''
  if(parts.length === 0){
    list.innerHTML = '<li style="opacity:.7">Belum ada peserta</li>'
  } else {
    parts.forEach(p=>{
      const li = document.createElement('li')
      const d = new Date(p.timestamp)
      li.textContent = `${p.name} — ${p.quizType} — Skor: ${p.score} — ${d.toLocaleString()}`
      list.appendChild(li)
    })
  }

  // summary & top scorer
  const summary = qsel('#summary')
  const top = getTopScorer(getParticipants())
  qsel('#topScorer').innerText = top ? `${top.name} — ${top.score} (${top.quizType})` : '-'
  summary.innerText = `Total peserta: ${getParticipants().length}`

  qsel('#btnBackChoose').addEventListener('click', ()=> window.location.href='choose.html')
  qsel('#btnLogout3').addEventListener('click', ()=> { localStorage.removeItem('currentUser'); window.location.href='index.html' })
}

/* ================== UTIL: top scorer ================== */
function getTopScorer(all, quizType){
  const list = all || getParticipants()
  if(!list || list.length===0) return null
  let filtered = list
  if(quizType) filtered = list.filter(p=>p.quizType === quizType)
  if(filtered.length===0) return null
  let top = filtered[0]
  for(let i=1;i<filtered.length;i++){
    if(filtered[i].score > top.score) top = filtered[i]
  }
  return top
}