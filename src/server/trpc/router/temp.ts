import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";
import axios from "axios";

const sensors = {
    kitchen: {
        ip: "192.168.178."
    },
    julian: {
        ip: "192.168.178.32"
    }
}

const sensorPorts = "3002"

export const tempRouter = router({
    getTemps: publicProcedure.query(async ({ ctx }) => {
        // const kitchenData = await axios.get(`${sensors.kitchen.ip}:${sensorPorts}/temp`);

        // //get current weather in Kiel
        // const currentWeather = await axios.get("https://api.openweathermap.org/data/2.5/weather?q=Kiel&appid=2b3e1b1b1b1b1b1b1b1b1b1b1b1b1b1b&units=metric")
        // return { kitchen: kitchenData.data, currentWeather: currentWeather.data };
        return { kitchen: 20, currentWeather: 20 };
    }),
    getSecretTemps: protectedProcedure
        .query(async ({ ctx }) => {
            const julianData = await axios.get(`${sensors.julian.ip}:${sensorPorts}/temp`);
            return { julian: julianData.data };
        }),
});
