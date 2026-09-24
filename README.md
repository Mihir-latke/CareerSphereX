# CareerSphereX — Full Project

A complete, self-contained career-development platform: Spring Boot
(Java 21) backend + React (Vite) frontend, wired together and using a
distinct cartographic ("career route") visual identity throughout.

Extract this zip fresh into its own folder. Don't merge it into any
previous copy of this project — a clean extract avoids the file-path
drift that caused most of the earlier setup issues.

```
careerspherex/
├── backend/     Spring Boot API (Java 21, Maven)
├── frontend/    React app (Vite)
└── README.md    this file
```

## What's actually built

**Backend** — all 15 entities from the original schema, mapped 1:1
(users, skills, careers, roadmaps, jobs, applications, interviews, etc.),
JWT auth, and working REST endpoints for:
- Register / login (`/api/auth/*`)
- Current user (`/api/users/me`)
- Skill catalog + a user's own skills, full CRUD (`/api/skills`,
  `/api/users/me/skills`)
- Profile, get + update (`/api/users/me/profile`)

**Frontend** — a real, connected app, not a static mockup:
- Login / Register / Forgot password, calling the real backend
- A dashboard shell with sidebar navigation
- **Profile page** — edit and save your background (location, education,
  career goal, bio, etc.) against the real database
- **Skills page** — add/remove skills from a starter catalog, see them
  listed with level and years of experience, all persisted for real

Career Recommendations, Skill Gaps, Learning Roadmap, Resume, Jobs,
Applications, and Interview Prep aren't built yet — the entities and
repositories exist on the backend, but no service/controller/page for
them yet. They're the natural next slice, following the same pattern as
Skills (service → controller → frontend service → page).

## The database — starts blank, fills itself in

You don't need to run any `.sql` scripts. Point the backend at a blank
MySQL database and Hibernate creates every table automatically on first
startup (`spring.jpa.hibernate.ddl-auto=update` in
`backend/src/main/resources/application.properties`).

The skill catalog also seeds itself automatically the first time the
backend runs — 15 common skills (Java, React, SQL, System Design, etc.)
so the Skills page isn't empty on day one. This only runs once; it's a
no-op on every startup after that.

## Setup

**1. Create a blank database:**
```sql
CREATE DATABASE careerspherex CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

**2. Run the backend.** In IntelliJ:
1. Open the `backend/` folder as a project
2. **Set Project SDK to Java 21** (`Ctrl+Alt+Shift+S` → Project → SDK).
   This matters — Java 24 causes a Hibernate/Tomcat startup crash.
3. `Run → Edit Configurations` → your `CareerSphereXApplication` config
   → **Environment variables**:
   ```
   DB_USERNAME=root;DB_PASSWORD=your_mysql_password;JWT_SECRET=any-long-random-string-32-chars-plus
   ```
4. Confirm that same run configuration's JDK is also set to 21 (it's a
   separate field from the Project SDK)
5. Open `CareerSphereXApplication.java`, click the green run arrow
6. Watch for `CREATE TABLE` statements, then `Tomcat started on port(s): 8080`

**3. Run the frontend:**
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```
Opens at `http://localhost:5173`.

**4. Use it:** register a real account, land on the dashboard, click
"Add skills" or "Complete profile" — both save to your actual MySQL
database.

## Troubleshooting

| Symptom | Fix |
|---|---|
| `Unable to determine Dialect` / Hibernate crash on startup | You're on Java 24 somewhere — check both Project SDK and the run configuration's JDK, set both to 21 |
| `Access denied for user` | Wrong `DB_USERNAME`/`DB_PASSWORD` in the run configuration |
| `net::ERR_CONNECTION_REFUSED` in the browser console | Backend isn't running — start it in IntelliJ first |
| Registration/login gives a generic error | Check IntelliJ's Run panel for the real Java stack trace at that moment — copy the `Caused by:` line |
| Lombok / `ExceptionInInitializerError` at compile time | `File → Settings → Build, Execution, Deployment → Compiler → Annotation Processors` → enable it; also try `Build, Execution, Deployment → Build Tools → Maven → Runner` → "Delegate IDE build/run actions to Maven" |
