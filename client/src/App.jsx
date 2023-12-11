import { useCallback, useLayoutEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { pdfjs } from 'react-pdf';
import Form from "./components/Form"
import Success from './components/Success'
import SignUp from './components/SignUp';
import Header from './components/Header';
import MyFiles from './components/MyFiles';
import SignIn from './components/SignIn';
import { NotFound } from './components/NotFound'
import { useUser } from './context/UserContext';
import { getUser } from './service';

pdfjs.GlobalWorkerOptions.workerSrc = "https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js"


function App() {

  const navigate = useNavigate()
  const location = useLocation()
  const { user, changeUser } = useUser()

  useLayoutEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      if (location.pathname === '/signup')
        return navigate("/signup")
      return navigate("/signin")
    }

    handleGetUser();
  }, [])

  const handleGetUser = useCallback(async () => {
    const { error, data } = await getUser();
    if (error) {
      console.log(data);
      return navigate("/signin")
    }
    changeUser(data)
  }, [])


  return (
    <>
      <Header />
      <Routes>
        <Route path='/signup' element={<SignUp />} />
        <Route path='/signin' element={<SignIn />} />
        {
          user?.email &&
          <>
            <Route path='/' element={<Form />} />
            <Route path='/edited' element={<Success />} />
            <Route path='/my-files' element={<MyFiles />} />
          </>
        }
        <Route path='*' element={<NotFound />} />
      </Routes>
    </>

  )
}

export default App

