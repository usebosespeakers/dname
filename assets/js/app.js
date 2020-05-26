let form = document.querySelector("form");
let rightPanel = document.querySelector("#right-panel");

const checkAvailability = async () => {

    rightPanel.innerHTML = `<i class="fa fa-circle-o-notch fa-spin"></i>&nbsp;Checking domains...`;

    let formData = JSON.stringify(Object.fromEntries(new FormData(form)));

    var requestOptions = {
        method: "POST",
        body: formData,
    };

    const response = await fetch("http://localhost:8000/api/name/checkAvailability", requestOptions);
    const json = await response.json(); 

    let html = "";

    for (const r of json.results) {
        const domain = r.domainName;
        const price = r.purchasePrice;
        html += `${domain} - $${price}<br>`;
    }
    
    rightPanel.innerHTML = html;

}

form.addEventListener("submit", e => {
    e.preventDefault(); 
    checkAvailability(); 
})