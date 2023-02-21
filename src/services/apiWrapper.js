
import axios from 'axios';

const BASE_URL = 'http://dataservice.accuweather.com';
const apikey = "hzWz5BClDqqWMjnZT9WrUZYG7RT0omx7"

axios.defaults.baseURL = BASE_URL;

const getRegionList = () => {
    return axios.get('/locations/v1/regions',{
        params: {
            apikey: apikey,
        }
    });
}

const getLocationKeyFromCurrLoc = (lat, long) => {
    let coords = lat + ',' + long;
    return axios.get('locations/v1/cities/geoposition/search',{
        params: {
            apikey: apikey,
            q: coords
        }
    });
}

const getTopCities = () => {
    return axios.get('/locations/v1/regions',{
        params: {
            apikey: apikey,
        }
    });
}

const getFiveDaysForecast = (locationKey) => {
    console.log(locationKey)
    return axios.get('forecasts/v1/daily/5day/'+locationKey,{
        params: {
            apikey: apikey,
        }
    });
}

export {
    getRegionList,
    getLocationKeyFromCurrLoc,
    getFiveDaysForecast
}