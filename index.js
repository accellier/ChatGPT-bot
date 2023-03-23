/*
INSTRUCTIONS: Go to https://platform.openai.com/account/api-keys and get an API key.
Copy it, then put it below where it says YOUR API KEY HERE

WARNING: This was only intended for personal demonstration purposes of what's possible with the ChatGPT API
Do not use this code for any real-world production purposes.
Putting your API key here will expose it to any user who inspects the code's source.
For production purposes you will need to use a server-side language like Node.js or PHP to perform the requests then send the bot response back to the client.
*/
const API_KEY = 'YOUR API KEY HERE';

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
    botText.innerText = "Responding...";
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

async function getChatGPT(prompt) {
    //Read the docs at https://platform.openai.com/docs/introduction for info on how to adjust model, temperature, tokens etc below.
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                "model": "gpt-3.5-turbo",
                "messages": [{
                    "role": "user",
                    "content": prompt
                }],
                "temperature": 0.7
            }
            )
        });
        if (response.status === 401) {
            return {
                'botResponse': 'There was a 401 error from OpenAI. Please check your API key is valid'
            };
        } else {
            const json = await response.json();
            return {
                'botResponse': json.choices[0].message.content.trimStart()
            };
        }

    } catch (error) {
        console.log('There was an error talking to ChatGPT: ', error);
        return {
            'botResponse': 'Something went wrong... ' + error
        };
    }
}
