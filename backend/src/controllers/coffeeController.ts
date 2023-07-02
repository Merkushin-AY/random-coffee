import randomCoffeeService from '~/services/RandomCoffeeService';
import { NextFunction, Request, Response } from 'express';
import Cache from '~/utils/Cache';
import ControllerError from '~/errors/ControllerError';

const cache = new Cache({
    maxKeys: 1000, //  less than 300b per average coffee, so 300kb cache
});

interface getCoffeeParams {
    index: string,
}

export class CoffeeController {
    fetchingCoffee: Partial<Record<string, Promise<any>>> = {};

    public async getCoffee(req: Request<getCoffeeParams>, res: Response, next: NextFunction) {
        try {
            const index = +req.params.index;
            if ((!index && index !== 0) || index < 0) {
                throw new ControllerError('The index param is required and should be positive or equal to zero', 400);
            }
            let coffee = cache.get(index);
            if (!coffee) {
                // if some other request already fetching same coffee
                if (this.fetchingCoffee[index]) {
                    coffee = await this.fetchingCoffee[index];
                } else {
                    this.fetchingCoffee[index] = randomCoffeeService.getCoffee();
                    coffee = await this.fetchingCoffee[index];
                    delete this.fetchingCoffee[index];
                    if (cache.isAble()) cache.set(index, coffee);
                }
            }
            res.json(coffee);
        } catch (e) {
            next(e);
        }
    }
}

export default new CoffeeController();
