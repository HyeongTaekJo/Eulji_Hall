import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { createTheme } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import BarChartIcon from '@mui/icons-material/BarChart';
import DescriptionIcon from '@mui/icons-material/Description';
import LayersIcon from '@mui/icons-material/Layers';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { useDemoRouter } from '@toolpad/core/internal';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { authUser, logoutUser } from '../../store/thunkFunctions';
import DateRangeIcon from '@mui/icons-material/DateRange';
import HistoryIcon from '@mui/icons-material/History';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const NAVIGATION = [
  {
    kind: 'header',
    title: 'Main items',
  },
  {
    segment: '',
    title: '예약하기',
    icon: <DateRangeIcon />,
  },
  {
    segment: 'reservationList',
    title: '예약내역 확인',
    icon: <HistoryIcon />,
  },
  {
    segment: 'register',
    title: '회원가입',
    icon: <PersonAddIcon />,
  },
  {
    kind: 'divider',
  },
  {
    kind: 'header',
    title: 'Analytics',
  },
  {
    segment: 'reports',
    title: 'Reports',
    icon: <BarChartIcon />,
    children: [
      {
        segment: 'register', // app.js 에 /reports/register 이런식으로 path를 줘야한다.
        title: 'Sales',
        icon: <DescriptionIcon />,
      },
      {
        segment: 'traffic',
        title: 'Traffic',
        icon: <DescriptionIcon />,
      },
    ],
  },
  {
    segment: 'integrations',
    title: 'Integrations',
    icon: <LayersIcon />,
  },
];

// preview-start
const BRANDING = {
  logo: (
    <img
      src={`${process.env.PUBLIC_URL}/joyfactory_ci_01.png`}
      alt="mark logo"
      style={{ height: '30px', width: 'auto' }} // 높이는 80px, 너비는 자동으로 조정
    />
  ),
  title: '을',
};

const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

function DemoPageContent({ pathname }) {
  return (
    <Box
      sx={{
        py: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <Typography>Dashboard content for {pathname}</Typography>
    </Box>
  );
}

DemoPageContent.propTypes = {
  pathname: PropTypes.string.isRequired,
};

function Dashboard(props) {
  const { window } = props;

  const [session, setSession] = useState({
    user: null,
  });

  //로그인 인증이 되어 있는지 확인하는 것
  //로그인이 되어 있고 토큰 기간이 유효하다면 isAuth가 true일 것이다.
  //페이지 이동시, 리덕스 store에 있는 isAuth를 확인한다.
  const dispatch = useDispatch();
  const navigate = useNavigate(); // useNavigate 훅 사용
  const isAuth = useSelector(state => state.user?.isAuth);
  const userData = useSelector((state) => state.user.userData);
  const { pathname } = useLocation();


  useEffect(() => {
    if (isAuth) {
      dispatch(authUser());
      //console.log('user -> ' + JSON.stringify(userData, null, 2));
      setSession({
        user: {
          name: userData.name,
          email: userData.email,
          image: userData.image,
        },
      });
    }

  }, [isAuth, pathname, dispatch])
  //dispatch는 일관성을 위해서 넣어준 것
  //pathname는 페이지 이동뿐만아니라 새로고침도 포함

  //const router = useDemoRouter('/register');

  useEffect(() => {
    // router.pathname이 변경될 때마다 navigate 호출
    console.log("pathname-> " + pathname);
    if (pathname) {
      navigate(pathname);
    }
  }, [pathname,  navigate]); // router.pathname 추가

  const handleLogout = () => {
    dispatch(logoutUser())
      .then(() => { //여기가 끝나고 navigate 실행
        navigate('/login');
      })
  }

  const authentication = useMemo(() => {
    return {
      signIn: () => {
        // setSession({
        //   user: {
        //     name: userData.name,
        //     email: userData.email,
        //     image: userData.image,
        //   },
        // });

        navigate('/login'); // 로그인 페이지로 리디렉션
      },
      signOut: () => {
        setSession(null);
        handleLogout();
      },
    };
  });



  // Remove this const when copying and pasting into your project.
  const demoWindow = window !== undefined ? window() : undefined;

  return (
    // preview-start
    <AppProvider
      branding={BRANDING}
      session={session}
      authentication={authentication}
      navigation={NAVIGATION}
      //router={router} //처음에 샘플 시작페이지
      theme={demoTheme}
      window={demoWindow}
    >
      <DashboardLayout defaultSidebarCollapsed>
        <Outlet />
      </DashboardLayout>
    </AppProvider>
    // preview-end
  );
}

Dashboard.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * Remove this when copying and pasting into your project.
   */
  window: PropTypes.func,
};

export default Dashboard;
