import Navbar from './components/Navbar'
import Home from './pages/Home'

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Home />
      </main>
    </div>
  )
}

export default App
