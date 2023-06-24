import { useState } from 'react';
import JobList from '../components/JobList';
import { useJobs } from '../lib/graphql/hooks';
import PaginationBar from '../components/PaginationBar'

const JOBS_PER_PAGE = 5;

function HomePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const {jobs, error, loading } = useJobs(JOBS_PER_PAGE, (currentPage-1)*JOBS_PER_PAGE)
  if(loading){
    return <div> Loading... </div>
  }
  if(jobs){
  const totalPages = Math.ceil(jobs.totalCount / JOBS_PER_PAGE)
  return (
    <div>
      <h1 className="title">
        Job Board
      </h1>
      <PaginationBar currentPage={currentPage} totalPages={totalPages} onPageChange ={setCurrentPage} />
      {/* <button disabled={currentPage===1} onClick={()=>setCurrentPage(currentPage-1)}>Previous</button>
      <span>{`${currentPage} of ${totalPages}`}</span>
      <button disabled={currentPage === totalPages} onClick={()=>setCurrentPage(currentPage+1)}>Next</button> */}
      <JobList jobs={jobs.items} />
    </div>
  );
  }
  else{
    console.log(error)
  }
}

export default HomePage;
