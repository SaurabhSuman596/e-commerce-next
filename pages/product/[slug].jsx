import Layout from '../../components/Layout';
import {
  Button,
  Card,
  Grid,
  Link,
  List,
  ListItem,
  Typography,
} from '@mui/material';
import NextLink from 'next/link';
import useStyle from '../../utils/styles';
import Image from 'next/image';
import db from '../../utils/db';
import Product from '../../models/Product';
import { useContext } from 'react';
import { Store } from '../../utils/Store';
import axios from 'axios';
import { useRouter } from 'next/router';

const Slug = ({ product }) => {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const classes = useStyle();

  if (!product) {
    return <div>Product Not Found</div>;
  }
  const addToCartHandler = async () => {
    const existItem = state.cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      window.alert('Sorry. Product is out of stock');
      return;
    }
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity: 1 } });
    router.push('/cart');
  };

  return (
    <Layout title={product.name} desc={product.description}>
      <div className={classes.section}>
        <NextLink href="/" passHref>
          <Link>
            {' '}
            <Typography>back to product</Typography>
          </Link>
        </NextLink>
      </div>
      <Grid container spacing={1}>
        <Grid item md={6} xs={12}>
          <Image
            src={product.image}
            alt={product.name}
            width={640}
            height={640}
            layout="responsive"
          ></Image>
        </Grid>

        <Grid item md={3} xs={12}>
          <List>
            <ListItem>
              <Typography>{product.name}</Typography>{' '}
            </ListItem>
            <ListItem>
              <Typography> Category : {product.category}</Typography>{' '}
            </ListItem>
            <ListItem>
              <Typography>Brand : {product.brand}</Typography>{' '}
            </ListItem>
            <ListItem>
              <Typography>
                Rating : {product.rating} stars ({product.numReviews} reviews)
              </Typography>
            </ListItem>
            <ListItem>
              <Typography>Description : {product.description}</Typography>
            </ListItem>
          </List>
        </Grid>
        <Grid item md={3} xs={12}>
          <Card>
            <List>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>Price</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>${product.price}</Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>Status</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>
                      ${product.countInStock > 0 ? 'In Stock' : 'Unavialable'}
                    </Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Button
                  type="button"
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={addToCartHandler}
                >
                  Add To Cart
                </Button>
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
};

export async function getServerSideProps(context) {
  const { slug } = context.params;
  await db.connect();
  const product = await Product.findOne({ slug }).lean();
  await db.disconnect();
  return {
    props: {
      product: db.convertDocToObj(product),
    },
  };
}

export default Slug;
