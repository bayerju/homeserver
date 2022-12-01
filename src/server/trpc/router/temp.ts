import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";
import axios, { AxiosResponse } from "axios";

const sensors = {
    raspZero: {
        id: 1,
        location: "kitchen",
        url: "http://raspberrypizero:3002/temp"
    },
    RaspPi4: {
        id: 0,
        location: "julian",
        url: "http://raspberrypi:3002/temp" // "192.168.178.32"
    },
    nodeMCU: {
        id: 2,
        location: "livingroom",
        url: "http://192.168.178.38:80/temp",
    }
}

const sensorPorts = "3002"

const options = {
    method: 'GET',
    url: 'http://raspberrypi:3002/temp',
    headers: { Accept: '*/*', 'User-Agent': 'Thunder Client (https://www.thunderclient.com)' }
};

interface ResponseData {
    response: {
        temperature: number,
        humidity: number,
    }
}

export const tempRouter = router({
    getTemps: publicProcedure.query(async ({ ctx }) => {
        const kitchenData: AxiosResponse<ResponseData> = await axios.get(sensors.raspZero.url);
        const livingRoomData: AxiosResponse<ResponseData> = await axios.get(sensors.nodeMCU.url);
        console.log(kitchenData.data);
        const response = {
            kitchen: {
                room: "kitchen",
                temperature: kitchenData.data.response.temperature,
                humidity: kitchenData.data.response.humidity,
            },
            livingRoom: {
                room: "livingRoom",
                temperature: livingRoomData.data.response.temperature,
                humidity: livingRoomData.data.response.humidity,
            },
        }
        // //get current weather in Kiel
        // const currentWeather = await axios.get("https://api.openweathermap.org/data/2.5/weather?q=Kiel&appid=2b3e1b1b1b1b1b1b1b1b1b1b1b1b1b1b&units=metric")
        return response;
        // return { kitchen: 20, currentWeather: 20 };
    }),
    getSecretTemps: protectedProcedure
        .query(async ({ ctx }) => {
            axios.request(options).then(function (response) {
                console.log(response.data);
            }).catch(function (error) {
                console.error(error);
            });
            //     const julianData = await axios.get(`${sensors.RaspPi4.ip}:${sensorPorts}/temp`);
            //     return { julian: julianData.data };

        }),
});
