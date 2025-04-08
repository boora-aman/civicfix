const { PrismaClient, Role, Status, Priority } = require('@prisma/client')
const { hash } = require('bcrypt')

const prisma = new PrismaClient()

async function main() {
  console.log('Starting database reset and seeding...')

  // Clear existing data
  console.log('Clearing existing data...')
  await prisma.upvote.deleteMany()
  await prisma.comment.deleteMany()
  await prisma.issue.deleteMany()
  await prisma.user.deleteMany()

  console.log('Creating users...')
  
  // Create admin user
  const adminPassword = await hash('admin123', 10)
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: adminPassword,
      role: Role.ADMIN,
    },
  })

  // Create regular users
  const users = []
  for (let i = 1; i <= 20; i++) {
    const password = await hash('user123', 10)
    const user = await prisma.user.create({
      data: {
        name: `User ${i}`,
        email: `user${i}@example.com`,
        password,
        role: Role.USER,
      },
    })
    users.push(user)
  }

  // Sample data for issues
  const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose']
  const states = ['NY', 'CA', 'IL', 'TX', 'AZ', 'PA', 'TX', 'CA', 'TX', 'CA']
  const categories = ['INFRASTRUCTURE', 'SAFETY', 'ENVIRONMENT', 'TRANSPORTATION', 'PUBLIC_SERVICES']
  const priorities = [Priority.URGENT, Priority.HIGH, Priority.MEDIUM, Priority.LOW]
  const statuses = [Status.PENDING, Status.IN_PROGRESS, Status.RESOLVED, Status.REJECTED]

  console.log('Creating 100 sample issues...')
  
  // Create 100 issues with realistic data
  const issues = []
  for (let i = 1; i <= 100; i++) {
    const cityIndex = Math.floor(Math.random() * cities.length)
    const category = categories[Math.floor(Math.random() * categories.length)]
    const priority = priorities[Math.floor(Math.random() * priorities.length)]
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const userId = users[Math.floor(Math.random() * users.length)].id
    const createdAt = new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000) // Random date within last 6 months

    const issue = await prisma.issue.create({
      data: {
        title: `Issue ${i}: ${category.toLowerCase().replace('_', ' ')} problem in ${cities[cityIndex]}`,
        description: `This is a detailed description of the ${category.toLowerCase().replace('_', ' ')} issue in ${cities[cityIndex]}. It requires immediate attention and affects the local community.`,
        location: `${cities[cityIndex]}, ${states[cityIndex]}`,
        city: cities[cityIndex],
        state: states[cityIndex],
        zip: Math.floor(10000 + Math.random() * 90000).toString(),
        category,
        priority,
        status,
        createdAt,
        updatedAt: new Date(createdAt.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000), // Random update within a week
        userId,
      },
    })
    issues.push(issue)

    // Add random upvotes (0-15 per issue)
    const upvoteCount = Math.floor(Math.random() * 16)
    const upvoters = [...users].sort(() => 0.5 - Math.random()).slice(0, upvoteCount)
    for (const upvoter of upvoters) {
      await prisma.upvote.create({
        data: {
          userId: upvoter.id,
          issueId: issue.id,
        },
      })
    }

    // Add random comments (0-5 per issue)
    const commentCount = Math.floor(Math.random() * 6)
    const commenters = [...users].sort(() => 0.5 - Math.random()).slice(0, commentCount)
    for (const commenter of commenters) {
      await prisma.comment.create({
        data: {
          content: `This is a comment from ${commenter.name} regarding the issue.`,
          userId: commenter.id,
          issueId: issue.id,
          createdAt: new Date(createdAt.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within a month of issue creation
        },
      })
    }
  }

  console.log('Seed data created successfully!')
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 