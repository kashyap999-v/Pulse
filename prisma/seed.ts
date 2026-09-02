import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function seed() {
  console.log("🌱 Seeding PULSE demo data...");

  // 1. Create demo user
  const hashedPassword = await bcrypt.hash("demo@123", 10);
  const user = await db.user.create({
    data: {
      email: "demo@pulse.local",
      name: "Demo Owner",
      password: hashedPassword,
      emailVerified: true,
    },
  });

  console.log("✅ User created:", user.email);

  // 2. Create demo business
  const business = await db.business.create({
    data: {
      name: "Demo Coffee Shop",
      slug: "demo-coffee",
      industry: "Retail",
      currency: "USD",
      timezone: "America/New_York",
      email: "hello@democoffee.local",
      phone: "+1-555-0100",
      address: "123 Main Street",
      city: "Springfield",
      state: "IL",
      zipCode: "62701",
      country: "USA",
    },
  });

  console.log("✅ Business created:", business.name);

  // 3. Link user to business
  await db.businessUser.create({
    data: {
      businessId: business.id,
      userId: user.id,
      role: "OWNER",
    },
  });

  console.log("✅ Business user created");

  // 4. Create demo customers
  const customers = await Promise.all([
    db.customer.create({
      data: {
        businessId: business.id,
        firstName: "John",
        lastName: "Smith",
        email: "john@example.com",
        phone: "+1-555-0101",
        customerType: "INDIVIDUAL",
        city: "Springfield",
      },
    }),
    db.customer.create({
      data: {
        businessId: business.id,
        firstName: "Sarah",
        lastName: "Johnson",
        email: "sarah@example.com",
        phone: "+1-555-0102",
        company: "TechCorp",
        customerType: "BUSINESS",
      },
    }),
    db.customer.create({
      data: {
        businessId: business.id,
        firstName: "Mike",
        lastName: "Wilson",
        email: "mike@example.com",
        customerType: "INDIVIDUAL",
      },
    }),
  ]);

  console.log(`✅ ${customers.length} customers created`);

  // 5. Create demo products
  const products = await Promise.all([
    db.product.create({
      data: {
        businessId: business.id,
        name: "Cold Brew Coffee",
        sku: "CB-001",
        price: 5.99,
        cost: 1.50,
        category: "Beverages",
        status: "ACTIVE",
      },
    }),
    db.product.create({
      data: {
        businessId: business.id,
        name: "Espresso",
        sku: "ESP-001",
        price: 3.99,
        cost: 0.75,
        category: "Beverages",
        status: "ACTIVE",
      },
    }),
    db.product.create({
      data: {
        businessId: business.id,
        name: "Croissant",
        sku: "CR-001",
        price: 4.50,
        cost: 1.25,
        category: "Pastries",
        status: "ACTIVE",
      },
    }),
  ]);

  console.log(`✅ ${products.length} products created`);

  // 6. Create inventory for products
  await Promise.all(
    products.map((product) =>
      db.inventory.create({
        data: {
          businessId: business.id,
          productId: product.id,
          quantity: Math.floor(Math.random() * 100) + 20,
          reorderLevel: 10,
          reorderQuantity: 50,
        },
      })
    )
  );

  console.log("✅ Inventory created");

  // 7. Create demo orders
  const orders = await Promise.all([
    db.order.create({
      data: {
        businessId: business.id,
        customerId: customers[0].id,
        orderNumber: `ORD-${Date.now()}-1`,
        status: "DELIVERED",
        subtotal: 25.96,
        total: 25.96,
        items: {
          create: [
            {
              productId: products[0].id,
              quantity: 2,
              price: 5.99,
              total: 11.98,
            },
            {
              productId: products[2].id,
              quantity: 2,
              price: 4.50,
              total: 9.00,
            },
          ],
        },
      },
    }),
    db.order.create({
      data: {
        businessId: business.id,
        customerId: customers[1].id,
        orderNumber: `ORD-${Date.now()}-2`,
        status: "CONFIRMED",
        subtotal: 19.95,
        total: 19.95,
        items: {
          create: [
            {
              productId: products[1].id,
              quantity: 5,
              price: 3.99,
              total: 19.95,
            },
          ],
        },
      },
    }),
  ]);

  console.log(`✅ ${orders.length} orders created`);

  // 8. Create demo expenses
  await Promise.all([
    db.expense.create({
      data: {
        businessId: business.id,
        category: "RENT",
        description: "Monthly rent",
        amount: 2000,
        date: new Date(),
        status: "APPROVED",
      },
    }),
    db.expense.create({
      data: {
        businessId: business.id,
        category: "UTILITIES",
        description: "Electric bill",
        amount: 300,
        date: new Date(),
        status: "APPROVED",
      },
    }),
    db.expense.create({
      data: {
        businessId: business.id,
        category: "SUPPLIES",
        description: "Coffee beans and supplies",
        amount: 150,
        date: new Date(),
        status: "PENDING",
      },
    }),
  ]);

  console.log("✅ Expenses created");

  // 9. Create demo invoice
  await db.invoice.create({
    data: {
      businessId: business.id,
      customerId: customers[1].id,
      invoiceNumber: `INV-${Date.now()}`,
      subtotal: 500,
      tax: 0,
      total: 500,
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: "SENT",
    },
  });

  console.log("✅ Invoice created");

  // 10. Create demo tasks
  await Promise.all([
    db.task.create({
      data: {
        businessId: business.id,
        title: "Restock cold brew coffee",
        priority: "HIGH",
        status: "TODO",
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      },
    }),
    db.task.create({
      data: {
        businessId: business.id,
        title: "Follow up with corporate client",
        priority: "MEDIUM",
        status: "IN_PROGRESS",
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      },
    }),
    db.task.create({
      data: {
        businessId: business.id,
        title: "Review monthly financials",
        priority: "MEDIUM",
        status: "TODO",
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      },
    }),
  ]);

  console.log("✅ Tasks created");

  // 11. Create demo campaign
  await db.campaign.create({
    data: {
      businessId: business.id,
      name: "Weekend Special",
      description: "Special promotion for weekend orders",
      type: "EMAIL",
      status: "DRAFT",
      budget: 100,
    },
  });

  console.log("✅ Campaign created");

  // 12. Create business metrics
  await Promise.all([
    db.businessMetric.create({
      data: {
        businessId: business.id,
        metricType: "TOTAL_REVENUE",
        value: 500,
        period: "2026-09-02",
      },
    }),
    db.businessMetric.create({
      data: {
        businessId: business.id,
        metricType: "NET_PROFIT",
        value: 250,
        period: "2026-09-02",
      },
    }),
    db.businessMetric.create({
      data: {
        businessId: business.id,
        metricType: "CUSTOMER_COUNT",
        value: 3,
        period: "2026-09-02",
      },
    }),
  ]);

  console.log("✅ Metrics created");

  console.log("");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("✅ Demo Data Seeding Complete!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("");
  console.log("Demo Credentials:");
  console.log("  Email: demo@pulse.local");
  console.log("  Password: demo@123");
  console.log("");
  console.log("Business: Demo Coffee Shop");
  console.log("Customers: 3");
  console.log("Products: 3");
  console.log("Orders: 2");
  console.log("Expenses: 3");
  console.log("Tasks: 3");
  console.log("");
}

seed()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
