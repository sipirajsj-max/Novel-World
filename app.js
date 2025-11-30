// Fade animation delay
document.querySelectorAll('.fade').forEach((el,i)=>{
  el.style.animationDelay = i*0.2 + "s";
});

// Dark Mode toggle
// Dark/Light mode for whole site
function toggleDarkMode(){
  const body = document.body;
  const currentBg = window.getComputedStyle(body).backgroundColor;
  if(currentBg === 'rgb(13, 17, 23)'){ // dark
    body.style.background='#ffffff';
    body.style.color='#000000';
    document.querySelectorAll('input,textarea').forEach(el=>{
      el.style.background='#f0f0f0';
      el.style.color='#000';
    });
  } else { // light
    body.style.background='#0d1117';
    body.style.color='#fff';
    document.querySelectorAll('input,textarea').forEach(el=>{
      el.style.background='#0b1020';
      el.style.color='#fff';
    });
  }
}

// SHOW REGISTER / LOGIN
function showRegister(){
  document.getElementById('login-box').style.display='none';
  document.getElementById('register-box').style.display='block';
}
function showLogin(){
  document.getElementById('login-box').style.display='block';
  document.getElementById('register-box').style.display='none';
}

// REGISTER AUTHOR
function registerAuthor(){
  const name = document.getElementById('regName').value;
  const email = document.getElementById('regEmail').value;
  const pwd = document.getElementById('regPwd').value;
  const confirmPwd = document.getElementById('regConfirmPwd').value;

  if(!name || !email || !pwd || !confirmPwd){ alert("Fill all fields!"); return; }
  if(pwd!==confirmPwd){ alert("Passwords do not match!"); return; }

  let authors = JSON.parse(localStorage.getItem('authors')||'[]');
  if(authors.find(a=>a.email===email)){ alert("Email already registered!"); return; }

  authors.push({name,email,pwd});
  localStorage.setItem('authors',JSON.stringify(authors));
  alert("Registration success! Login now.");
  showLogin();
}

// LOGIN AUTHOR
function loginAuthor(){
  const email = document.getElementById('loginEmail').value;
  const pwd = document.getElementById('loginPwd').value;

  let authors = JSON.parse(localStorage.getItem('authors')||'[]');
  const user = authors.find(a=>a.email===email && a.pwd===pwd);

  if(user){
    localStorage.setItem('authorLoggedIn','true');
    localStorage.setItem('authorName', user.name);
    alert("Login success!");
    window.location.href='author.html'; // redirect to author panel
  } else {
    alert("Invalid credentials!");
  }
}

// Fade animation delay
document.querySelectorAll('.fade').forEach((el,i)=>{ el.style.animationDelay=i*0.2+"s"; });
// Check if author is logged in
window.onload = function(){
  if(localStorage.getItem('authorLoggedIn') !== 'true'){
    alert("Please login first!");
    window.location.href='login.html';
  } else {
    document.getElementById('authorName').innerText = localStorage.getItem('authorName');
    loadNovels();
  }
}

let novels = JSON.parse(localStorage.getItem('novels')||'[]');

// CREATE NEW NOVEL
function createNovel(){
  const title = document.getElementById('novelTitle').value;
  const desc = document.getElementById('novelDesc').value;
  const cover = document.getElementById('novelCover').value;
  const author = localStorage.getItem('authorName');

  if(!title || !desc || !cover){ alert("Fill all fields!"); return; }

  const newNovel = {
    id:Date.now(),
    title,
    desc,
    cover,
    author,
    chapters:[]
  }

  novels.push(newNovel);
  localStorage.setItem('novels', JSON.stringify(novels));
  document.getElementById('novelTitle').value='';
  document.getElementById('novelDesc').value='';
  document.getElementById('novelCover').value='';
  loadNovels();
}

// LOAD NOVELS OF CURRENT AUTHOR
function createNovel(){
  const title = document.getElementById('novelTitle').value;
  const desc = document.getElementById('novelDesc').value;
  const fileInput = document.getElementById('novelCoverFile');
  const author = localStorage.getItem('authorName');

  if(!title || !desc || fileInput.files.length===0){ 
    alert("Fill all fields!"); 
    return; 
  }

  const file = fileInput.files[0];
  const reader = new FileReader();
  reader.onload = function(e){
    const coverBase64 = e.target.result; // base64 string

    const newNovel = {
      id: Date.now(),
      title,
      desc,
      cover: coverBase64, // save as base64
      author,
      chapters:[]
    }

    novels.push(newNovel);
    localStorage.setItem('novels', JSON.stringify(novels));

    document.getElementById('novelTitle').value='';
    document.getElementById('novelDesc').value='';
    fileInput.value='';
    loadNovels();
  }

  reader.readAsDataURL(file); // convert image to base64
}


// ADD CHAPTER FUNCTION
function addChapter(novelId){
  const chapterTitle = prompt("Chapter Title:");
  const chapterContent = prompt("Chapter Content:");
  if(!chapterTitle || !chapterContent){ alert("Cannot be empty!"); return; }

  novels = novels.map(n=>{
    if(n.id === novelId){
      n.chapters.push({
        id:Date.now(),
        title:chapterTitle,
        content:chapterContent,
        wordCount: chapterContent.split(' ').length
      });
    }
    return n;
  });
  localStorage.setItem('novels', JSON.stringify(novels));
  alert("Chapter added!");
}

const chapterContent = document.getElementById('chapterContent');
const wordCountEl = document.getElementById('wordCount');
const fontSizeInput = document.getElementById('fontSize');
const fontColorInput = document.getElementById('fontColor');

let isBold = false;
let isItalic = false;

// Word count live update
chapterContent.addEventListener('input', ()=>{
  const words = chapterContent.value.trim().split(/\s+/).filter(w=>w.length>0);
  wordCountEl.innerText = words.length;
});

// Font size change
fontSizeInput.addEventListener('input', ()=>{
  chapterContent.style.fontSize = fontSizeInput.value + "px";
});

// Font color change
fontColorInput.addEventListener('input', ()=>{
  chapterContent.style.color = fontColorInput.value;
});

// Bold / Italic toggle
function toggleBold(){
  isBold = !isBold;
  chapterContent.style.fontWeight = isBold ? "bold" : "normal";
}
function toggleItalic(){
  isItalic = !isItalic;
  chapterContent.style.fontStyle = isItalic ? "italic" : "normal";
}

// Save chapter to novels array
function saveChapter(){
  const title = document.getElementById('chapterTitle').value;
  const content = chapterContent.value;
  if(!title || !content){ alert("Fill all fields!"); return; }

  const author = localStorage.getItem('authorName');
  // Select novel to attach chapter (simple prompt for demo)
  const novelTitles = novels.filter(n=>n.author===author).map(n=>n.title).join(', ');
  const novelSelect = prompt("Which novel to add this chapter? Available: "+novelTitles);
  const novel = novels.find(n=>n.title===novelSelect && n.author===author);
  if(!novel){ alert("Invalid novel!"); return; }

  novel.chapters.push({
    id:Date.now(),
    title,
    content,
    wordCount: content.split(/\s+/).filter(w=>w.length>0).length,
    fontSize: chapterContent.style.fontSize,
    fontColor: chapterContent.style.color,
    bold: isBold,
    italic: isItalic
  });

  localStorage.setItem('novels', JSON.stringify(novels));
  alert("Chapter saved!");
  chapterContent.value='';
  document.getElementById('chapterTitle').value='';
  wordCountEl.innerText=0;
}
// Load all novels in library
function loadLibrary(){
  const container = document.getElementById('libraryGrid');
  container.innerHTML='';
  novels.forEach(n=>{
    const card = document.createElement('div');
    card.classList.add('novel-card');
    card.innerHTML = `
      <img src="${n.cover}" alt="Novel Cover">
      <h3>${n.title}</h3>
      <p>✍️ ${n.author} | 👁️ ${n.chapters.length * 100}</p>
    `;
    card.onclick = ()=>{ viewNovel(n.id); }
    container.appendChild(card);
  });
}

// Redirect to reader page with novel id
function viewNovel(novelId){
  localStorage.setItem('currentNovelId', novelId);
  window.location.href='view.html';
}

window.onload = function(){
  loadLibrary();
}
let currentNovel = null;
let currentChapterIndex = 0;

window.onload = function(){
  const novelId = parseInt(localStorage.getItem('currentNovelId'));
  currentNovel = novels.find(n=>n.id===novelId);
  if(!currentNovel || currentNovel.chapters.length===0){
    alert("No chapters available!");
    window.location.href='library.html';
    return;
  }
  loadChapter(0);
}

// Load chapter by index
function loadChapter(index){
  currentChapterIndex = index;
  const chapter = currentNovel.chapters[index];
  document.getElementById('novelTitle').innerText = currentNovel.title;
  document.getElementById('chapterTitle').innerText = chapter.title;
  const contentEl = document.getElementById('chapterContent');
  contentEl.value = chapter.content;
  contentEl.style.fontSize = chapter.fontSize || "16px";
  contentEl.style.color = chapter.fontColor || "#ffffff";
  contentEl.style.fontWeight = chapter.bold ? "bold" : "normal";
  contentEl.style.fontStyle = chapter.italic ? "italic" : "normal";

  // Word count
  const words = chapter.content.trim().split(/\s+/).filter(w=>w.length>0);
  document.getElementById('wordCountReader').innerText = words.length;
}

// Prev/Next Chapter
function prevChapter(){
  if(currentChapterIndex > 0) loadChapter(currentChapterIndex -1);
}
function nextChapter(){
  if(currentChapterIndex < currentNovel.chapters.length-1) loadChapter(currentChapterIndex +1);
}

// Reader font size/color controls
document.getElementById('fontSizeReader').addEventListener('input', e=>{
  document.getElementById('chapterContent').style.fontSize = e.target.value + "px";
});
document.getElementById('fontColorReader').addEventListener('input', e=>{
  document.getElementById('chapterContent').style.color = e.target.value;
});
