import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/userSlice';
import styled from 'styled-components';
import { BasicButton } from '../utils/buttonStyles';
import { getProductDetails, updateStuff } from '../redux/userHandle';
import { Avatar, Card, IconButton, Menu, MenuItem, Typography } from '@mui/material';
import { generateRandomColor, timeAgo } from '../utils/helperFunctions';
import { MoreVert } from '@mui/icons-material';
import Rating from '@mui/material/Rating';
import { 
    Box, 
    Grid, 
    CardMedia 
} from "@mui/material";

const ViewProduct = () => {
    const dispatch = useDispatch();
    const params = useParams();
    const productID = params.id;

    const { currentUser, currentRole, productDetails, loading, responseDetails } = useSelector(state => state.user);

    useEffect(() => {
        dispatch(getProductDetails(productID));
    }, [productID, dispatch]);

    const [anchorElMenu, setAnchorElMenu] = useState(null);
    const [mainImage, setMainImage] = useState(""); // State for main image

    useEffect(() => {
        if (productDetails?.productImage) {
            setMainImage(productDetails.productImage);
        }
    }, [productDetails]); // Update main image when product details load

    const handleOpenMenu = (event) => {
        setAnchorElMenu(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorElMenu(null);
    };

    const deleteHandler = (reviewId) => {
        const fields = { reviewId };
        dispatch(updateStuff(fields, productID, "deleteProductReview"));
    };

    const reviewer = currentUser && currentUser._id;

    return (
        <>
            {loading ? (
                <div>Loading...</div>
            ) : responseDetails ? (
                <div>Product not found</div>
            ) : (
                <>
                    <ProductContainer>
                        {/* Product Image Gallery */}
                        <Box>
                            <Card sx={{ maxWidth: 300, margin: "auto", borderRadius:10 }}>
                                <CardMedia
                                    component="img"
                                    height="300"
                                    image={mainImage}
                                    alt={productDetails?.productName}
                                />
                            </Card>
                            <Grid container spacing={2} sx={{ marginTop: 2, justifyContent: "center" }}>
                                {productDetails?.images?.map((img, index) => (
                                    <Grid item key={index}>
                                        <Card
                                            sx={{
                                                width: 60,
                                                height: 60,
                                                cursor: "pointer",
                                                border: mainImage === img ? "2px solid blue" : "none",
                                            }}
                                            onClick={() => setMainImage(img)}
                                        >
                                            <CardMedia
                                                component="img"
                                                image={img}
                                                alt={`Thumbnail ${index}`}
                                                sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                                            />
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>

                        {/* Product Info */}
                        <ProductInfo>
                            <ProductName>{productDetails?.productName}</ProductName>
                            <PriceContainer>
                                <PriceCost>₹{productDetails?.price?.cost}</PriceCost>
                                <PriceMrp>₹{productDetails?.price?.mrp}</PriceMrp>
                                <PriceDiscount>{productDetails?.price?.discountPercent}% off</PriceDiscount>
                            </PriceContainer>
                            <Rating name="half-rating" value={productDetails.reviews?.map(r=>r.rating)} readOnly size="small" />
                            <Description>{productDetails?.description}</Description>
                            <ProductDetails>
                                <p>Category: {productDetails?.category}</p>
                                <p>Subcategory: {productDetails?.subcategory}</p>
                            </ProductDetails>
                        </ProductInfo>
                    </ProductContainer>

                    {currentRole === "Customer" && (
                        <ButtonContainer>
                            <BasicButton onClick={() => dispatch(addToCart(productDetails))}>
                                Add to Cart
                            </BasicButton>
                        </ButtonContainer>
                    )}

                    {/* Reviews Section */}
                    <ReviewWritingContainer>
                        <Typography variant="h4">Reviews</Typography>
                    </ReviewWritingContainer>

                    {productDetails?.reviews?.length > 0 ? (
                        <ReviewContainer>
                            {productDetails.reviews.map((review, index) => (
                                <ReviewCard key={index}>
                                    <ReviewCardDivision>
                                        <Avatar
                                            sx={{
                                                width: "60px",
                                                height: "60px",
                                                marginRight: "1rem",
                                                backgroundColor: generateRandomColor(review._id)
                                            }}
                                        >
                                            {String(review.reviewer.name).charAt(0)}
                                        </Avatar>
                                        <ReviewDetails>
                                            <Typography variant="h6">{review.reviewer.name}</Typography>
                                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                                                <Typography variant="body2">{timeAgo(review.date)}</Typography>
                                            </div>
                                            <Typography variant="subtitle1">Rating: {review.rating}</Typography>
                                            <Typography variant="body1">{review.comment}</Typography>
                                        </ReviewDetails>
                                        {review.reviewer._id === reviewer && (
                                            <>
                                                <IconButton onClick={handleOpenMenu} sx={{ width: "4rem", color: 'inherit', p: 0 }}>
                                                    <MoreVert sx={{ fontSize: "2rem" }} />
                                                </IconButton>
                                                <Menu
                                                    id="menu-appbar"
                                                    anchorEl={anchorElMenu}
                                                    anchorOrigin={{
                                                        vertical: 'bottom',
                                                        horizontal: 'left',
                                                    }}
                                                    keepMounted
                                                    transformOrigin={{
                                                        vertical: 'top',
                                                        horizontal: 'left',
                                                    }}
                                                    open={Boolean(anchorElMenu)}
                                                    onClose={handleCloseMenu}
                                                    onClick={handleCloseMenu}
                                                >
                                                    <MenuItem onClick={handleCloseMenu}>
                                                        <Typography textAlign="center">Edit</Typography>
                                                    </MenuItem>
                                                    <MenuItem onClick={() => {
                                                        deleteHandler(review._id);
                                                        handleCloseMenu();
                                                    }}>
                                                        <Typography textAlign="center">Delete</Typography>
                                                    </MenuItem>
                                                </Menu>
                                            </>
                                        )}
                                    </ReviewCardDivision>
                                </ReviewCard>
                            ))}
                        </ReviewContainer>
                    ) : (
                        <ReviewWritingContainer>
                            <Typography variant="h6">No Reviews Found. Add a review.</Typography>
                        </ReviewWritingContainer>
                    )}
                </>
            )}
        </>
    );
};

export default ViewProduct;

const ProductContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin: 20px;
    justify-content: center;
    align-items: center;
    @media (min-width: 768px) {
        flex-direction: row;
    }
`;

// const ProductImage = styled.img`
//     max-width: 300px;
//     /* width: 50%; */
//     margin-bottom: 20px;
// `;

const ProductInfo = styled.div`
    display: flex;
    flex-direction: column;
    margin-left:30px;
`;

const ProductName = styled.h1`
    font-size: 24px;
`;

const PriceContainer = styled.div`
    display: flex;
    gap: 8px;
    margin-top: 8px;
`;

const PriceMrp = styled.p`
    margin-top: 8px;
    text-decoration: line-through;
    color: #525050;
`;

const PriceCost = styled.h3`
    margin-top: 8px;
`;

const PriceDiscount = styled.p`
    margin-top: 8px;
    color: darkgreen;
`;

const Description = styled.p`
    margin-top: 16px;
`;

const ProductDetails = styled.div`
    margin: 16px;
`;

const ButtonContainer = styled.div`
    margin: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const ReviewWritingContainer = styled.div`
    margin: 6rem;
    display: flex;
    gap: 2rem;
    justify-content: center;
    align-items: center;
    flex-direction:column;
`;

const ReviewContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const ReviewCard = styled(Card)`
  && {
    background-color: white;
    margin-bottom: 2rem;
    padding: 1rem;
  }
`;

const ReviewCardDivision = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const ReviewDetails = styled.div`
  flex: 1;
`;