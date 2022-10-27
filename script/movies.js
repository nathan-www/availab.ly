class Movies {
    static baseURL = 'https://api.themoviedb.org/3/'
    static apiKey = '1c6c391489739f8b1c4822c55184344c'


    static async getTrending(timeWindow) {
        // timeWindow is either 'day' or 'week'
        const route = `trending/movie/${timeWindow}`
        
        try {
            const data = await Movies.queryApi(route)
            return { data, error: false }
        } catch (e) {
            return { data: null, error: true }
        }
 
    }

    static async searchByName(name) {
        const route = 'search/movie'
        const queryParams = { query: name }

        try {
            const data = await Movies.queryApi(route, queryParams)
            return { data, error: false }
        } catch (e) {
            return { data: null, error: true }
        }
    }

    static async searchByKeywords(keywords) {
        let route = 'search/keyword'
        let keywordIds = await Promise.all(
            keywords.map(keyword => Movies.queryApi(route, { query: keyword })
            .then(json => {
                if (json['results'].length)
                    return json['results'][0]['id']
            })
        ))
        
        //Get rid of the result of invalid keywords
        keywordIds = keywordIds.filter(keywordId => keywordId !== undefined)
        

        route = 'discover/movie'
        const queryParams = {with_keywords: keywordIds.join(',')}
        
        try {
            const data = await Movies.queryApi(route, queryParams)
            return { data, error: false }
        } catch (e) {
            return { data: null, error: true }
        }
    }

    static async queryApi(route, queryParams) {
        const endpoint = new URL(route, Movies.baseURL)
        endpoint.searchParams.set('api_key', Movies.apiKey)

        if (queryParams) {
            for (let [param, value] of Object.entries(queryParams))
                endpoint.searchParams.set(param, value)
        }
        
        const response = await fetch(endpoint)
        const json = await response.json()
   
        if (json.success === false)
            throw new Error()
        return json
    }

    static async getProviders(movieId) {
        const route = `movie/${movieId}/watch/providers`

        try {
            const data = await Movies.queryApi(route)
            return { data, error: false }
        } catch (e) {
            return { data: null, error: true }
        }
    }
}

