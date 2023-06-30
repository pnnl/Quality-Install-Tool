import {Component, FC, useEffect} from 'react'
import templatesConfig from '../templates/templates_config'
import { ListGroup } from 'react-bootstrap';
import { Link } from "react-router-dom";
import {LinkContainer} from 'react-router-bootstrap'
import { useNavigate } from "react-router-dom";


const Home: FC = () => {
  const path = window.location.href.split('?')[1];
  const navigate = useNavigate();
  useEffect(() => {
    if(path){
      navigate(path);
    }
  }, []);

  const templates = Object.keys(templatesConfig).map((key) => (
    <LinkContainer to={`/app/${key}`}>
      <ListGroup.Item key={key} action={true}>
        {templatesConfig[key as keyof typeof templatesConfig].title}
      </ListGroup.Item>
    </LinkContainer>
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
