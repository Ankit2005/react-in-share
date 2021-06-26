import logo from './logo.svg';
import './App.css';
import ImgDropZone from './Components/ImgDropZone/ImgDropZone';
import FileDropzone from './Components/FileDropzone/FileDropzone';
import ReactNotification from "react-notifications-component";

function App() {
  return (
    <>
        <ReactNotification />
      <div className="App">
        {/* <ImgDropZone /> */}
        <FileDropzone />
      </div>
    </>
  );
}

export default App;
