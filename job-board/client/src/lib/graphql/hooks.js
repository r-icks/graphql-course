import {  useQuery, useMutation } from '@apollo/client';
import { companyById, getJobsQuery, jobById, createJobMutation} from './queries';

export function useCompany(id) {
    const {data, loading, error} = useQuery(companyById,
      {
        variables:{id}
      })
      return {company:data?.company, loading, error: Boolean(error)}
  }

export function useJob(id) {
    const {data, loading, error} = useQuery(jobById,
      {
        variables:{id}
      })
      return {job:data?.job, loading, error: Boolean(error)}
  }


export function useJobs(limit, offset) {
    const {data, loading, error} = useQuery(getJobsQuery,
      {
        variables: {limit, offset},
        fetchPolicy:'network-only'
      })
      if(Boolean(error)) console.log(error);
      return {jobs:data?.jobs, loading, error: Boolean(error)}
  }


  export function useCreateJob () {
    const [mutate, {loading}] = useMutation(createJobMutation);

    const createJob = async (title, description) => {
        const {data: {job}}= await mutate({
            variables:{ input: {title, description}},
        update: (cache, {data}) => {
            cache.writeQuery({
                query: jobById,
                variables: {id: data.job.id},
                data,
            })
        }})
        return job
    }

    return{
        loading,
        createJob
    }
}
