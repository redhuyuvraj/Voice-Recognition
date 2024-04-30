const btn = document.querySelector('.talk');
const content = document.querySelector('.content');

function speak(sentence) {
    const text_speak = new SpeechSynthesisUtterance(sentence);

    text_speak.rate = 1;
    text_speak.pitch = 1;

    window.speechSynthesis.speak(text_speak);
}

function wishMe() {
    var day = new Date();
    var hr = day.getHours();

    if(hr >= 0 && hr < 12) {
        speak("Good Morning ");
    }

    else if(hr == 12) {
        speak("Good noon ");
    }

    else if(hr > 12 && hr <= 17) {
        speak("Good Afternoon ");
    }

    else {
        speak("Good Evening ");
    }
}

window.addEventListener('load', ()=>{
    speak("Activating Inertia");
    speak("Going online");
    wishMe();
    speak("What can i do for you");
})

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.onresult = (event) => {
    const current = event.resultIndex;
    const transcript = event.results[current][0].transcript;
    content.textContent = transcript;
    speakThis(transcript.toLowerCase());
}

btn.addEventListener('click', ()=>{
    recognition.start();
})

function speakThis(message) {
    const speech = new SpeechSynthesisUtterance();
    speech.text = "I did not understand what you said, please try again";

    if (message.includes('hey') || message.includes('hello')) {
        speech.text = "Hello";
    } else if (message.includes('how are you')) {
        speech.text = "I am fine, tell me how can I help you";
    } else if (message.includes('What is your name')) {
        speech.text = "My name is Inertia";
    } else if (message.includes('open google')) {
        window.open("https://www.google.com/", "_blank");
        speech.text = "Opening Google";
    } else if (message.includes('open youtube')) {
        window.open("https://www.youtube.com/", "_blank");
        speech.text = "Opening YouTube";
    } else if (message.includes('what is') || message.includes('who is') || message.includes('what are')) {
        window.open(`https://www.google.com/search?q=${message.replace(" ", "+")}`, "_blank");
        speech.text = "This is what I found on the internet regarding " + message;
    } else if (message.includes('play')) {
        const youtubeUrl = extractYouTubeUrl(message);
        if (youtubeUrl) {
            window.open(youtubeUrl, "_blank");
            speech.text = "Playing the video on YouTube";
        } else {
            const searchTerm = message.replace("play", "").trim();
            const youtubeUrl = `https://www.youtube.com/results?search_query=${searchTerm.replace(" ", "+")}`;
            window.open(youtubeUrl, "_blank");
            speech.text = "Searching for and playing " + searchTerm + " on YouTube";
        }
    } else if (message.includes('wikipedia')) {
        window.open(`https://en.wikipedia.org/wiki/${message.replace("wikipedia", "").trim().replace(" ", "_")}`, "_blank");
        speech.text = "This is what I found on Wikipedia regarding " + message;
    } else if (message.includes('time')) {
        const time = new Date().toLocaleString(undefined, { hour: "numeric", minute: "numeric" });
        speech.text = "The current time is " + time;
    } else if (message.includes('date')) {
        const date = new Date().toLocaleString(undefined, { month: "short", day: "numeric" });
        speech.text = "Today's date is " + date;
    } else {
        window.open(`https://www.google.com/search?q=${message.replace(" ", "+")}`, "_blank");
        speech.text = "I found some information for " + message + " on Google";
    }

    speech.volume = 1;
    speech.pitch = 1;
    speech.rate = 1;

    window.speechSynthesis.speak(speech);
}

function extractYouTubeUrl(message) {
    // Regular expression to extract YouTube video ID from URL
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = message.match(regex);
    if (match && match[0]) {
        return match[0];
    }
    
    // Check if it's a search query
    const searchRegex = /youtube\.com\/results\?search_query=/;
    if (searchRegex.test(message)) {
        return message;
    }

    return null;
}
