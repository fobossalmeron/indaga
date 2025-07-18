-- BetterAuth Required Tables

-- Drop conflicting user table if it exists from a previous bad migration
DROP TABLE IF EXISTS "user" CASCADE;

-- Sessions table
CREATE TABLE IF NOT EXISTS "session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "expiresAt" TIMESTAMP NOT NULL,
    "token" TEXT NOT NULL UNIQUE,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" UUID NOT NULL,
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
);

-- Accounts table (for social providers)
CREATE TABLE IF NOT EXISTS "account" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" UUID NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP,
    "refreshTokenExpiresAt" TIMESTAMP,
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
);

-- Verification table (for magic links)
CREATE TABLE IF NOT EXISTS "verification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS "idx_session_userId" ON "session" ("userId");
CREATE INDEX IF NOT EXISTS "idx_account_userId" ON "account" ("userId");
CREATE INDEX IF NOT EXISTS "idx_verification_identifier" ON "verification" ("identifier");

-- Create a view named "user" that mirrors the "users" table.
-- This is a workaround for better-auth, which expects a table named "user"
-- with columns in camelCase, while our table uses snake_case.
CREATE OR REPLACE VIEW "user" AS
SELECT
    id,
    email,
    full_name AS name,
    created_at AS "createdAt",
    updated_at AS "updatedAt",
    email_verified AS "emailVerified",
    avatar_url AS "avatarUrl",
    provider,
    role
FROM "users";

-- Since views in PostgreSQL are not updatable by default,
-- we need to create rules to handle INSERT, UPDATE, and DELETE operations
-- on the "user" view and redirect them to the underlying "users" table.

-- Rule for INSERTs on the "user" view
CREATE OR REPLACE RULE user_insert AS
    ON INSERT TO "user"
    DO INSTEAD (
        INSERT INTO "users" (id, email, full_name, created_at, updated_at, email_verified, avatar_url, provider, role)
        VALUES (
            NEW.id,
            NEW.email,
            NEW.name,
            NEW."createdAt",
            NEW."updatedAt",
            NEW."emailVerified",
            NEW."avatarUrl",
            NEW.provider,
            NEW.role
        )
        RETURNING
            id,
            email,
            full_name AS name,
            created_at AS "createdAt",
            updated_at AS "updatedAt",
            email_verified AS "emailVerified",
            avatar_url AS "avatarUrl",
            provider,
            role
    );

-- Rule for UPDATEs on the "user" view
CREATE OR REPLACE RULE user_update AS
    ON UPDATE TO "user"
    DO INSTEAD (
        UPDATE "users"
        SET
            email = NEW.email,
            full_name = NEW.name,
            updated_at = NEW."updatedAt",
            email_verified = NEW."emailVerified",
            avatar_url = NEW."avatarUrl",
            provider = NEW.provider,
            role = NEW.role
        WHERE id = OLD.id
    );

-- Rule for DELETEs on the "user" view
CREATE OR REPLACE RULE user_delete AS
    ON DELETE TO "user"
    DO INSTEAD (
        DELETE FROM "users"
        WHERE id = OLD.id
    ); 