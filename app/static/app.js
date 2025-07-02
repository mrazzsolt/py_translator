async function submitTranslation() {
  const text = document.getElementById('textToTranslate').value;
  const languages = document.getElementById('languages').value.split(',').map(lang => lang.trim());
  if (!text || languages.length === 0 || languages[0] === "") {
    alert("Please provide both text and target language.");
    return;
  }

  const progressBar = document.getElementById('progress-bar');
  const progressText = document.getElementById('progress-text');
  progressBar.classList.remove('bg-success');
  progressBar.classList.add('bg-primary');
  progressBar.style.width = '0%';
  progressText.textContent = 'Translation in progress..';

  try {
    const response = await axios.post('http://localhost:8000/translate', {
      text: text,
      languages: languages
    });
    console.log("POST response:", response.data);
    const taskId = response.data.task_id;
    alert(`Task ID: ${taskId}`);
    document.getElementById('progress-container').style.display = 'block';
    document.getElementById('results').style.display = 'none';
    document.getElementById('status-container').style.display = 'none';
    document.getElementById('content-container').style.display = 'none';

    let translationResult = null;
    let progress = 0;
    while (progress < 100) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const resultResponse = await axios.get(`http://localhost:8000/translate/${taskId}`);
      translationResult = resultResponse.data;
      if (translationResult.status === 'completed') {
        progress = 100;
      } else {
        progressBar.style.width = `50%`;
      }
    }
    progressBar.classList.remove('bg-primary');
    progressBar.classList.add('bg-success');
    progressBar.style.width = `100%`;
    progressText.textContent = 'Translation complete!';
    document.getElementById('translationResults').textContent = JSON.stringify(translationResult.translations, null, 2);
    document.getElementById('results').style.display = 'block';
  } catch (error) {
    console.error("Error occured", error);
    alert("Try again.");
  }
}

async function checkTranslationStatus() {
  const id = document.getElementById('search-id').value;
  try{
    const response = await axios.get(`http://localhost:8000/translate/${id}`);
    const translationResult = response.data;
    document.getElementById('translationResults').textContent = JSON.stringify(translationResult.translations,null,2);
    document.getElementById('results').style.display = 'block';
    document.getElementById('statusResult').textContent = `Status: ${translationResult.status}`;
    document.getElementById('status-container').style.display = 'block';
  } catch(error){
    console.error("Error fetching translation status: ",error);
    alert("An error occurec while fetching the translation status. Please try again!");
  }
}

async function checkTranslationContent() {
  const id = document.getElementById('search-id').value;
   try{
    const response = await axios.get(`http://localhost:8000/translate/content/${id}`);
    const translationResult = response.data;
    document.getElementById('contentResult').textContent = JSON.stringify(translationResult.translations,null,2);
    document.getElementById('content-container').style.display = 'block';
  } catch(error){
    console.error("Error fetching translation status: ",error);
    alert("An error occurec while fetching the translation status. Please try again!");
  }
}


function setupDarkModeToggle(buttonId, className = 'dark-mode') {
  const button = document.getElementById(buttonId);
  if (!button) {
    console.warn(`Button with id "${buttonId}" not found.`);
    return;
  }

  if (localStorage.getItem('darkMode') === 'enabled') {
    document.body.classList.add(className);
  }

  const toggleDarkMode = () => {
    document.body.classList.toggle(className);

    if (document.body.classList.contains(className)) {
      localStorage.setItem('darkMode', 'enabled');
    } else {
      localStorage.removeItem('darkMode');
    }
  };

  button.addEventListener('click', toggleDarkMode);
}

window.addEventListener('load', () => {
  setupDarkModeToggle('toggleDarkMode');
});
