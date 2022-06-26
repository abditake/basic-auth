'use strict';

const { server } = require('../src/server');
const { sequelize } = require('../src/auth/models');
const base64 = require('base-64');
const supertest = require('supertest');
const request = supertest(server);


beforeAll(async () => {
  await sequelize.sync();
});

afterAll(async () => {
  await sequelize.drop();
});



describe('Testing Basic Auth Server',()=>{
  
  test('Should allow users to signup, with a POST to /signup',async ()=>{
    let response = await request.post('/signup').send({
      username: 'Abdi',
      password: 'password23'
    });
    console.log('Response Body', response.body);
    expect(response.status).toEqual(200);
    expect(response.body.username).toEqual('Abdi');
    expect(response.body.password).toBeTruthy();
    expect(response.body.password).not.toEqual('Abdi');
    
  })
  test('should allow a user to `signin` with correct password', async ()=>{
    let authString = 'Abdi:password23'

    let encodedString = base64.encode(authString);
    console.log(`THIS IS THE ENCODED STRING ${encodedString}`);
    let response = await request.post('/signin').set('Authorization', `Basic ${encodedString}`);
    console.log(`THIS IS THE RESPONSE.BODY: `, response.body);
    expect(response.status).toEqual(200);
    expect(response.body.username).toEqual('Abdi');
  })
})