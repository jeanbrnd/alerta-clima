import { Prisma, Subscription } from "../generated/prisma/client.js";
import prisma from "../prisma.js";


class SubscriptionService {
    public async create(args: Prisma.SubscriptionCreateArgs): Promise<Subscription> {
         const subscription = await prisma.subscription.create(args);

         return subscription;
    };
   
    public async getByPhone(phone: string): Promise<Subscription | null> {
         const subscription = await prisma.subscription.findUnique({ where: { phone }});

         return subscription;
    };

    public async update(args: Prisma.SubscriptionUpdateArgs): Promise<Subscription> {
        const subscription = await prisma.subscription.update(args);
        
        return subscription;
    };
    
};

export default new SubscriptionService();