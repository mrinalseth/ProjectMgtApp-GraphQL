const Project = require('../models/Project')
const Client = require('../models/Client')

const {
    GraphQLObjectType, 
    GraphQLID, GraphQLString, 
    GraphQLSchema, GraphQLList, 
    GraphQLInt,
    GraphQLNonNull,
    GraphQLEnumType
} = require('graphql')



const ClientType = new GraphQLObjectType({
    name: 'Client', 
    fields: () => {
        return ({
            id: {type: GraphQLID},
            name: {type: GraphQLString},
            email: {type: GraphQLString},
            phone: {type: GraphQLString}
        })
    }
})

const ProjectType = new GraphQLObjectType({
    name: 'Project',
    fields: () => {
        return ({
            id: {type: GraphQLID},
            clientId: {type: GraphQLInt},
            name: {type: GraphQLString},
            description: {type: GraphQLString},
            status: {type: GraphQLString},
            client: {
                type: ClientType,
                resolve: async (parent, args) => {
                    return await Client.findById(parent.clientId)
                }
            }
        })
    }
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        client: {
            type: ClientType,
            args: {id: {type: GraphQLID}},
            resolve: async (parent, args) => {
                return await Client.findById(args.id)
                // return clients.find(c => c.id === args.id)
            }
        },
        clients: {
            type: new GraphQLList(ClientType),
            resolve: async (parent, args) => {
                // return clients
                return await Client.find()
            }
        },
        clientByName: {
            type: new GraphQLList(ClientType),
            args: {name: {type: GraphQLString}},
            resolve: async (parent, args) => {
                return await Client.find({"name": args.name}) 
            }
        },
        project: {
            type: ProjectType,
            args: {id: {type: GraphQLID}},
            resolve: async (parent, args) => {
                return await Project.findById(args.id)
            }
        },
        projects: {
            type: new GraphQLList(ProjectType),
            resolve: (parent, args) => {
                return Project.find()
            }
        },
        projectByClient: {
            type: new GraphQLList(ProjectType),
            args: {clientId: {type: GraphQLID}},
            resolve: async (parent, args) => {
                return await Project.find({"clientId": args.clientId})
            }
        }
    },
})


const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addClient: {
            type: ClientType,
            args: {
                name: {type: GraphQLNonNull(GraphQLString)},
                email: {type: GraphQLNonNull(GraphQLString)},
                phone: {type: GraphQLNonNull(GraphQLString)},
            },
            resolve: async (parent, args) => {
                const client = new Client({
                    name: args.name,
                    email: args.email,
                    phone: args.phone
                })
                return await client.save()
            }
        },
        deleteClient: {
            type: ClientType,
            args: {id: {type: GraphQLNonNull(GraphQLID)}},
            resolve: async (parent, args) => {
                return await Client.findByIdAndRemove(args.id)
            }
        },
        addProject :{
            type: ProjectType,
            args: {
                clientId: {type: GraphQLNonNull(GraphQLID)},
                name: {type: GraphQLNonNull(GraphQLString)},
                description: {type: GraphQLNonNull(GraphQLString)},
                status: {
                    type: new GraphQLEnumType({
                        name: 'ProjectStatus',
                        values: {
                            'new': {value: 'Not Started'},
                            'progress': {value: 'In Progress'},
                            'completed': {value: 'Completed'}
                        }
                    }),
                    defaultValue: 'Not Started'
                }
            },
            resolve: async (parent, args) => {
                const newProject = new Project({
                    clientId: args.clientId,
                    name: args.name,
                    description: args.description,
                    status: args.status
                })
                await newProject.save()
                return newProject
            }
        },
        deleteProject: {
            type: ProjectType,
            args: {id: {type: GraphQLNonNull(GraphQLID)}},
            resolve: async (parent, args) => {
                return await Project.findByIdAndRemove(args.id)
            }
        },
        
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation
})