// ========================================
// ALI MAHMOUD AI
// V1
// ========================================

let chats = [];
let projects = [];
let currentChat = null;

// ----------------------------------------
// Elements
// ----------------------------------------

const messages = document.getElementById("messages");
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const attachBtn = document.getElementById("attachBtn");
const uploadBtn = document.getElementById("uploadBtn");
const fileInput = document.getElementById("fileInput");
const typing = document.getElementById("typing");

const sidebar = document.getElementById("sidebar");
const menuBtn = document.getElementById("menuBtn");

const modal = document.getElementById("modal");
const modalContent = document.getElementById("modalContent");
const closeModal = document.getElementById("closeModal");

// ----------------------------------------
// Gemini
// ----------------------------------------

// مهم:
// لا تضع API Key الحقيقي هنا عند رفع المشروع إلى GitHub.
//
// هذه الدالة تتوقع وجود Backend:
// POST /api/chat
//
// والـBackend هو الذي يتعامل مع Gemini API.

async function askAI(question) {

  const response = await fetch("/api/chat", {
    method: "POST",

    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify({
      message: question
    })
  });

  if (!response.ok) {
    throw new Error("فشل الاتصال بالـAI");
  }

  const data = await response.json();

  return data.reply;
}

// ----------------------------------------
// Chat system
// ----------------------------------------

function createChat() {

  const chat = {
    id: Date.now(),
    title: "دردشة جديدة",
    messages: []
  };

  chats.push(chat);
  currentChat = chat;

  saveData();
  renderChatList();
  renderMessages();
}

function addMessage(role, text) {

  if (!currentChat) {
    createChat();
  }

  currentChat.messages.push({
    role,
    text
  });

  if (
    role === "user" &&
    currentChat.title === "دردشة جديدة"
  ) {
    currentChat.title =
      text.length > 25
        ? text.substring(0, 25) + "..."
        : text;
  }

  saveData();
  renderMessages();
}

function renderMessages() {

  messages.innerHTML = "";

  if (!currentChat) {
    const welcome = document.createElement("div");

    welcome.className = "message ai";

    welcome.textContent =
      "👋 أهلاً بك في ALI MAHMOUD AI\n\nاكتب أي سؤال للبدء!";

    messages.appendChild(welcome);

    return;
  }

  currentChat.messages.forEach(msg => {

    const div = document.createElement("div");

    div.className =
      "message " +
      (msg.role === "user" ? "user" : "ai");

    div.textContent = msg.text;

    messages.appendChild(div);
  });

  messages.scrollTop = messages.scrollHeight;
}

function renderChatList() {

  const list =
    document.getElementById("chatList");

  list.innerHTML = "";

  chats.forEach(chat => {

    const item =
      document.createElement("div");

    item.className = "chat-item";

    item.textContent = "💬 " + chat.title;

    item.onclick = () => {

      currentChat = chat;

      renderMessages();

      sidebar.classList.remove("open");
    };

    list.appendChild(item);
  });
}

// ----------------------------------------
// Send
// ----------------------------------------

async function sendMessage() {

  const question =
    messageInput.value.trim();

  if (!question) return;

  if (!currentChat) {
    createChat();
  }

  messageInput.value = "";

  addMessage("user", question);

  typing.classList.remove("hidden");

  try {

    const answer =
      await askAI(question);

    addMessage("ai", answer);

  } catch (error) {

    addMessage(
      "ai",
      "❌ حصل خطأ في الاتصال بالذكاء الاصطناعي.\n\n" +
      "تأكد أن Backend شغال وأن Gemini API مضبوط."
    );

    console.error(error);

  } finally {

    typing.classList.add("hidden");
  }
}

sendBtn.onclick = sendMessage;

messageInput.addEventListener(
  "keydown",
  event => {

    if (event.key === "Enter") {
      sendMessage();
    }

  }
);

// ----------------------------------------
// New Chat
// ----------------------------------------

document
  .getElementById("newChatBtn")
  .onclick = createChat;

document
  .getElementById("newChatSide")
  .onclick = createChat;

// ----------------------------------------
// Sidebar
// ----------------------------------------

menuBtn.onclick = () => {

  sidebar.classList.toggle("open");

};

// ----------------------------------------
// Files
// ----------------------------------------

attachBtn.onclick = () => {
  fileInput.click();
};

uploadBtn.onclick = () => {
  fileInput.click();
};

fileInput.onchange = () => {

  const files =
    Array.from(fileInput.files);

  if (!files.length) return;

  files.forEach(file => {

    addMessage(
      "user",
      "📎 تم اختيار الملف: " +
      file.name
    );

  });

  fileInput.value = "";
};

// ----------------------------------------
// Projects
// ----------------------------------------

document
  .getElementById("newProjectBtn")
  .onclick = () => {

    openModal(`
      <h2>📁 مشروع جديد</h2>

      <input
        id="projectName"
        placeholder="اسم المشروع"
      >

      <button
        class="action"
        onclick="createProject()"
      >
        إنشاء المشروع
      </button>
    `);
  };

window.createProject = function () {

  const name =
    document
      .getElementById("projectName")
      .value
      .trim();

  if (!name) return;

  projects.push({
    id: Date.now(),
    name,
    chats: []
  });

  saveData();
  renderProjects();
  closeModalWindow();
};

function renderProjects() {

  const list =
    document.getElementById("projectList");

  list.innerHTML = "";

  projects.forEach(project => {

    const item =
      document.createElement("div");

    item.className = "project-item";

    item.textContent =
      "📁 " + project.name;

    list.appendChild(item);

  });
}

// ----------------------------------------
// Code
// ----------------------------------------

document
  .getElementById("codeBtn")
  .onclick = () => {

    openModal(`

      <h2>💻 Code Generator</h2>

      <select id="language">

        <option>HTML</option>
        <option>CSS</option>
        <option>JavaScript</option>
        <option>Python</option>
        <option>C</option>
        <option>C++</option>
        <option>C#</option>
        <option>Lua</option>
        <option>H</option>

      </select>

      <textarea
        id="codeRequest"
        rows="5"
        placeholder="ماذا تريد أن يكتب الـAI؟"
      ></textarea>

      <button
        class="action"
        onclick="generateCode()"
      >
        توليد الكود
      </button>

      <div id="codeResult"></div>
    `);
  };

window.generateCode = async function () {

  const language =
    document.getElementById("language").value;

  const request =
    document.getElementById("codeRequest").value;

  const result =
    document.getElementById("codeResult");

  result.innerHTML =
    "⏳ جاري التوليد...";

  try {

    const answer = await askAI(
      `اكتب كود ${language} للطلب التالي:\n${request}`
    );

    result.innerHTML = `
      <pre>${escapeHTML(answer)}</pre>
    `;

  } catch {

    result.innerHTML =
      "❌ فشل توليد الكود.";
  }
};

// ----------------------------------------
// HTML Preview
// ----------------------------------------

document
  .getElementById("previewBtn")
  .onclick = () => {

    openModal(`

      <h2>👁 HTML Preview</h2>

      <textarea
        id="htmlCode"
        rows="10"
        placeholder="<h1>Hello</h1>"
      ></textarea>

      <button
        class="action"
        onclick="previewHTML()"
      >
        Preview
      </button>

      <br><br>

      <iframe
        id="previewFrame"
        class="preview-frame"
        sandbox="allow-scripts"
      ></iframe>
    `);
  };

window.previewHTML = function () {

  const code =
    document.getElementById("htmlCode").value;

  const frame =
    document.getElementById("previewFrame");

  frame.srcdoc = code;
};

// ----------------------------------------
// Plans
// ----------------------------------------

document
  .getElementById("plansBtn")
  .onclick = () => {

    openModal(`

      <h2>⭐ ALI MAHMOUD AI</h2>

      <div class="project-item">
        🆓 FREE
      </div>

      <div class="project-item">
        ⭐ PLUS
      </div>

      <div class="project-item">
        🚀 GO
      </div>

      <div class="project-item">
        🌌 SPACE
      </div>

      <div class="project-item">
        🎮 ENTER THE GAME
      </div>

      <p>
        هذه الخطط تجريبية داخل التطبيق
        ولا يوجد دفع حقيقي.
      </p>
    `);
  };

// ----------------------------------------
// Modal
// ----------------------------------------

function openModal(content) {

  modalContent.innerHTML = content;

  modal.classList.remove("hidden");
}

function closeModalWindow() {

  modal.classList.add("hidden");

}

closeModal.onclick =
  closeModalWindow;

modal.onclick = event => {

  if (event.target === modal) {
    closeModalWindow();
  }

};

// ----------------------------------------
// Storage
// ----------------------------------------

function saveData() {

  localStorage.setItem(
    "ali_chats",
    JSON.stringify(chats)
  );

  localStorage.setItem(
    "ali_projects",
    JSON.stringify(projects)
  );
}

function loadData() {

  try {

    chats =
      JSON.parse(
        localStorage.getItem("ali_chats")
      ) || [];

    projects =
      JSON.parse(
        localStorage.getItem("ali_projects")
      ) || [];

  } catch {

    chats = [];
    projects = [];
  }

  if (chats.length) {
    currentChat = chats[0];
  }

  renderChatList();
  renderProjects();
  renderMessages();
}

// ----------------------------------------
// Security helper
// ----------------------------------------

function escapeHTML(text) {

  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

// ----------------------------------------
// Start
// ----------------------------------------

loadData(); 