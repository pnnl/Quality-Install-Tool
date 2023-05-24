import {Component, FC} from 'react'
import templatesConfig from '../templates/templates_config'
import { ListGroup } from 'react-bootstrap';

const Home: FC = () => {
    
  const templates = Object.keys(templatesConfig).map((key) => (
    <ListGroup.Item key={key}>
      <a href={`/app/${key}`}>
      {templatesConfig[key as keyof typeof templatesConfig].title}
      </a>
    </ListGroup.Item>
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