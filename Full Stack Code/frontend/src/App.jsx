import {Route,Routes} from 'react-router-dom'
import './App.css'
import {SignupRender} from './pages/SignupJSX'
import {LoginUser,token} from './pages/Loginpage'
import AddTodos from './pages/Addtodos'
import { Journal } from './pages/Journalpage'
import {Dummy} from './pages/dashboard'
import { DarkModeProvider, EditorProvider, TokenProvider,UsernameProvider } from './components/tokencontext'
import { Goals } from './pages/Goals'

import 'flowbite'; // Import Flowbite's JavaScript
import 'flowbite/dist/flowbite.min.css'; // Import Flowbite's CSS




function App() {
  // const token = localStorage.getItem("authtoken");

  return (
    <div>
      
        <UsernameProvider>
      <TokenProvider>
        <EditorProvider>
          <DarkModeProvider>
      <Routes>
        <Route index element={<SignupRender/>} ></Route>
        <Route path='/login' element={<LoginUser/>}/>
        <Route path='/DailyActions' element={<AddTodos/>}/>
        <Route path='/Journal' element={<Journal/>} />
        <Route path='/goals' element={<Goals/>}/>
      </Routes>
            </DarkModeProvider>
        </EditorProvider>
      </TokenProvider>
        </UsernameProvider>
    </div>
  )
}


export default App