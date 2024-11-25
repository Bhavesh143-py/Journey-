import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Create TokenContext
const TokenContext = createContext();
// Custom hook to access TokenContext
export const useToken = () => useContext(TokenContext);

// TokenProvider component that wraps your app
export const TokenProvider = ({ children }) => {
  const navigate =useNavigate();
  // Initialize the token state from sessionStorage if it exists
  const [token, setToken] = useState(() => sessionStorage.getItem('authToken') || null);

  useEffect(() => {
    if (token) {
      // Save token to sessionStorage whenever it changes
      sessionStorage.setItem('authToken', token);
    } else {
      // Remove token from sessionStorage when it is null (user logged out)
      sessionStorage.removeItem('authToken');
      navigate('/');
    }
  }, [token]);

  return (
    <TokenContext.Provider value={{ token, setToken }}>
      {children}
    </TokenContext.Provider>
  );
};
const EditorContext = createContext();

export const useEditor = () => useContext(EditorContext);

export const EditorProvider = ({ children }) => {
  const [editorContent, setEditorContent] = useState("");

  return (
    <EditorContext.Provider value={{ editorContent, setEditorContent }}>
      {children}
    </EditorContext.Provider>
  );
};
const UserContext = createContext();

export const useUsername =()=> useContext(UserContext);
export const UsernameProvider = ({children}) =>{
  const navigate = useNavigate();
  const [ProUsername, setProUsername] = useState(() => sessionStorage.getItem('ProUsername') || null);
  const [ProPass, setProPass] = useState(() => sessionStorage.getItem('ProPass') || null);
  useEffect(() => {
    if (ProUsername && ProPass) {
      // Save token to sessionStorage whenever it changes
      sessionStorage.setItem('ProUsername',ProUsername);
      sessionStorage.setItem('ProPass', ProPass); 
    } else {
      // Remove token from sessionStorage when it is null (user logged out)
      sessionStorage.removeItem('ProUsername');
      sessionStorage.removeItem('ProPass');
      navigate('/');
    }
  }, [ProUsername,ProPass]);

  
  return(
    <UserContext.Provider value={{ProUsername,setProUsername,ProPass,setProPass}}>{children}</UserContext.Provider>
  );
};
const DarkContext = createContext();
export const useDarkMode =()=> useContext(DarkContext);
export const DarkModeProvider = ({children})=>{
  const [darkMode, setDarkMode] = useState(() => {
    // Check localStorage for existing preference
    const savedMode = localStorage.getItem("darkMode");
    return savedMode ? JSON.parse(savedMode) : false;
  });
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  return(
    <DarkContext.Provider value={{darkMode,setDarkMode}}>{children}</DarkContext.Provider>
  )
};