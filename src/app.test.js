import request from "supertest"
import {describe, expect, test} from "@jest/globals";
import app from "./app.js"

describe("Avatar API", () => {
    const testData = {
        "avatarName": "Mark",
        "childAge": 12,
        "skinColor": "#0000ff",
        "hairstyle": "short-curly",
        "headShape": "oval",
        "upperClothing": "jacket",
        "lowerClothing": "shorts"
    }
    test("Create avatar", async () => {
        const response = await request(app)
            .post('/api/avatars')
            .auth('nikita@srh.edu', 'Ra123')
            .send(testData)
            .set('Accept', 'application/json')
            .expect(201)
        expect(response.body).toMatchObject(testData)
        // expect(response.body.id).toBeGreaterThan(0)
        expect(response.body.createdAt).toBeDefined()

        const response2 = await request(app)
            .get(`/api/avatars/${response.body.id}`)
            .auth('nikita@srh.edu', 'Ra123')
            .set('Accept', 'application/json')
            .expect(200)

    })

    test ('test dress working', async () => {


        let test_data = {
            "avatarName": "David",
            "childAge": "12",
            "skinColor": "#53165F",
            "hairstyle": "short",
            "headShape": "oval",
            "upperClothing": "dress",
            "lowerClothing": "jeans"
        }


        const dressWithJeans = await request(app)
            .post('/api/avatars')
            .auth('nikita@srh.edu', 'Ra123')
            .send(test_data)
            .expect(400)

        let test_data2 = {
            "avatarName": "David",
            "childAge": "12",
            "skinColor": "#53165F",
            "hairstyle": "short",
            "headShape": "oval",
            "upperClothing": "dress",
        }


        const dressWithoutJeans= await request(app)
            .post('/api/avatars')
            .auth('nikita@srh.edu', 'Ra123')
            .send(test_data2)
            .expect(201)



    });

    test("Get all avatars", async () => {
        const prevArray = await request(app).get('/api/avatars').auth('nikita@srh.edu', 'Ra123').expect(200)

        const response = await request(app)
            .post('/api/avatars')
            .auth('nikita@srh.edu', 'Ra123')
            .send(testData)

            .set('Accept', 'application/json')
            .expect(201)

        const newArray = await request(app).get('/api/avatars').expect(200)

        expect(newArray.body.length).toBeGreaterThan(prevArray.body.length)
        expect(newArray.body).toEqual(expect.arrayContaining([expect.objectContaining({id: response.body.id})]))
    })
    test("Update avatar", async () => {
        const updateFields = {
            "avatarName": "Mark",
            "childAge": 14,
            "skinColor": "#ffd",
            "hairstyle": "short-curly",
            "headShape": "oval",
            "upperClothing": "jacket",
            "lowerClothing": "shorts"
        }

        const newAvatar = await request(app)
            .post('/api/avatars')
            .auth('nikita@srh.edu', 'Ra123')
            .send(testData)

            .set('Accept', 'application/json')
            .expect(201)

        const updating = await request(app)
            .put(`/api/avatars/${newAvatar.body.id}`)
            .auth('nikita@srh.edu', 'Ra123')
            .send(updateFields)
            .set('Accept', 'application/json').expect(204)

        const changedAvatar = await request(app)
            .get(`/api/avatars/${newAvatar.body.id}`)
            .auth('nikita@srh.edu', 'Ra123')
            .set('Accept', 'application/json')
            .expect(200)

        expect({...newAvatar.body, ...updateFields}).toMatchObject(changedAvatar.body)
    })

    test("Deleting avatar", async () => {
        const prevArray = await request(app).get('/api/avatars').auth('nikita@srh.edu', 'Ra123').expect(200)

        const response = await request(app)
            .post('/api/avatars')
            .auth('nikita@srh.edu', 'Ra123')
            .send(testData)
            .set('Accept', 'application/json')
            .expect(201)

        const deleting = await request(app)
            .delete(`/api/avatars/${response.body.id}`)
            .auth('nikita@srh.edu', 'Ra123')
            .expect(204)

        const newArray = await request(app).get('/api/avatars').expect(200)

        expect(newArray.body.length).toEqual(prevArray.body.length)
    })

    test('Creating user', async ()=>{
       const data = {
           "name": "Nikita",
           "password": "Ra123",
           "userName": "nikita@srh.edu",
       }

       const response = await request(app)
           .post('/api/users')
           .send(data)
           .set('Accept', 'application/json')
           .expect(201)


    })

    test('Create user with bad request', async ()=>{
        const data = {
            "password": "Ra123",
            "userName": "nikita@srh.edu",
        }

        const response = await request(app)
            .post('/api/users')
            .send(data)
            .set('Accept', 'application/json')
            .expect(400)
    })


})