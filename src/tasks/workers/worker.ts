import logger from '../../utils/logger.util';
import startEmailWorker from './email.worker';

const startWorkers = async () => {
    const emailWorker = await startEmailWorker();
    //

    process.on('SIGTERM', async () => {
        await Promise.all([emailWorker.close()]);
        logger.log({
            data: '[SIGTERM]: Shutdown all Queue listeners',
            label: 'worker',
            type: 'info',
        });
    });

    process.on('SIGINT', async () => {
        await Promise.all([emailWorker.close()]);
        logger.log({
            data: '[SIGINT]: Shutdown all Queue listeners',
            label: 'worker',
            type: 'info',
        });
    });
};

export default startWorkers;
