import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../server/db/client";

const watched = async (req: NextApiRequest, res: NextApiResponse) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type")
    if (req.method === "GET") {
        const watchedE = await prisma.watched.findMany();
        return res.status(200).json(watchedE);
    } else if (req.method === "POST") {
        const watchedW = await prisma.watched.upsert({
            where: {
                link: req.body.link,
            },
            update: {},
            create: {
                link: req.body.link.toString(),
            }
        });
        console.log(watchedW);
        return res.status(200).json(watchedW);
    }
    else if (req.method === "OPTIONS") {
        return res.status(204).end();
    }
    return res.status(404).json({ message: "wrong method" });
};

export default watched
// export default watched;
