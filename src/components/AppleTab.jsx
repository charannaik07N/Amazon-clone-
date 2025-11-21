// components/products/AppleProducts.js
import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const AppleTab = () => {
  const navigate = useNavigate();

  const appleProducts = [
    {
      id: 1,
      name: 'iPad Pro',
      image: '/image/ipad-pro.jpg',
      price: '$799',
      specs: '12.9-inch Liquid Retina XDR display'
    },
    {
      id: 2,
      name: 'iPad Air',
      image: '/image/ipad-air.jpg',
      price: '$599',
      specs: '10.9-inch Liquid Retina display'
    },
    // Add more Apple products
  ];

  return (
    <>
      <Navbar />
      <Container className="py-5">

        
        <h2 className="mb-4">Apple Products</h2>
        
        <Row className="g-4">
          {appleProducts.map((product) => (
            <Col key={product.id} xs={12} sm={6} md={4}>
              <Card className="h-100 shadow-sm border-0 hover-card" 
              style={{
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out'
              }}
              onMouseOver={e => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 .5rem 1rem rgba(0,0,0,.15)';
              }}
              onMouseOut={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 .125rem .25rem rgba(0,0,0,.075)';
              }}>
                <Card.Body className="text-center">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="img-fluid mb-3"
                    style={{ maxHeight: '200px', objectFit: 'contain' }}
                  />
                  <h5 className="mb-2">{product.name}</h5>
                  <p className="text-primary fw-bold mb-2">{product.price}</p>
                  <p className="text-muted small">{product.specs}</p>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
};

export default AppleTab;