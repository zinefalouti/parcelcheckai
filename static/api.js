document.addEventListener('DOMContentLoaded', function() {
    loadtoscan(); 
    const button = document.querySelector('#classify');
    button.addEventListener('click', function() {
        Classify(); 
    });
});

// Loading the image for scanning
function loadtoscan() {
    const imageInput = document.getElementById('imageInput');
    const selectedImage = document.getElementById('selectedImage');
    const Preview = document.getElementById('placeholder');

    imageInput.addEventListener('change', function(event) {
        const file = event.target.files[0]; // Get the selected file

        if (file) {
            const reader = new FileReader();

            // When the file is successfully read
            reader.onload = function(e) {
                selectedImage.src = e.target.result;
                selectedImage.style.display = 'block';
                Preview.style.display = 'none';  // Make the image visible
            };

            // Read the file as a data URL (base64 string)
            reader.readAsDataURL(file);
        }
    });
}


//Classify
function Classify() {
    const selectedImage = document.getElementById('selectedImage');
    
    // Get the image URL (adjust if necessary depending on how the image is selected or displayed)
    const imageUrl = selectedImage.src; 

    // Get the IDs to change when post scan happens

    let result = document.querySelector('#Result');
    let confid = document.querySelector('#Confidence');

    // Send a POST request to the /post endpoint
    fetch('/post', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imgUrl: imageUrl }) // Send imgUrl as JSON payload
    })
    .then(response => response.json())  // Parse the JSON response
    .then(data => {
        // Handle the response from the server, e.g., display the prediction and class
        console.log('Prediction:', data.prediction);
        console.log('Confidence: ', data.confidence);

        result.innerHTML = data.prediction;
        confid.innerHTML = data.confidence;

        if (data.confidence >= 0.5){
            Stats(data.index);
        }
        
    })
    .catch(error => {
        console.error('Error during classification:', error);
        alert("An error occurred during classification.");
    });
}


//Declaring global totals
let totalenvdmg = 0;
let totalenvclear = 0;

let totalpltdmg = 0;
let totalpltclear = 0;

let totalboxdmg = 0;
let totalboxclear = 0;

let totalpbagdmg = 0;
let totalpbagclear = 0;

let totalcratedmg = 0;
let totalcrateclear = 0;

let totalibcdmg = 0;
let totalibcclear = 0;



//Function to keep track of stats during session
function Stats(index){
    // Declare the ids of areas to modify
    let envclear = document.querySelector('#p-1-1');
    let envdmg = document.querySelector('#p-1-2');

    let pltclear = document.querySelector('#p-2-1');
    let pltdmg = document.querySelector('#p-2-2');

    let boxclear = document.querySelector('#p-3-1');
    let boxdmg = document.querySelector('#p-3-2');

    let pbagclear = document.querySelector('#p-4-1');
    let pbagdmg = document.querySelector('#p-4-2');

    let cratesclear = document.querySelector('#p-5-1');
    let cratesdmg = document.querySelector('#p-5-2');

    let ibcclear = document.querySelector('#p-6-1');
    let ibcdmg = document.querySelector('#p-6-2');

    switch(index){
        case 0:
            totalboxdmg++; // Increment the global variable
            boxdmg.innerHTML = totalboxdmg; // Update the HTML
            break;
        
        case 1:
            totalboxclear++;
            boxclear.innerHTML = totalboxclear;
            break;
        
        case 2:
            totalenvdmg++;
            envdmg.innerHTML = totalenvdmg;
            break;
        
        case 3:
            totalenvclear++;
            envclear.innerHTML = totalenvclear;
            break;
        
        case 4:
            totalibcdmg++;
            ibcdmg.innerHTML = totalibcdmg;
            break;
        
        case 5:
            totalibcclear++;
            ibcclear.innerHTML = totalibcclear;
            break;
        
        case 6:
            totalpltdmg++;
            pltdmg.innerHTML = totalpltdmg;
            break;
        
        case 7:
            totalpltclear++;
            pltclear.innerHTML = totalpltclear;
            break;
        
        case 8:
            totalpbagdmg++;
            pbagdmg.innerHTML = totalpbagdmg;
            break;
        
        case 9:
            totalpbagclear++;
            pbagclear.innerHTML = totalpbagclear;
            break;
        
        case 10:
            totalcratedmg++;
            cratesdmg.innerHTML = totalcratedmg;
            break;
    
        case 11:
            totalcrateclear++;
            cratesclear.innerHTML = totalcrateclear;
            break;
    }    
        

}

