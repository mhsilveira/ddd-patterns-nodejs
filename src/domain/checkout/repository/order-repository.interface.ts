import RepositoryInterface from "../../@shared/repository/repository-interface";
import Order from "../entity/order";

export default interface OrderRepositoryInterface extends RepositoryInterface<Order> {
    create(entity: Order): Promise<void>;
    update(entity: Order): Promise<void>;
    find(id: string): Promise<Order>;
    findAll(): Promise<Order[]>;
}