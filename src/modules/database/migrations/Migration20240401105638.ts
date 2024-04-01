import { Migration } from '@mikro-orm/migrations';

export class Migration20240401105638 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "organisation" ("id" varchar(255) not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "last_ingestion_data_date" timestamptz null, "name" varchar(255) not null, "some_boolean" boolean not null default false, "book_stats" jsonb null, "order_stats" jsonb null, constraint "organisation_pkey" primary key ("id"));');
    this.addSql('create index "organisation_id_index" on "organisation" ("id");');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "organisation" cascade;');
  }

}
