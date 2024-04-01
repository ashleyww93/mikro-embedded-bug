import { Migration } from '@mikro-orm/migrations';

export class Migration20240401110651 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "organisation_metadata" ("id" varchar(255) not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "organisation_id" varchar(255) null, "key" text not null, "value" text not null, constraint "organisation_metadata_pkey" primary key ("id"));');
    this.addSql('create index "organisation_metadata_id_index" on "organisation_metadata" ("id");');

    this.addSql('alter table "organisation_metadata" add constraint "organisation_metadata_organisation_id_foreign" foreign key ("organisation_id") references "organisation" ("id") on update cascade on delete cascade;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "organisation_metadata" cascade;');
  }

}
