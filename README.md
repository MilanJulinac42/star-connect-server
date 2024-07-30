## Migrations

1. Make some changes to the files with suffix `*.entity.ts`
2. Decide name for migration (eg. `new-username-column`)
3. Run `npm run migration:generate --name=new-username-column`
   - Check that new file was generated under [migrations/history](migrations/history)
   - Check that SQL query inside the file corresponds to what you wanted
4. If you want to run migration use `npm run migration:run`
   - Check that database was affected as expected

### Production migrations

Migrations will be applied automatically in other environments before application will start, since
we have `migrationsRun: true` configured in [src/config/database.ts](src/config/database.ts)

> You can simulate production migrations by doing 2 following steps:
>
> - Run `npm run build`
> - Run `npm run start:prod`
>
> After that check database that migration was applied properly

### Reverting migrations

Migrations can be reverted using `npm run migration:revert` which will call `down function` on the
latest migration file

- After that migration record will be removed from `migrations` table in database
- If you want to revert multiple migrations, just run this command multiple times...
