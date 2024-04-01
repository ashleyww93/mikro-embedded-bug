import { Global, Module, forwardRef } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Organisation } from './organisation.entity';
import { OrganisationResolver } from './organisation.resolver';
import { OrganisationService } from './organisation.service';

@Global()
@Module({
    imports: [MikroOrmModule.forFeature([Organisation])],
    providers: [OrganisationResolver, OrganisationService],
    controllers: [],
    exports: [OrganisationService],
})
export class OrganisationModule {}
