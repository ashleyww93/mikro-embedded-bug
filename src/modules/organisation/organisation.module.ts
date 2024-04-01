import { Global, Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { OrganisationMetadata } from './metadata/organisation.metadata.entity';
import { Organisation } from './organisation.entity';
import { OrganisationResolver } from './organisation.resolver';
import { OrganisationService } from './organisation.service';

@Global()
@Module({
    imports: [MikroOrmModule.forFeature([Organisation, OrganisationMetadata])],
    providers: [OrganisationResolver, OrganisationService],
    controllers: [],
    exports: [OrganisationService],
})
export class OrganisationModule {}
