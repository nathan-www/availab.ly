const send = async (tmdbid) => {

    const options = {
    method: 'GET',
    url: 'https://streaming-availability.p.rapidapi.com/get/basic',
    params: {country: 'gb', tmdb_id: `movie/${tmdbid}`, output_language: 'en'},
    headers: {
        'X-RapidAPI-Key': '2c7c65c3e2msh5230eed38d75131p19d70fjsna7867b8d94c7',
        'X-RapidAPI-Host': 'streaming-availability.p.rapidapi.com'
    }
    };

    return axios.request(options).then(function (response) {
        var available = [];
        Object.entries(response.data.streamingInfo).map(
            (object)=> { 
                if (object[1].gb.leaving > 0) {
                    available.push({platform: object[0], link: object[1].gb.link})
                }
            } 
        )
        return available
    }).catch(function (error) {
        console.error(error);
    });
    
}

//106646 - wolf
// 393 - kill bill 2
// 24 - kill bill 1

// send(24).then((res)=> console.log(res, "lol"))
