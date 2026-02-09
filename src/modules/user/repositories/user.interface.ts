import { UserDomain, UserModel} from "@modules/user/domain";


export interface IUserRepository {
   
    save(user: UserDomain): Promise<UserModel>;
    update(user: UserDomain,userId:string): Promise<UserModel>;
    findById(userId: string): Promise<UserModel | null>;
   
}