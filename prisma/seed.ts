const { PrismaClient, Role, Status, Priority } = require('@prisma/client')
const { hash } = require('bcrypt')

const prisma = new PrismaClient()

async function main() {
  console.log('Starting database reset and seeding...')

  // Clear existing data
  console.log('Clearing existing data...')
  await prisma.upvote.deleteMany({})
  await prisma.comment.deleteMany({})
  await prisma.issue.deleteMany({})
  await prisma.user.deleteMany({})

  console.log('Creating users...')
  
  // Create admin user
  const adminUser = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@example.com",
      password: await hash("admin123", 10),
      role: Role.ADMIN,
    },
  })

  // Create regular users
  const users = []
  for (let i = 1; i <= 3; i++) {
    const user = await prisma.user.create({
      data: {
        name: `User ${i}`,
        email: `user${i}@example.com`,
        password: await hash("user123", 10),
        role: Role.USER,
      },
    })
    users.push(user)
  }

  // Sample data for issues
  const categories = [
    "Damaged Playground Equipment",
    "Pothole on Main Street",
    "Broken Street Light",
    "Overflowing Trash Bin",
    "Graffiti on Public Library",
    "Other",
  ]

  const priorities = [Priority.LOW, Priority.MEDIUM, Priority.HIGH, Priority.URGENT]
  const statuses = [Status.PENDING, Status.IN_PROGRESS, Status.RESOLVED, Status.APPROVED, Status.REJECTED]
  
  const locations = [
    { city: "Springfield", state: "IL", zip: "62701" },
    { city: "Riverdale", state: "CA", zip: "93656" },
    { city: "Oakwood", state: "OH", zip: "45409" },
    { city: "Franklin", state: "TN", zip: "37064" },
  ]

  console.log('Creating 10 sample issues...')
  
  // Create 10 sample issues
  for (let i = 1; i <= 10; i++) {
    const randomUser = users[Math.floor(Math.random() * users.length)]
    const randomCategory = categories[Math.floor(Math.random() * categories.length)]
    const randomPriority = priorities[Math.floor(Math.random() * priorities.length)]
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]
    const randomLocation = locations[Math.floor(Math.random() * locations.length)]
    
    // Create dates within the last 3 months
    const randomDate = new Date()
    randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 90))
    
    const issue = await prisma.issue.create({
      data: {
        title: `Test Issue ${i}: ${randomCategory}`,
        description: `This is a test issue #${i} with ${randomPriority} priority in ${randomLocation.city}. This is auto-generated for testing purposes.`,
        category: randomCategory,
        priority: randomPriority,
        status: randomStatus,
        location: `${randomLocation.city} Main Street`,
        city: randomLocation.city,
        state: randomLocation.state,
        zip: randomLocation.zip,
        createdAt: randomDate,
        updatedAt: randomDate,
        userId: randomUser.id,
      },
    })
    
    // Add random comments
    const commentCount = Math.floor(Math.random() * 3)
    for (let j = 0; j < commentCount; j++) {
      const commentUser = users[Math.floor(Math.random() * users.length)]
      await prisma.comment.create({
        data: {
          content: `Comment ${j + 1} on issue #${i}. We are working on this!`,
          issueId: issue.id,
          userId: commentUser.id,
        },
      })
    }
    
    // Add random upvotes
    const upvoteCount = Math.floor(Math.random() * 5)
    const upvoters = [...users].sort(() => 0.5 - Math.random()).slice(0, upvoteCount)
    
    for (const upvoter of upvoters) {
      await prisma.upvote.create({
        data: {
          issueId: issue.id,
          userId: upvoter.id,
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