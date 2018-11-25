import express from 'express';
import asyncMiddleware from '../middlewares/async_middleware';

export const create = (identityService) => async (req, res, next) => {
  const { managementKey } = req.body;
  try {
    const transaction = await identityService.create(managementKey);
    res.status(201)
      .type('json')
      .send(JSON.stringify({transaction}));
  } catch (err) {
    next(err);
  }
};

export const execution = (identityService) => async (req, res, next) => {
  try {
    const transaction = await identityService.executeSigned(req.body);
    res.status(201)
      .type('json')
      .send(JSON.stringify({transaction}));
  } catch (err) {
    next(err);
  }
};

export const createFactory = (identityService) => async (req, res) => {

    const transaction = await identityService.createIdentityFactory();
    res.status(201)
        .type('json')
        .send(JSON.stringify({transaction}));
};

export const transferTokensByLink = (identityService) => async (req, res) => {
    const {
	identityPubKey, // = "0xF695e673d7D159CBFc119b53D8928cEca4Efe99e",
	token, // = "0x0566C17c5E65d760243b9c57717031c708f13d26",
	amount, // = 1000,
	transitPubKey, // = "0x1111111111111111111111111111111111111111",
	sender, // = sender's identity contract "0x61639e4d54b819e5c09dc9f57c69b1ce176ef40a",
	sigSender,// = "0x1111111111111111111111111111111111111111"
	sigReceiver, // = "0x1111111111111111111111111111111111111111",	
    } = req.body;

    console.log({params: req.body});

    const transaction = await identityService.transferTokensByLink({
	identityPubKey,
	sigSender,
	sigReceiver,
	token,
	amount,
	transitPubKey,
	sender
    } );

    res.status(201)
        .type('json')
        .send(JSON.stringify({transaction}));
};


export default (identityService) => {
  const router = new express.Router();

  router.post('/',
	      asyncMiddleware(create(identityService)));

  router.post('/factory',
	      asyncMiddleware(createFactory(identityService)));
    
  router.post('/execution',
    asyncMiddleware(execution(identityService)));

    router.post('/transfer-by-link',
	asyncMiddleware(transferTokensByLink(identityService)));
    
  return router;
};
