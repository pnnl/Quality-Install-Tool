import React, { type FC } from 'react'
import { Route } from 'react-router-dom'
import projects from '../templates/projects_config'
import RootLayout from './root_layout'
import MdxProjectView from './mdx_project_details_view'

const ProjectRouterGenerator: FC = (project: any) => {
    return (
        <>
            projects.flatMap((project, value) ={' '}
            {
                <Route
                    path={'/app/' + project?._id}
                    key={project?.id}
                    children={
                        <RootLayout>
                            <MdxProjectView project={project} />
                        </RootLayout>
                    }
                />
            }
            )
        </>
    )
}

export default ProjectRouterGenerator
