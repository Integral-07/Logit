import './App.css'
import Header from '../components/Header';
import Footer from '../components/Footer';

function App() {
  return (
    <div className="App">
      <Header />
        <img src="" className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      <Footer/>
    </div>
  )
}

export default App
