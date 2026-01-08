let editor;
let dark = false;

require.config({ paths: { vs: 'https://unpkg.com/monaco-editor@0.44.0/min/vs' }});
require(['vs/editor/editor.main'], function () {
  editor = monaco.editor.create(document.getElementById('editor'), {
    value: '',
    language: 'python',
    theme: 'vs-light'
  });
});

function toggleTheme() {
  dark = !dark;
  document.body.classList.toggle("dark");
  monaco.editor.setTheme(dark ? 'vs-dark' : 'vs-light');
}

async function runAI(mode) {
  const prompt = document.getElementById("prompt").value;
  const lang = document.getElementById("language").value;

  let key = localStorage.getItem("OPENAI_KEY");
  if (!key) {
    key = prompt("Paste your OpenAI API key:");
    if (!key) return;
    localStorage.setItem("OPENAI_KEY", key);
  }

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + key
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{
        role: "user",
        content: `Language:${lang}\nMode:${mode}\n${prompt}`
      }],
      temperature: 0.2
    })
  });

  const data = await res.json();
  editor.setValue(data.choices[0].message.content);
}

function saveProject() {
  localStorage.setItem("codegenie_project", editor.getValue());
  alert("Saved!");
    }
