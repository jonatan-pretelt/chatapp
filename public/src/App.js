import {useState, useEffect} from 'react';
import io from 'socket.io-client';
import { TextField, Typography, AppBar, CssBaseline, Grid, Toolbar, Container } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import SendIcon from '@mui/icons-material/Send';
import { Button } from '@mui/material';
import { makeStyles } from '@mui/styles';
import './App.css';

const useStyles = makeStyles((theme) => ({
  container: {
    padding: '20px'
  }
}));

const socket = io.connect("http://192.168.254.42:8000");

socket.on('connect', () => {
  console.log("connected");
});

socket.on('disconnect', () => {   
    console.log("disconnected");

});


function App() {
  const classes = useStyles();

  const [state, setState] = useState({message: '', name: ''})
  const [chat, setChat]  = useState([])


  useEffect(() => {
    socket.on('message', ({name, message }) => {
      setChat([...chat, { name, message }])
    })
  })

  const onTextChange = e => {
    setState({...state, [e.target.name]: e.target.value})
  }

  const onMessageSubmit = (e) => {
    e.preventDefault()
    const {name, message} = state
    socket.emit('message', {name, message})
    setState({message: '', name})
  }

  const renderChat = () => {
    return chat.map(({name, message}, index) => (
      <div key={index}>

        <h3>{name}: <span>{message}</span></h3>


      </div>
    ))
  }

  return (
    <div>
      <CssBaseline />
      <AppBar position="relative">

        <Toolbar>
          <ChatIcon/>
          <Typography variant="h6">Messenger</Typography>
        </Toolbar>
      </AppBar>

    <main className={classes.container}>
      <div>
        <Container maxWidth="sm" style={{ marginTop: '30px' }}>
       <form onSubmit={onMessageSubmit}>  
        <div>
          <TextField name="name" onChange={e => onTextChange(e)} value={state.name} label="Name"/>
        </div>
        <div style={{ marginTop: '10px' }}>
          <TextField name="message" onChange={e => onTextChange(e)} value={state.message} label="Message" id="outlined-multiline-static" variant="outlined" />
        </div>
          
           <Button style={{ marginTop: "5px" }} variant="contained" type="submit" endIcon={<SendIcon />}>
            Send
           </Button>
          
        {/* <button>Send</button> */}
        </form>
        </Container>
       </div>
          <div style={{ marginTop: '20px'}}>
            <Container maxWidth="sm">
              <Typography variant="overline" gutterBottom>Chat History</Typography>
              {renderChat()}
              </Container>
            </div>
      </main>

    </div>
  );
}

export default App;
