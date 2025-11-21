import React from 'react';
import { Card, Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const TabletBrands = () => {
  const navigate = useNavigate();
  
  const tabBrands = [
    {
      name: 'Apple',
      image: '/image/monitor1.jpg',
      path: '/products/apple'
    },
    {
      name: 'Samsung',
      image: '/image/S10Ultra.jpg',
      path: '/products/samsung'
    },
    {
      name: 'Lenovo',
      image: '/image/S10Ultra.jpg',
      path: '/products/microsoft'
    },
    {
      name: 'Xiaomi',
      image: '/image/S10Ultra.jpg',
      path: '/products/microsoft'
    },
    {
      name: 'oneplus',
      image: '/image/S10Ultra.jpg',
      path: '/products/microsoft'
    },
    {
      name: 'Microsoft',
      image: '/image/S10Ultra.jpg',
      path: '/products/microsoft'
    },
    {
      name: 'Microsoft',
      image: '/image/S10Ultra.jpg',
      path: '/products/microsoft'
    },
    {
      name: 'Microsoft',
      image: '/image/S10Ultra.jpg',
      path: '/products/microsoft'
    },
  ];

  return (
    <>
    <Navbar />
    <Container className="py-5" style={{ background: "hsl(210, 14%, 98%)" }}>
      <Row className="g-4">
        {tabBrands.map((brand, index) => (
          <Col key={index} xs={12} sm={6} md={4} lg={3}>
            <Card 
              className="h-100 shadow-sm border-0 hover-card" 
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
              }}
            >
              <div className="text-center p-4">
                <img
                  src={brand.image}
                  alt={brand.name}
                  className="img-fluid mb-3"
                  style={{ maxHeight: '150px', objectFit: 'contain' }}
                />
                <h5 className="mb-3 fw-bold">{brand.name}</h5>
                <Button 
                  variant="primary" 
                  onClick={() => navigate(brand.path)}
                  className="w-100"
                >
                  View Details
                </Button>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
    </>
  );
};

export default TabletBrands;