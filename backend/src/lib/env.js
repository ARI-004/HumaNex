import "dotenv/config"

export const ENV = {
    PORT : process.env.PORT,
    MOMGO_URL : process.env.MOMGO_URL,
    NODE_ENV : process.env.NODE_ENV,
}