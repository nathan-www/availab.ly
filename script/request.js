const send = async (tmdbid) => {

    const options = {
    method: 'GET',
    url: 'https://streaming-availability.p.rapidapi.com/get/basic',
    params: {country: 'gb', tmdb_id: `movie/${tmdbid}`, output_language: 'en'},
    headers: {
        'X-RapidAPI-Key': '964af13f99mshcaff0998bd99117p1dcd90jsn580da8e9be7f',
        'X-RapidAPI-Host': 'streaming-availability.p.rapidapi.com'
    }
    };
    
    var available = [];
    /// returns promise with result
    return axios.request(options).then(function (response) {
        console.log(response.data.streamingInfo)
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
        return available
    });
    
}