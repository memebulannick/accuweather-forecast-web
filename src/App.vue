
<template>
  <div class="w-full md:h-screen sm:h-full bg-[url('src/assets/images/home.jpg')] bg-cover bg-center">
    <div v-if="isStarted" class="flex flex-col p-2 w-full h-full bg-black bg-opacity-10">
      <!-- SEARCAH MODULE -->
      <!-- <div class="px-10 py-2 w-full">
        <div class="flex" v-if="isNavigator">
          <img class="w-6 h-6 mr-3 mt-2" :src="'src/assets/images/search.png'">
          <select class="md:flex-grow, w-full lg:w-1/3 bg-white bg-opacity-10 p-2 rounded" v-model="selectedCity">
            <option disabled value="">Select City</option>
            <option v-for="city in cities" :value="city">{{city}}</option>
          </select>
        </div>
        <div v-else>
          <span>GEOLOCATION NO</span>
          <select v-model="selectedCity">
            <option disabled value="">Select City</option>
            <option v-for="city in cities" :value="city">{{city}}</option>
          </select>
          <span class="">{{ selectedCity }}</span>
        </div>
      </div> -->
      <!-- TODAY's FORECAST -->
      <div v-if="isShowForecast" class="p-10 pt-3 w-full text-slate-300">
        <div>
          <div>
            <p>{{ formatDate(forecasts[0].Date) }}</p>
            <p class="text-2xl">{{ selectedCity.ParentCity.EnglishName }}</p>
            <p class="font-roboto text-6xl lg:text-7xl font-black ">{{ forecasts[0].Temperature.Minimum.Value }}&#176;- {{ forecasts[0].Temperature.Maximum.Value }}&#176;</p>
            <p>Day: {{ forecasts[0].Day.IconPhrase }}</p>
            <p>Night: {{ forecasts[0].Night.IconPhrase }}</p>
          </div>
        </div>
      </div>
      <!-- FREE 5 DAY FORECASTS -->
      <div v-if="isShowForecast" class="md:p-2 lg:p-10 pt-1 mt-auto w-full text-neutral-900">
        <div class="md:flex lg:flex-auto mt-auto">
          <div class="flex-grow rounded border m-1 px-5 py-2 bg-white bg-opacity-10 backdrop-blur-sm" v-for="forecast in forecasts">
            <p>{{ formatDate(forecast.Date) }}</p>
            <p>{{ forecast.Temperature.Maximum.Value }}&#8457; - {{ forecast.Temperature.Minimum.Value }}&#8457;</p>
            <div class="flex">
              <p class="flex-auto">Day: <img class="h-10 w-10 text-center" :src="getWeatherIcon(forecast.Day.IconPhrase)">{{ forecast.Day.IconPhrase }}</p>
              <p class="flex-auto">Night: <img class="h-10 w-10 text-center" :src="getWeatherIcon(forecast.Night.IconPhrase)"> {{ forecast.Night.IconPhrase }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- LANDING MODULE -->
    <div v-else class="w-full h-screen">
      <button @click="getCurrentLocation" class="rounded border-2 border-slate-300 m-10">
        <div class="flex py-3 px-5">
          <img class="w-6 h-6 mr-3" :src="'src/assets/images/search.png'">
          <span class="font-semibold text-slate-300">Search Weather</span>
        </div>
      </button>
    </div>
  </div>
</template>

<script>

  import { getLocationKeyFromCurrLoc } from './services/apiWrapper';
  import { getFiveDaysForecast } from './services/apiWrapper';
  import dayjs from 'dayjs';

  export default{
    data() {
      return {
        isStarted: false,
        isNavigator: false,
        isShowForecast: false,
        //cities: ["Antipolo","Taytay"],
        selectedCity: null,
        forecasts: []
      }
    },
    methods: {
      // GET LOCATION PERMISSION AND CURRENT LOCATION
      getCurrentLocation(){
        if(navigator.geolocation){
          navigator.geolocation.getCurrentPosition(
            position => {
              console.log(position.coords.latitude);
              console.log(position.coords.longitude);
              this.getCurrLocationKey(position.coords.latitude, position.coords.longitude)
              this.isNavigator = true
              this.isStarted = true
            },
            error => {
              console.log(error.message)
              this.isNavigator = false
              this.isStarted = true
            }
          );
        }else{
          console.log("Browser does not support geolocation API");
        }
      },
      async getCurrLocationKey(lat, lang){
        let currLocInfo = (await getLocationKeyFromCurrLoc(lat, lang)).data
        let locationKey = currLocInfo.Key
        console.log(locationKey)
        this.getLocationForecast(locationKey)
        console.log(currLocInfo)
        this.selectedCity = currLocInfo
      },
      async getLocationForecast(locationKey){
        let currLocForecast = (await getFiveDaysForecast(locationKey)).data
        this.forecasts = currLocForecast.DailyForecasts
        this.isShowForecast = true
        console.log(currLocForecast)
      },
      // DATE FORMATTER USING DAYjs LIBRARY
      formatDate(dateString){
        const date = dayjs(dateString);
        return date.format('dddd, MMM D, YYYY');
      },
      // ICON FOR WEATHER FORECASTS DEPENDING ON KEYWORD
      getWeatherIcon(weatherString){
        let weather = weatherString.toLowerCase();
        if(weather.includes("sun") && weather.includes("shower")){
          return 'src/assets/images/sunny-partly-rainy-day.png';
        }else if(weather.includes("sun")){
          return 'src/assets/images/sunny-day.png';
        }else if(weather.includes("shower")){
          return 'src/assets/images/rainy-day.png';
        }else if(weather.includes("cloud")){
          return 'src/assets/images/cloudy-day.png';
        }else{
          return 'src/assets/images/sunny-day.png';
        }
      }
    }
  }
</script>

<style scoped>

</style>
