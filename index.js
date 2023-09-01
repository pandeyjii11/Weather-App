const userTab = document.querySelector("[data-Weather]");
const searchTab = document.querySelector("[data-serachWeather]");

const searchform = document.querySelector("[data-searchform]");
const searchInput = document.querySelector("[data-searchInput]");

const grantAccess = document.querySelector(".grant-location-container");
const grantAccessBtn = document.querySelector("[data-grantAccess]");

const userInfoContainer = document.querySelector('.user-info-container');

const loadingScreen = document.querySelector(".loading-container");

const notFound = document.querySelector("[data-notFound]");
const errorMsg = document.querySelector("[data-errorMsg]");

const key="31babfdee0bf76c3f1a362ae66b57966";



let currentTab=userTab;
currentTab.classList.add("current-tab");
getFromSessionStorage();

// console.log("here", currentTab.classList);

// Rendering Data on Screen
function renderData(data) {
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const weatherDescription = document.querySelector("[data-weatherDesc]");
    const weatherImage = document.querySelector("[data-weatherImage]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windSpeed]");
    const humidity = document.querySelector("[data-humidity]");
    const clouds = document.querySelector("[data-clouds]");

    cityName.innerText = data?.name;
    countryIcon.src =`https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;
    weatherDescription.innerText = data?.weather?.[0]?.description;
    weatherImage.src=`http://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`;
    temp.innerText = `${data?.main?.temp} °C`;
    windspeed.innerText =`${data?.wind?.speed} m/s`;
    humidity.innerText = `${data?.main?.humidity}%`;
    clouds.innerText = `${data?.clouds?.all}%`;
}


// Incase of error Rendering 404 error on the screen
function errorDisplay(data)
{
    loadingScreen.classList.remove("active");
    userInfoContainer.classList.remove("active");
    notFound.classList.add("active");
    errorMsg.innerText = data?.message;
}


// Accessing Session Storage
function getFromSessionStorage() {
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates)
    {
        grantAccess.classList.add("active");
    }
    else
    {
        const coordinates = JSON.parse(localCoordinates);
        customWeater(coordinates);
    }
}

// Switiching Tab
function switchTab(clickedTab)
{
    if(currentTab!=clickedTab)
    {
        currentTab.classList.remove("current-tab");
        currentTab=clickedTab;
        currentTab.classList.add("current-tab");
        if(!searchform.classList.contains("active"))
        {
            searchform.classList.add("active");
            grantAccess.classList.remove("active");
            userInfoContainer.classList.remove("active");
            notFound.classList.remove("active");
        }
        else
        {
            searchform.classList.remove("active");
            userInfoContainer.classList.remove("active");
            notFound.classList.remove("active");
            getFromSessionStorage();
        }
    }
}


// Getting Location Coordinates
function getLocation() {

    if(navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        alert("Geolocation not supported");
    }
}

// Finding Location coordinates using Geolocation
function showPosition(position)
{
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }
    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));


    customWeater(userCoordinates);
}


// Getting Weather Details by API calling using City name
async function cityWeather(city)
{
    notFound.classList.remove("active");
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccess.classList.remove("active");
    try {
        // let city="Kolkata";

    
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&units=metric`);
    
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        if(data?.cod==200)
        {
            renderData(data);
        }
        else{
            errorDisplay(data);
        }
        // console.log(data);
    }
    catch(err)
    {
        console.log("Error");
    }
}


// Getting Weather Details by API calling using Latitude and Longitude
async function customWeater(coordinates) {

    const{lat, lon} = coordinates;
    grantAccess.classList.remove("active");
    loadingScreen.classList.add("active");
    
    try {
        
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=metric`);

        const data=await response.json();

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        if(data?.cod==200)
        {
            renderData(data);
        }
        else{
            errorDisplay(data);
        }
        // console.log(data);
    }
    catch(err)
    {
        console.log("error msg: ", err);
    }
}

// Switching tab event
userTab.addEventListener('click', () => {
    switchTab(userTab);
});

searchTab.addEventListener('click', () => {
    switchTab(searchTab);
});

//  searching Event
searchform.addEventListener('submit', (event) => {
    event.preventDefault();

    let City=searchInput.value;

    if(City==="")
    {
        return;
    }

    cityWeather(City);

    city="";
    searchInput.value=null;
});

// Grant Access Event
grantAccessBtn.addEventListener('click', getLocation);