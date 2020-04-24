const graphql = require('graphql');
//const _ = require('lodash');
const axios = require('axios');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
} = graphql;

/*
const users = [
    {id:'123', firstName: 'Bill', age: 23},
    {id:'124', firstName: 'Andy', age: 33}
];

*/

const CompanyType = new GraphQLObjectType({
    name : 'Company',
    fields : () => ({    // we created a closure so that we dont get referene error for usertype
        id: {type:GraphQLString } ,
        name: {type:GraphQLString } ,
        description: {type:GraphQLString },
        users:{
            type:new GraphQLList(UserType),
            resolve(parentValue,args){
                return axios.get(`http://localhost:3000/companies/${parentValue.id}/users`)
                .then(res=>res.data);
            }
        } 

    })
})


const UserType = new GraphQLObjectType({
    name : 'User',
    fields : () => ({
        id: {type:GraphQLString } ,
        firstName: {type:GraphQLString } ,
        age: {type:GraphQLInt },
        company: {
            type:CompanyType,
            resolve(parentValue,args){
                 return axios.get(`http://localhost:3000/companies/${parentValue.companyId}`)
                 .then((resp)=>resp.data); 
            }
        }
    
    })
});


const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {

        user:{
            type:UserType,
            args:{id:{type:GraphQLString}},
            resolve(parentValue, args){
                //return _.find(users, {id:args.id});     
                return axios.get(`http://localhost:3000/users/${args.id}`)
                .then(resp=> resp.data); // axis send back data nested under data: tag => Strip it   
            }    
        },
        company:{
            type:CompanyType,
            args:{ id: { type: GraphQLString}},
            resolve(parentValue, args){
                return axios.get(`http://localhost:3000/companies/${args.id}`)
                .then(resp=> resp.data);
            }    
        }     
    }
}) ;


const mutation = new GraphQLObjectType({
    name:'Mutation',
    fields:{
        addUser: {
            type: UserType, // return type from addUser mutation
            args: {
                firstName: {type: new GraphQLNonNull(GraphQLString)},
                age:{type: new  GraphQLNonNull(GraphQLInt)},
                companyId:{type: GraphQLString}
            },
            resolve(parentValue, {firstName, age}){
                return axios.post('http://localhost:3000/users', {firstName, age})
                .then(resp=> resp.data);
            }
        }
    }
})


module.exports = new GraphQLSchema({
    query:RootQuery,
    mutation
});

