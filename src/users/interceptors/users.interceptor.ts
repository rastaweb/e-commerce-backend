import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { map, Observable } from 'rxjs';
import { User } from "../entities/user.entity";

@Injectable()
export class UserInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<User | User[]>): Observable<User | User[]> | Promise<Observable<User | User[]>> {
        return next.handle().pipe(
            map(user => plainToInstance(User, user))
        )
    }
}
