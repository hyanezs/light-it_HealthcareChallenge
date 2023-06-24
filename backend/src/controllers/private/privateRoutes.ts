import { Router } from 'express';
import diagnosisController from './diagnosisController';
import meController from './meController';
import symptomsController from './symptomsController';

const privateRoutes = Router();

privateRoutes.use('/me', meController);
privateRoutes.use('/diagnosis', diagnosisController);
privateRoutes.use('/symptoms', symptomsController);

export default privateRoutes;
