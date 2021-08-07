import {Model, Server, Response, Registry, Request} from 'miragejs'
import { ModelDefinition, AnyModels } from 'miragejs/-types';
import Schema from 'miragejs/orm/schema';
import {authenticate} from './auth'
import { AxiosAdditionalProps, AuthUser } from './common';

type UserType = {username: string, password: string}
const UserModel: ModelDefinition<UserType> = Model.extend({});
type AppRegistry = Registry<
    {
        user: typeof UserModel
    },
    {}
>;
type AppSchema = Schema<AppRegistry>
type AppServer = Server<AppRegistry>
type JsonRequest = {
    username: string,
    password: string
}

function createAuthEndpoint():AppServer{
    return new Server({
        models:{
            user: Model
        },

        seeds(server:AppServer) {
            server.create("user", { username:'some_user', password:"somePassword123!@#"})
            server.create("user", { username:'other_user', password:"otherPassword123!@#"})
            server.create("user", { username:'this_user', password:"thisPassword123!@#"})
        },

        routes(){
            this.namespace = "/api"

            this.post("/auth/login",(schema: AppSchema, request: Request)=>{
                let jbody:JsonRequest;
                const successResponseBody:object = 
                    {
                        success: true, message: "Succesfully authenticated.", code:200, 
                        stats:{       
                            start_date: "2021-07-26T20:40:45.754817Z",
                            end_date: "2021-07-26T20:40:46.113792Z",
                            duration: 358975,
                            duration_unit: "microseconds"
                        }
                    }
                const failedResponse: object = {
                    success: false, message: "Fail.", code:401, 
                }
                const successResponse = new Response(200,{},successResponseBody)
                jbody = JSON.parse(request.requestBody)
                if (!jbody.username || !jbody.password) return new Response(401,{},failedResponse)

                const user = schema.findBy('user', {username:jbody.username, password: jbody.password})

                if (user){
                    return successResponse
                }

                return new Response(401,{},failedResponse)
                    
            })
        }
    })
}

describe("Authentication fetch test success.", ()=>{
    let server:AppServer;

    //creates server for requests
    beforeAll(()=>{
        server = createAuthEndpoint()
    })
    //shutdown the server after all tests run
    afterAll(()=>{
        if (server) server.shutdown()
    })

    it("Gets success response.", async ()=>{
        //prepare
        let request = {
            user:{
                username:'some_user', password:"somePassword123!@#"
            },
            axiosParams: {
                url:"/api/auth/login",
                headers: {}
            }
        }
        let response =  {
            success: true, message: "Succesfully authenticated.", code:200, 
            stats:{       
                start_date: "2021-07-26T20:40:45.754817Z",
                end_date: "2021-07-26T20:40:46.113792Z",
                duration: 358975,
                duration_unit: "microseconds"
            }
        }
        //actual request
        let data = await authenticate(request.user, request.axiosParams)
        //test
        expect(data).toHaveProperty("code")
        expect(data).toHaveProperty("success")
        expect(data).toHaveProperty("stats")
        expect(data).toHaveProperty("message")
        expect(data).toMatchObject(response)
    })
    it("Gets failure response with incomplete request.", async ()=>{
        //prepare
        let requests:Array<{user:AuthUser, axiosParams:AxiosAdditionalProps}> = [{
                user:{
                    username:'some_user', password:""
                },
                axiosParams: {
                    url:"/api/auth/login",
                    headers: {}
                }
            },
            {
                user:{ 
                    password:"somePassword123!@#", username:""
                },
                axiosParams:{
                    url:"/api/auth/login",
                    headers: {}
                }

            }
        ]
        let response =  {
            success: false, message: "Fail.", code:401, 
        }
        for(let request of requests){
            let data = await authenticate(request.user, request.axiosParams)
            expect(data).toHaveProperty("code")
            expect(data).toHaveProperty("success")
            expect(data).toHaveProperty("message")
            expect(data).toMatchObject(response)
        }
     
    })
})

describe("Authentication fetch test success.", ()=>{
    let server:AppServer;

    //creates server for requests
    beforeAll(()=>{
        server = createAuthEndpoint()
    })
    //shutdown the server after all tests run
    afterAll(()=>{
        if (server) server.shutdown()
    })

    it("Gets success response.", async ()=>{
        //prepare
        let request = {
            user:{
                username:'some_user', password:"somePassword123!@#"
            },
            axiosParams: {
                url:"/api/auth/login",
                headers: {}
            }
        }
        let response =  {
            success: true, message: "Succesfully authenticated.", code:200, 
            stats:{       
                start_date: "2021-07-26T20:40:45.754817Z",
                end_date: "2021-07-26T20:40:46.113792Z",
                duration: 358975,
                duration_unit: "microseconds"
            }
        }
        //actual request
        let data = await authenticate(request.user, request.axiosParams)
        //test
        expect(data).toHaveProperty("code")
        expect(data).toHaveProperty("success")
        expect(data).toHaveProperty("stats")
        expect(data).toHaveProperty("message")
        expect(data).toMatchObject(response)
    })
    it("Gets failure response with incomplete request.", async ()=>{
        //prepare
        let requests:Array<{user:AuthUser, axiosParams:AxiosAdditionalProps}> = [{
                user:{
                    username:'some_user', password:""
                },
                axiosParams: {
                    url:"/api/auth/login",
                    headers: {}
                }
            },
            {
                user:{ 
                    password:"somePassword123!@#", username:""
                },
                axiosParams:{
                    url:"/api/auth/login",
                    headers: {}
                }

            }
        ]
        let response =  {
            success: false, message: "Fail.", code:401, 
        }
        for(let request of requests){
            let data = await authenticate(request.user, request.axiosParams)
            expect(data).toHaveProperty("code")
            expect(data).toHaveProperty("success")
            expect(data).toHaveProperty("message")
            expect(data).toMatchObject(response)
        }
     
    })
})
