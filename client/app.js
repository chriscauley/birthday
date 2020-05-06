import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route } from 'react-router-dom'

import Home from './Home'
import { Sidebar } from './Sidebar'
import Nav from './Nav'

const App = () => {
  return (
    <div className="container mx-auto">
      <BrowserRouter>
        <Nav />
        <div className="p-4" style={{ minHeight: 'calc(100vh - 230px)' }}>
          <div className="flex">
            <div className="w-1/3">
              <Sidebar />
            </div>
            <Route path="/:step_number/" component={Home} />
            <Route exact path="/" component={Home} />
          </div>
        </div>
      </BrowserRouter>
    </div>
  )
}

const domContainer = document.querySelector('#react-app')
ReactDOM.render(<App />, domContainer)
