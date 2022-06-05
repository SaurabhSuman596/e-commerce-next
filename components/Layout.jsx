import { useContext } from 'react';
import Head from 'next/head';
import { AppBar, Link, Toolbar, Typography, Badge } from '@mui/material';
import { Container } from '@mui/system';
import useStyle from '../utils/styles';
import NextLink from 'next/link';
import { Store } from '../utils/Store';

const Layout = ({ title, desc, children }) => {
  const { state } = useContext(Store);
  const { cart } = state;
  const classes = useStyle();
  return (
    <div>
      <Head>
        <title>{title ? `${title} - Saurabh-Ecomm` : 'Saurabh-Ecomm'}</title>
        {desc && <meta name="description" content={desc} />}
      </Head>
      <AppBar position="static" className={classes.navbar}>
        <Toolbar>
          <NextLink href="/" passHref>
            <Link>
              {' '}
              <Typography className={classes.brand}>SAURABH - SHOP</Typography>
            </Link>
          </NextLink>
          <div className={classes.grow}></div>
          <div>
            <NextLink href="/cart" passHref>
              <Link>
                {cart.cartItems.length > 0 ? (
                  <Badge
                    badgeContent={
                      cart.cartItems.length && cart.cartItems.length
                    }
                    color="secondary"
                  >
                    Cart
                  </Badge>
                ) : (
                  'cart'
                )}
              </Link>
            </NextLink>
            <NextLink href="/login" passHref>
              <Link>Login</Link>
            </NextLink>
          </div>
        </Toolbar>
      </AppBar>
      <Container className={classes.main}>{children}</Container>
      <footer className={classes.footer}>
        All Rights Reserved. Saurabh-shop
      </footer>
    </div>
  );
};

export default Layout;
