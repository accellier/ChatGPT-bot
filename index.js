document.addEventListener("DOMContentLoaded", () => {
  const inputField = document.getElementById("input");
  inputField.addEventListener("keydown", (e) => {
    if (e.code === "Enter") {
      let input = inputField.value;
      inputField.value = "";
      addChat(input);
    }
  });
});

async function addChat(input) {
  const messagesContainer = document.getElementById("messages");

  let userDiv = document.createElement("div");
  userDiv.id = "user";
  userDiv.className = "user response";
  userDiv.innerHTML = `<img src="user.png" class="avatar"><span>${input}</span>`;
  messagesContainer.appendChild(userDiv);

  let botDiv = document.createElement("div");
  let botImg = document.createElement("img");
  let botText = document.createElement("span");
  botDiv.id = "bot";
  botImg.src = "bot-mini.png";
  botImg.className = "avatar";
  botDiv.className = "bot response";
  botText.innerText = "Typing...";
  botDiv.appendChild(botText);
  botDiv.appendChild(botImg);
  messagesContainer.appendChild(botDiv);
  // Keep messages at most recent
  messagesContainer.scrollTop = messagesContainer.scrollHeight - messagesContainer.clientHeight;

  //This calls the function to make the request.
  let cgpt = await getChatGPT(input);
  //Set the botText innerText to the result from the getChatGPT function
  botText.innerText = cgpt.botResponse;
}

async function getChatGPT(prompt){

  //Change 'xx-xxxx' to your own API Key provided by openai.com
  //Read the docs at https://beta.openai.com/docs/introduction for info on how to adjust model, temperature, tokens etc below.
  
  const response = await fetch('https://api.openai.com/v1/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer xx-xxxx'
    },
    body: JSON.stringify({
      'model': 'text-davinci-003',
      'prompt': prompt,
      'temperature': 0,
      'max_tokens': 7
    })
  });
  const json = await response.json();
  
  //response ID not used but could be useful later
  //seems to always add a /n newline character to response hence trimStart()
  return {
    'botResponse': json.choices[0].text.trimStart(),
    'id': json.id
  };
}

