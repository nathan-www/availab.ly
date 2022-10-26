const axios = require("axios");
var tmdbid = 24;

const send = () => {

    const options = {
    method: 'GET',
    url: 'https://streaming-availability.p.rapidapi.com/get/basic',
    params: {country: 'gb', tmdb_id: `movie/${tmdbid}`, output_language: 'en'},
    headers: {
        'X-RapidAPI-Key': '2c7c65c3e2msh5230eed38d75131p19d70fjsna7867b8d94c7',
        'X-RapidAPI-Host': 'streaming-availability.p.rapidapi.com'
    }
    };

}

send()