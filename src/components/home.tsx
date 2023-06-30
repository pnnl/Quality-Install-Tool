import {Component, FC} from 'react'
import templatesConfig from '../templates/templates_config'
import { ListGroup } from 'react-bootstrap';
import { Link } from "react-router-dom";
import {LinkContainer} from 'react-router-bootstrap'


const Home: FC = () => {
    
  const templates = Object.keys(templatesConfig).map((key) => (
    <LinkContainer to={`/app/${key}`}>
      <ListGroup.Item key={key} action={true}>
        {templatesConfig[key as keyof typeof templatesConfig].title}
      </ListGroup.Item>
    </LinkContainer>
  ));

  return (
    <div>
      <h1>Choose a Document Type</h1>
      <ListGroup>
          {templates}
      </ListGroup>
    </div>
  ) 
}

export default Home;