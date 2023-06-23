import * as React from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Toolbar from '@mui/material/Toolbar';
import MenuItem from '@mui/material/MenuItem';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import ListItemIcon from '@mui/material/ListItemIcon';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';

import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse';
import StarBorder from '@mui/icons-material/StarBorder';
import { useRouter } from 'next/router';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HomeIcon from '@mui/icons-material/Home';
import { ArrowBackIosNewOutlined } from "@mui/icons-material";
import LogoutIcon from '@mui/icons-material/Logout';
// import { styled, alpha } from '@mui/material/styles';
import { deleteCookie, getCookie } from "cookies-next";
import { withAuth } from "../../models/withAuthorization";
import Image from 'next/image';


function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}
const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);
const mdTheme = createTheme();


const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity,
        ),
      },
    },
  },
}));


const Footer = () => {
  return (
    <Paper sx={
      {
        marginTop: 'calc(10% + 60px)',
        width: '100%',
        position: 'fixed',
        backgroundColor: '#f5f5f5',
        bottom: 0,
        width: '100%'
    }} component="footer" square variant="outlined">
      <Container maxWidth="lg">
        <Box
          sx={{
            flexGrow: 1,
            justifyContent: "center",
            display: "flex",
            my:1
          }}
        >
            <div>
            {/* <Image priority src="/Logo.svg" width={75} height={30} alt="Logo" /> */}
            </div>
        </Box>

        <Box
          sx={{
            flexGrow: 1,
            justifyContent: "center",
            display: "flex",
            mb: 2,
          }}
        >
          <Typography variant="caption" color="initial">
            Copyright ©2022. [] Limited
          </Typography>
        </Box>
      </Container>
    </Paper>
  );
};

const CustomBar = (props) => {
  
  const [open, setOpen] = React.useState(true);
  const [pinjam, setPinjam] = React.useState(true);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const router = useRouter();
  const user = JSON.parse(props.user);
  const handleClick = () => {
    setOpen(!open);
  };
  const toggleDrawer = () => {
    setOpen(!open);
  };
  const handlePinjam = () => {
    setPinjam(!pinjam);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (<>
  <AppBar style={{ background: '#212121' }} position="absolute" open={open}>
      <Toolbar
        sx={{
          pr: '24px', // keep right padding when drawer closed
        }}
      >
          <Menu />
        <Typography
          component="h1"
          variant="h6"
          color="inherit"
          noWrap
          sx={{ flexGrow: 1 }}
        >
          Dashboard
        </Typography>
        
        <Box sx={{ flexGrow: 0 }}>
          <Tooltip title="Account">
            <IconButton
              onClick={handleOpenUserMenu}
              size="small"
              sx={{ ml: 2 }}
              aria-controls={open ? 'account-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
            >
              <Avatar sx={{ width: 32, height: 32 }}>{user.username.toUpperCase().substring(0,1)}</Avatar>
            </IconButton>
          </Tooltip>
          <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
          <MenuItem onClick={() => {
              deleteCookie('user');
              router.push("/login")}}>
              <ListItemIcon  >
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
            <Divider />
            </Menu>
        </Box>
      </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />  
            <List component="nav">
              <ListItemButton key="MasterButton">
                <ListItemIcon key="MasterIcon" onClick={handleClick}>
                  <InboxIcon />
                </ListItemIcon>
                <ListItemText key="MasterText">Master</ListItemText>
                <ExpandMore />
              </ListItemButton>
              { user.menu.map((x) => {
                
                  if (x.parent === 'Master'){
                    return (<List key={x.title} component="div" disablePadding>
                      <ListItemButton href={x.path} sx={{ pl: 3 }}>
                        <ListItemIcon>
                          <Image src={`/static/${x.icon}`} width={30} height={30} alt={x.title}  />
                        </ListItemIcon>
                        <ListItemText primary={x.title} />
                      </ListItemButton>
                  </List>)
                  }
              })}
              <ListItemButton key="TransaksiButton">
                <ListItemIcon key="TransaksiIcon" onClick={handleClick}>
                  <InboxIcon />
                </ListItemIcon>
                <ListItemText key="TransaksiText">Transaksi</ListItemText>
                <ExpandMore />
              </ListItemButton>
              { user.menu.map((x) => {
                  if (x.parent === 'Transaksi'){
                    return (<List key={x.title} component="div" disablePadding>
                      <ListItemButton href={x.path} sx={{ pl: 3 }}>
                        <ListItemIcon>
                        <Image src={`/static/${x.icon}`} width={30} height={30} alt={x.title}  />
                        </ListItemIcon>
                        <ListItemText primary={x.title} />
                      </ListItemButton>
                  </List>)
                  }
              })}
            </List>
           
        </Drawer>
        </>
)}

function DashboardContent({children}) {
  
 const {asPath} = useRouter();
 const user = getCookie('user');
  let body;
  console.log(asPath)
  if (asPath.includes("pinjam") || asPath.includes("kembali") || asPath === '/'){
    body = children 
  } else {
    body =  <Grid container spacing={3}>
    <Grid item xs={12} md={12} lg={12}>
      <Paper
        sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          
        }}
      >
      <Box sx={{ height: 108 + (35 * 20) + 'px'} }>
        {children}
      </Box>
      </Paper>
    </Grid>
    
  </Grid>
  }

  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <CustomBar user={user} />
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
           {body}
           
            <Copyright sx={{ pt: 4 }} />
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
export default withAuth(DashboardContent)