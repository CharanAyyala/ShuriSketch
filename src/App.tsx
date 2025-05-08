import React, { useEffect } from 'react';
import Whiteboard from './components/Whiteboard';
import Header from './components/Header';

function App() {
  useEffect(() => {
    document.title = 'Shuriken - Digital Whiteboard';
  }, []);

  return (
    <>
      <Header />
      <main className="h-screen">
        <Whiteboard />
      </main>
    </>
  );
}

export default App;