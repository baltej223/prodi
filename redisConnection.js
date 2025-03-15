import { createClient } from 'redis';

const redisClient = createClient({
    username: 'default',
    password: 'mb35ThzKo6aQzZcjwjWnMBAFvJLvmMP3',
    socket: {
        host: 'redis-14073.c262.us-east-1-3.ec2.redns.redis-cloud.com',
        port: 14073
    }
});

redisClient.on('error', err => console.log('Redis client Error', err));

await redisClient.connect();

console.log("Connected to Redis Server.");
// await redisClient.set('foo', 'bar');
const result = await redisClient.get('foo');
console.log(result);

export default redisClient;