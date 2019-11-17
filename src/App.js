import React from 'react';

import FightView from './Views/Fight';
import { BrowserRouter , Route } from 'react-router-dom';
function App() {
  return (
    <div className="App">
		<BrowserRouter>
			<Route path={`/`} component={FightView}></Route>
		</BrowserRouter >
	</div>
  );
}

export default App;
