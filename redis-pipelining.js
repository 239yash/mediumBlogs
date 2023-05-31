// Configuring an Express app.
const express = require("express");
const Redis = require("ioredis");
const app = express();
const port = 3000;

// Setting up Redis config. There are many ways for connecting to Redis server.
// You can check this -> https://github.com/luin/ioredis#connect-to-redis
const redis = new Redis({
    port: 6379, 
    host: "127.0.0.1", 
    username: "default", 
    password: "changeit",
    db: 1
});

// I have added 2 endpoints to show the differences how sequential commands
// works, And how the pipelining works in Redis
// run-sequential endpoint is triggering a for loop which sequentially
// executes 50,000 SET operations in Redis server.

app.get("/run-sequential", async (req, res) => {
    console.time("sequential time");
    for (let i = 0; i < 50000; i++) {
        await setKeyFunction("foo", "test-test")
    }
    console.timeEnd("sequential time");
    res.send("OK");
});

// run-pipeline endpoint is creating a pipeline object.
// In the for loop we are batching commands in that pipeline object.
// After for loop, We are executing the pipeling with 50,000 commands in it.

app.get("/run-pipeline", async (req, res) => {
    console.time("pipeline time");
    const pipeline = redis.pipeline();
    for (let i = 0; i < 50000; i++) {
        pipeline.set("foo", "test-test");
    }
    await pipeline.exec();
    console.timeEnd("pipeline time");
    res.send("OK");
});

// An async function for setting a key-value pair in Redis cache
const setKeyFunction = async (name, value) => {
    return await redis.set(name, value);
}

app.listen(port, () => {
    console.log(`Io-Redis pipelining demo app listening on port ${port}`);
});