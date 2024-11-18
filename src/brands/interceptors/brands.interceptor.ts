import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { map, Observable } from 'rxjs';
import { Brand } from "../entities/brand.entity";

@Injectable()
export class BrandInterseptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<Brand | Brand[]>): Observable<Brand | Brand[]> | Promise<Observable<Brand | Brand[]>> {
        return next.handle().pipe(
            map(user => plainToInstance(Brand, user))
        )
    }
}
