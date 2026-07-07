import { Router } from 'express';
import { crear, misPedidos, todos } from '../controllers/pedidoController.js';
import { proteger, autorizar } from '../middleware/auth.js';

const router = Router();

router.use(proteger);

router.post('/', crear);
router.get('/mis-pedidos', misPedidos);
router.get('/', autorizar('admin'), todos);

export default router;
