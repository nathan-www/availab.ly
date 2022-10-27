const { createApp } = Vue

createApp({
    data() {
      return {

        search_results: [], // { name, tmdb_id, release_year, rating, description backdrop_img, poster_img}
        trending_movies: [], // { name, tmdb_id, release_year, rating, description backdrop_img, poster_img}
        streaming_availability: {}, // tmdb_id: [{ platform, link }]

        user_country: "GB",

        search_text: "",

        active_movie: null

      }
    },

    methods: {

        tmdbResult: function(movie){
            return {
                name: movie.original_title,
                tmdb_id: movie.id,
                release_year: (new Date(movie.release_date).getFullYear()),
                rating: Math.round(movie.vote_average*10),
                description: movie.overview,
                backdrop_img: 'https://image.tmdb.org/t/p/original' + movie.backdrop_path,
                poster_img: 'https://image.tmdb.org/t/p/original' + movie.poster_path
            }
        },

        search: function(ev){
            this.active_movie = null;
            this.search_text = ev.target.value;
            this.searchMovies(this.search_text);
        },

        searchMovies: function(){

            Movies.searchByName(this.search_text).then((res) => {
                this.search_results = res.data.results.map((movie) => this.tmdbResult(movie))
            });

        },

        getTrendingMovies: function(){

            Movies.getTrending('day').then((res) => {
                this.trending_movies = res.data.results.map((movie) => this.tmdbResult(movie))
            });

        },

        clickMovie: function(tmdb_id){

            this.active_movie = tmdb_id;
            this.getStreamingAvailability(tmdb_id);

        },

        tmbdProviderResult: function(res){
            return {
                name: res.provider_name,
                logo: 'https://image.tmdb.org/t/p/original' + res.logo_path
            }
        },

        getStreamingAvailability: function(tmdb_id){

            if(!this.streaming_availability.hasOwnProperty(tmdb_id)){
                Movies.getProviders(tmdb_id).then((res) => {

                    let results = res.data.results;
                    let availability;

                    if(!results.hasOwnProperty(this.user_country)){
                        availability = {
                            link: null,
                            stream: [],
                            rent: [],
                            buy: []
                        }
                    } else {
                        let localResults = results[this.user_country];

                        availability = {
                            link: localResults.link,
                            stream: [],
                            rent: [],
                            buy: []
                        }

                        if(localResults.hasOwnProperty('flatrate')){
                            availability.stream = localResults['flatrate'].map((p) => this.tmbdProviderResult(p));
                        }
                        if(localResults.hasOwnProperty('rent')){
                            availability.rent = localResults['rent'].map((p) => this.tmbdProviderResult(p));
                        }
                        if(localResults.hasOwnProperty('buy')){
                            availability.buy = localResults['buy'].map((p) => this.tmbdProviderResult(p));
                        }
                    }

                    this.pause(800).then(() => {
                        this.streaming_availability[tmdb_id] = availability;
                    })

                })
            }

        },

        pause: function(ms){
            return new Promise((resolve,reject) => {
                window.setTimeout(resolve, ms);
            })
        },

        openLinkNewTab: function(url){
            window.open(url, '_blank').focus();
        }

    },

    mounted(){

        window.addEventListener('load', () => {
            // Load trending movies
            this.getTrendingMovies();
        })

    }

  }).mount('#app')
