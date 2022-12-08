import { router, publicProcedure } from "../trpc";
import { z } from "zod";
import axios from "axios";
import { map, orderBy } from "lodash";

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
    },
    ESP32: {
        id: 3,
        location: "ersatz",
        url: "http://192.168.178.40:80/temp",
    },
}

interface ResponseData {
    room: string,
        temperature: number,
        humidity: number,
}

async function getTemps(isJulian: boolean) {
    const response: ResponseData[] = []
    await Promise.all(map(sensors, async (iSensor) => {
        if (iSensor.location === "julian" && !isJulian) return;
        await axios.get(iSensor.url).then((res) => {
            response.push({
                room: iSensor.location,
                temperature: res.data?.response.temperature,
                humidity: res.data?.response.humidity,
            });
        })
            .catch((err) => {
                response.push({
                    room: iSensor.location,
                    temperature: 0,
                    humidity: 0,
                });
                console.error(err);
            });
    }))

    return response;
}

export const tempRouter = router({
    getTemps: publicProcedure.query(async ({ ctx }) => {
        const temps = await getTemps(ctx.session?.user?.name === "bayerju");
        return orderBy(temps, ["room"], ["asc"]);
    }),
});
