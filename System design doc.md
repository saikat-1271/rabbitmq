##  System Design Doc

############# Stock Sync Flow #############

> > Vendors provide APIs that show their current stock.

> > A scheduled background job (using @Cron) runs at regular intervals.

> > It fetches stock data from each vendor and updates our local PostgreSQL database.

############# Order Placement Architecture #############

> > The /order API receives new customer orders.

> > Orders are checked and saved in the database with a PENDING status.

> > Then, the order is sent to a RabbitMQ queue called order_queue.

############# Queue-Based Worker Model #############

> > A worker service listens to messages from the RabbitMQ queue.

> > The worker checks if enough stock is available (uses our local DB).

> > If enough stock is found, it reduces the stock and marks the order as CONFIRMED.

> > If not, it marks the order as FAILED.

############# Consistency Guarantees #############

> > Strong Consistency: Orders are placed only if stock exists in our local DB.

> > Eventual Consistency: Vendor stock is synced periodically, so it may not always be up to the second.

> > Idempotency: Workers handle retries safely using RabbitMQ’s ack or nack, so the same message isn't processed multiple times by mistake.
