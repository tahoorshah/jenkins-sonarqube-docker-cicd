import { describe, it, after } from 'node:test';
import assert from 'node:assert/strict';
describe('API Endpoints', () => {
 it('GET / returns 200 with message', async () => {
 const res = await fetch('http://localhost:3000/');
 assert.equal(res.status, 200);
 const body = await res.json();
 assert.ok(body.message);
 });
 it('GET /health returns healthy status', async () => {
 const res = await fetch('http://localhost:3000/health');
 assert.equal(res.status, 200);
 const body = await res.json();
 assert.equal(body.status, 'healthy');
 });
});
