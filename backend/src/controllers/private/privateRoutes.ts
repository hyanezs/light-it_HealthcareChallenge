import { Router } from 'express';
import meController from './meController';

const privateRoutes = Router();

privateRoutes.use('/me', meController);

export default privateRoutes;
