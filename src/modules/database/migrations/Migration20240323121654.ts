import { Migration } from '@mikro-orm/migrations';

export class Migration20240323121654 extends Migration {
    async up(): Promise<void> {
        this.addSql(
            'create table "tools" ("id" varchar(255) not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "mutations" int not null default 0, constraint "tools_pkey" primary key ("id"));',
        );
        this.addSql('create index "tools_id_index" on "tools" ("id");');
    }

    async down(): Promise<void> {
        this.addSql('drop table if exists "tools" cascade;');
    }
}
