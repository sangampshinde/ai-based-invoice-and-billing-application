import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import {
  User,
  Client,
  Invoice,
  InvoiceItem,
  Payment,
  Expense,
} from '../entities';

dotenv.config();

async function seed() {
  console.log('🌱 Starting Database Seeder...');

  const databaseUrl = process.env.DATABASE_URL;
  const isNeonOrRemote = databaseUrl && (
    databaseUrl.includes('neon.tech') || 
    databaseUrl.includes('sslmode=') || 
    databaseUrl.includes('supabase') || 
    databaseUrl.includes('rds.amazonaws.com')
  );
  const cleanUrl = databaseUrl ? databaseUrl.replace(/([?&])sslmode=[^&]*(&?)/, (match, p1, p2) => (p1 === '?' && p2 ? '?' : '')) : undefined;

  const dataSource = new DataSource(
    cleanUrl
      ? {
          type: 'postgres',
          url: cleanUrl,
          entities: [User, Client, Invoice, InvoiceItem, Payment, Expense],
          synchronize: true,
          ssl: isNeonOrRemote ? { rejectUnauthorized: false } : false,
          extra: isNeonOrRemote ? { ssl: { rejectUnauthorized: false } } : undefined,
        }
      : {
          type: 'postgres',
          host: process.env.DB_HOST || '127.0.0.1',
          port: Number(process.env.DB_PORT) || 5432,
          username: process.env.DB_USERNAME || 'postgres',
          password: process.env.DB_PASSWORD || 'postgres',
          database: process.env.DB_NAME || 'invoicer_db',
          entities: [User, Client, Invoice, InvoiceItem, Payment, Expense],
          synchronize: true,
        },
  );

  await dataSource.initialize();
  console.log('✅ Connected to database');

  const userRepo = dataSource.getRepository(User);
  const clientRepo = dataSource.getRepository(Client);
  const invoiceRepo = dataSource.getRepository(Invoice);
  const itemRepo = dataSource.getRepository(InvoiceItem);
  const paymentRepo = dataSource.getRepository(Payment);
  const expenseRepo = dataSource.getRepository(Expense);

  // 1. Create or Find Demo User
  let user = await userRepo.findOne({
    where: [{ email: 'alex@invoicer.ai' }, { email: 'alex@timetoprogram.com' }],
  });
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('password123', salt);
  if (!user) {
    user = userRepo.create({
      name: 'Alex Vance',
      email: 'alex@invoicer.ai',
      password: passwordHash,
      company_name: 'Apex Design Studio',
      company_email: 'alex@invoicer.ai',
      company_address: '410 Townsend St, San Francisco, CA 94107',
    });
    await userRepo.save(user);
    console.log('👤 Created demo user: alex@invoicer.ai / password123');
  } else {
    user.name = 'Alex Vance';
    user.email = 'alex@invoicer.ai';
    user.company_name = 'Apex Design Studio';
    user.company_email = 'alex@invoicer.ai';
    user.password = passwordHash;
    await userRepo.save(user);
    console.log('👤 Updated demo user: alex@invoicer.ai / password123');
  }

  // 2. Create Clients
  const clientNames = [
    { name: 'Nova Retail Group', email: 'billing@novaretail.com', company: 'Nova Retail', phone: '+1 (415) 555-0142', address: '100 Market St, San Francisco, CA' },
    { name: 'Brightline Studios', email: 'accounts@brightline.com', company: 'Brightline', phone: '+1 (212) 555-0188', address: '450 Broadway, New York, NY' },
    { name: 'Harbor & Co.', email: 'finance@harbor.co', company: 'Harbor', phone: '+1 (617) 555-0193', address: '22 Wharf Rd, Boston, MA' },
    { name: 'Riverstone Legal', email: 'invoices@riverstone.law', company: 'Riverstone', phone: '+1 (303) 555-0111', address: '880 Pine St, Denver, CO' },
    { name: 'Summit Media', email: 'billing@summitmedia.com', company: 'Summit', phone: '+1 (305) 555-0155', address: '50 Ocean Dr, Miami, FL' },
  ];

  const clients: Client[] = [];
  for (const cData of clientNames) {
    let client = await clientRepo.findOne({ where: { email: cData.email, user_id: user.id } });
    if (!client) {
      client = clientRepo.create({
        user_id: user.id,
        name: cData.name,
        email: cData.email,
        company: cData.company,
        phone: cData.phone,
        address: cData.address,
      });
      await clientRepo.save(client);
    }
    clients.push(client);
  }
  console.log(`🏢 Seeded ${clients.length} clients`);

  // 3. Create Invoices
  const existingInvoices = await invoiceRepo.count({ where: { user_id: user.id } });
  if (existingInvoices === 0) {
    const catalog = [
      { desc: 'Brand & UI Design Sprint', qty: 1, rate: 3200 },
      { desc: 'Frontend Development (React/Next)', qty: 24, rate: 95 },
      { desc: 'Backend API Development (NestJS)', qty: 20, rate: 110 },
      { desc: 'Monthly Support Retainer', qty: 1, rate: 1500 },
      { desc: 'Technical SEO Optimization', qty: 1, rate: 750 },
    ];

    const today = new Date();
    const invoiceConfigs = [
      { client: clients[0], num: 'INV-0001', daysAgo: 45, dueDaysAgo: 15, status: 'paid' },
      { client: clients[1], num: 'INV-0002', daysAgo: 30, dueDaysAgo: 0, status: 'paid' },
      { client: clients[2], num: 'INV-0003', daysAgo: 15, dueDaysAgo: -15, status: 'unpaid' },
      { client: clients[3], num: 'INV-0004', daysAgo: 35, dueDaysAgo: 5, status: 'overdue' },
      { client: clients[4], num: 'INV-0005', daysAgo: 5, dueDaysAgo: -25, status: 'unpaid' },
    ];

    for (const conf of invoiceConfigs) {
      const issue = new Date(today);
      issue.setDate(today.getDate() - conf.daysAgo);
      const due = new Date(today);
      due.setDate(today.getDate() - conf.dueDaysAgo);

      const items = [catalog[Math.floor(Math.random() * catalog.length)], catalog[Math.floor(Math.random() * catalog.length)]];
      let subtotal = 0;
      const computedItems = items.map((it) => {
        const amt = it.qty * it.rate;
        subtotal += amt;
        return { description: it.desc, quantity: it.qty, rate: it.rate, amount: amt };
      });
      const tax = Number((subtotal * 0.085).toFixed(2));
      const total = Number((subtotal + tax).toFixed(2));

      const inv = invoiceRepo.create({
        user_id: user.id,
        client_id: conf.client.id,
        invoice_number: conf.num,
        issue_date: issue.toISOString().slice(0, 10),
        due_date: due.toISOString().slice(0, 10),
        status: conf.status,
        subtotal,
        tax,
        total,
        notes: 'Thank you for your partnership!',
      });
      const savedInv = await invoiceRepo.save(inv);

      for (const it of computedItems) {
        const item = itemRepo.create({
          invoice_id: savedInv.id,
          description: it.description,
          quantity: it.quantity,
          rate: it.rate,
          amount: it.amount,
        });
        await itemRepo.save(item);
      }

      if (conf.status === 'paid') {
        const pay = paymentRepo.create({
          user_id: user.id,
          invoice_id: savedInv.id,
          amount: total,
          payment_date: issue.toISOString().slice(0, 10),
          method: 'bank_transfer',
        });
        await paymentRepo.save(pay);
      }
    }
    console.log('🧾 Seeded 5 realistic invoices with line items and payments');
  }

  // 4. Create Expenses
  const existingExpenses = await expenseRepo.count({ where: { user_id: user.id } });
  if (existingExpenses === 0) {
    const expensesList = [
      { category: 'Software', vendor: 'Adobe Creative Cloud', amount: 54.99, daysAgo: 10 },
      { category: 'Software', vendor: 'GitHub Enterprise', amount: 21.00, daysAgo: 20 },
      { category: 'Hosting', vendor: 'Amazon Web Services', amount: 124.50, daysAgo: 15 },
      { category: 'Office', vendor: 'WeWork Coworking', amount: 350.00, daysAgo: 25 },
      { category: 'Meals', vendor: 'Blue Bottle Coffee', amount: 18.50, daysAgo: 3 },
    ];

    for (const exp of expensesList) {
      const expDate = new Date();
      expDate.setDate(expDate.getDate() - exp.daysAgo);
      const e = expenseRepo.create({
        user_id: user.id,
        category: exp.category,
        vendor: exp.vendor,
        amount: exp.amount,
        date: expDate.toISOString().slice(0, 10),
        notes: 'Monthly operating expense',
      });
      await expenseRepo.save(e);
    }
    console.log('💸 Seeded 5 initial business expenses');
  }

  console.log('✨ Database seeding complete! Ready to start application.');
  await dataSource.destroy();
}

seed().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
