# CareerSphereX — Backend (auto-creates its own schema)

This is a complete, self-contained rebuild of the backend. Extract this
zip fresh — don't merge it into an existing folder — to avoid the kind
of file-path drift we ran into before.

## What's different in this version

You don't need to run any `.sql` scripts yourself. Point this at a
**blank** MySQL database and Hibernate will create every table for you
automatically, based on the Java entity classes in
`src/main/java/com/careerspherex/entity/`.

This is controlled by one line in
`src/main/resources/application.properties`:
```properties
spring.jpa.hibernate.ddl-auto=update
```
`update` means: on every startup, Hibernate checks the database, creates
any tables/columns that don't exist yet, and never deletes existing data.

## Setup

**1. Create a blank database in MySQL** (skip this if you already have one):
```sql
CREATE DATABASE careerspherex CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```
If your database has a different name, you'll override it below — no code
changes needed.

**2. Set your credentials.** Everything reads from environment variables
with safe fallback defaults, all defined in one place:
`src/main/resources/application.properties`. You need at minimum:

| Variable | Purpose | Default if unset |
|---|---|---|
| `DB_NAME` | your database name | `careerspherex` |
| `DB_USERNAME` | MySQL username | `root` |
| `DB_PASSWORD` | MySQL password | *(empty)* |
| `JWT_SECRET` | signs login tokens — any string 32+ characters | a placeholder (fine for local dev, but set your own) |

**In IntelliJ** (recommended, given the JDK issues we hit before):
1. `Run -> Edit Configurations...`
2. Select (or create) the `CareerSphereXApplication` configuration
3. In **Environment variables**, add:
   ```
   DB_USERNAME=root;DB_PASSWORD=your_mysql_password;JWT_SECRET=any-long-random-string-here
   ```
   (semicolon-separated, all on one line, in that field)
4. **Important - set the JDK for this run configuration to Java 21**, not
   Java 24. Look for a "JRE"/"SDK" dropdown in the same dialog. Java 24
   caused the Hibernate crash we saw earlier; 21 is the tested/supported
   version for this Spring Boot version.
5. Apply -> OK, then run `CareerSphereXApplication` as before (green run
   arrow next to `main`)

**In a terminal**, equivalently:
```bash
export DB_USERNAME=root
export DB_PASSWORD=your_mysql_password
export JWT_SECRET=any-long-random-string-here
cd backend
mvn spring-boot:run
```

## What success looks like

In the console/Run panel, near the end:
```
Tomcat started on port(s): 8080
```

And since `spring.jpa.show-sql=true` is on by default in this version,
you'll actually see the `CREATE TABLE` statements Hibernate runs scroll
by on that very first startup - that's it building your schema from
scratch.

Check it worked: open MySQL Workbench (or any client) and look at the
`careerspherex` database - all 15 tables (`users`, `skills`, `careers`,
etc.) should now exist, even though you started from blank.

## If it still fails

- **`Access denied for user`** -> wrong `DB_USERNAME`/`DB_PASSWORD`
- **`Unknown database`** -> the database named in `DB_NAME` (or the
  default `careerspherex`) doesn't exist - but note
  `createDatabaseIfNotExist=true` is in the JDBC URL, which usually
  handles this automatically; if it still fails, your MySQL user may
  lack `CREATE DATABASE` privilege - create the database manually
  (step 1 above) instead
- **Something about Java version / Dialect / JdbcEnvironment** -> you're
  still running on JDK 24 somewhere. Double check Project Structure
  (`Ctrl+Alt+Shift+S`) -> Project SDK is set to 21, AND the run
  configuration's own JDK field (they're separate settings in IntelliJ)

## Auth endpoints, once it's running

- `POST /api/auth/register` - `{ name, email, password }`
- `POST /api/auth/login` - `{ email, password }`
- `GET /api/users/me` - requires `Authorization: Bearer <token>`
- `GET /api/skills`, `POST /api/users/me/skills`, etc. - see
  `SkillController.java` for the full list
