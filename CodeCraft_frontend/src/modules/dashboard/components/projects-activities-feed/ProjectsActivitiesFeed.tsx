import ProjectActivities from '../project-activities/ProjectActivities'
import './ProjectsActivitiesFeed.scss'

type ProjectsActivitiesFeedProps = {
  projectsId: []
}

const ProjectsActivitiesFeed = ({ projectsId } : ProjectsActivitiesFeedProps) => {

  return (
    <div className='recent-activities-dashboard'>
      <div className='recent-activities-dashboard__projects'>
        <ProjectActivities 
          projectName= 'NutriPlan'
          projectId= ''
          activities= {[]}
        />

        <ProjectActivities 
          projectName= 'NutriPlan'
          projectId= ''
          activities= {[]}
        />

        <ProjectActivities 
          projectName= 'NutriPlan'
          projectId= ''
          activities= {[]}
        />
      </div>
    </div>
  )
}

export default ProjectsActivitiesFeed