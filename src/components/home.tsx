import type { FC } from 'react'
import { ListGroup } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import templatesConfig from '../templates/templates_config'

const Home: FC = () => {
    const templates = Object.keys(templatesConfig).map(key => (
        <LinkContainer key={key} to={`/app/${key}`}>
            <ListGroup.Item key={key} action={true}>
                {templatesConfig[key as keyof typeof templatesConfig].title}
            </ListGroup.Item>
        </LinkContainer>
    ))
    return (
        <div>
            <h1>Choose a Workflow</h1>
            <ListGroup>{templates}</ListGroup>
        </div>
    )
}

export default Home
