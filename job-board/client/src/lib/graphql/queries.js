import {ApolloClient, ApolloLink, InMemoryCache, createHttpLink, gql, concat} from "@apollo/client"
import {getAccessToken} from "../auth.js"

const jobDetailFragment = gql `
    fragment JobDetail on Job {
        id
        date
        title
        company{
            id
            name
        }
        description
    }
`

export const jobById = gql`
query jobById($id: ID!) {
    job(id: $id){
        ...JobDetail
    }
}
${jobDetailFragment}
`

export const companyById = gql`
query CompanyByID($id: ID!){
    company(id: $id){
        description
        name
        id
        jobs{
            title
            date
            id
        }
    }
}
`
export const getJobsQuery = gql`
query jobs($limit: Int, $offset: Int){
    jobs(limit:$limit, offset: $offset){
        items{
        id
        date
        title
        company{
            id
            name
        }
        }
        totalCount
    }
}
`
export const createJobMutation = gql`
    mutation($input: CreateJobInput){
        job: createJob(input: $input) {
            ...JobDetail
        }
    }
    ${jobDetailFragment}
    `

const httpLink = createHttpLink({
    uri:'http://localhost:9000/graphql'
})

const authLink = new ApolloLink((operation, forward)=>{
    const accessToken= getAccessToken();
    if(accessToken){
        operation.setContext({
            headers:{'Authorization': `Bearer ${accessToken}`}
        })
    }
    return forward(operation)
})

export const apolloClient = new ApolloClient({
    link: concat(authLink, httpLink),
    cache: new InMemoryCache(),
})