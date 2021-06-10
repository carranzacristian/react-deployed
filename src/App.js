import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import './App.css';
import Rank from './components/rank/Rank';
import Navigation from './components/navigation/Navigation';
import Logo from './components/logo/Logo';
import ImageLinkForm from './components/imageLinkForm/ImageLinkForm';
import FaceRecognition from './components/faceRecognition/FaceRecognition';

const app = new Clarifai.App({
  apiKey: '13901b317f664b328f1d8d123271fd5b',
});

const particlesOptions = {
  particles: {
    number: {
      value: 150,
      density: {
        enable: true,
        value_area: 800
      }
    }
  },
  interactivity: {
    events: {
      onhover: {
        enable: true,
        mode: 'repulse'
      }
    }
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      imageWidth: null,
		  imageHeight: null,
      clarifaiFace: {}
    }
  }
  updateDims = () => {
    const image = document.getElementById('inputImage');

    this.setState({
        imageWidth: Number(image.width),
        imageHeight: Number(image.height)
      });
      this.displayFaceBox(this.calculateFaceLocationUpdated());
  }

  componentDidMount() {
      window.addEventListener('resize', this.updateDims);
  }
  componentWillUnmount() {
      window.removeEventListener('resize', this.updateDims);
  }

  calculateFaceLocationUpdated = () => {
    const clarifaiFace = this.state.clarifaiFace;
    const width = this.state.imageWidth;
    const height = this.state.imageHeight;
    return{
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  calculateFaceLocation = (data) => {
    this.setState({clarifaiFace: data.outputs[0].data.regions[0].region_info.bounding_box});
    const clarifaiFace = this.state.clarifaiFace;
    const width = this.state.imageWidth;
    const height = this.state.imageHeight;
    return{
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    console.log(box);
    this.setState({box:box});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value})
  }

  onBtnSubmit = () => {
    this.setState({ imageUrl: this.state.input })
    app.models.predict(
      Clarifai.FACE_DETECT_MODEL,
      // The url
      this.state.input)
      .then(response =>
        this.displayFaceBox(this.calculateFaceLocation(response)))
        .catch(err => console.log(err));
  }
  render() {
    return (
      <div className="App">
      <Particles className='particles'
        params={particlesOptions}
      />
        <Navigation />
        <Rank />
        <Logo />
        <ImageLinkForm onInputChange={this.onInputChange} onBtnSubmit={this.onBtnSubmit}/>
        <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl} />
      </div>
    );
  }
}

export default App;


