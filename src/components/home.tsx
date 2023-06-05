import {Component, FC} from 'react'
import templatesConfig from '../templates/templates_config'
import { ListGroup } from 'react-bootstrap';
import { Link } from "react-router-dom";


const Home: FC = () => {
    
  const templates = Object.keys(templatesConfig).map((key) => (
    <ListGroup.Item key={key}>
      <Link to={`/app/${key}`}>
      {templatesConfig[key as keyof typeof templatesConfig].title}
      </Link>
    </ListGroup.Item>
  ));

  const editor = (
    <ListGroup.Item key='template editor'>
      <Link to={`/template_editor`}>
      Template Editor
      </Link>
    </ListGroup.Item>
  );
    
  return (
    <div>
      <h1>Choose a Document Type</h1>
      <ListGroup>
          {templates}
          {editor}
      </ListGroup>
    </div>
  ) 
}

export default Home;