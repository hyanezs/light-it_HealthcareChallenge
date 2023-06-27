import { Router } from 'express';
import HealthController from './healthController';
import SessionController from './sessionController';

const publicRoutes = Router();

publicRoutes.use('/auth', SessionController);
publicRoutes.use('/health', HealthController);

export default publicRoutes;
