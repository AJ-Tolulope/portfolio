const textData = {
    quote: ["The greatest glory in living lies not in never falling, but in rising every time we fall.","The way to get started is to quit talking and begin doing.","Your time is limited, so don't waste it living someone else's life.","If life were predictable it would cease to be life, and be without flavor.","If you look at what you have in life, you'll always have more. If you look at what you don't have in life, you'll never have enough."],
    typingText: "Front-end Web Development"
}

var quoteArreyIndex = 0;


const quotes = document.querySelector('.quotes p'),
type = document.querySelector('.typing-text'),
typingW = textData.typingText.split("");

var quoteText = '';
var typeText = '';

var quoteIndex = 0;
var typeTextIndex = 0;

setInterval(() => {
    var quotesW = textData.quote[quoteArreyIndex].split("");
    if(quoteIndex < quotesW.length){
        quoteText = quoteText + quotesW[quoteIndex];
        quotes.textContent = quoteText;
    }

    quoteIndex++;
    
    if (quoteIndex == quotesW.length) {
        quoteIndex = 0;
        quoteText = '';
        quoteArreyIndex++;
        
        if (quoteArreyIndex == textData.quote.length) {
            quoteArreyIndex = 0;
        }
    }
}, 200);
setInterval(() => {
    if(typeTextIndex < typingW.length){
        typeText = typeText + typingW[typeTextIndex];
        type.textContent = typeText;
    }

    typeTextIndex++;

    if (typeTextIndex == typingW.length) {
        typeTextIndex = 0;
        typeText = '';
    }
}, 200);