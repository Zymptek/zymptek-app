# B2B Marketplace Architecture

## Table of Contents
1. [Overview](#overview)
2. [Core Components](#core-components)
3. [Workflows](#workflows)
4. [Entity-Relationship Diagram (ERD)](#entity-relationship-diagram-erd)
5. [API Endpoints](#api-endpoints)
6. [Security Considerations](#security-considerations)

## Overview

This document outlines the architecture for a B2B marketplace platform that facilitates negotiations, escrow payments, and order fulfillment between buyers and sellers.

## Core Components

1. **User Management System**
   - Handles user registration, authentication, and profile management
   - Differentiates between buyer and seller accounts

2. **Product Management System**
   - Allows sellers to create, update, and manage product listings
   - Implements category management

3. **Negotiation System**
   - Facilitates real-time messaging between buyers and sellers
   - Tracks and manages price offers
   - Handles negotiation status updates

4. **Payment and Escrow Management**
   - Integrates with a payment service provider that supports escrow
   - Manages payment gateway creation, payment processing, and fund releases
   - Generates and manages escrow agreements

5. **Order Management System**
   - Creates and tracks orders based on successful negotiations
   - Manages order statuses throughout the fulfillment process

6. **Shipping and Logistics**
   - Allows sellers to update shipping information
   - Tracks and notifies buyers of shipping status changes

7. **Dispute Resolution System**
   - Handles dispute creation and management
   - Facilitates the resolution process
   - Manages fund releases or refunds based on dispute outcomes

## Workflows

### 1. Negotiation Workflow
1. Buyer initiates negotiation on a product
2. Seller and buyer exchange messages and price offers
3. Both parties agree on a final price

### 2. Order Placement Workflow
1. Seller creates a payment gateway for the agreed amount
2. Buyer makes the payment into escrow
3. System generates an escrow agreement
4. Both parties sign the escrow agreement
5. Order is officially placed

### 3. Fulfillment Workflow
1. Seller prepares the product for shipping
2. Seller updates shipping information
3. Buyer receives the product
4. Buyer confirms receipt and satisfaction
5. System releases payment to the seller

### 4. Dispute Resolution Workflow
1. Either party raises a dispute
2. System freezes the escrow payment
3. Dispute resolution process is initiated
4. Resolution is reached
5. Funds are released according to the resolution

## Entity-Relationship Diagram (ERD)

### Users
- id (PK)
- email
- password_hash
- user_type (buyer/seller)
- created_at
- updated_at

### Profiles
- id (PK)
- user_id (FK to Users)
- first_name
- last_name
- company_name
- address
- phone_number
- created_at
- updated_at

### Products
- id (PK)
- seller_id (FK to Users)
- name
- description
- base_price
- category_id (FK to Categories)
- created_at
- updated_at

### Categories
- id (PK)
- name
- parent_id (FK to Categories, for subcategories)

### Negotiations
- id (PK)
- product_id (FK to Products)
- buyer_id (FK to Users)
- seller_id (FK to Users)
- status (open, closed, agreement_reached)
- final_price
- created_at
- updated_at

### NegotiationMessages
- id (PK)
- negotiation_id (FK to Negotiations)
- sender_id (FK to Users)
- message
- is_price_offer
- created_at

### PaymentGateways
- id (PK)
- negotiation_id (FK to Negotiations)
- amount
- status (created, paid, released, refunded)
- created_at
- updated_at

### EscrowAgreements
- id (PK)
- negotiation_id (FK to Negotiations)
- payment_gateway_id (FK to PaymentGateways)
- buyer_signature
- seller_signature
- agreement_text
- status (pending, signed, completed)
- created_at
- updated_at

### Orders
- id (PK)
- negotiation_id (FK to Negotiations)
- payment_gateway_id (FK to PaymentGateways)
- escrow_agreement_id (FK to EscrowAgreements)
- status (placed, in_progress, shipped, delivered, completed, disputed)
- created_at
- updated_at

### ShippingUpdates
- id (PK)
- order_id (FK to Orders)
- status
- tracking_number
- carrier
- update_text
- created_at

### Disputes
- id (PK)
- order_id (FK to Orders)
- raised_by (FK to Users)
- reason
- status (open, in_progress, resolved)
- resolution
- created_at
- updated_at

## API Endpoints

### User Management
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/logout
- GET /api/users/profile
- PUT /api/users/profile

### Product Management
- POST /api/products
- GET /api/products
- GET /api/products/:id
- PUT /api/products/:id
- DELETE /api/products/:id

### Negotiation
- POST /api/negotiations
- GET /api/negotiations/:id
- POST /api/negotiations/:id/messages
- GET /api/negotiations/:id/messages

### Payment and Escrow
- POST /api/payments/create-gateway
- POST /api/payments/process
- POST /api/escrow/generate-agreement
- POST /api/escrow/sign-agreement

### Order Management
- POST /api/orders
- GET /api/orders/:id
- PUT /api/orders/:id/status

### Shipping
- POST /api/shipping/:orderId/update
- GET /api/shipping/:orderId/updates

### Dispute Resolution
- POST /api/disputes
- GET /api/disputes/:id
- PUT /api/disputes/:id/resolve

## Security Considerations

1. **Authentication and Authorization**
   - Implement JWT-based authentication
   - Use role-based access control (RBAC) for different user types

2. **Data Encryption**
   - Use HTTPS for all API communications
   - Encrypt sensitive data at rest (e.g., payment information)

3. **Input Validation**
   - Implement server-side input validation for all API endpoints
   - Use parameterized queries to prevent SQL injection

4. **Rate Limiting**
   - Implement rate limiting on API endpoints to prevent abuse

5. **Audit Logging**
   - Log all important actions and transactions for auditing purposes

6. **Payment Security**
   - Use a reputable payment service provider with PCI DSS compliance
   - Implement 3D Secure for credit card transactions

7. **Error Handling**
   - Implement proper error handling and logging
   - Return generic error messages to clients to avoid information leakage

8. **Regular Security Audits**
   - Conduct regular security audits and penetration testing
   - Keep all dependencies and systems up to date with security patches