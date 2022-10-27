const { createApp } = Vue

createApp({
    data() {
      return {

        search_results: [], // { name, tmdb_id, release_year, rating, description backdrop_img, poster_img}
        trending_movies: [], // { name, tmdb_id, release_year, rating, description backdrop_img, poster_img}
        streaming_availability: {}, // tmdb_id: [{ platform, link }]

        platforms: {
            all4: "All 4",
            apple: "Apple TV",
            britbox: "BritBox",
            curiosity: "Curiosity",
            disney: "Disney",
            hotstar: "Hotstar",
            iplayer: "BBC iPlayer",
            mubi: "Mubi",
            netflix: "Netflix",
            now: "NOW",
            prime: "Amazon Prime",
            zee5: "ZEE5"
        },

        search_text: "",

        active_movie: 1

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

        getStreamingAvailability: function(tmdb_id){

            if(!this.streaming_availability.hasOwnProperty(tmdb_id)){
                send(tmdb_id).then((res) => {
                    this.pause(500).then(() => {
                        this.streaming_availability[tmdb_id] = res;
                    });

                    console.log("Got streaming availability for: " + tmdb_id);
                    console.log(res);
                    console.log("===");

                }).catch(() => {
                    this.pause(500).then(() => {
                        this.streaming_availability[tmdb_id] = [];
                    });
                });
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
