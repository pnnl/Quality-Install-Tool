import {Component, FC} from 'react'
import templatesConfig from '../templates/templates_config'

export default class Home extends Component {
    render() {
        const homeFlexItems = Object.keys(templatesConfig).map((item, index) => (
            <a key={index} className="flex-item" href={`/app/${item}`}>
                {item}
            </a>
          ));
    
    return (
      <div>
        <h1>Home</h1>
        <div className="home-flex-container" id="homeFlexContainer">
            {homeFlexItems}
        </div>
      </div>
    ) 
    }
  }