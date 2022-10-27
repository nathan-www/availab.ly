const send = async (tmdbid) => {

    const options = {
    method: 'GET',
    url: 'https://streaming-availability.p.rapidapi.com/get/basic',
    params: {country: 'gb', tmdb_id: `movie/${tmdbid}`, output_language: 'en'},
    headers: {
        // /* test */ 'X-RapidAPI-Key': '88dc15aabfmshecb77a80354edd2p1c5e65jsn565a2a7c5e12',
        /* prod */ 'X-RapidAPI-Key': '964af13f99mshcaff0998bd99117p1dcd90jsn580da8e9be7f',
        'X-RapidAPI-Host': 'streaming-availability.p.rapidapi.com'
    }
    };
    
    /// returns promise with result
    var available = [];
    return axios.request(options).then(function (response) {
        Object.entries(response.data.streamingInfo).map(
            (object)=> { 
                available.push({platform: object[0], link: object[1].gb.link})
            } 
        )
        return available
    }).catch((err)=> {
        return available
    })
    
}

// send(615457).then((res)=>{
//     console.log(res)
// })