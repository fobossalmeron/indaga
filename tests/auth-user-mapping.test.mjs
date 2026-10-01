import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import ts from 'typescript'
import { getAuthTables, getSchema, convertToDB, convertFromDB } from 'better-auth/db'

// Inspect only the literal user configuration; do not import auth.ts, connect to
// the database, instantiate mail providers, or read local secrets.
const source = await readFile(new URL('../src/lib/auth.ts', import.meta.url), 'utf8')
const ast = ts.createSourceFile('auth.ts', source, ts.ScriptTarget.Latest, true)
const exported = ast.statements.find(node => ts.isExportAssignment(node))
const config = exported.expression.arguments[0]
const userNode = config.properties.find(node => node.name?.getText(ast) === 'user').initializer
const user = Function(`"use strict"; return (${userNode.getText(ast)})`)()
const tables = getAuthTables({ user })

test('Better Auth targets the physical users table and session foreign key remains users', () => {
  assert.equal(tables.user.modelName, 'users')
  const schema = getSchema({ user })
  assert.ok(schema.users)
  assert.equal(schema.user, undefined)
  assert.equal(schema.session.fields.userId.references.model, 'users')
})

test('new-user insertion maps Better Auth values to existing snake_case columns', () => {
  const now = new Date('2026-10-01T06:00:00Z')
  assert.deepEqual(convertToDB(tables.user.fields, {
    id:'existing-uuid', name:'Example', email:'example@example.invalid',
    emailVerified:false, image:null, createdAt:now, updatedAt:now,
  }), {
    id:'existing-uuid', full_name:'Example', email:'example@example.invalid',
    email_verified:false, avatar_url:null, created_at:now, updated_at:now,
  })
})

test('email verification update targets email_verified and returns existing public auth shape', () => {
  assert.deepEqual(convertToDB(tables.user.fields, {emailVerified:true}), {email_verified:true})
  const result = convertFromDB(tables.user.fields, {
    id:'existing-uuid',email:'example@example.invalid',full_name:'Example',email_verified:true,avatar_url:'/avatar.png',role:'user',
  })
  assert.equal(result.id,'existing-uuid')
  assert.equal(result.emailVerified,true)
  assert.equal(result.name,'Example')
  assert.equal(result.image,'/avatar.png')
  assert.equal(result.role,'user')
})
