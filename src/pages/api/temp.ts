import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../server/db/client";

const sensors = {
    kitchen: {
        ip: "192.168.178."
    },
    julian: {
        ip: "192.168.178.32"
    }
}

const sensorPorts = "3002"

const temp = async (req: NextApiRequest, res: NextApiResponse) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type")
    if (req.method === "GET") {
        if (JSON.stringify(req.body) === JSON.stringify({})) {
            const kitchenData = await axios.get(`${sensors.kitchen.ip}:${sensorPorts}/temp`);
            const julianData = await axios.get(`${sensors.julian.ip}:${sensorPorts}/temp`);
            return res.status(200).json({ kitchen: kitchenData.data, julian: julianData.data });
        } else {
            const kitchenData = await axios.get(`${sensors.kitchen.ip}:${sensorPorts}/temp`);
            return res.status(200).json({ kitchen: kitchenData.data });
        }

    }
    else if (req.method === "OPTIONS") {
        return res.status(204).end();
    }
    return res.status(404).json({ message: "wrong method" });

};

export default temp;
