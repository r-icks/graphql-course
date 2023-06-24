import { getJobs, getJob, getJobsByCompany, createJob, deleteJob, updateJob, countJobs } from "./db/jobs.js"
import { getCompany } from "./db/companies.js"
import { GraphQLError } from "graphql"

export const resolvers = {
    Query: {
        jobs: async (_root, {limit, offset}) => {
            const items = await getJobs(limit, offset)
            const totalCount = await countJobs();
            return {items, totalCount}
        },
        job: async (_root, {id}) => {
            const job = await getJob(id)
            if(!job){
                throw notFoundError("No job found with id "+id)
            }
            return job
        },
        company: async (_root, {id}) => {
            const company = await getCompany(id)
            if(!company){
                throw notFoundError("No company found with id "+id)
            }
            return company
        }
    },
    Mutation: {
        createJob: async (_root, {input:{title, description}}, {user} ) => {
            if(!user){
                throw new unauthorizedError("Missing authentication")
            }
            const {companyId} = user
            const job = await createJob({companyId, title, description})
            return job
        },
        deleteJob: async (_root, {id}, {user}) => {
            if(!user){
                throw new unauthorizedError("Missing authentication")
            }
            
            const job =  await deleteJob(id, user.companyId)
            if(!job){
                throw notFoundError("No job found with id "+id)
            }
            return job
        }
            ,
        updateJob: async (_root, {input:{title, description, id}, }, {user})=>{
            if(!user){
                throw new unauthorizedError("Missing authentication")
            }
            const job = await updateJob({title, description, id}, user.companyId)
            if(!job){
                throw notFoundError("No job found with id "+id)
            }
            return job
        }
        
    },
    Job: {
        date: (job)=> toIsoDate(job.createdAt),
        company: (job, _args, {companyLoader})=> companyLoader.load(job.companyId)
    },
    Company: {
        jobs: (company) => getJobsByCompany(company.id)
    }
}

function notFoundError(message) {
    return new GraphQLError(message, {
        extensions:{code:"NOT_FOUND"}
    })
}

function unauthorizedError(message) {
    return new GraphQLError(message, {
        extensions:{code:"UNAUTHORIZED"}
    })
}

function toIsoDate (value) {
    return value.slice(0, 'yyyy-mm-dd'.length)
}