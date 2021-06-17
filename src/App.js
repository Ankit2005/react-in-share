import logo from './logo.svg';
import './App.css';
import ImgDropZone from './Components/ImgDropZone/ImgDropZone';
import ReactNotification from "react-notifications-component";
function App() {
  return (
    <>
      <div className="App">
      <ReactNotification />
        <ImgDropZone />
      </div>
    </>
  );
}

export default App;
