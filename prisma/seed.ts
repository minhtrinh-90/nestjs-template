import { faker } from '@faker-js/faker';
import { PrismaClient, UserRole } from '@prisma/client';
import { hashSync } from 'bcrypt';
import slugify from 'slugify';

const prisma = new PrismaClient();

async function main() {
  // Create new users
  const admin = await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: {},
    create: {
      email: 'admin@test.com',
      name: 'Admin',
      role: UserRole.ADMIN,
      password: hashSync('12345678', 12),
    },
  });
  const user = await prisma.user.upsert({
    where: { email: 'user@test.com' },
    update: {},
    create: {
      email: 'user@test.com',
      name: 'User',
      role: UserRole.USER,
      avatar: faker.image.avatar(),
      password: hashSync('12345678', 12),
    },
  });

  // Create posts
  await prisma.post.deleteMany({});
  const postTags = Array.from({ length: 20 }, faker.word.noun);
  const createPost = () => ({
    title: faker.lorem.sentence().slice(0, -1),
    content: faker.lorem.paragraphs(),
    imageUrl: faker.image.imageUrl(),
    tags: faker.helpers.arrayElements(postTags).join(','),
    creatorId: admin.id,
  });
  const posts = Array.from({ length: 50 }, createPost);
  posts.forEach(async (post) => {
    const createdPost = await prisma.post.create({ data: post });
    createdPost.slug = slugify(
      createdPost.title.slice(0, 64) + ' ' + createdPost.id.slice(0, 8),
    );
    await prisma.post.update({
      where: { id: createdPost.id },
      data: createdPost,
    });
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
