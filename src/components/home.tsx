import { Component, FC, useEffect } from 'react'
import templatesConfig from '../templates/templates_config'
import { ListGroup } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import { useNavigate } from 'react-router-dom'

const Home: FC = () => {
    const path = window.location.href.split('?')[1]
    const navigate = useNavigate()
    useEffect(() => {
        if (path) {
            navigate(path)
        }
    }, [])

    const templates = Object.keys(templatesConfig).map(key => (
        <LinkContainer to={`/app/${key}`}>
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
