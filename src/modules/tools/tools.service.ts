import { Injectable, Logger } from '@nestjs/common';
import { EntityManager, MikroORM } from '@mikro-orm/core';
import { ToolsEntity } from './tools.entity';

@Injectable()
export class ToolsService {
    private readonly logger = new Logger('ToolsService');

    constructor(private readonly entityManager: EntityManager, private readonly orm: MikroORM) {}

    async getAll() {
        return this.entityManager.find(ToolsEntity, {});
    }

    async create() {
        const tool = new ToolsEntity();
        tool.mutations = 0;
        this.entityManager.persist(tool);
        return tool;
    }

    async increment(tool: ToolsEntity) {
        tool.mutations++;
        this.entityManager.persist(tool);
        return tool;
    }

    async testCreateOrUpdate() {
        const tools = await this.getAll();
        if (tools.length === 0) {
            tools.push(await this.create());
            await this.entityManager.flush();
            return tools;
        }

        tools[0] = await this.increment(tools[0]);
        await this.entityManager.flush();
        return tools;
    }

    async rwTestMikro() {
        //Lets check if the UOW is empty (as it should be)
        this.logger.log('keys: ' + this.entityManager.getUnitOfWork().getIdentityMap().keys().length);

        //create a new tool in memory
        const newTool = await this.create();

        //flush this to the database
        await this.entityManager.flush();

        //read another tool from the database
        const readTool = await this.entityManager.findOne(ToolsEntity, { id: { $ne: newTool.id } });

        //remove the new tool from memory
        this.entityManager.remove(newTool);

        //flush the removal to the database
        await this.entityManager.flush();

        return true;
    }
}
