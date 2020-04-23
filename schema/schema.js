const graphql = require('graphql');
//const _ = require('lodash');
const axios = require('axios');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema
} = graphql;

/*
const users = [
    {id:'123', firstName: 'Bill', age: 23},
    {id:'124', firstName: 'Andy', age: 33}
];

*/


const UserType = new GraphQLObjectType({
    name : 'User',
    fields :{
        id: {type:GraphQLString } ,
        firstName: {type:GraphQLString } ,
        age: {type:GraphQLInt } 

    }
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
        }

    }
}) ;

module.exports = new GraphQLSchema({
    query:RootQuery
});

