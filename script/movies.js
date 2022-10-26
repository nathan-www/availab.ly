class Movies {
    baseURL = 'https://api.themoviedb.org/3/'
    apiKey = '1c6c391489739f8b1c4822c55184344c'


    async getTrending(timeWindow) {
        // timeWindow is either 'day' or 'week'
        const route = `trending/movie/${timeWindow}`
        
        try {
            const data = await this.queryApi(route)
            return { data, error: false }
        } catch (e) {
            return { data: null, error: true }
        }
 
    }

    async searchByName(name) {
        const route = 'search/movie'
        const queryParams = { query: name }

        try {
            const data = await this.queryApi(route, queryParams)
            return { data, error: false }
        } catch (e) {
            return { data: null, error: true }
        }
    }

    async searchByKeywords(keywords) {
        let route = 'search/keyword'
        const keywordIds = await Promise.all(
            keywords.map(keyword => this.queryApi(route, { query: keyword })
            .then(json => {
                if (json['results'].length)
                    return json['results'][0]['id']
            })
        ))
        
        route = 'discover/movie'
        const queryParams = {with_keywords: keywordIds.join('&')}
        try {
            const data = await this.queryApi(route, queryParams)
            return { data, error: false }
        } catch (e) {
            return { data: null, error: true }
        }
    }

    async queryApi(route, queryParams) {
        const endpoint = new URL(route, this.baseURL)
        endpoint.searchParams.set('api_key', this.apiKey)

        if (queryParams) {
            for (let [param, value] of Object.entries(queryParams))
                endpoint.searchParams.set(param, value)
        }
        
        const response = await fetch(endpoint)
        const json = await response.json()
        return json
    }

}

// const movies = new Movies()
// console.log(movies.searchByKeywords(['horror', 'happy', 'sadfff']))