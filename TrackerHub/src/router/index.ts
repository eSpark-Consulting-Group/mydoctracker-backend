import express from 'express';
import fs from "fs";

const router = express.Router();

// router.use("/v1", v1);



fs.readdirSync(__dirname)
    .filter((file: string) => (file !== "index.ts" && file !== "index.js"))
    .forEach((file: string) => {
        if (file.toLowerCase()) {
            router.use(`/${file}`, require(`./${file}`));
        }
    });

export default router