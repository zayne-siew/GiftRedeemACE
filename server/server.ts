import { config } from 'dotenv';
import { Server } from 'http';
import { ILogObj, Logger } from 'tslog';
import app from './app';

const log: Logger<ILogObj> = new Logger({ minLevel: 3 });
config();

const port: number | string = process.env.PORT || 5500;
const server: Server = app.listen(port, () =>
    log.info(`Server is running on port ${port}`)
);
export default server;
